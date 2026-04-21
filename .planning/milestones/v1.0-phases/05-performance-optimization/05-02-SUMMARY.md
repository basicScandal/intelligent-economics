---
phase: 05-performance-optimization
plan: 02
subsystem: performance
tags: [threejs, webgl, intersection-observer, reduced-motion, accessibility, cache-headers, netlify]

# Dependency graph
requires:
  - phase: 05-performance-optimization
    provides: Tier-based particle adaptation (device-detect.ts, particle count lookups)
  - phase: 02-content-migration
    provides: Three.js particle systems (hero-particles, morph-engine, zone-zero) and sections.css
provides:
  - IntersectionObserver-based render loop pause/resume on all Three.js scenes
  - Reduced-motion CSS fallbacks with gradient backgrounds replacing canvases
  - Immutable cache headers for content-hashed static assets
affects: [06-growth-engagement]

# Tech tracking
tech-stack:
  added: []
  patterns: [IntersectionObserver render-pause, reduced-motion gradient fallbacks, immutable asset caching]

key-files:
  modified:
    - src/scripts/hero-particles.ts
    - src/scripts/morph-engine.ts
    - src/scripts/zone-zero.ts
    - src/styles/sections.css
    - netlify.toml

key-decisions:
  - "Render-pause observers are separate from analytics observers in zone-zero.ts to maintain independent lifecycles"
  - "Gradient fallbacks use bioluminescent palette colors from design tokens for visual consistency with particle effects"
  - "Cache headers placed before security headers in netlify.toml for Netlify rule priority (more specific first)"

patterns-established:
  - "IntersectionObserver render-pause pattern: isVisible boolean gates rAF loop self-termination, startLoop() restarts on re-entry"
  - "Reduced-motion canvas hiding: display:none on canvas + gradient background on parent wrapper inside @media (prefers-reduced-motion: reduce)"

requirements-completed: [PERF-01, PERF-03, PERF-05, PERF-06]

# Metrics
duration: 2min
completed: 2026-04-21
---

# Phase 05 Plan 02: Render Loop Pausing, Reduced-Motion Fallbacks, and Cache Headers Summary

**IntersectionObserver-based off-screen render loop pausing for all Three.js scenes, gradient CSS fallbacks for prefers-reduced-motion users, and immutable cache headers for Astro/Vite content-hashed assets**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-21T08:32:49Z
- **Completed:** 2026-04-21T08:35:46Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- All three Three.js particle systems (hero, morph, zone-zero) now pause their rAF render loops when scrolled off-screen and resume when visible, saving GPU/battery
- Reduced-motion users see themed bioluminescent gradient backgrounds instead of blank canvas areas, maintaining visual richness without animation
- Static assets in `/_astro/*` and `*.woff2` served with `Cache-Control: public, max-age=31536000, immutable` for instant repeat visits

## Task Commits

Each task was committed atomically:

1. **Task 1: Add IntersectionObserver render loop pause/resume to all Three.js scripts** - `69b9ae6` (feat)
2. **Task 2: Reduced-motion CSS fallbacks and immutable cache headers** - `bc8961a` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/scripts/hero-particles.ts` - Added heroObserver IntersectionObserver, startLoop/animate pause/resume pattern
- `src/scripts/morph-engine.ts` - Added mObserver IntersectionObserver on morphSceneEl, startMLoop/mLoop pause/resume pattern
- `src/scripts/zone-zero.ts` - Added zzRenderObserver (separate from analytics observer), startZZLoop/animate pause/resume pattern, renamed analytics observer to analyticsObserver
- `src/styles/sections.css` - Extended prefers-reduced-motion block with canvas hiding, gradient fallbacks for hero/morph/zone-zero, morph UI element hiding
- `netlify.toml` - Added Cache-Control immutable headers for /_astro/* and *.woff2 paths

## Decisions Made
- Render-pause observers kept separate from the existing CONV-09 analytics observer in zone-zero.ts -- different lifecycles (persistent vs fire-once-and-disconnect)
- Gradient fallback colors pulled from the bioluminescent design token palette (--color-primary, --color-secondary, --color-tertiary) for visual consistency
- Cache header rules placed before the catch-all security headers in netlify.toml since Netlify applies more specific path rules first

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 05 (performance-optimization) is now complete with both plans executed
- All performance requirements addressed: tier-based adaptation (Plan 01), render loop pausing, reduced-motion fallbacks, and cache headers (Plan 02)
- Ready for Phase 06 (growth-engagement)

## Self-Check: PASSED

- All 5 modified files exist on disk
- Both task commits (69b9ae6, bc8961a) found in git log
- SUMMARY.md created at expected path

---
*Phase: 05-performance-optimization*
*Completed: 2026-04-21*
