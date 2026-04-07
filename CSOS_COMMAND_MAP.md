# CSOS_COMMAND_MAP.md

## Purpose
Map CSOS command groups to external workforce agents and workflows.

## Command Groups Identified
- constituent
- alumni
- sponsor
- campaign
- outreach
- proposal
- report
- status
- future: goal, ambassador

## Initial Mapping
### Sponsorship Intelligence Agent
**Uses:**
- `csos sponsor attrition --json`
- `csos sponsor category-gaps --json`
- `csos sponsor match-alumni --json`
- `csos sponsor list --json`

**Purpose:**
- identify sponsor attrition
- find category gaps
- surface alumni/company matches
- rank recovery opportunities

### Proposal & Outreach Agent
**Uses:**
- `csos proposal create`
- `csos proposal add-asset`
- `csos proposal view`
- `csos proposal submit`
- future outreach commands

**Purpose:**
- generate proposal package draft
- manage package assets
- prep outbound sponsorship workflow

### Executive Assistant Agent
**Uses:**
- `csos report ...`
- future summary/report commands

**Purpose:**
- create summaries and leadership briefings

### Compliance & Coordination Agent
**Uses:**
- workflow state and approval systems in workforce platform
- some report/status commands where useful

**Purpose:**
- ensure workflows are approved and tracked

## Connector Priorities
### Priority 1
- sponsor attrition
- sponsor category gaps
- sponsor match-alumni
- proposal create
- proposal view

### Priority 2
- proposal submit
- outreach commands
- reporting commands

### Priority 3
- campaign commands
- ambassador / goal commands when mature

## Notes
The connector should support both:
- CLI execution now
- direct RPC/API adapters later
