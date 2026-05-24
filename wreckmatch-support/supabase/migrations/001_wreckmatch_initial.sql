-- WreckMatch support app initial schema
-- Run in Supabase SQL Editor

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  anonymous_mode boolean not null default false,
  wreck_type text,
  injuries text[] not null default '{}',
  state text,
  accident_date date,
  story text,
  mood_checkin smallint,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  post_type text not null check (post_type in ('win', 'struggle', 'question', 'story')),
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  match_user_id uuid references public.profiles (id) on delete set null,
  match_type text not null check (match_type in ('peer', 'attorney')),
  score numeric,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attorneys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text not null,
  state text not null,
  practice_areas text[] not null default '{}',
  location text,
  website_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.matches enable row level security;
alter table public.attorneys enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Posts are readable by authenticated users"
  on public.posts for select
  to authenticated
  using (true);

create policy "Posts are insertable by author"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Matches are readable by owner"
  on public.matches for select
  using (auth.uid() = user_id);

create policy "Attorneys are publicly readable"
  on public.attorneys for select
  using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Survivor')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
