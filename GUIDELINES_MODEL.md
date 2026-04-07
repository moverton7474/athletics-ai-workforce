# GUIDELINES_MODEL.md

## Goal
Use structured guideline fields instead of hiding all worker behavior inside a single prompt.

## Observed Marblism Pattern
For at least the Social Media Manager, guidelines appear to include structured fields such as:
- content themes
- image style
- writing style

## Recommended Model
### Shared fields for all workers
- mission
- role boundaries
- tone/style
- escalation rules
- approval requirements
- success metrics

### Role-specific fields
#### Social/Content worker
- content pillars
- posting frequency
- visual style
- platform preferences
- hashtag/SEO preferences

#### Executive assistant
- inbox rules
- reply style
- summary format
- urgency thresholds

#### Sponsorship worker
- target categories
- minimum deal thresholds
- outreach constraints
- donor/sponsor priorities

#### Compliance worker
- required approvals
- restricted actions
- deadline rules
- escalation deadlines

## UX Recommendation
Guidelines UI should combine:
- structured form fields
- rich text notes
- optional system-generated recommendations
