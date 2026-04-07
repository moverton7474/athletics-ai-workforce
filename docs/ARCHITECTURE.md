# ARCHITECTURE.md

## Core Principle
Separate the **workforce platform** from the **domain execution system**.

- **athletics-ai-workforce** = orchestration, memory, collaboration, billing, workflows
- **KSU CSOS** = athletics domain execution and operational data interface

## Layers
### 1. Workforce Platform
- organizations
- users
- seats
- agents
- agent threads
- messages
- tasks
- workflows
- approvals
- memory
- logs
- billing

### 2. Connector Layer
- CSOS connector
- email connector
- calendar connector
- social connector
- CRM connector

### 3. Domain Packs
- athletics pack
- recruiting pack
- NIL pack
- sponsorship pack
- compliance pack

## Collaboration Model
### Shared agent
- department-owned
- shared thread
- shared outputs
- used for team workflows

### Personal agent
- staff-owned
- private thread
- private context
- used for role-specific assistance

## Safety Model
- service credentials isolated in backend connector service
- agent permissions mapped by role
- human approval for sensitive outbound actions
- full execution logs
