# SCHEMA_OVERVIEW.md

## Core Tables
- organizations
- organization_members
- seats
- agents
- agent_assignments
- agent_threads
- agent_messages
- tasks
- task_status_history
- workflow_templates
- workflow_runs
- workflow_steps
- approvals
- integration_accounts
- connector_runs
- memory_entries
- activity_logs
- billing_plans
- subscriptions

## CSOS Connector Tables
- csos_command_templates
- csos_command_runs
- csos_result_cache
- csos_entity_links

## Notes
- Keep CSOS credentials isolated in backend connector services.
- Do not grant broad direct service-role access to all agents.
- Use JSON outputs from CSOS CLI as the initial normalized exchange format.
