-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd.
-- Adds lightweight owner dashboard tracking fields to the existing public.leads table.

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
      'systems_clarity_session',
      'vision',
      'experience',
      'connect',
      'essentials_retainer',
      'growth_partner',
      'fractional_systems_director',
      'foundation_journey',
      'connected_business_journey',
      'custom'
    )
  );

create index if not exists leads_pipeline_stage_idx on public.leads(pipeline_stage);
create index if not exists leads_last_updated_idx on public.leads(last_updated desc);
