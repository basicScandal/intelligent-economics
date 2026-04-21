---
phase: 07-shared-foundation-data-pipeline
plan: 02
subsystem: data-pipeline
tags: [world-bank-api, data-fetch, normalization, mind-scores, json-baseline, tsx]

# Dependency graph
requires:
  - "07-01: Shared MIND score library (calcScore, getBindingConstraint, normalize)"
provides:
  - "World Bank data fetch pipeline (scripts/fetch-world-bank.ts)"
  - "Committed MIND scores baseline (src/data/mind-scores.json) with 217 countries"
  - "npm run fetch-data script for refreshing data"
  - "16 normalized indicators across 4 MIND dimensions"
affects: [08-whitepaper, 09-dashboard, 11-aggregation]

# Tech tracking
tech-stack:
  added: []
  patterns: [serial-api-fetch-with-fallback, bom-safe-json-parsing, mrnev-mrv-fallback, percentile-capped-normalization-pipeline]

key-files:
  created:
    - scripts/fetch-world-bank.ts
    - src/data/mind-scores.json
  modified:
    - package.json

key-decisions:
  - "Used mrnev/mrv fallback strategy: try mrnev=1 first, fall back to mrv=5 with most-recent-non-null selection when mrnev returns HTTP 400"
  - "TX.VAL.TECH.MF.ZS (high-tech exports %) used as proxy for trade diversification since UNCTAD concentration index has no REST API"
  - "2.5s delay between indicator requests to avoid World Bank API rate limiting"

patterns-established:
  - "Data pipeline: scripts/ directory for build-time data fetch scripts"
  - "Committed JSON baseline: src/data/ for static data importable at build time"
  - "API fallback: try preferred parameter first, degrade gracefully on HTTP error"

requirements-completed: [DATA-02, DATA-03]

# Metrics
duration: 14min
completed: 2026-04-21
---

# Phase 7 Plan 2: World Bank Data Pipeline Summary

**World Bank fetch pipeline retrieving 16 indicators for 217 countries with mrnev/mrv fallback, producing committed JSON baseline with normalized 0-100 MIND dimension scores**

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-21T17:13:19Z
- **Completed:** 2026-04-21T17:49:30Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Built `scripts/fetch-world-bank.ts` (590+ lines) fetching all 16 MIND indicators from World Bank API v2
- Produced `src/data/mind-scores.json` with 217 countries, 198 with complete MIND scores
- Site builds offline using only the committed JSON baseline (no network access needed)
- All 22 existing tests pass, build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Create World Bank fetch script with serial fetching and normalization** - `d710f02` (feat)
2. **Task 2: Run fetch pipeline, validate output, and verify build** - `5997f1d` (feat)

## Files Created/Modified
- `scripts/fetch-world-bank.ts` - Full data pipeline: fetch 16 indicators, normalize, compute MIND scores, write JSON
- `src/data/mind-scores.json` - Committed baseline with 217 countries, dimension scores, MIND scores, metadata
- `package.json` - Added `fetch-data` npm script

## Decisions Made
- **mrnev/mrv fallback:** World Bank API `mrnev=1` parameter returns HTTP 400 for some indicators (approximately half). Solution: try `mrnev=1` first, fall back to `mrv=5` (last 5 years) and select most recent non-null value per country. This preserves data coverage (e.g., R&D expenditure: 110 countries with fallback vs 30 with mrv=1 alone).
- **TX.VAL.TECH.MF.ZS as diversity proxy:** Per RESEARCH.md recommendation, used high-technology exports (% of manufactured) as the 4th Diversity indicator since UNCTAD concentration index has no REST API.
- **Country list pagination:** Added pagination handling for the country list endpoint in case total exceeds per_page (currently 296 total with per_page=300, but future-proofed).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed mrnev=1 causing HTTP 400 for many indicators**
- **Found during:** Task 2 (running the pipeline)
- **Issue:** Plan specified `mrnev=1` in URLs, but World Bank API returns HTTP 400 for approximately half the indicators with this parameter. The `mrnev` parameter is only supported for certain data sources.
- **Fix:** Implemented mrnev/mrv fallback strategy: try mrnev=1 first, if it fails fall back to mrv=5 (last 5 years) and select the most recent non-null value per country.
- **Files modified:** scripts/fetch-world-bank.ts
- **Verification:** All 16 indicators fetched successfully on re-run
- **Committed in:** 5997f1d (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug in plan specification -- API parameter incompatibility)
**Impact on plan:** Essential fix for data completeness. Without the fallback, only ~8 of 16 indicators would fetch successfully.

## Issues Encountered
- Initial run lost 3 indicators (SH.H2O.SMDW.ZS, SE.TER.ENRR, GB.XPD.RSDV.GD.ZS) to HTTP 502 errors from API rate limiting caused by multiple concurrent test requests. Resolved by waiting for API cool-down and re-running the pipeline.
- World Bank API rate limiting is inconsistent: some indicators accept mrnev, others return 400. No official documentation on which parameters each source supports.

## Data Quality Summary

| Metric | Value |
|--------|-------|
| Total countries | 217 |
| Countries with complete data (all 4 dims) | 198 |
| Countries with incomplete data | 19 |
| Indicators fetched | 16/16 |
| Scores out of 0-100 range | 0 |
| USA MIND score | 51 |
| USA binding constraint | n (Network) |

## Known Stubs
None -- all functions are fully implemented with real data from the World Bank API.

## User Setup Required
None - no external service configuration required. World Bank API is free and requires no API key.

## Next Phase Readiness
- `src/data/mind-scores.json` ready for import by whitepaper (Phase 8) and dashboard (Phase 9)
- `npm run fetch-data` available for data refresh at any time
- Data structure matches the interface defined in CONTEXT.md
- No blockers for subsequent phases

## Self-Check: PASSED

All created files verified present. All commit hashes verified in git log.

---
*Phase: 07-shared-foundation-data-pipeline*
*Completed: 2026-04-21*
