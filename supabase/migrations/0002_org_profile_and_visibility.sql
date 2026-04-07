-- 0002_org_profile_and_visibility.sql

alter table organizations
  add column if not exists website text,
  add column if not exists industry text,
  add column if not exists description text,
  add column if not exists target_customers text,
  add column if not exists country text,
  add column if not exists primary_language text,
  add column if not exists tone_of_voice text;

alter table agents
  add column if not exists visibility_scope text not null default 'organization',
  add column if not exists role_template_code text,
  add column if not exists tabs jsonb not null default '["chat","outputs","guidelines","settings"]'::jsonb;

alter table memory_entries
  add column if not exists visibility_scope text not null default 'organization';
