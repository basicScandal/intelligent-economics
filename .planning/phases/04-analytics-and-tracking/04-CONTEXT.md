# Phase 4: Analytics and Tracking - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Add Plausible analytics to track visitor behavior, form funnel events, and Zone Zero simulator engagement. This gives the team visibility into how visitors move through the site and where the conversion funnel leaks.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — infrastructure/analytics phase. Key constraints:
- Plausible Analytics (cloud-hosted, $9/mo — user must set up account)
- Script tag in BaseLayout.astro head
- Custom events via plausible() JavaScript API for form funnel and Zone Zero engagement
- No cookies, GDPR-compliant by default

</decisions>

<code_context>
## Existing Code Insights

### Integration Points
- src/layouts/BaseLayout.astro — Plausible script tag goes in head
- src/scripts/form-handler.ts — Add funnel events (form viewed, started, submitted)
- src/scripts/zone-zero.ts — Add engagement events (opened, interacted, shared)
- src/components/VolunteerForm.astro — IntersectionObserver for "form viewed" event

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the 3 CONV requirements.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
