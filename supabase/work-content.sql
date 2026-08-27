create table if not exists public.work_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content_type text not null check (content_type in ('case_study', 'article', 'tips', 'field_note', 'guide')),
  excerpt text,
  featured_image_url text,
  body text not null default '',
  seo_title text,
  meta_description text,
  cta_type text default 'none' check (cta_type in ('clarity_check', 'discovery_call', 'email', 'custom', 'none')),
  cta_label text,
  cta_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  publish_date timestamptz,
  is_featured boolean not null default false,
  client_name text,
  industry text,
  services jsonb,
  results text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists work_content_public_idx
  on public.work_content (status, publish_date desc);

create index if not exists work_content_featured_idx
  on public.work_content (is_featured, status, publish_date desc);

create or replace function public.set_work_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_work_content_updated_at on public.work_content;
create trigger set_work_content_updated_at
before update on public.work_content
for each row execute function public.set_work_content_updated_at();

create or replace function public.enforce_work_content_feature_limit()
returns trigger
language plpgsql
as $$
begin
  if new.is_featured = true and new.status = 'published' then
    if (
      select count(*)
      from public.work_content
      where is_featured = true
        and status = 'published'
        and id <> new.id
    ) >= 3 then
      raise exception 'Only 3 published work pieces can be featured at once.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_work_content_feature_limit on public.work_content;
create trigger enforce_work_content_feature_limit
before insert or update on public.work_content
for each row execute function public.enforce_work_content_feature_limit();

alter table public.work_content enable row level security;

drop policy if exists "Published work is public" on public.work_content;
create policy "Published work is public"
on public.work_content for select
using (status = 'published' and publish_date <= now());

drop policy if exists "Admins manage work content" on public.work_content;
create policy "Admins manage work content"
on public.work_content for all
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

insert into storage.buckets (id, name, public)
values ('work-images', 'work-images', true)
on conflict (id) do nothing;

drop policy if exists "Work images are public" on storage.objects;
create policy "Work images are public"
on storage.objects for select
using (bucket_id = 'work-images');

drop policy if exists "Admins manage work images" on storage.objects;
create policy "Admins manage work images"
on storage.objects for all
using (
  bucket_id = 'work-images'
  and exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
)
with check (
  bucket_id = 'work-images'
  and exists (
    select 1
    from public.employees
    where employees.id = auth.uid()
      and employees.active = true
      and employees.role = 'admin'
  )
);
