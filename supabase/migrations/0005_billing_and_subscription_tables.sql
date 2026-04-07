-- 0005_billing_and_subscription_tables.sql

create table if not exists billing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique not null,
  billing_period text not null default 'monthly',
  price_cents integer not null default 0,
  features jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  billing_plan_id uuid references billing_plans(id) on delete set null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ended_at timestamptz
);
