-- NeuroDay — migración v2 (Datos, Historial, Perfil/ajustes)
-- Ejecutar en el SQL Editor de Supabase (Dashboard > SQL Editor > New query),
-- DESPUÉS de haber corrido supabase/schema.sql alguna vez.

create extension if not exists "pgcrypto";

-- Diagnóstico (uno por usuario en esta versión, antes de perfiles familiares)
create table if not exists public.diagnostico (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tipo text check (tipo in ('inatento', 'hiperactivo', 'combinado')),
  fecha date,
  verificado boolean not null default false,
  notas text,
  updated_at timestamptz not null default now()
);

-- Profesionales de salud (médico, psicólogo, etc.)
create table if not exists public.profesionales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  especialidad text,
  telefono text,
  notas text,
  created_at timestamptz not null default now()
);

-- Documentos (informes, recetas, estudios) — el archivo vive en Storage
create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  storage_path text not null,
  tipo text,
  created_at timestamptz not null default now()
);

-- Preferencias (avisos + accesibilidad)
create table if not exists public.preferencias (
  user_id uuid primary key references auth.users(id) on delete cascade,
  aviso_toma boolean not null default true,
  aviso_receta boolean not null default true,
  aviso_cita boolean not null default true,
  texto_grande boolean not null default false,
  reducir_movimiento boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists profesionales_user_idx on public.profesionales (user_id);
create index if not exists documentos_user_idx on public.documentos (user_id);

alter table public.diagnostico enable row level security;
alter table public.profesionales enable row level security;
alter table public.documentos enable row level security;
alter table public.preferencias enable row level security;

drop policy if exists "diagnostico_all_own" on public.diagnostico;
create policy "diagnostico_all_own" on public.diagnostico for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "profesionales_all_own" on public.profesionales;
create policy "profesionales_all_own" on public.profesionales for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "documentos_all_own" on public.documentos;
create policy "documentos_all_own" on public.documentos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "preferencias_all_own" on public.preferencias;
create policy "preferencias_all_own" on public.preferencias for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage: bucket privado para documentos, un folder por usuario (documentos/<user_id>/archivo.pdf)
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

drop policy if exists "documentos_storage_select_own" on storage.objects;
create policy "documentos_storage_select_own" on storage.objects for select
  using (bucket_id = 'documentos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "documentos_storage_insert_own" on storage.objects;
create policy "documentos_storage_insert_own" on storage.objects for insert
  with check (bucket_id = 'documentos' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "documentos_storage_delete_own" on storage.objects;
create policy "documentos_storage_delete_own" on storage.objects for delete
  using (bucket_id = 'documentos' and auth.uid()::text = (storage.foldername(name))[1]);
