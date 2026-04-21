---
phase: 02-content-migration
plan: 03
subsystem: ui
tags: [three.js, gsap, scroll-trigger, webgl, particles, typescript, astro-scripts]

# Dependency graph
requires:
  - phase: 02-content-migration/01
    provides: Static HTML sections as Astro components with DOM anchor IDs
  - phase: 02-content-migration/02
    provides: Content collections, Stories/ZoneZeroSimulator/StoryPanel component markup
provides:
  - "Hero particle system (5-nuclei, 4000/1500 particles) via hero-particles.ts"
  - "Scroll-driven morph engine with 6 shape generators via morph-engine.ts"
  - "Zone Zero simulator with 4-slider MIND scoring and share helpers via zone-zero.ts"
  - "Shared device capability detection utility via device-detect.ts"
affects: [performance-optimization, analytics]

# Tech tracking
tech-stack:
  added: [three@0.184.x, gsap@3.15.x, "@types/three"]
  patterns: ["Astro <script> tag imports for client-side modules", "getDeviceCapability() shared utility for all Three.js scripts", "Reduced-motion guard at top of every init function"]

key-files:
  created:
    - src/scripts/device-detect.ts
    - src/scripts/hero-particles.ts
    - src/scripts/morph-engine.ts
    - src/scripts/zone-zero.ts
  modified:
    - src/components/Hero.astro
    - src/components/Stories.astro
    - src/components/ZoneZeroSimulator.astro
    - src/components/LocalExperiments.astro
    - package.json
    - package-lock.json

key-decisions:
  - "All Three.js imports via npm ES modules (import * as THREE from 'three') -- no CDN globals"
  - "Shared device-detect.ts utility consumed by all three particle scripts for consistent mobile/reduced-motion handling"
  - "Restored 02-02 component markup overwritten by 02-01 parallel execution collision"

patterns-established:
  - "Astro script pattern: <script> import { initX } from '../scripts/x'; initX(el); </script>"
  - "Device tier detection: full/reduced/minimal tiers with WebGL and core count checks"
  - "Reduced motion guard: early return at top of every Three.js init function"

requirements-completed: [CPRE-02, CPRE-03]

# Metrics
duration: 7min
completed: 2026-04-21
---

# Phase 02 Plan 03: Three.js Script Extraction Summary

**Three.js hero particles, scroll-driven morph engine (6 shapes), and Zone Zero 4-slider simulator extracted as typed ES modules with npm imports and Astro script wiring**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-21T07:37:05Z
- **Completed:** 2026-04-21T07:44:31Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Extracted 3 complex Three.js particle systems from monolithic index.html into typed TypeScript modules
- Created shared device-detect.ts utility for consistent mobile/reduced-motion handling across all scripts
- Wired all scripts to their Astro components via <script> imports -- Astro auto-bundles dependencies
- All Three.js/GSAP code now uses npm ES module imports instead of CDN globals
- npm run build succeeds with all modules correctly bundled

## Task Commits

Each task was committed atomically:

1. **Task 1: Create device-detect.ts and hero-particles.ts modules** - `e40fb80` (feat)
2. **Task 2: Create morph-engine.ts and zone-zero.ts modules, wire to components** - `1a5d7f9` (feat)

**Plan metadata:** (pending)

## Files Created/Modified
- `src/scripts/device-detect.ts` - Shared device capability detection (mobile, WebGL, core count, reduced motion, tier)
- `src/scripts/hero-particles.ts` - Hero background 5-nuclei particle system (4000/1500 particles) with velocity drift and mouse parallax
- `src/scripts/morph-engine.ts` - Scroll-driven morph engine with 6 shape generators (Network, Radial, Rings, Explosion, Grid, Spinout) and GSAP ScrollTrigger
- `src/scripts/zone-zero.ts` - Zone Zero simulator with geometric mean scoring, 6 health states, collapse detection, URL param hydration, and social sharing
- `src/components/Hero.astro` - Added script tag importing hero-particles
- `src/components/Stories.astro` - Restored full 02-02 markup + added morph-engine script tag
- `src/components/ZoneZeroSimulator.astro` - Restored full 02-02 markup + added zone-zero script tag
- `src/components/LocalExperiments.astro` - Restored full 02-02 markup (parallel collision fix)
- `package.json` - Added three, gsap, @types/three dependencies
- `package-lock.json` - Updated lockfile

## Decisions Made
- Used `import * as THREE from 'three'` (namespace import) rather than named imports for consistency with original code patterns
- Created device-detect.ts as a separate shared module rather than inlining detection in each script
- Restored Stories.astro, ZoneZeroSimulator.astro, and LocalExperiments.astro from 02-02 commit (parallel execution collision had overwritten full markup with placeholders)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing three.js and gsap npm dependencies**
- **Found during:** Task 1 (hero-particles.ts creation)
- **Issue:** three.js and gsap were not in package.json -- only used via CDN in original monolith
- **Fix:** Ran `npm install three gsap && npm install -D @types/three`
- **Files modified:** package.json, package-lock.json
- **Verification:** npm run build succeeds, imports resolve correctly
- **Committed in:** e40fb80 (Task 1 commit)

**2. [Rule 3 - Blocking] Restored 02-02 component markup overwritten by parallel execution**
- **Found during:** Task 2 (wiring scripts to components)
- **Issue:** Stories.astro, ZoneZeroSimulator.astro, and LocalExperiments.astro had placeholder content instead of full markup from 02-02. Plan 02-01 (parallel agent) overwrote the 02-02 versions.
- **Fix:** Extracted full versions from git commit d7a789b and restored them, then appended script tags
- **Files modified:** Stories.astro, ZoneZeroSimulator.astro, LocalExperiments.astro
- **Verification:** npm run build succeeds, all DOM anchor IDs present for script queries
- **Committed in:** 1a5d7f9 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking issues)
**Impact on plan:** Both fixes were necessary for the plan to succeed. No scope creep.

## Issues Encountered
- @types/three produces many TS errors when invoked with bare `npx tsc` (missing ES2015 lib target), but Astro's bundler (Vite) handles this correctly with its own tsconfig resolution. Build succeeds.

## Known Stubs
None - all Three.js systems are fully wired to live DOM elements with complete behavior preserved from the original monolith.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All Three.js visual systems are now in typed modules ready for performance optimization (Phase 05)
- Device tier detection utility provides the foundation for conditional particle reduction
- Scripts are tree-shakeable via Vite bundling

## Self-Check: PASSED

All 8 created/modified files verified present. Both task commits (e40fb80, 1a5d7f9) verified in git log. SUMMARY.md exists.

---
*Phase: 02-content-migration*
*Completed: 2026-04-21*
