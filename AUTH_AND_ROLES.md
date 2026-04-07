# AUTH_AND_ROLES.md

## Auth Model
Use Supabase Auth for primary authentication.

## Initial Roles
### owner
- full org control
- billing
- role assignment
- plan management

### admin
- manage workers
- manage org settings
- manage integrations
- manage workflows

### operator
- use workers
- manage day-to-day tasks
- act on assigned approvals where allowed

### collaborator
- limited workspace participation
- view/use assigned surfaces

### future: security_compliance
- approval authority for protected actions
- audit/export authority

## Worker assignment model
### shared worker
- assigned at org/team level
- visible to authorized team members

### personal worker
- assigned to one user
- private by default
- admin/owner override only where policy allows

## Auth milestones
1. email/password + magic link
2. invite flow for members
3. org creation on first login
4. role assignment UI
5. later: SSO / SCIM
