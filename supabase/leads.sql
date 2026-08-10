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
  constraint leads_status_check check (
    status in ('new', 'contacted', 'qualified', 'booked', 'closed', 'not_a_fit')
  ),
  constraint leads_budget_check check (
    budget in ('$2,500–$5,000', '$5,000–$10,000', '$10,000–$20,000', '$20,000+', 'Not sure yet')
  )
);

alter table public.leads enable row level security;

-- No public SELECT policy is created. Lead records are not publicly readable.
-- The website API route should insert using SUPABASE_SECRET_KEY server-side.

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
