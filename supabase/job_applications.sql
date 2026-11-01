-- Run once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Stores applications from deventeck.site/careers and keeps CVs in a private storage bucket.

-- 1. Applications table
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  role text not null check (char_length(role) <= 120),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 40),
  link text check (char_length(link) <= 300),
  note text check (char_length(note) <= 3000),
  cv_path text,
  cv_name text,
  status text not null default 'new' check (status in ('new', 'shortlisted', 'interview', 'hired', 'rejected'))
);

create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);

-- Locked: no public access. Only the website's server (secret key) can add rows.
alter table public.job_applications enable row level security;
revoke all on public.job_applications from anon, authenticated;
grant insert on public.job_applications to service_role;

-- 2. Private bucket for CVs (PDF / Word, max 4 MB). Not public: files are only reachable from the
--    Supabase dashboard (Storage > resumes) or with the secret key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes', 'resumes', false, 4194304,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;