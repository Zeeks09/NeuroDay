-- NeuroDay — esquema Supabase
-- Ejecutar en el SQL Editor del proyecto Supabase (Dashboard > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists public.medicaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  dosis text not null,
  hora time, -- null = "a demanda" (sin horario fijo)
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.registros_dia (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  medicacion_tomada jsonb not null default '[]'::jsonb, -- [{ medicacion_id, hora_tomada }]
  dosis_extra jsonb not null default '[]'::jsonb,        -- [{ nombre, dosis, hora, nota }]
  foco smallint check (foco between 1 and 5),
  animo smallint check (animo between 1 and 5),
  sueno_horas numeric(4,1),
  efectos text[] not null default '{}',
  nota text,
  completado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, fecha)
);

create index if not exists registros_dia_user_fecha_idx on public.registros_dia (user_id, fecha desc);
create index if not exists medicaciones_user_idx on public.medicaciones (user_id);

alter table public.medicaciones enable row level security;
alter table public.registros_dia enable row level security;

drop policy if exists "medicaciones_select_own" on public.medicaciones;
create policy "medicaciones_select_own" on public.medicaciones for select using (auth.uid() = user_id);
drop policy if exists "medicaciones_insert_own" on public.medicaciones;
create policy "medicaciones_insert_own" on public.medicaciones for insert with check (auth.uid() = user_id);
drop policy if exists "medicaciones_update_own" on public.medicaciones;
create policy "medicaciones_update_own" on public.medicaciones for update using (auth.uid() = user_id);
drop policy if exists "medicaciones_delete_own" on public.medicaciones;
create policy "medicaciones_delete_own" on public.medicaciones for delete using (auth.uid() = user_id);

drop policy if exists "registros_select_own" on public.registros_dia;
create policy "registros_select_own" on public.registros_dia for select using (auth.uid() = user_id);
drop policy if exists "registros_insert_own" on public.registros_dia;
create policy "registros_insert_own" on public.registros_dia for insert with check (auth.uid() = user_id);
drop policy if exists "registros_update_own" on public.registros_dia;
create policy "registros_update_own" on public.registros_dia for update using (auth.uid() = user_id);
drop policy if exists "registros_delete_own" on public.registros_dia;
create policy "registros_delete_own" on public.registros_dia for delete using (auth.uid() = user_id);
