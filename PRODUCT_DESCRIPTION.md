# PRODUCT_DESCRIPTION.md

## athletics-ai-workforce

`athletics-ai-workforce` is being built as a Marblism-style AI workforce operating system for college athletics, with the architecture designed to work in three modes at once:

1. **Athletics-first product** for college sports departments and adjacent revenue teams
2. **Connector-backed operating shell** that can coordinate work with the KSU College Sports Operating System (CSOS)
3. **Generalizable AI workforce platform** that can later be adapted to other industries inside the Visionary AI ecosystem or operate standalone for any business

The product is not just a chatbot, and it is not just a connector. It is meant to be a governed operating layer where organizations can:
- define their workforce
- launch role-specific AI workers
- capture durable knowledge and operational memory
- route work through tasks and approvals
- connect carefully into external execution systems
- preserve continuity between sessions, users, and future agents

---

## Core Product Goal

The goal is to turn an organization’s AI usage into a **structured workforce system** rather than a collection of isolated prompts and disconnected automations.

For college athletics specifically, that means the system should help teams coordinate sponsorship, proposal, reporting, executive support, and compliance-oriented workflows in a way that feels like an actual operating model.

---

## System Design Philosophy

### 1. Product shell first
The product shell comes before broad integration expansion.

That means the system is being built around:
- onboarding
- worker roster quality
- operating workflows
- approvals
- memory and continuity
- clear operator next actions

Connector depth matters, but only after the shell is strong enough to support real daily use.

### 2. Governed AI work, not opaque automation
The system is designed so humans can see:
- what the workers are doing
- what tasks are queued
- what approvals are waiting
- what context is missing
- what decision needs to happen next

### 3. Knowledge + memory as separate layers
The product distinguishes between:
- **knowledge** = reusable reference material, documents, guidelines, source notes
- **memory** = operational continuity, handoffs, reminders, decision context, task-linked notes

That separation matters because durable institutional knowledge and short-horizon operating continuity are not the same thing.

### 4. Connector systems as execution backends
KSU CSOS and future operating systems are treated as execution backends or domain systems, not as the full product shell.

The long-term pattern is:
- the workforce product orchestrates work
- external systems provide domain execution and/or source-of-truth data
- the AI workforce stays productized above the connector layer

---

## Current Major Product Surfaces

### 1. Dashboard
The dashboard is the command center.

It currently surfaces:
- live Supabase runtime/data status
- workflow snapshot
- next actions
- queued approvals
- pinned memory
- recent memory
- continuity coverage
- resolve-next recommendations
- latest connector outcomes

Why it matters:
- operators can see both execution state and continuity gaps in one place
- the product makes missing memory visible instead of hiding it

### 2. Workers
The workers surface defines the operating team.

It currently shows:
- shared workers
- personal workers
- worker-specific workspace entry points
- mode distinctions between collaborative and individual support roles

Why it matters:
- this is where the workforce concept becomes concrete
- the product reinforces the difference between team-facing workers and private support workers

### 3. Tasks
The tasks surface is the execution queue.

It currently supports:
- task listing
- task detail views
- links into workers
- links into approvals
- related memory visibility
- explicit operator next-action guidance

Why it matters:
- tasks are the operational unit of work
- task detail pages keep context, approvals, and continuity attached to the work item

### 4. Approvals
The approvals surface governs sensitive or consequential actions.

It currently supports:
- approval listing
- approval review pages
- approval decisions
- workflow transition visibility
- decision history
- related memory visibility
- explicit operator next-action guidance

Why it matters:
- this is how the platform prevents important work from disappearing inside hidden agent actions
- approvals are central to enterprise trust, governance, and auditability

### 5. Knowledge Brain
The knowledge surface is the institutional context layer.

It currently supports:
- organization knowledge
- worker memory
- personal memory
- knowledge capture
- memory capture
- continuity feed
- memory management actions

Why it matters:
- the system needs both reference context and live operating continuity to function well over time
- this is the foundation for session-to-session and agent-to-agent durability

### 6. Onboarding + Generated Workforce Blueprint
The onboarding and team blueprint experience is the product entry path.

It currently supports:
- organization intake
- live recommended team preview
- generated workforce blueprint
- rollout sequence
- launch package
- first-week operating checklist
- direct links into the live product shell

Why it matters:
- this is how the product sells and structures the workforce before deep backend integration
- it is the bridge from “tell us about your org” to “here is how your AI team should operate”

### 7. Voice Surface
The voice area represents the voice-first direction.

It is meant to support:
- command routing
- workflow triggering
- voice/manual parity for high-value workflows

Why it matters:
- Batman’s Three Pillars and the broader Visionary AI architecture both point toward voice-enabled orchestration as a strategic differentiator

### 8. Connector Runs
Connector runs show the product’s bridge into external systems.

They currently represent:
- sponsor attrition
- sponsor category gaps
- sponsor match-alumni
- proposal create
- proposal view / submit / reporting paths in scaffolded form

Why it matters:
- connector runs create a visible execution trail instead of black-box automation

---

## Current Worker Model

The current MVP direction centers around five initial workers:

1. **Chief of Staff Agent**
   - orchestration
   - cross-functional coordination
   - approval escalation

2. **Executive Assistant Agent**
   - daily prep
   - follow-up packaging
   - leadership support

3. **Sponsorship Intelligence Agent**
   - sponsor analysis
   - category gaps
   - relationship signal review

4. **Proposal / Outreach Agent**
   - proposal drafting
   - outreach packaging
   - review-ready submission prep

5. **Compliance & Coordination Agent**
   - workflow hygiene
   - governance
   - continuity and audit support

---

## How It Connects to KSU CSOS

KSU CSOS is currently being treated as the athletics-domain execution layer.

That means:
- CSOS provides domain-specific commands and execution opportunities
- athletics-ai-workforce provides the productized AI workforce shell above that layer
- the connector pattern should stay narrow at first

Planned relationship:
- `athletics-ai-workforce` creates or recommends work
- `athletics-ai-workforce` routes that work through tasks, approvals, and memory
- approved actions can then call into CSOS through adapter-backed connectors
- CSOS can return data/results that feed back into tasks, approvals, connector runs, and memory

This separation is strategic because it avoids making the product hostage to a single domain backend.

---

## How It Extends to Future Industry Operating Systems

The same product architecture can be adapted beyond athletics.

Pattern:
- keep the workforce shell
- swap the domain execution backend
- preserve workers, tasks, approvals, memory, onboarding, and product packaging

Examples:
- healthcare operating system + AI workforce shell
- real estate operating system + AI workforce shell
- recruiting or NIL operating system + AI workforce shell
- standalone SMB operations platform with no external operating system at all

In other words, athletics is the first proving ground, not the ceiling.

---

## How It Fits the Visionary AI Ecosystem

Inside the broader Visionary AI ecosystem, this product is meant to become a reusable pattern for embedded AI workforces that can:
- communicate with each other
- share structured knowledge
- hand off tasks across systems
- trigger cross-product workflows
- preserve continuity between agents, products, and environments

That aligns with Milton’s broader architecture vision:
- OpenClaw / NemoClaw style agents as operational interfaces
- NotebookLM and related knowledge systems as shared intelligence layers
- domain-specific products acting as execution surfaces
- orchestrated agents coordinating across products instead of staying trapped inside one app

---

## What Makes This Similar to Marblism — and Different

### Similar
- generates an AI team concept
- productizes onboarding and worker setup
- frames AI as a workforce, not a single assistant
- aims for packaged, business-ready value

### Different
- stronger emphasis on governance, approvals, and continuity
- stronger separation between shell and backend execution systems
- stronger role for memory, handoffs, and operational traceability
- more explicit path toward voice-first orchestration
- designed to plug into a multi-agent Visionary AI ecosystem, not remain a standalone isolated app

---

## Near-Term Product Priorities

1. strengthen workflow clarity and operator next actions
2. keep onboarding → team generation → launch flow product-grade
3. continue continuity/memory discipline across tasks, approvals, and workers
4. keep connector proof narrow while the product shell gets stronger
5. preserve GitHub-backed continuity and handoff quality every session

---

## Practical Summary

`athletics-ai-workforce` is becoming:
- an AI team generator
- an operator command center
- a governed task/approval system
- a continuity-preserving memory layer
- a connector-aware orchestration shell
- a future template for multi-industry AI workforce products across the Visionary AI ecosystem

For athletics today, it should help departments coordinate revenue, sponsorship, proposal, and leadership workflows.

For Visionary AI long term, it is a reusable pattern for how AI workers should be launched, governed, remembered, and connected across products.
