create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
  ) then
    create type user_role as enum ('admin', 'manager', 'user');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  email text not null unique,
  google_account_id text not null unique,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  action text not null,
  resource text not null,
  timestamp timestamptz not null default now(),
  ip_address text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs
add column if not exists resource text;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.audit_logs enable row level security;

create policy "service role manages users"
on public.users
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role manages audit logs"
on public.audit_logs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
