-- Run this in the Supabase SQL editor for the Mosaic project.
-- Adds the Discovery decision -> client portal -> Business Health Assessment flow.
-- Admin operations happen server-side through SUPABASE_SECRET_KEY.
-- Client portal reads/writes are scoped by Supabase Auth and RLS.

alter table public.leads
  add column if not exists discovery_decision text not null default 'pending',
  add column if not exists discovery_decision_at timestamptz,
  add column if not exists discovery_decision_notes text,
  add column if not exists discovery_email_sent_at timestamptz;

alter table public.leads
  drop constraint if exists leads_discovery_decision_check;

alter table public.leads
  add constraint leads_discovery_decision_check check (
    discovery_decision in ('pending', 'accepted', 'declined')
  );

alter table public.leads
  drop constraint if exists leads_pipeline_stage_check;

alter table public.leads
  add constraint leads_pipeline_stage_check check (
    pipeline_stage in (
      'new_inquiry',
      'scheduling_first_call',
      'first_call_scheduled',
      'first_call_complete',
      'discovery_call_complete',
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

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete set null,
  company_name text not null,
  primary_contact_name text not null,
  email text not null,
  status text not null default 'onboarding',
  current_engagement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clients_status_check check (
    status in (
      'onboarding',
      'assessment_complete',
      'vision_active',
      'active_project',
      'ongoing_partner',
      'completed',
      'paused'
    )
  )
);

create unique index if not exists clients_email_unique_idx on public.clients(email);
create index if not exists clients_email_lower_idx on public.clients(lower(email));
create index if not exists clients_lead_idx on public.clients(lead_id);
create index if not exists clients_auth_user_idx on public.clients(auth_user_id);

create table if not exists public.business_health_assessments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  status text not null default 'not_started',
  started_at timestamptz,
  completed_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint business_health_assessments_status_check check (
    status in ('not_started', 'in_progress', 'complete')
  )
);

create unique index if not exists business_health_assessments_client_unique_idx on public.business_health_assessments(client_id);
create index if not exists business_health_assessments_status_idx on public.business_health_assessments(status);

alter table public.clients enable row level security;
alter table public.business_health_assessments enable row level security;

drop policy if exists "Clients can read own client record" on public.clients;
create policy "Clients can read own client record"
  on public.clients
  for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists "Clients can update own client basics" on public.clients;
create policy "Clients can update own client basics"
  on public.clients
  for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "Clients can read own assessment" on public.business_health_assessments;
create policy "Clients can read own assessment"
  on public.business_health_assessments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.clients
      where clients.id = business_health_assessments.client_id
        and clients.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Clients can insert own assessment" on public.business_health_assessments;
create policy "Clients can insert own assessment"
  on public.business_health_assessments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.clients
      where clients.id = business_health_assessments.client_id
        and clients.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Clients can update own assessment" on public.business_health_assessments;
create policy "Clients can update own assessment"
  on public.business_health_assessments
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.clients
      where clients.id = business_health_assessments.client_id
        and clients.auth_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.clients
      where clients.id = business_health_assessments.client_id
        and clients.auth_user_id = auth.uid()
    )
  );
