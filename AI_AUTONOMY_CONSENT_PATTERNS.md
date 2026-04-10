# AI Autonomy & Consent Patterns to Reuse Later

## Purpose
Capture the most reusable admin/settings patterns visible in the Visionary AI Vision Board screenshots so athletics-ai-workforce can later adopt the strongest ideas in a product-appropriate way.

These are not immediate build requirements unless explicitly prioritized, but they are high-value future UX patterns.

---

## Strong reusable patterns observed

### 1. Global AI action enablement
Observed pattern:
- explicit master control like **Enable AI Agent Actions**
- framed as user consent / authorization for the AI to act on the user’s behalf

Why this matters for athletics-ai-workforce:
- excellent pattern for governed AI operations
- creates a clear top-level permission posture
- reduces ambiguity around when workers may act vs only recommend

Potential athletics adaptation:
- per-org and/or per-role master switch for AI-initiated actions
- language could distinguish:
  - recommend only
  - prepare drafts
  - act after approval
  - act automatically for low-risk items

### 2. Action permissions by action type
Observed pattern:
- explicit permission blocks for actions like:
  - send emails
  - send SMS
  - voice calls
  - create tasks
  - schedule reminders

Why it matters:
- athletics-ai-workforce will eventually need exactly this type of permission granularity
- maps well onto external or consequential actions

Potential athletics adaptation:
- permissions by action family:
  - proposal drafting
  - outreach draft generation
  - campaign scheduling
  - external send
  - reminder/task creation
  - connector execution
  - CRM sync / reporting actions

### 3. Confirmation requirements
Observed pattern:
- separate from permission itself
- even if an action is allowed, confirmation can still be required

Why it matters:
- this is a very strong governance pattern
- permission and confirmation should not be conflated

Potential athletics adaptation:
- org/admin policy surface for:
  - require approval before external send
  - require confirmation before scheduling campaign
  - require human confirmation before CSOS mutation
  - allow auto-execution only for narrowly low-risk actions

### 4. Confidence threshold / auto-approval logic
Observed pattern:
- explicit confidence threshold and risk-level logic
- low-risk vs medium-risk framing

Why it matters:
- directly useful for future worker autonomy controls
- helps frame autonomy in operational rather than magical terms

Potential athletics adaptation:
- future org policy settings like:
  - low-risk actions may auto-complete
  - medium-risk actions require operator confirmation
  - high-risk actions always route through approval
- examples:
  - low-risk: internal reminders, task generation, note packaging
  - medium-risk: internal workflow routing, draft updates
  - high-risk: external sends, proposal submission, campaign launch

### 5. Quiet hours / communication timing controls
Observed pattern:
- notification settings include quiet hours and delivery timing controls

Why it matters:
- extremely relevant for executive support / outreach / reminders / task digests

Potential athletics adaptation:
- worker/admin preferences for:
  - quiet hours
  - digest timing
  - notification window policies
  - approval reminder scheduling
  - campaign/operator reminders

### 6. Channel preference management
Observed pattern:
- communication channels are explicit and configurable
- primary/secondary roles can be assigned

Why it matters:
- athletics-ai-workforce may later span email, SMS, voice call, and other channels
- channel hierarchy matters operationally

Potential athletics adaptation:
- channel policy per org/user/worker:
  - email
  - SMS
  - voice
  - internal app notifications
  - future messaging surfaces

### 7. Action history / recent activity log
Observed pattern:
- visible action history showing status and recency

Why it matters:
- a strong trust-building feature
- users need to see what the AI did, what is pending, what succeeded, and what failed

Potential athletics adaptation:
- worker or org-level action history for:
  - draft creation
  - approval submissions
  - reminder scheduling
  - outreach prep
  - connector actions
  - campaign workflow transitions

### 8. Voice persona / voice coach configuration
Observed pattern:
- voice settings include persona selection and quotas

Why it matters:
- voice is already part of athletics-ai-workforce strategy
- eventually useful for role-specific voice surfaces

Potential athletics adaptation:
- per-worker voice persona settings
- voice/manual parity surfaces
- visibility into which worker owns which spoken interaction style

---

## What should transfer directly vs carefully

### Transfer directly later
- master AI action enablement
- action-type permission matrix
- confirmation requirement matrix
- confidence/risk posture controls
- action history visibility
- quiet hours / notification timing

### Transfer carefully / adapt to athletics context
- voice persona controls
- channel preference hierarchy
- proactive outreach settings
- admin dashboard module density

The reason: athletics-ai-workforce is an operator console first, so these controls must map to:
- approvals
- tasks
- memory continuity
- connector governance
- campaign workflow states

---

## Best future placement inside athletics-ai-workforce

### A. Org admin / policy center
Ideal home for:
- AI action permissions
- confirmation rules
- confidence thresholds
- communication channel rules
- quiet hours
- audit policy summaries

### B. Worker settings
Ideal home for:
- worker-specific autonomy posture
- worker-specific channel capabilities
- voice persona / presentation settings
- escalation defaults

### C. Approval / action history surfaces
Ideal home for:
- what the worker attempted
- what required approval
- what executed
- what failed or was canceled

---

## Key rule for athletics-ai-workforce
These controls should support a simple ladder of trust:
1. **Observe** — the AI recommends only
2. **Prepare** — the AI drafts but does not act
3. **Escalate** — the AI routes work into approvals
4. **Assist with guardrails** — the AI can perform approved low-risk actions
5. **Operate automatically in narrow domains** — only where policy clearly allows it

That trust ladder fits athletics-ai-workforce much better than a single vague “autonomous AI” switch.

---

## Immediate takeaway
The Vision Board screenshots surfaced one especially valuable product lesson:

**Users trust AI more when autonomy is decomposed into visible permissions, confirmations, confidence rules, timing rules, and action history.**

That principle is highly relevant to athletics-ai-workforce and should likely influence a future admin/policy surface.
