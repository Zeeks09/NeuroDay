export type Medicacion = {
  id: string
  nombre: string
  dosis: string
  hora: string | null // "HH:MM" o null = a demanda
  activa: boolean
}

export type MedicacionTomada = {
  medicacion_id: string
  hora_tomada: string // ISO
}

export type DosisExtra = {
  nombre: string
  dosis: string
  hora: string // ISO
  nota?: string
}

export type RegistroDia = {
  id: string
  fecha: string // YYYY-MM-DD
  medicacion_tomada: MedicacionTomada[]
  dosis_extra: DosisExtra[]
  foco: number | null
  animo: number | null
  sueno_horas: number | null
  efectos: string[]
  nota: string | null
  completado: boolean
}

export const EFECTOS_OPCIONES = [
  'Poco apetito',
  'Insomnio',
  'Dolor de cabeza',
  'Irritabilidad',
  'Ninguno',
] as const

export const METAS_RACHA = [3, 5, 10, 20, 30] as const
