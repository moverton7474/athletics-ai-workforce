# PRODUCT_REQUIREMENTS.md

## Product Name
athletics-ai-workforce

## Product Vision
A Marblism-style AI workforce platform that enables organizations to deploy specialized AI staff members with shared memory, collaboration, approvals, and workflow orchestration. The first vertical is college athletics, with KSU CSOS serving as a backend execution connector for athletics-specific operations.

## Problem Statement
Current AI tools are often isolated, prompt-driven assistants. Athletics departments and similar organizations need a system that:
- assigns AI workers to real operational roles,
- lets those workers collaborate,
- routes work through existing operational systems,
- tracks approvals and outcomes,
- and packages this capability as a sellable product.

## Goals
1. Build a standalone workforce orchestration platform.
2. Support shared and personal AI workers.
3. Integrate with KSU CSOS through a dedicated connector.
4. Launch a college athletics MVP with measurable sponsorship/revenue use cases.
5. Create a product foundation that can extend to other industries.

## Non-Goals
- Replacing or rewriting the existing KSU CSOS codebase.
- Granting all agents direct access to sensitive service-role credentials.
- Launching every athletics use case in the MVP.

## Primary Users
- Athletic directors
- Sponsorship teams
- Communications teams
- Compliance/admin staff
- Coaches and executive staff
- Eventually, operators in other verticals

## MVP Features
- organization + user management
- shared vs personal AI workers
- agent roster / dashboard
- persistent agent threads
- task queue
- approvals
- memory and activity logs
- CSOS connector for sponsorship/proposal workflows
- basic billing plan framework

## MVP Success Criteria
- A department can create an org and invite users.
- A user can assign shared and personal agents.
- Agents can generate and route tasks.
- A sponsorship workflow can be initiated and completed via CSOS connector.
- Human approvals can gate sensitive external actions.
- All activity is logged and reviewable.

## Phase 1 Use Cases
- sponsor attrition recovery
- alumni sponsor matching
- proposal creation and handoff
- executive summary generation
- compliance coordination and reminders

## Future Expansion
- recruiting operations
- NIL and athlete brand workflows
- content and communications workflows
- donor / booster operations
- multi-industry domain packs
