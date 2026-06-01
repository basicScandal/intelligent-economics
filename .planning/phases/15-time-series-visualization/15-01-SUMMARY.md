---
phase: 15-time-series-visualization
plan: 01
wave: 1
status: complete
completed_date: 2026-06-01
duration_minutes: 45
subsystem: dashboard
tags:
  - time-series
  - pure-functions
  - TDD
  - state-management
  - url-state
dependency_graph:
  requires:
    - Phase 13 historical data structure
    - Phase 14 dashboard state & charts
  provides:
    - makeTimeSeriesOption() for line chart generation
    - snapshotToSlim() for data transformation
    - year field in DashboardState
    - setYear() method in DashboardStore
    - year parameter in URL state
  affects:
    - 15-02-PLAN (UI wiring consumes these functions)
    - 15-03-PLAN (multi-country overlay builds on state)
tech_stack:
  added:
    - TimeSeriesCountry interface for time-series data
    - SPEEDS constant (animation playback speeds)
    - LATEST_YEAR and YEAR_RANGE constants
  patterns:
    - Pure functions for data transformation
    - Store extension with year field
    - TDD execution (RED -> GREEN -> REFACTOR)
key_files:
  created: []
  modified:
    - src/scripts/dashboard/charts.ts (added makeTimeSeriesOption, snapshotToSlim, SPEEDS, TimeSeriesCountry)
    - src/scripts/dashboard/state.ts (added year field, setYear method, constants)
    - src/scripts/dashboard/url-state.ts (added year parameter encode/decode)
    - src/scripts/dashboard/echarts-setup.ts (registered LineChart, MarkLineComponent)
    - tests/dashboard-timeline.test.ts (new comprehensive test suite)
    - tests/dashboard-url-state.test.ts (updated for year field)
decisions:
  - Used TDD flow for all pure functions to ensure correctness before UI wiring
  - Extended existing state/url patterns rather than creating new modules
  - Stored year as number | null (null represents "latest")
  - SPEEDS constant enables configurable animation timing
metrics:
  tasks_completed: 1
  files_modified: 6
  test_coverage:
    total_tests: 31 (all new tests for this plan)
    passing: 31
    regressions: 0 (all 161 existing tests still pass)
  build_status: clean
---

# Phase 15 Plan 01: Time-Series Data Layer Summary

## What Was Built

**Pure data layer for time-series MIND score visualization (2014-2024)**

- `makeTimeSeriesOption()`: ECharts line chart option generator with year marker support
- `snapshotToSlim()`: Year snapshot → SlimCountry[] conversion with binding constraint derivation
- `TimeSeriesCountry`: Data interface for historical country scores across years
- Extended `DashboardState` with `year: number | null` field (null = latest)
- Extended `DashboardStore` with `setYear(year)` method for state mutations
- Year parameter support in URL state encode/decode for bookmarkable views
- ECharts LineChart & MarkLineComponent registration for rendering
- `LATEST_YEAR=2024` and `YEAR_RANGE=[2014, 2024]` constants
- `SPEEDS` constant defining 3 playback speeds: 0.5x (2s), 1x (1s), 2x (500ms)

## How It Works

### Data Transformation

`snapshotToSlim()` converts World Bank historical MIND data into dashboard-ready format:
- Takes year snapshot record (ISO3 code → YearScores)
- Derives binding constraint per country using `getBindingConstraint()`
- Returns SlimCountry[] for use in map, radar, charts

### Year State Management

- `store.setYear(year)` updates state and notifies subscribers
- Null year represents "latest" (2024)
- URL hydration restores year from query params on page load
- URL sync keeps year param updated as user interacts

### Chart Preparation

`makeTimeSeriesOption()` generates complete ECharts configuration:
- X-axis: years 2014-2024 as strings
- Y-axis: 0-100 scale for MIND scores
- Series: one line per country with solid cyan or comparison color
- MarkLine: optional vertical marker at currentYear
- Legend, grid, tooltip, and aria configured for accessibility

## Testing Strategy (TDD)

**RED phase:** 31 failing tests covering:
- Single/multi-country line charts
- Year slider encoding/decoding
- Binding constraint derivation
- Screen reader text generation
- Constants validation

**GREEN phase:** Implemented all functions to satisfy tests

**REFACTOR phase:** No changes needed; tests already validate minimal implementation

All existing tests remain green (161/161 passing).

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use TDD for pure functions | Ensures correctness before UI integration; easy to extend/modify |
| Extend existing state/URL patterns | Minimizes new code; reuses established patterns from Phase 14 |
| Store year as `number \| null` | Null cleanly represents "latest"; avoids magic number (2024) |
| SPEEDS constant | Enables playback speed configuration without code changes |
| LATEST_YEAR export | Single source of truth for latest year (2024) |
| MarkLineComponent registration | Enables vertical year marker in charts |

## Deviations from Plan

None. Plan executed exactly as specified.

## Testing & Verification

- ✅ All 31 new tests passing
- ✅ All 161 existing tests still passing (no regressions)
- ✅ Site builds without errors
- ✅ No TypeScript errors
- ✅ Code follows dashboard patterns (pure functions, no side effects)

## Files Changed Summary

| File | Changes |
|------|---------|
| `src/scripts/dashboard/charts.ts` | +TimeSeriesCountry, +makeTimeSeriesOption, +snapshotToSlim, +SPEEDS |
| `src/scripts/dashboard/state.ts` | +year field, +setYear method, +LATEST_YEAR, +YEAR_RANGE |
| `src/scripts/dashboard/url-state.ts` | +year param encode/decode |
| `src/scripts/dashboard/echarts-setup.ts` | +LineChart, +MarkLineComponent registration |
| `tests/dashboard-timeline.test.ts` | +31 tests (new file) |
| `tests/dashboard-url-state.test.ts` | Updated for year field in return objects |

## Next Steps (Plan 02)

- Wire UI components (YearControls, timeline.ts module)
- Implement playback animation and slider interaction
- Integrate with dashboard.astro and init.ts
- Add map year subscription and recoloring
- Lazy-load timeline module on first country selection
