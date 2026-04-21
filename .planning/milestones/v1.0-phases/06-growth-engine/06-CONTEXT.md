# Phase 6: Growth Engine - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (requirements-driven — discuss skipped in autonomous mode)

<domain>
## Phase Boundary

Build the full welcome-to-community pipeline: MailerLite welcome email sequence, Discord community setup, team/about page with founder identity, and organizational status. New signups receive a structured experience moving them from subscriber to active community member.

</domain>

<decisions>
## Implementation Decisions

### Welcome Email Sequence
- 4 emails over 14 days via MailerLite automation
- Day 0: Welcome + MIND explainer + community invite
- Day 3: Zone Zero simulator deep-dive + share challenge
- Day 7: "Choose your first micro-task" based on selected role
- Day 14: Progress update + ask for feedback
- Each email has single clear CTA and unsubscribe link

### Discord Community
- Role-based channels: #introductions, #economists, #engineers, #designers, #organizers, #researchers, #policymakers, #zone-zero-ideas, #general
- Invite link shown on form success screen (VolunteerForm.astro)
- Invite link included in welcome emails
- Pinned "Start Here" message in each channel (user action)

### Team/About Section
- New Astro component or modification of existing section
- At least one named person (Rob) with photo/avatar and bio
- Contact email available
- Organizational status stated: "Forming as a nonprofit" or equivalent

### Claude's Discretion
- Team section visual design (should match site aesthetic)
- Email copy tone and specific wording
- Discord server icon and description
- Where the team section goes in the page flow

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/components/VolunteerForm.astro — form success state needs Discord invite link
- src/styles/sections.css — existing section styling patterns
- src/content.config.ts — content collections pattern for team members (ARCH-07)

### Integration Points
- MailerLite automation builder (user action — configure in dashboard)
- Discord server creation (user action — create server, set channels)
- Form success screen (add Discord invite link)
- Welcome emails (add Discord invite link)

</code_context>

<specifics>
## Specific Ideas

From SPEC.md FR-005: Discord channels list and auto-role assignment concept.
From SPEC.md FR-007: 4-email sequence details with specific CTAs per email.

</specifics>

<deferred>
## Deferred Ideas

None — growth engine is the final v1 milestone phase.

</deferred>
