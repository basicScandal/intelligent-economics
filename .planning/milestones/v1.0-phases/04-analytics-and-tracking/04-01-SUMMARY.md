---
phase: 04-analytics-and-tracking
plan: 01
subsystem: analytics
tags: [plausible, analytics, tracking, events, intersection-observer]

# Dependency graph
requires:
  - phase: 03-conversion-and-forms
    provides: Form handler module, volunteer form, email capture, Zone Zero simulator
provides:
  - Plausible Analytics script on every page (cloud integration)
  - Typed trackEvent helper for custom events
  - Form funnel tracking (viewed, started, submitted)
  - Simulator engagement tracking (opened, interacted, shared)
affects: [05-performance, 06-growth]

# Tech tracking
tech-stack:
  added: [plausible-analytics]
  patterns: [fire-and-forget analytics, IntersectionObserver for viewport tracking, boolean-gated one-time events]

key-files:
  created:
    - src/scripts/analytics.ts
  modified:
    - src/layouts/BaseLayout.astro
    - src/scripts/form-handler.ts
    - src/scripts/zone-zero.ts
    - src/components/VolunteerForm.astro

key-decisions:
  - "Plausible queue stub before script tag to capture events before Plausible loads"
  - "All analytics fire-and-forget -- never block UI, silently no-op if Plausible blocked"

patterns-established:
  - "Analytics wrapper: import trackEvent from analytics.ts for all custom events"
  - "Viewport tracking: IntersectionObserver with disconnect() for one-time events"
  - "Interaction gating: boolean flags for first-interaction-only events"

requirements-completed: [CONV-07, CONV-08, CONV-09]

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 04 Plan 01: Analytics and Tracking Summary

**Plausible analytics with 6 custom events tracking form funnel (viewed/started/submitted) and Zone Zero simulator engagement (opened/interacted/shared)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-21T08:16:39Z
- **Completed:** 2026-04-21T08:19:51Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Plausible Analytics script loads on every page with queue stub for early event capture
- Typed trackEvent wrapper provides TypeScript safety for all 6 custom event names
- Form funnel tracks 3 events: Form Viewed (IntersectionObserver), Form Started (first focusin), Form Submitted (successful POST) for both volunteer and email-capture forms
- Zone Zero simulator tracks 3 events: Simulator Opened (viewport entry), Simulator Interacted (first slider change), Simulator Shared (every copy/twitter/linkedin click)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Plausible script and analytics helper module** - `31e56d3` (feat)
2. **Task 2: Wire custom events into form funnel and Zone Zero simulator** - `1e2f651` (feat)

## Files Created/Modified
- `src/scripts/analytics.ts` - Typed trackEvent wrapper with PlausibleEvent union type and Window interface extension
- `src/layouts/BaseLayout.astro` - Plausible queue stub + script tag with data-domain in head
- `src/scripts/form-handler.ts` - Form Started (focusin) and Form Submitted events for volunteer and email-capture forms
- `src/scripts/zone-zero.ts` - Simulator Opened (viewport), Simulator Interacted (first slider), Simulator Shared (share clicks)
- `src/components/VolunteerForm.astro` - IntersectionObserver for Form Viewed event on viewport entry

## Decisions Made
- Plausible queue stub placed before the Plausible script tag so events fired before Plausible loads are queued and sent when the script initializes
- All analytics calls are fire-and-forget -- try/catch wrapper ensures analytics never break site functionality even if Plausible is blocked by ad blockers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
Plausible Analytics requires a cloud account ($9/month) at plausible.io with the domain `intelligenteconomics.ai` configured. Custom goals for the 6 event names must be created in the Plausible dashboard for events to appear in reports.

## Next Phase Readiness
- Analytics infrastructure complete -- all page views and custom events will flow to Plausible once the account is configured
- Ready for Phase 05 (performance optimization) and Phase 06 (growth)

## Self-Check: PASSED

All files verified present. All commits verified in git log.

---
*Phase: 04-analytics-and-tracking*
*Completed: 2026-04-21*
