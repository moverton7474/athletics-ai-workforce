# SALES_WORKFLOW_SPEC.md

## Observed Marblism Pattern
The Sales Associate has multiple operating surfaces:
- Chat
- AI Leads
- Sequence

### AI Leads
A lead table includes:
- name
- company
- profile link
- email
- status
- assigned sequence

### Sequence
Sequence builder appears to support multi-step outreach over time with steps such as:
- enroll leads
- send email
- wait period
- send invitation
- send message
- additional waits / follow-ups

## Product Implications
athletics-ai-workforce should support worker-specific output/workflow tabs.
For a Sponsorship / Revenue worker, likely tabs are:
- Chat
- Opportunities
- Sequences
- Approvals

## athletics adaptation
### Sponsorship Intelligence / Proposal Agent surfaces
- Opportunities table
- lead/contact enrichment
- sequence builder for outreach steps
- proposal handoff / approval state

## MVP simplification
For v1, start with:
- opportunity list
- contact table
- simple outreach sequence template
- approval gate before external send
