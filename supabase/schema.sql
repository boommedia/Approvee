-- ================================================================
-- Approvee Database Schema
-- Run this in the Supabase SQL editor
-- ================================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- PROFILES
-- ----------------------------------------------------------------
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------
-- PROJECTS
-- ----------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  description text,
  status text not null default 'active',
  review_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_by uuid references profiles(id) on delete cascade not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "Users can manage own projects"
  on projects for all using (auth.uid() = created_by);

-- ----------------------------------------------------------------
-- FEEDBACK ITEMS
-- ----------------------------------------------------------------
create table if not exists feedback_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  title text,
  comment text not null,
  x_percent numeric,
  y_percent numeric,
  page_url text,
  screenshot_url text,
  selector text,
  viewport_width integer,
  viewport_height integer,
  browser_info jsonb,
  status text not null default 'open',
  priority text not null default 'normal',
  tags text[],
  is_private boolean default false,
  reviewer_name text,
  reviewer_email text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table feedback_items enable row level security;

-- Project owners can see/manage all feedback on their projects
create policy "Project owners manage feedback"
  on feedback_items for all
  using (
    project_id in (
      select id from projects where created_by = auth.uid()
    )
  );

-- Anyone can INSERT feedback (for guest reviewers — checked by service role in API)
create policy "Anyone can submit feedback"
  on feedback_items for insert
  with check (true);

-- ----------------------------------------------------------------
-- FEEDBACK REPLIES
-- ----------------------------------------------------------------
create table if not exists feedback_replies (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid references feedback_items(id) on delete cascade not null,
  comment text not null,
  author_name text,
  author_email text,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table feedback_replies enable row level security;

create policy "Anyone can read replies"
  on feedback_replies for select using (true);

create policy "Anyone can insert replies"
  on feedback_replies for insert with check (true);

-- ----------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- ----------------------------------------------------------------
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at_column();

create trigger update_feedback_updated_at
  before update on feedback_items
  for each row execute procedure update_updated_at_column();

create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

-- ----------------------------------------------------------------
-- INDEXES
-- ----------------------------------------------------------------
create index if not exists idx_projects_created_by on projects(created_by);
create index if not exists idx_projects_review_token on projects(review_token);
create index if not exists idx_feedback_project_id on feedback_items(project_id);
create index if not exists idx_feedback_status on feedback_items(status);
create index if not exists idx_replies_feedback_id on feedback_replies(feedback_id);
