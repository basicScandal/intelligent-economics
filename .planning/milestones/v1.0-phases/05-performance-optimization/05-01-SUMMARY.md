---
phase: 05-performance-optimization
plan: 01
subsystem: performance
tags: [threejs, webgl, device-detection, particle-systems, mobile-optimization]

# Dependency graph
requires:
  - phase: 02-content-migration
    provides: Three.js particle systems (hero-particles, morph-engine, zone-zero) and device-detect utility
provides:
  - Tier-based device classification (full/reduced/minimal) with cached results
  - Adaptive particle counts across all three Three.js systems
  - Per-tier pixel ratio clamping for GPU savings
affects: [05-performance-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns: [tier-based particle adaptation, cached device detection, pixelRatioLimit abstraction]

key-files:
  modified:
    - src/scripts/device-detect.ts
    - src/scripts/hero-particles.ts
    - src/scripts/morph-engine.ts
    - src/scripts/zone-zero.ts

key-decisions:
  - "All mobile devices classified as 'reduced' tier regardless of core count -- screen size and battery matter more than CPU"
  - "Desktop with <=2 cores also classified as 'reduced' -- catches low-end Chromebooks"
  - "Antialias enabled only for 'full' tier across all particle systems for GPU savings"

patterns-established:
  - "Tier lookup pattern: const COUNTS = { full: X, reduced: Y, minimal: 0 } as const; const N = COUNTS[device.tier];"
  - "Module-level caching for device detection via _cached variable"

requirements-completed: [ARCH-05, ARCH-06, PERF-02, PERF-04]

# Metrics
duration: 2min
completed: 2026-04-21
---

# Phase 05 Plan 01: Tier-Based Particle Adaptation Summary

**Three-tier device classification (full/reduced/minimal) with cached detection, adaptive particle counts (4000/1500/0, 3200/1200/0, 1800/800/0), and per-tier pixel ratio clamping across all three WebGL systems**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-21T08:28:02Z
- **Completed:** 2026-04-21T08:30:35Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Enhanced device-detect.ts with refined tier classification: all mobile -> reduced, desktop <=2 cores -> reduced, no WebGL/reduced-motion -> minimal, everything else -> full
- Added pixelRatioLimit field (2/1.5/1 per tier) and module-level caching to avoid re-detection
- Updated hero-particles.ts, morph-engine.ts, and zone-zero.ts to use tier-based particle count lookups instead of raw isMobile boolean checks
- Eliminated all raw isMobile/prefersReducedMotion boolean checks for particle counts and early returns

## Task Commits

Each task was committed atomically:

1. **Task 1: Enhance device-detect.ts tier classification and update hero-particles.ts** - `f0f09df` (feat)
2. **Task 2: Update morph-engine.ts and zone-zero.ts to use tier-based particle counts** - `e3315d0` (feat)

**Plan metadata:** (pending final commit)

## Files Created/Modified
- `src/scripts/device-detect.ts` - Added pixelRatioLimit, cached detection, refined tier logic (all mobile -> reduced)
- `src/scripts/hero-particles.ts` - Tier-based PARTICLE_COUNTS lookup (4000/1500/0), pixelRatioLimit, tier-based antialias
- `src/scripts/morph-engine.ts` - Tier-based MORPH_COUNTS lookup (3200/1200/0), pixelRatioLimit, tier-based antialias
- `src/scripts/zone-zero.ts` - Tier-based ZZ_COUNTS lookup (1800/800/0), pixelRatioLimit, tier-based antialias

## Decisions Made
- All mobile devices classified as 'reduced' tier regardless of hardware concurrency -- battery life and small screen size justify lower particle counts even on flagship phones
- Desktop with <=2 cores also 'reduced' -- captures old Chromebooks and constrained VMs
- Antialias switched to tier-based (`device.tier === 'full'`) across all three renderers for consistent GPU behavior

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in `netlify/functions/submission-created.ts` (missing @types/node) -- unrelated to this plan's changes, not fixed per scope boundary rules

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All three particle systems now use tier-based adaptation
- Ready for Phase 05 Plan 02 (further performance optimizations if any)
- Build passes cleanly, no new TypeScript errors introduced

## Self-Check: PASSED

- All 4 modified files exist on disk
- Both task commits (f0f09df, e3315d0) found in git log
- SUMMARY.md created at expected path

---
*Phase: 05-performance-optimization*
*Completed: 2026-04-21*
