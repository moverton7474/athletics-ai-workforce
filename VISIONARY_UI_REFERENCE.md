# Visionary UI Reference for athletics-ai-workforce

## Purpose
Use the Visionary AI Vision Board application as a **visual and branding reference layer** for athletics-ai-workforce while keeping KSU CSOS as the primary **functional operations reference**.

This is a deliberate split:
- **Vision Board / Visionary AI app** = look and feel, branding marks, premium product mood, admin/settings UX patterns, consent/autonomy UI ideas
- **KSU CSOS** = athletics-domain workflow logic, operational command surface, backend execution seams, connector/adapter grounding
- **athletics-ai-workforce** = governed product shell that blends Visionary AI brand expression with athletics workflow execution

## Important rule
Do **not** let visual inspiration from Vision Board pull athletics-ai-workforce away from:
- the core workflow shell
- tasks / approvals / memory continuity
- adapter-based CSOS integration
- human-in-the-loop operational governance

Vision Board should influence the **presentation language**, not replace the athletics operating model.

## Current repo-access note
The live Vision Board app is reachable at:
- `https://ai-interactive-vision-board-2.vercel.app/`

The GitHub repo referenced by Milton appears to require credentials from the current environment, so a full local clone was not available from this session.

That means this reference currently comes from:
- user-provided screenshots
- live app metadata/title
- Milton’s direct product guidance

If repo access becomes available later, extend this doc with exact token/theme/component references from source.

---

## Visual language to borrow

### 1. Premium dark foundation
Observed direction:
- very dark navy / charcoal surfaces
- deep indigo / purple gradients in hero/admin areas
- bright but controlled contrast
- thin, refined border treatments instead of heavy card outlines

How to apply in athletics-ai-workforce:
- move toward a darker premium command-center aesthetic for operator/admin surfaces
- use gradient or branded-background treatments selectively on:
  - dashboard command center
  - approvals / policy center
  - executive or admin views
- keep workflow-heavy pages readable first; do not bury operational clarity under decorative styling

### 2. Visionary brand marks and gold accents
Observed direction:
- elegant gold / amber brand accents
- restrained use of warm highlight color for emphasis and premium feel
- Visionary AI mark appears subtle, not loud

How to apply:
- use gold/amber for:
  - premium emphasis
  - key badges / plan tiers / elevated settings
  - important action highlights
  - brand micro-accents in top navigation and section headers
- keep success/warning/error semantic colors distinct from brand gold

### 3. Card-first modular control surfaces
Observed direction:
- settings and admin areas are organized as stacked modular cards
- each card owns one concern clearly
- controls feel grouped and intentional

How to apply:
- continue using card-based workflow surfaces for:
  - worker ownership
  - approval gating
  - autonomy settings
  - notification/quiet hours
  - channel preferences
  - connector policy / action history

### 4. Productized admin dashboard feel
Observed direction:
- admin pages feel like a platform console, not a generic CRUD panel
- tab chips / segmented nav create a system-management mood
- dashboard cards emphasize role and platform posture

How to apply:
- athletics-ai-workforce should eventually have an explicit admin/operator layer for:
  - team and worker governance
  - policy/consent controls
  - connector oversight
  - memory governance
  - action history / audit review

### 5. Glow / highlight restraint
Observed direction:
- some glow and premium contrast is present
- still relatively contained inside cards, accent bars, and highlighted sections

How to apply:
- use subtle glow only for:
  - primary CTAs
  - active tabs / selected personas / premium feature callouts
  - approval-critical or route-entry context blocks
- avoid turning the product into a neon dashboard where operational signal gets lost

---

## Layout patterns worth borrowing

### Top nav treatment
Observed:
- slim branded top navigation
- app feels unified under one umbrella product family

Application:
- athletics-ai-workforce can inherit a Visionary-family top-shell feel while still keeping athletics-specific information architecture below it

### Tab-chip management surfaces
Observed:
- admin dashboard uses a dense but readable chip/tab system for many management domains

Application:
- useful for future athletics admin/governance areas such as:
  - approvals
  - workers
  - communication policies
  - connector runs
  - memory governance
  - outreach / campaigns
  - agent activity

### Stacked settings architecture
Observed:
- settings read as a coherent sequence of policy blocks

Application:
- athletics-ai-workforce should use this for future worker/admin settings so operators can understand:
  - what is enabled
  - what requires confirmation
  - what confidence threshold applies
  - which channels are active
  - what happened recently

---

## Typography / mood guidance
Target mood to borrow:
- premium
- focused
- trustworthy
- operator-grade
- aspirational without being fluffy

Avoid:
- generic startup blue
- plain enterprise gray everywhere
- overloaded marketing gradients on workflow pages
- playful styling that undermines operational seriousness

---

## Athletics-specific adaptation rule
athletics-ai-workforce should not become a clone of Vision Board.

It should become:
- a Visionary AI umbrella product in brand tone and finish
- an athletics operator console in function and workflow clarity

So the target is:
- **Visionary polish + athletics execution discipline**

---

## Recommended implementation sequence
1. extract color tokens and surface rules from Vision Board references
2. define athletics-ai-workforce brand-safe token set
3. apply to shared primitives first:
   - page shells
   - cards
   - buttons
   - badges
   - tabs
   - stat blocks
4. then apply to high-value routes:
   - dashboard
   - workers
   - approvals
   - campaign workflow pages
5. only after those are stable, consider broader full-app aesthetic unification

---

## Summary
Use Vision Board to make athletics-ai-workforce feel:
- premium
- branded
- coherent
- productized

But keep KSU CSOS and the current athletics roadmap in charge of:
- workflow logic
- permissions model
- integration direction
- operator-facing execution structure
