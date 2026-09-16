'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { DosisExtra, Medicacion, MedicacionTomada, RegistroDia } from '@/lib/types'

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
