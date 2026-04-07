-- EmeraldClean Supabase Schema
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql-editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Bookings table
create table if not exists public.bookings (
  id            uuid        primary key default uuid_generate_v4(),
  service       text        not null,
  booking_date  date        not null,
  booking_time  text        not null,
  customer_name text,
  customer_phone text,
  notes         text,
  status        text        not null default 'pending'
                  check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

-- RLS policies (public insert, authenticated read/update)
alter table public.bookings enable row level security;

-- Anyone can create a booking (form submission)
create policy "Allow public inserts" on public.bookings
  for insert to anon, authenticated with check (true);

-- Only authenticated users can read bookings
create policy "Allow authenticated reads" on public.bookings
  for select to authenticated using (true);

-- Only authenticated users can update status
create policy "Allow authenticated updates" on public.bookings
  for update to authenticated using (true);

-- Index for fast date lookups
create index if not exists idx_bookings_date on public.bookings (booking_date);
create index if not exists idx_bookings_status on public.bookings (status);
