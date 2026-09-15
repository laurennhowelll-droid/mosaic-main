-- Phase 5 Clarity Check rebuild.
-- Run in Supabase SQL editor before deploying the rebuilt Clarity Check.

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
      'REACTIVE'
    )
  );

alter table public.clarity_assessments
  drop constraint if exists clarity_recommended_service_check;

alter table public.clarity_assessments
  add constraint clarity_recommended_service_check check (
    recommended_service in (
      'Advisory',
      'CRM & Systems',
      'Websites & Customer Experience',
      'Marketing & Growth',
      'Vision',
      'Experience',
      'Connect',
      'Grow',
      'Clarity Session'
    )
  );
