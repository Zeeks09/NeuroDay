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

export type Diagnostico = {
  tipo: 'inatento' | 'hiperactivo' | 'combinado' | null
  fecha: string | null // YYYY-MM-DD
  verificado: boolean
  notas: string | null
}

export type Profesional = {
  id: string
  nombre: string
  especialidad: string | null
  telefono: string | null
  notas: string | null
}

export type Documento = {
  id: string
  nombre: string
  storage_path: string
  tipo: string | null
  created_at: string
}

export type Preferencias = {
  aviso_toma: boolean
  aviso_receta: boolean
  aviso_cita: boolean
  texto_grande: boolean
  reducir_movimiento: boolean
}

export type EstadisticasDia = {
  fecha: string
  foco: number | null
  sueno_horas: number | null
  completado: boolean
}

export type Estadisticas = {
  dias: EstadisticasDia[]
  focoMedio7: number | null
  suenoMedio7: number | null
  adherencia7: number // 0-100
  adherencia21: number // 0-100
  diasConDatos: number
}

export const RECURSOS_LIBRERIA = [
  {
    titulo: '¿Qué es el TDAH? — Guía general',
    fuente: 'CHADD',
    url: 'https://chadd.org/about-adhd/overview/',
    resumen: 'Panorama general del trastorno, síntomas en distintas edades y cómo se diagnostica, por la organización de referencia en TDAH en EE. UU.',
  },
  {
    titulo: 'Datos y estadísticas del TDAH',
    fuente: 'CDC',
    url: 'https://www.cdc.gov/adhd/data/index.html',
    resumen: 'Prevalencia, diagnóstico y tratamiento del TDAH según los Centros para el Control y Prevención de Enfermedades de EE. UU.',
  },
  {
    titulo: 'TDAH en adultos',
    fuente: 'ADDA (Attention Deficit Disorder Association)',
    url: 'https://add.org/adhd-in-adults/',
    resumen: 'Cómo se presenta el TDAH en la adultez, estrategias de manejo y recursos de la asociación especializada en adultos con TDAH.',
  },
  {
    titulo: 'Trastorno por déficit de atención con hiperactividad',
    fuente: 'NIMH (National Institute of Mental Health)',
    url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
    resumen: 'Información clínica revisada sobre causas, síntomas y tratamientos basados en evidencia, del instituto de salud mental de EE. UU.',
  },
] as const
