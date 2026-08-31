-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd.
-- Outreach data is private and should only be managed by active admins.

create table if not exists public.outreach_prospects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  business_name text not null,
  contact_name text,
  contact_title text,
  industry text,
  website text,
  email text,
  instagram text,
  location text,
  problem_category text,
  problem_observed text not null,
  observation_notes text,
  mosaic_opportunity text not null default 'unsure',
  prospect_tier text not null default 'standard',
  research_notes text,
  status text not null default 'lead',
  channel text,
  first_contacted_at timestamptz,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  follow_up_count integer not null default 0,
  outreach_message text,
  message_angle text,
  replied_at timestamptz,
  reply_sentiment text,
  discovery_booked_at timestamptz,
  discovery_completed_at timestamptz,
  outcome text not null default 'open',
  lost_reason text,
  client_id uuid references public.clients(id) on delete set null,
  estimated_project_value numeric,
  notes text,
  constraint outreach_status_check check (status in ('lead','researched','contacted','follow_up','replied','interested','discovery_booked','discovery_complete','won','lost','not_a_fit')),
  constraint outreach_outcome_check check (outcome in ('open','won','lost','not_a_fit')),
  constraint outreach_terminal_alignment_check check (
    (status = 'won' and outcome = 'won')
    or (status = 'lost' and outcome = 'lost')
    or (status = 'not_a_fit' and outcome = 'not_a_fit')
    or (status not in ('won','lost','not_a_fit') and outcome = 'open')
  ),
  constraint outreach_opportunity_check check (mosaic_opportunity in ('vision','experience','connect','grow','full_mosaic','a_la_carte','unsure')),
  constraint outreach_problem_category_check check (
    problem_category is null
    or problem_category in ('website_clarity','website_ux','mobile_experience','weak_cta','lead_flow','booking_flow','customer_journey','customer_communication','manual_process','duplicate_data_entry','disconnected_tools','crm','automation','reporting_visibility','documentation','owner_dependency','operational_bottleneck','brand_positioning','growth_scaling','other')
  ),
  constraint outreach_tier_check check (prospect_tier in ('standard','high_potential','dream')),
  constraint outreach_channel_check check (channel is null or channel in ('email','instagram_dm','linkedin','referral','in_person','other')),
  constraint outreach_reply_sentiment_check check (reply_sentiment is null or reply_sentiment in ('positive','neutral','negative','no_response')),
  constraint outreach_message_angle_check check (message_angle is null or message_angle in ('specific_observation','customer_friction','systems_friction','website','growth_scaling','local_connection','referral_mutual_connection','loom_video','other')),
  constraint outreach_lost_reason_check check (lost_reason is null or lost_reason in ('no_response','not_interested','no_budget','bad_timing','diy','hired_someone_else','not_a_fit','stopped_responding','other')),
  constraint outreach_value_check check (estimated_project_value is null or estimated_project_value >= 0)
);

create table if not exists public.outreach_activities (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.outreach_prospects(id) on delete cascade,
  created_at timestamptz not null default now(),
  activity_type text not null,
  channel text,
  notes text,
  message text,
  scheduled_for timestamptz,
  constraint outreach_activity_type_check check (activity_type in ('research','contacted','follow_up','reply','note','discovery_booked','discovery_completed','status_change','won','lost')),
  constraint outreach_activity_channel_check check (channel is null or channel in ('email','instagram_dm','linkedin','referral','in_person','other'))
);

create or replace function public.set_outreach_prospect_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_outreach_prospect_updated_at on public.outreach_prospects;
create trigger set_outreach_prospect_updated_at
before update on public.outreach_prospects
for each row execute function public.set_outreach_prospect_updated_at();

create index if not exists outreach_prospects_status_idx on public.outreach_prospects(status);
create index if not exists outreach_prospects_next_follow_up_idx on public.outreach_prospects(next_follow_up_at);
create index if not exists outreach_prospects_last_contacted_idx on public.outreach_prospects(last_contacted_at desc);
create index if not exists outreach_prospects_created_at_idx on public.outreach_prospects(created_at desc);
create index if not exists outreach_activities_prospect_idx on public.outreach_activities(prospect_id, created_at desc);

alter table public.outreach_prospects enable row level security;
alter table public.outreach_activities enable row level security;

drop policy if exists "Admins manage outreach prospects" on public.outreach_prospects;
create policy "Admins manage outreach prospects"
on public.outreach_prospects for all
using (
  exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
);

drop policy if exists "Admins manage outreach activities" on public.outreach_activities;
create policy "Admins manage outreach activities"
on public.outreach_activities for all
using (
  exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
);
