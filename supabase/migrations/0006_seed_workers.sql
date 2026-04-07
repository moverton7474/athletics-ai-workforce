-- 0006_seed_workers.sql

insert into billing_plans (name, code, billing_period, price_cents, features)
values
  ('Athletics Workforce Core', 'core_monthly', 'monthly', 4400, '{"workers":["chief_of_staff","executive_assistant","sponsorship_intelligence","proposal_outreach","compliance_coordination"]}'::jsonb)
on conflict (code) do nothing;

insert into csos_command_templates (name, command, description)
values
  ('Sponsor Attrition', 'csos sponsor attrition --json', 'Analyze sponsorship attrition'),
  ('Sponsor Category Gaps', 'csos sponsor category-gaps --json', 'Find highest-value revenue gaps'),
  ('Sponsor Match Alumni', 'csos sponsor match-alumni --category {{category}} --json', 'Find alumni/company matches for a category'),
  ('Proposal Create', 'csos proposal create --company {{company}} --value {{value}}', 'Create a proposal shell')
on conflict do nothing;
