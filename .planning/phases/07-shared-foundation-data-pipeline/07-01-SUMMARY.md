---
phase: 07-shared-foundation-data-pipeline
plan: 01
subsystem: data-pipeline
tags: [vitest, typescript, mind-score, normalization, tdd, geometric-mean]

# Dependency graph
requires: []
provides:
  - "Shared MIND score calculation library (src/lib/mind-score.ts)"
  - "Vitest test infrastructure with Astro integration"
  - "calcScore, getBindingConstraint, normalize exports"
  - "DimensionKey, DimensionScores, NormBounds type exports"
affects: [08-whitepaper, 09-dashboard, 10-world-bank-data, 11-aggregation]

# Tech tracking
tech-stack:
  added: [vitest, tsx]
  patterns: [shared-library-extraction, tdd-red-green, percentile-capped-normalization]

key-files:
  created:
    - src/lib/mind-score.ts
    - vitest.config.ts
    - tests/mind-score.test.ts
    - tests/normalization.test.ts
  modified:
    - package.json
    - src/scripts/zone-zero.ts

key-decisions:
  - "getBindingConstraint uses <= (first-wins) tie-breaking vs zone-zero inline < (last-wins) — shared lib prioritizes determinism"
  - "normalize returns NormBounds object with lazy normalize function for reuse across datasets"
  - "Corrected plan expectation: calcScore({70,60,50,40}) = 54 not 52 (verified against formula)"

patterns-established:
  - "Shared library: src/lib/ for cross-component logic extracted from scripts"
  - "TDD workflow: tests/ directory with vitest, run via npm test"
  - "Normalization: percentile-capped min-max with configurable p1/p99 bounds"

requirements-completed: [DATA-01, DATA-03]

# Metrics
duration: 5min
completed: 2026-04-21
---

# Phase 7 Plan 1: Shared MIND Score Library Summary

**Extracted MIND score calculation into shared library with calcScore, getBindingConstraint, and percentile-capped normalize, backed by 22 vitest tests (TDD)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-21T17:03:08Z
- **Completed:** 2026-04-21T17:08:00Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created `src/lib/mind-score.ts` as single source of truth for MIND scoring across the platform
- Established vitest test infrastructure with 22 passing tests (13 calcScore/binding + 9 normalization)
- Zone Zero simulator now imports `calcScore` from shared library (local definition removed)
- Normalization function ready for World Bank data pipeline (Phase 10)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, create vitest config, and write test scaffolds** - `a5e04fc` (test)
2. **Task 2: Create shared MIND score library and make all tests pass** - `53992dc` (feat)

_TDD: Task 1 = RED (all tests fail), Task 2 = GREEN (all 22 pass)_

## Files Created/Modified
- `src/lib/mind-score.ts` - Shared MIND score library with calcScore, getBindingConstraint, normalize
- `vitest.config.ts` - Vitest configuration using Astro getViteConfig
- `tests/mind-score.test.ts` - 13 parity tests for calcScore and getBindingConstraint
- `tests/normalization.test.ts` - 9 tests for percentile-capped normalization
- `package.json` - Added vitest, tsx devDependencies and test script
- `src/scripts/zone-zero.ts` - Imports calcScore from shared library, local definition removed

## Decisions Made
- **getBindingConstraint tie-breaking:** Used `<=` (first-key-wins) in shared library for deterministic behavior, while zone-zero.ts inline code retains `<` (last-key-wins) since it's UI-coupled and the difference is cosmetic on ties
- **normalize signature:** Returns `NormBounds` object with lazy `normalize()` function so bounds can be computed once and applied to many values (efficient for dashboard use)
- **Plan correction:** The plan stated `calcScore({m:70,i:60,n:50,d:40})` = 52, but the actual geometric mean formula produces 54. Corrected test expectations to match verified formula output.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected calcScore expected value from 52 to 54**
- **Found during:** Task 2 (making tests pass)
- **Issue:** Plan stated `calcScore({m:70,i:60,n:50,d:40})` should return 52, but `Math.round(Math.pow((70/100)*(60/100)*(50/100)*(40/100), 0.25) * 100)` = 54
- **Fix:** Updated test expectation to 54 with verification comment
- **Files modified:** tests/mind-score.test.ts
- **Verification:** `node -e "console.log(Math.round(Math.pow(0.7*0.6*0.5*0.4, 0.25) * 100))"` outputs 54
- **Committed in:** 53992dc (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug in plan specification)
**Impact on plan:** Corrected a mathematical error in the plan's expected output. No scope creep.

## Issues Encountered
- `astro check` reports type error on vitest.config.ts `test` property (getViteConfig type doesn't include vitest augmentation) -- this is a known false positive; vitest runs correctly. Pre-existing errors in netlify/functions/submission-created.ts (missing @types/node) are out of scope.

## Known Stubs
None -- all functions are fully implemented with real logic.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Shared library ready for import by whitepaper components (Phase 8) and dashboard (Phase 9)
- Vitest infrastructure established for all subsequent plans to add tests
- Normalization function ready for World Bank data pipeline (Phase 10)
- No blockers for Phase 7 Plan 2

## Self-Check: PASSED

All created files verified present. All commit hashes verified in git log.

---
*Phase: 07-shared-foundation-data-pipeline*
*Completed: 2026-04-21*
