-- EduTrack · Persistencia de análisis de sede
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`).
-- Cada envío del formulario crea una fila; el dashboard lee las últimas.

create table if not exists public.analisis_sede (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid()
                     references auth.users (id) on delete cascade,
  user_email       text,
  created_at       timestamptz not null default now(),

  -- Parámetros capturados (mismos nombres que el payload de la API)
  matricula        integer not null check (matricula between 0 and 100000),
  docentes         integer not null check (docentes between 1 and 5000),
  orientadores     integer not null check (orientadores between 0 and 500),
  niveles          integer not null check (niveles between 1 and 6),
  jornadas         integer not null check (jornadas between 1 and 5),
  zona             text    not null check (zona in ('rural', 'urbana')),
  bilingue         boolean not null,
  etnoeducativa    boolean not null,
  departamento     text    not null,
  est_por_docente  numeric not null check (est_por_docente >= 0),

  -- Salida del modelo
  clase            smallint not null check (clase in (0, 1)),
  probabilidad     numeric  not null check (probabilidad between 0 and 1)
);

comment on table public.analisis_sede is
  'Registro de análisis ejecutados en EduTrack (clase/probabilidad del modelo).';

create index if not exists analisis_sede_created_at_idx
  on public.analisis_sede (created_at desc);

create index if not exists analisis_sede_user_id_idx
  on public.analisis_sede (user_id);

alter table public.analisis_sede enable row level security;

-- Cada usuario autenticado solo inserta y lee sus propios análisis.
drop policy if exists "analisis_sede_insert_own" on public.analisis_sede;
create policy "analisis_sede_insert_own"
  on public.analisis_sede
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "analisis_sede_select_own" on public.analisis_sede;
create policy "analisis_sede_select_own"
  on public.analisis_sede
  for select
  to authenticated
  using (auth.uid() = user_id);
