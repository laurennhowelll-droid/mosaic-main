-- Run this in the Supabase SQL editor for the Mosaic project.
-- Adds the lightweight internal 90-Day Growth Dashboard tables.
-- Admin reads and writes happen server-side through the existing admin system.

create table if not exists public.growth_campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_name text not null default 'Mosaic Launch — 90 Days',
  start_date date not null default current_date,
  end_date date not null default (current_date + interval '89 days')::date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.growth_targets (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.growth_campaigns(id) on delete cascade,
  metric text not null,
  weekly_target numeric,
  campaign_target numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint growth_targets_metric_unique unique (campaign_id, metric)
);

create table if not exists public.growth_activity (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.growth_campaigns(id) on delete cascade,
  activity_date date not null default current_date,
  activity_type text not null,
  count integer not null default 1,
  url text,
  notes text,
  created_at timestamptz not null default now(),
  constraint growth_activity_type_check check (
    activity_type in (
      'linkedin_connection',
      'outreach_message',
      'linkedin_comment',
      'personal_linkedin_post',
      'company_linkedin_post',
      'partnership_conversation',
      'discovery_call',
      'playbook_article',
      'proposal_sent',
      'networking_event',
      'referral_request',
      'reply'
    )
  )
);

create table if not exists public.content_tracker (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.growth_campaigns(id) on delete cascade,
  title text not null,
  post_type text not null,
  status text not null default 'idea',
  publish_date date,
  url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint content_tracker_post_type_check check (
    post_type in ('personal_linkedin', 'mosaic_linkedin', 'playbook', 'case_study', 'founder_story')
  ),
  constraint content_tracker_status_check check (
    status in ('idea', 'draft', 'scheduled', 'published')
  )
);

alter table public.growth_campaigns enable row level security;
alter table public.growth_targets enable row level security;
alter table public.growth_activity enable row level security;
alter table public.content_tracker enable row level security;

create index if not exists growth_targets_campaign_idx on public.growth_targets(campaign_id);
create index if not exists growth_activity_campaign_date_idx on public.growth_activity(campaign_id, activity_date desc);
create index if not exists growth_activity_type_idx on public.growth_activity(activity_type);
create index if not exists content_tracker_campaign_status_idx on public.content_tracker(campaign_id, status);
create index if not exists content_tracker_publish_date_idx on public.content_tracker(publish_date desc);
