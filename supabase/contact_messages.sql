-- Run this once in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- Stores every contact form enquiry from the website.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 200),
  service text check (char_length(service) <= 120),
  budget text check (char_length(budget) <= 60),
  message text not null check (char_length(message) <= 5000),
  email_sent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost'))
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- Lock the table. With row level security on and no policies, the public (anon/publishable) key
-- can neither read nor write it. Only the website's server, using the secret key, can insert.
alter table public.contact_messages enable row level security;

-- Access for the Data API (needed when "Automatically expose new tables" is turned off).
-- The website's server only ever adds rows, so it gets insert and nothing else.
-- Visitors' (anon) and logged-in (authenticated) roles get no access at all.
revoke all on public.contact_messages from anon, authenticated;
grant insert on public.contact_messages to service_role;