# Phase 3: Conversion Pipeline - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (requirements-driven — discuss skipped in autonomous mode)

<domain>
## Phase Boundary

Fix the broken volunteer form, add email-first capture near the hero, wire MailerLite integration, and rewrite the partner organizations section with honest framing. This is the most critical phase for the movement — every submission must be reliably persisted.

</domain>

<decisions>
## Implementation Decisions

### Form Backend
- Netlify Forms via `data-netlify="true"` attribute on the form element
- Success/error states handled in TypeScript — real confirmation only after fetch succeeds
- Honeypot spam prevention (already in place from Phase 2 migration)
- Duplicate emails flagged via Netlify Forms submission metadata (not rejected)

### Email Capture
- Single-field email input positioned after the hero section (within first 2 viewport heights)
- Submits to MailerLite API via a Netlify serverless function (netlify/functions/)
- Triggers the welcome automation sequence in MailerLite
- Does NOT duplicate with the full volunteer form (if same email, MailerLite merges)

### MailerLite Integration
- Netlify Function at netlify/functions/subscribe.ts
- Uses MailerLite API v2 to add subscriber and trigger group-based automation
- API key stored as Netlify environment variable MAILERLITE_API_KEY
- The submission-created webhook can also POST to MailerLite for volunteer form signups

### Partner Section
- Rename to "Organizations Working in This Space" or similar honest framing
- Add visible disclaimer: "These are independent organizations doing parallel work. Listing does not imply partnership or endorsement."
- Remove any language implying direct partnership

### Claude's Discretion
- Email capture visual design (should match the bioluminescent palette)
- Success/error animation or transition styles
- Exact partner section title wording
- Whether to use submission-created event or direct API call for MailerLite

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- src/components/VolunteerForm.astro — form markup already migrated with data-netlify, honeypot
- src/components/Partners.astro — partner section markup already migrated
- src/components/Hero.astro — hero section where email capture should be adjacent
- src/styles/sections.css — existing form and partner styles
- netlify.toml — Netlify configuration already in place

### Established Patterns
- TypeScript modules in src/scripts/ for interactive behavior
- Astro components with scoped styles where needed
- Netlify Functions in netlify/functions/ directory

### Integration Points
- MailerLite API (requires account setup and API key)
- Netlify Forms dashboard (automatic with data-netlify attribute)
- Netlify environment variables for API keys

</code_context>

<specifics>
## Specific Ideas

From SPEC.md FR-001: "On form submit, POST data to a backend service. Persist: first_name, last_name, email, location, expertise, bandwidth, roles, message, timestamp."
From SPEC.md FR-004: "Single-field email capture near the hero section. On submit, add to newsletter list. Show: 'We'll send your first mission in 24 hours.'"

</specifics>

<deferred>
## Deferred Ideas

None — conversion pipeline is tightly scoped by requirements.

</deferred>
