-- ================================================================
-- Asset & File Review — run in Supabase SQL editor
-- ================================================================

-- project_assets table
create table if not exists project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  file_url text not null,
  file_type text not null,
  storage_path text not null,
  file_size integer,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table project_assets enable row level security;

create policy "Project owners manage assets"
  on project_assets for all
  using (project_id in (select id from projects where created_by = auth.uid()));

create policy "Anyone can read assets"
  on project_assets for select using (true);

-- Add asset_id to feedback_items (nullable — null = website feedback)
alter table feedback_items add column if not exists asset_id uuid references project_assets(id) on delete cascade;

-- Grants
grant select on public.project_assets to anon;
grant select, insert, update, delete on public.project_assets to authenticated;
grant all on public.project_assets to service_role;

-- Indexes
create index if not exists idx_assets_project_id on project_assets(project_id);
create index if not exists idx_feedback_asset_id on feedback_items(asset_id);

-- ----------------------------------------------------------------
-- Storage bucket (run these separately in SQL editor)
-- ----------------------------------------------------------------
-- insert into storage.buckets (id, name, public)
--   values ('project-assets', 'project-assets', true)
--   on conflict do nothing;
--
-- create policy "Public read project-assets"
--   on storage.objects for select using (bucket_id = 'project-assets');
--
-- create policy "Auth upload project-assets"
--   on storage.objects for insert
--   with check (bucket_id = 'project-assets' and auth.role() = 'authenticated');
--
-- create policy "Auth delete project-assets"
--   on storage.objects for delete
--   using (bucket_id = 'project-assets' and auth.role() = 'authenticated');
