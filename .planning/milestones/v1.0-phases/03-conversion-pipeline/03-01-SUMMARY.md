---
phase: 03-conversion-pipeline
plan: 01
subsystem: forms
tags: [netlify-forms, fetch, typescript, aria, form-validation]

# Dependency graph
requires:
  - phase: 02-content-migration
    provides: Astro component architecture with VolunteerForm.astro and EmailCapture.astro markup
provides:
  - Fetch-based Netlify Forms submission handler (form-handler.ts)
  - Role card toggle with hidden input sync (role-cards.ts)
  - Error state UI with retry for both forms
  - Inline success/error feedback without page redirect
affects: [03-conversion-pipeline, 06-growth-engine]

# Tech tracking
tech-stack:
  added: []
  patterns: [fetch POST to window.location.pathname for Netlify Forms AJAX, shared form handler pattern with per-form init functions]

key-files:
  created:
    - src/scripts/form-handler.ts
    - src/scripts/role-cards.ts
  modified:
    - src/components/VolunteerForm.astro
    - src/components/EmailCapture.astro

key-decisions:
  - "Netlify Forms AJAX via fetch POST to current page URL with URLSearchParams body"
  - "Shared form-handler module with separate init functions per form"
  - "Duplicate handling is server-side automatic (CONV-04) -- no client-side dedup"

patterns-established:
  - "Form handler pattern: querySelector bail-early, submit listener with preventDefault, fetch POST, success/error class toggle"
  - "Error state: .form-error/.visible toggle with retry button re-enabling submission"

requirements-completed: [CONV-01, CONV-02, CONV-03, CONV-04, CONV-05]

# Metrics
duration: 2min
completed: 2026-04-21
---

# Phase 03 Plan 01: Form Submission Wiring Summary

**Fetch-based Netlify Forms submission for volunteer signup and email capture with inline success/error states and role card selection sync**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-21T08:01:38Z
- **Completed:** 2026-04-21T08:04:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Both forms (volunteer signup + email capture) now submit via fetch POST to Netlify Forms with AJAX pattern -- no page redirect
- Volunteer form shows success only after server confirms receipt (CONV-01, CONV-02); error state with retry button on failure (CONV-03)
- Email capture shows inline success on submission, error with button re-enable on failure
- Role card selection restored: click toggles .selected class, aria-pressed attribute, and syncs to hidden input for form submission
- Duplicate submission handling documented as automatic on Netlify's server side (CONV-04)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create form submission handler and role card scripts** - `94d542c` (feat)
2. **Task 2: Update form components with error UI and script imports** - `a6e0e1e` (feat)

## Files Created/Modified
- `src/scripts/form-handler.ts` - Form submission handling for both volunteer and email-capture forms via Netlify Forms AJAX
- `src/scripts/role-cards.ts` - Role card toggle with aria-pressed and hidden input sync
- `src/components/VolunteerForm.astro` - Added error div with retry button, scoped error styles, script imports for form-handler and role-cards
- `src/components/EmailCapture.astro` - Added error paragraph, scoped error styles, script import for form-handler

## Decisions Made
- Used `URLSearchParams(formData)` body instead of raw FormData for Netlify Forms compatibility with AJAX submissions
- Shared form-handler module with separate `initVolunteerForm()` and `initEmailCapture()` functions (not a single generic handler) to keep form-specific logic clear
- Error state uses `.visible` class toggle pattern consistent with existing `.signup-success.visible` and `.email-capture__success.visible` CSS

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Form submission wiring complete; forms will POST to Netlify Forms on deploy
- Role card selection restored and syncing to hidden input
- Ready for 03-02 (analytics) and 03-03 (remaining conversion pipeline work)
- Note: Netlify Forms require deployment to Netlify for actual form processing; local dev shows fetch success/error path only

---
*Phase: 03-conversion-pipeline*
*Completed: 2026-04-21*
