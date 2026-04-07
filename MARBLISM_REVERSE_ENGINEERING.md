# MARBLISM_REVERSE_ENGINEERING.md

## Summary
Marblism combines a strong marketing frame (AI employees) with a lightweight but sticky operating model:
- named role-based agents
- persistent threads per agent
- simple onboarding
- role-specific settings/guidelines
- generated draft outputs
- connected external accounts
- shared vs personal collaboration patterns
- packaged pricing with add-ons and seats

## Observed UX Patterns
### Marketing / acquisition
- homepage sells "AI Employees" as a team
- role cards are visual, character-based, easy to understand
- messaging focuses on replacing fragmented tools with workers

### Onboarding
Observed steps suggest:
1. choose usage mode (business / job / personal)
2. enter website/business URL
3. system benchmarks/analyzes the business
4. present generated AI team

This is important: onboarding creates perceived personalization before work begins.

### Agent workspace model
Each AI employee appears to have:
- Chat tab
- Posts tab
- Guidelines tab
- Settings menu

### Guidelines model
At least for Social Media Manager, guideline fields appear to include:
- content themes
- image style
- writing style

This suggests a structured role-tuning system rather than one giant freeform prompt.

### Output model
The Social Media Manager appears to:
- generate draft posts on a content calendar
- maintain a queue of drafts
- publish through connected social accounts
- expose quick action prompts inside chat

### Integration model
Observed connected-account settings indicate account-specific integrations per worker.
For the social manager, this included examples like Instagram and LinkedIn.

## Product Patterns To Reuse
- role cards / staff identity
- structured onboarding wizard
- role-tuning fields instead of hidden-only prompts
- tabbed worker workspace (chat / outputs / guidance / settings)
- channel/account connection per worker
- draft-first workflow design
- collaboration and seat-based monetization

## Patterns To Improve In athletics-ai-workforce
- stronger governance and approvals
- auditability on every action
- clearer task/workflow visibility
- more explicit cross-agent collaboration
- deeper connector-backed execution through CSOS
