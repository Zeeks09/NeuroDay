'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DosisExtra, Medicacion, MedicacionTomada, RegistroDia, Diagnostico, Profesional, Documento, Preferencias, Estadisticas, EstadisticasDia } from '@/lib/types'

function today(): string {
  const d = new Date()
  const tz = d.getTimezoneOffset()
  const local = new Date(d.getTime() - tz * 60000)
  return local.toISOString().slice(0, 10)
}

export async function getMedicaciones(): Promise<Medicacion[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('medicaciones')
    .select('id, nombre, dosis, hora, activa')
    .eq('activa', true)
    .order('hora', { ascending: true, nullsFirst: false })
  if (error) throw error
  return data ?? []
}

export async function addMedicacion(input: { nombre: string; dosis: string; hora: string | null }) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { error } = await supabase.from('medicaciones').insert({
    user_id: userData.user.id,
    nombre: input.nombre,
    dosis: input.dosis,
    hora: input.hora,
  })
  if (error) throw error
  revalidatePath('/hoy')
  revalidatePath('/log')
}

async function ensureRegistroHoy(): Promise<RegistroDia> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const fecha = today()

  const { data: existing, error: selErr } = await supabase
    .from('registros_dia')
    .select('*')
    .eq('fecha', fecha)
    .maybeSingle()
  if (selErr) throw selErr
  if (existing) return existing as unknown as RegistroDia

  const { data: created, error: insErr } = await supabase
    .from('registros_dia')
    .insert({ user_id: userData.user.id, fecha })
    .select('*')
    .single()
  if (insErr) throw insErr
  return created as unknown as RegistroDia
}

export async function getRegistroHoy(): Promise<RegistroDia> {
  return ensureRegistroHoy()
}

export async function marcarMedicacionTomada(medicacionId: string) {
  const supabase = await createClient()
  const registro = await ensureRegistroHoy()
  const yaMarcada = registro.medicacion_tomada.some((m) => m.medicacion_id === medicacionId)
  const nuevas: MedicacionTomada[] = yaMarcada
    ? registro.medicacion_tomada
    : [...registro.medicacion_tomada, { medicacion_id: medicacionId, hora_tomada: new Date().toISOString() }]

  const { error } = await supabase
    .from('registros_dia')
    .update({ medicacion_tomada: nuevas, updated_at: new Date().toISOString() })
    .eq('id', registro.id)
  if (error) throw error
  revalidatePath('/hoy')
}

export async function agregarDosisExtra(dosis: DosisExtra) {
  const supabase = await createClient()
  const registro = await ensureRegistroHoy()
  const nuevas = [...registro.dosis_extra, dosis]
  const { error } = await supabase
    .from('registros_dia')
    .update({ dosis_extra: nuevas, updated_at: new Date().toISOString() })
    .eq('id', registro.id)
  if (error) throw error
  revalidatePath('/hoy')
}

export async function guardarRegistro(input: {
  foco: number | null
  animo: number | null
  sueno_horas: number | null
  efectos: string[]
  nota: string | null
}) {
  const supabase = await createClient()
  const registro = await ensureRegistroHoy()
  const { error } = await supabase
    .from('registros_dia')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', registro.id)
  if (error) throw error
  revalidatePath('/hoy')
  revalidatePath('/log')
}

export async function completarRegistroHoy(): Promise<{ racha: number }> {
  const supabase = await createClient()
  const registro = await ensureRegistroHoy()
  const { error } = await supabase
    .from('registros_dia')
    .update({ completado: true, updated_at: new Date().toISOString() })
    .eq('id', registro.id)
  if (error) throw error
  revalidatePath('/hoy')
  const racha = await getRacha()
  return { racha }
}

export async function getRacha(): Promise<number> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('registros_dia')
    .select('fecha, completado')
    .eq('completado', true)
    .order('fecha', { ascending: false })
    .limit(400)
  if (error) throw error
  if (!data || data.length === 0) return 0

  const fechas = new Set(data.map((r) => r.fecha as string))
  let cursor = new Date(today())
  let racha = 0
  // La racha cuenta hoy (si ya está completo) o ayer hacia atrás, sin saltos.
  if (!fechas.has(today())) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (fechas.has(cursor.toISOString().slice(0, 10))) {
    racha += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return racha
}

export async function guardarYCompletar(input: {
  foco: number | null
  animo: number | null
  sueno_horas: number | null
  efectos: string[]
  nota: string | null
}): Promise<{ racha: number }> {
  await guardarRegistro(input)
  return completarRegistroHoy()
}

// ---------- Datos (estadísticas) ----------

export async function getEstadisticas(): Promise<Estadisticas> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('registros_dia')
    .select('fecha, foco, sueno_horas, completado')
    .order('fecha', { ascending: false })
    .limit(30)
  if (error) throw error

  const dias: EstadisticasDia[] = (data ?? []).map((d) => ({
    fecha: d.fecha as string,
    foco: d.foco as number | null,
    sueno_horas: d.sueno_horas as number | null,
    completado: d.completado as boolean,
  }))

  const ultimos7 = dias.slice(0, 7)
  const ultimos21 = dias.slice(0, 21)

  const focoVals = ultimos7.map((d) => d.foco).filter((v): v is number => v !== null)
  const suenoVals = ultimos7.map((d) => d.sueno_horas).filter((v): v is number => v !== null)

  const focoMedio7 = focoVals.length ? focoVals.reduce((a, b) => a + b, 0) / focoVals.length : null
  const suenoMedio7 = suenoVals.length ? suenoVals.reduce((a, b) => a + b, 0) / suenoVals.length : null

  const adherencia7 = ultimos7.length
    ? Math.round((ultimos7.filter((d) => d.completado).length / 7) * 100)
    : 0
  const adherencia21 = ultimos21.length
    ? Math.round((ultimos21.filter((d) => d.completado).length / 21) * 100)
    : 0

  return {
    dias: dias.reverse(),
    focoMedio7,
    suenoMedio7,
    adherencia7,
    adherencia21,
    diasConDatos: dias.filter((d) => d.completado).length,
  }
}

// ---------- Diagnóstico ----------

export async function getDiagnostico(): Promise<Diagnostico | null> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { data, error } = await supabase
    .from('diagnostico')
    .select('tipo, fecha, verificado, notas')
    .eq('user_id', userData.user.id)
    .maybeSingle()
  if (error) throw error
  return (data as Diagnostico | null) ?? null
}

export async function guardarDiagnostico(input: { tipo: Diagnostico['tipo']; fecha: string | null; notas: string | null }) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { error } = await supabase
    .from('diagnostico')
    .upsert({ user_id: userData.user.id, ...input, updated_at: new Date().toISOString() })
  if (error) throw error
  revalidatePath('/historial')
}

// ---------- Profesionales ----------

export async function getProfesionales(): Promise<Profesional[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profesionales')
    .select('id, nombre, especialidad, telefono, notas')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function addProfesional(input: { nombre: string; especialidad: string | null; telefono: string | null; notas: string | null }) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { error } = await supabase.from('profesionales').insert({ user_id: userData.user.id, ...input })
  if (error) throw error
  revalidatePath('/historial')
}

export async function eliminarProfesional(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('profesionales').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/historial')
}

// ---------- Documentos ----------

export async function getDocumentos(): Promise<Documento[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('documentos')
    .select('id, nombre, storage_path, tipo, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function subirDocumento(formData: FormData) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const file = formData.get('archivo') as File | null
  if (!file || file.size === 0) throw new Error('Elegí un archivo')

  const path = `${userData.user.id}/${Date.now()}_${file.name}`
  const { error: upErr } = await supabase.storage.from('documentos').upload(path, file)
  if (upErr) throw upErr

  const { error: dbErr } = await supabase.from('documentos').insert({
    user_id: userData.user.id,
    nombre: file.name,
    storage_path: path,
    tipo: file.type || null,
  })
  if (dbErr) throw dbErr
  revalidatePath('/historial')
}

export async function getUrlDocumento(storagePath: string): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('documentos').createSignedUrl(storagePath, 60 * 5)
  if (error) throw error
  return data.signedUrl
}

export async function eliminarDocumento(id: string, storagePath: string) {
  const supabase = await createClient()
  await supabase.storage.from('documentos').remove([storagePath])
  const { error } = await supabase.from('documentos').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/historial')
}

// ---------- Preferencias ----------

export async function getPreferencias(): Promise<Preferencias> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { data, error } = await supabase
    .from('preferencias')
    .select('aviso_toma, aviso_receta, aviso_cita, texto_grande, reducir_movimiento')
    .eq('user_id', userData.user.id)
    .maybeSingle()
  if (error) throw error
  return (
    (data as Preferencias | null) ?? {
      aviso_toma: true,
      aviso_receta: true,
      aviso_cita: true,
      texto_grande: false,
      reducir_movimiento: false,
    }
  )
}

export async function guardarPreferencias(input: Preferencias) {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('No autenticado')
  const { error } = await supabase
    .from('preferencias')
    .upsert({ user_id: userData.user.id, ...input, updated_at: new Date().toISOString() })
  if (error) throw error
  revalidatePath('/perfil')
}
