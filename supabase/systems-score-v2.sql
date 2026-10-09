-- Systems Score v2.
-- Run this in the Supabase SQL editor for project ivmvfknrzmftsdzexwhd
-- before saving any v2 Systems Score submission.
-- Historical assessment rows stay valid. This does not send email.

alter table public.clarity_assessments
  drop constraint if exists clarity_result_band_check;

alter table public.clarity_assessments
  add constraint clarity_result_band_check check (
    result_band in (
      'FOUNDATION',
      'WORKAROUNDS',
      'PARTIALLY_CONNECTED',
      'OPTIMIZE',
      'CONNECTED',
      'GROWING FRICTION',
      'DISCONNECTED',
      'REACTIVE',
      'PATCHED TOGETHER',
      'BUILT TO SCALE',
      'Running on You',
      'Patched Together',
      'Mostly Connected',
      'Running Like a System'
    )
  );

alter table public.clarity_assessments
  add column if not exists submission_id text;

create unique index if not exists clarity_assessments_submission_id_idx
  on public.clarity_assessments (submission_id)
  where submission_id is not null;

create table if not exists public.systems_score_access_tokens (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.clarity_assessments(id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  last_used_at timestamptz
);

create index if not exists systems_score_access_tokens_assessment_idx
  on public.systems_score_access_tokens (assessment_id);

alter table public.systems_score_access_tokens enable row level security;

-- No public policies. The website reads and writes tokens with SUPABASE_SECRET_KEY.
