# API_ROUTE_MAP.md

## Purpose
Map the first backend routes/services required for MVP execution.

## Organization
- `POST /api/orgs`
- `GET /api/orgs/:orgId`
- `PATCH /api/orgs/:orgId`
- `POST /api/orgs/:orgId/invite`

## Agents
- `GET /api/orgs/:orgId/agents`
- `POST /api/orgs/:orgId/agents`
- `PATCH /api/agents/:agentId`
- `POST /api/agents/:agentId/assign`

## Threads / Messages
- `GET /api/agents/:agentId/threads`
- `POST /api/agents/:agentId/threads`
- `GET /api/threads/:threadId/messages`
- `POST /api/threads/:threadId/messages`

## Tasks / Approvals
- `GET /api/orgs/:orgId/tasks`
- `POST /api/orgs/:orgId/tasks`
- `PATCH /api/tasks/:taskId`
- `GET /api/orgs/:orgId/approvals`
- `POST /api/approvals/:approvalId/decide`

## Knowledge / Brain
- `GET /api/orgs/:orgId/knowledge`
- `POST /api/orgs/:orgId/knowledge`
- `PATCH /api/knowledge/:knowledgeId`

## Connector
- `POST /api/connectors/csos/run`
- `GET /api/orgs/:orgId/connector-runs`

## Workflow
- `GET /api/orgs/:orgId/workflows`
- `POST /api/orgs/:orgId/workflows`
- `POST /api/workflows/:workflowId/run`

## Billing / Entitlements
- `GET /api/orgs/:orgId/subscription`
- `POST /api/billing/checkout`
- `POST /api/billing/webhook`
