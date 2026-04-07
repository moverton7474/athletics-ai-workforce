-- 0006_demo_org_seed.sql

insert into organizations (
  id,
  name,
  website,
  industry,
  description,
  target_customers,
  country,
  primary_language,
  tone_of_voice
)
values (
  '00000000-0000-0000-0000-000000000001',
  'KSU Athletics Demo',
  'https://ksuowls.com',
  'College Athletics',
  'Demo organization for athletics-ai-workforce.',
  'Sponsors, donors, alumni, fans',
  'US',
  'en',
  'Professional, energetic, institutional'
)
on conflict (id) do nothing;

insert into agents (id, organization_id, name, role_name, mode, status, role_template_code)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Atlas', 'Chief of Staff', 'shared', 'active', 'chief_of_staff'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Eva', 'Executive Assistant', 'personal', 'active', 'executive_assistant'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'Stan', 'Sponsorship Intelligence', 'shared', 'active', 'sponsorship_intelligence')
on conflict (id) do nothing;

insert into tasks (id, organization_id, agent_id, title, description, status, priority)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'Review sponsor attrition opportunities', 'Top categories need attention.', 'queued', 'high'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'Prepare executive morning briefing', 'Summarize tasks, approvals, and pipeline changes.', 'in_progress', 'normal')
on conflict (id) do nothing;

insert into knowledge_items (id, organization_id, scope, source_type, title, content)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000001', 'organization', 'document', 'KSU Brand Guidelines', 'Brand and messaging guide for demo workspace.')
on conflict (id) do nothing;
