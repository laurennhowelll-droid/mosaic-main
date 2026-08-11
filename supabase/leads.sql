-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd.
-- Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and
-- SUPABASE_SECRET_KEY to your local and production environment variables.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  website text,
  problems text not null,
  budget text not null,
  status text not null default 'new',
  source text not null default 'start_with_vision',
  notes text,
  pipeline_stage text not null default 'new_inquiry',
  selected_plan text,
  projected_revenue numeric,
  internal_notes text,
  last_updated timestamptz not null default now(),
  constraint leads_status_check check (
    status in ('new', 'contacted', 'qualified', 'booked', 'closed', 'not_a_fit')
  ),
  constraint leads_budget_check check (
    budget in ('$2,500–$5,000', '$5,000–$10,000', '$10,000–$20,000', '$20,000+', 'Not sure yet')
  ),
  constraint leads_pipeline_stage_check check (
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
  ),
  constraint leads_selected_plan_check check (
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
  )
);

alter table public.leads enable row level security;

-- No public SELECT policy is created. Lead records are not publicly readable.
-- The website API route should insert using SUPABASE_SECRET_KEY server-side.

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_pipeline_stage_idx on public.leads(pipeline_stage);
create index if not exists leads_last_updated_idx on public.leads(last_updated desc);
