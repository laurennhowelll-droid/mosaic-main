-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd.
-- Stores completed Business Clarity Check reports.

create table if not exists public.clarity_assessments (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  company_name text,
  total_score integer not null,
  result_band text not null,
  vision_score integer not null,
  experience_score integer not null,
  systems_score integer not null,
  operations_score integer not null,
  growth_score integer not null,
  strongest_category text not null,
  weakest_category text not null,
  primary_gap text not null,
  recommended_service text not null,
  answers jsonb not null,
  email_sent_at timestamptz,
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint clarity_result_band_check check (
    result_band in ('CONNECTED', 'GROWING FRICTION', 'DISCONNECTED', 'REACTIVE')
  ),
  constraint clarity_recommended_service_check check (
    recommended_service in ('Vision', 'Experience', 'Connect', 'Grow', 'Clarity Session')
  )
);

alter table public.clarity_assessments enable row level security;

-- No public policies are created. Public users cannot read assessments.
-- The website API route writes using SUPABASE_SECRET_KEY server-side.
-- The admin CRM reads assessments server-side after admin authorization.

create index if not exists clarity_assessments_email_idx on public.clarity_assessments(email);
create index if not exists clarity_assessments_lead_id_idx on public.clarity_assessments(lead_id);
create index if not exists clarity_assessments_created_at_idx on public.clarity_assessments(created_at desc);
