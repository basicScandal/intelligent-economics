---
phase: 02-content-migration
plan: 04
subsystem: ui
tags: [gsap, scrolltrigger, theme-toggle, countdown, intersection-observer, typescript, aria]

# Dependency graph
requires:
  - phase: 02-content-migration/01
    provides: "Astro component structure with DOM anchors (data-theme-toggle, #nav, #cd-days, .pillar-card, .mind__panel)"
  - phase: 02-content-migration/02
    provides: "Section components (Pillars, MindDashboard, LocalExperiments) with markup and CSS"
provides:
  - "Dark/light theme toggle with localStorage persistence and FOUC prevention"
  - "Countdown timer module targeting 2029-01-09"
  - "GSAP ScrollTrigger clip-path diagonal wipe animations"
  - "MIND bar counter animation via IntersectionObserver"
  - "Experiment tab switching with ARIA states"
  - "Nav scroll state management"
  - "IntersectionObserver-based .reveal fade-in system"
affects: [03-conversion, 05-performance]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Astro <script> imports for component-scoped JS", "is:inline only for FOUC prevention in <head>", "IntersectionObserver for viewport-triggered animations", "GSAP imported via npm (no CDN)"]

key-files:
  created:
    - src/scripts/theme.ts
    - src/scripts/countdown.ts
    - src/scripts/nav-scroll.ts
    - src/scripts/gsap-reveals.ts
    - src/scripts/experiments-tabs.ts
  modified:
    - src/layouts/BaseLayout.astro
    - src/components/Nav.astro
    - src/components/Hero.astro
    - src/components/MindDashboard.astro
    - src/components/Pillars.astro
    - src/components/LocalExperiments.astro

key-decisions:
  - "Single is:inline script for FOUC prevention; all other scripts use Astro bundled <script> tags"
  - "GSAP loaded via npm import, not CDN -- bundled by Vite at ~46KB gzipped"
  - "initScrollReveals() placed in Pillars component (mid-page) to observe all .reveal elements globally"
  - "Countdown and hero-particles in separate <script> tags on Hero.astro (parallel agent merged safely)"

patterns-established:
  - "Component scripts: import typed module, call init function in Astro <script> tag"
  - "FOUC prevention: is:inline in <head> only for theme, nothing else"
  - "GSAP animations: register ScrollTrigger once per module, use toggleActions play-none-none-none"

requirements-completed: [CPRE-05, CPRE-07, ARCH-08]

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 02 Plan 04: Interactive Scripts Summary

**5 TypeScript modules for theme toggle (FOUC-safe), countdown timer, GSAP ScrollTrigger clip-path wipes, MIND bar counters, and experiment tabs -- all bundled via npm with zero CDN dependencies**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-21T07:35:24Z
- **Completed:** 2026-04-21T07:38:21Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Dark/light theme toggle with localStorage persistence, SVG icon swap, and FOUC prevention via is:inline head script (ARCH-08)
- GSAP ScrollTrigger diagonal clip-path wipe animations for pillar cards and MIND panels, plus IntersectionObserver-based .reveal system (CPRE-05)
- Countdown timer displaying days/hours/mins remaining to 2029-01-09 with explanation toggle (CPRE-07)
- Experiment tab switching with ARIA aria-selected state management
- Nav scroll state adds .scrolled class at 60px threshold

## Task Commits

Each task was committed atomically:

1. **Task 1: Create theme.ts, countdown.ts, nav-scroll.ts modules** - `8431779` (feat)
2. **Task 2: Create gsap-reveals.ts, experiments-tabs.ts, wire components** - `655e3d7` (feat)

## Files Created/Modified
- `src/scripts/theme.ts` - Dark/light toggle handler with data-theme, localStorage, SVG icon swap
- `src/scripts/countdown.ts` - Countdown to 2029-01-09 with explanation toggle
- `src/scripts/nav-scroll.ts` - Nav .scrolled class toggle at 60px scroll threshold
- `src/scripts/gsap-reveals.ts` - ScrollTrigger clip-path wipes, IntersectionObserver reveals, MIND bar counters
- `src/scripts/experiments-tabs.ts` - Tab switching with ARIA state management
- `src/layouts/BaseLayout.astro` - Added is:inline FOUC prevention script in <head>
- `src/components/Nav.astro` - Added script importing theme toggle + nav scroll
- `src/components/Hero.astro` - Added script importing countdown timer
- `src/components/MindDashboard.astro` - Added script importing MIND counter animation
- `src/components/Pillars.astro` - Added script importing clip wipes + scroll reveals
- `src/components/LocalExperiments.astro` - Added script importing experiment tabs

## Decisions Made
- Used a single `is:inline` script in BaseLayout `<head>` for FOUC prevention; all other scripts are bundled Astro `<script>` tags per PITFALLS.md guidance
- GSAP imported via npm (`gsap` package) rather than CDN, resulting in ~46KB gzipped bundle handled by Vite
- `initScrollReveals()` placed in Pillars.astro since it queries `.reveal` globally and Pillars loads mid-page
- Hero.astro has separate `<script>` tags for countdown and hero-particles (added by parallel Plan 03 agent) -- Astro handles both correctly

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - build succeeds cleanly, all verification checks pass.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all scripts are fully functional with their corresponding DOM elements.

## Next Phase Readiness
- All interactive behaviors from the original monolithic HTML are now preserved in typed TypeScript modules
- LocalExperiments.astro currently has a placeholder for the tabbed interface (depends on Plan 02 completing the full tab markup) -- the experiments-tabs.ts script will activate once the `.exp-tab` elements are present
- Ready for Phase 03 (conversion) and Phase 05 (performance optimization)

## Self-Check: PASSED

All 12 files verified present. Both task commits (8431779, 655e3d7) verified in git log.

---
*Phase: 02-content-migration*
*Completed: 2026-04-21*
