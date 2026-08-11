-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd.
-- Adds lightweight owner dashboard tracking fields to the existing public.leads table.
-- Supabase Auth remains the source of truth for login credentials.

create table if not exists public.employees (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'employee',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint employees_role_check check (role in ('admin', 'employee'))
);

alter table public.employees enable row level security;

drop policy if exists "Employees can read their own profile" on public.employees;

create policy "Employees can read their own profile"
  on public.employees
  for select
  to authenticated
  using (auth.uid() = id);

create or replace function public.create_employee_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.employees (id, email, full_name, role, active)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'employee',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_employee_profile_on_auth_user on auth.users;

create trigger create_employee_profile_on_auth_user
  after insert on auth.users
  for each row execute function public.create_employee_profile();

-- After creating admin@buildwithmosaic.com in Supabase Auth, run this to grant admin access:
-- insert into public.employees (id, email, full_name, role, active)
-- select id, email, coalesce(raw_user_meta_data->>'full_name', 'Mosaic Admin'), 'admin', true
-- from auth.users
-- where email = 'admin@buildwithmosaic.com'
-- on conflict (id) do update
-- set email = excluded.email,
--     full_name = excluded.full_name,
--     role = 'admin',
--     active = true;

alter table public.leads
  add column if not exists pipeline_stage text not null default 'new_inquiry',
  add column if not exists selected_plan text,
  add column if not exists projected_revenue numeric,
  add column if not exists internal_notes text,
  add column if not exists last_updated timestamptz not null default now();

alter table public.leads
  drop constraint if exists leads_pipeline_stage_check;

alter table public.leads
  add constraint leads_pipeline_stage_check check (
    pipeline_stage in (
      'new_inquiry',
      'scheduling_first_call',
      'first_call_scheduled',
      'first_call_complete',
      'working_on_plan',
      'proposal_sent',
      'waiting_on_client',
      'plan_selected',
      'project_active',
      'retainer_active',
      'ghosted',
      'not_a_fit',
      'closed',
      'lost'
    )
  );

alter table public.leads
  drop constraint if exists leads_selected_plan_check;

alter table public.leads
  add constraint leads_selected_plan_check check (
    selected_plan is null
    or selected_plan in (
      'not_selected',
      'clarity',
      'vision',
      'experience',
      'connect',
      'essentials',
      'growth_partner',
      'fractional_systems_director',
      'foundation',
      'connected_business',
      'custom'
    )
  );

create index if not exists leads_pipeline_stage_idx on public.leads(pipeline_stage);
create index if not exists leads_last_updated_idx on public.leads(last_updated desc);
