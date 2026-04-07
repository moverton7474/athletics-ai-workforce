# INTEGRATIONS_MODEL.md

## Goal
Allow workers to connect the right accounts/tools for their role.

## Observed Marblism Pattern
Social media workers appear to support connected external social accounts, making the worker account-aware and channel-specific.

## Recommended Model
### Integration scopes
- organization-level integrations
- worker-level integrations
- user/personal integrations

### Example mappings
#### Social/Content worker
- Instagram
- LinkedIn
- X/Twitter
- Facebook
- YouTube

#### Executive assistant
- Gmail/Outlook
- calendar
- Slack/Teams

#### Sponsorship worker
- CRM
- CSOS connector
- email
- calendar
- proposal/doc storage

#### Compliance worker
- docs/storage
- approval routing tools
- messaging alerts

## Rules
- worker can only access explicitly connected accounts
- sensitive integrations require admin approval
- integration actions must be logged
