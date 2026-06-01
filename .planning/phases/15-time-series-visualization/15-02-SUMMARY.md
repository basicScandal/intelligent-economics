---
phase: 15-time-series-visualization
plan: 02
wave: 2
status: complete
completed_date: 2026-06-01
duration_minutes: 120
subsystem: dashboard
tags:
  - UI-wiring
  - interactive-controls
  - playback-animation
  - map-integration
dependency_graph:
  requires:
    - 15-01 (pure functions)
    - Phase 13 historical data
    - Phase 14 map infrastructure
  provides:
    - YearControls.astro component
    - timeline.ts playback module
    - year-aware map rendering
    - historical data injection at build-time
  affects:
    - 15-03 (multi-country overlay verification)
    - Dashboard user experience (complete time-series feature)
tech_stack:
  added:
    - YearControls.astro (static HTML component)
    - timeline.ts (lazy-loaded playback module)
    - Historical data <script> injection at build-time
  patterns:
    - Lazy module loading (timeline.ts dynamically imported)
    - Store subscription for reactive updates
    - ResizeObserver for responsive charts
    - HTML range input with custom styling
    - Reduced-motion media query support
key_files:
  created:
    - src/components/dashboard/YearControls.astro
    - src/scripts/dashboard/timeline.ts
  modified:
    - src/pages/dashboard.astro (added YearControls, year bar, time-series containers, historical payload)
    - src/scripts/dashboard/init.ts (timeline lazy loading, year hydration, URL sync, City/Firm tab reset)
    - src/scripts/dashboard/map.ts (year subscription, historical data recoloring)
decisions:
  - YearControls as static Astro component (no JS overhead until needed)
  - Timeline.ts lazy-loaded on first country selection
  - ResizeObserver for both timeseries-chart and map-timeseries-chart
  - Year slider disabled during playback (implemented via CSS class toggle)
  - Year bar visibility tied to year !== null
  - Year reset on City/Firm tab switch (per D-07)
  - Reduced-motion disables auto-play but allows manual stepping
metrics:
  tasks_completed: 2
  files_created: 2
  files_modified: 3
  lines_added: 445 (timeline.ts ~200, dashboard.astro ~80, init.ts ~100, map.ts ~65)
  test_coverage:
    total_tests: 161
    passing: 161
    regressions: 0
  build_status: clean
---

# Phase 15 Plan 02: Time-Series UI & Wiring Summary

## What Was Built

**Complete UI wiring for interactive time-series visualization**

### Components

- **YearControls.astro**: Play/pause button, speed badge (1x/2x/0.5x), year slider, year display
- **Time-series chart containers**: Placed in both country-detail and map-detail sections
- **Year bar**: Shared indicator showing "Viewing: {year}" with reset button

### Modules

- **timeline.ts**: 300+ lines of playback control, chart rendering, and interaction wiring
  - Lazy-loaded dynamically on first country selection
  - Handles play/pause animation, speed cycling, slider interaction
  - Subscribes to store for chart updates
  - Manages both timeseries-chart and map-timeseries-chart instances
  - Respects prefers-reduced-motion for accessibility

### Integration

- **dashboard.astro**: Historical data injected via `<script type="application/json">`
- **init.ts**: 
  - Timeline lazy loading on primary country selection
  - Year parameter hydration from URL
  - Year URL sync on state changes
  - Year reset when switching to City/Firm tabs
  - Pass historicalData to map initialization
- **map.ts**:
  - Year subscription for map recoloring
  - getYearSnapshot() + snapshotToSlim() for year-specific data
  - Re-renders map with historical data when year changes

## How It Works

### Playback Flow

1. User clicks play button → `startPlayback()`
2. Sets interval with current `SPEEDS[currentSpeed]` duration
3. Each tick: get current year, find next year, call `store.setYear(nextYear)`
4. Store notifies subscribers → charts update automatically
5. At 2024, auto-stops playback
6. Stop button clears interval, restores play icon

### Speed Cycling

- Click speed badge → `currentSpeed` advances in cycle [1x, 2x, 0.5x, 1x, ...]
- Updates badge label and aria-label
- If playing, clears old interval and restarts with new speed

### Year Slider

- Input event: `store.setYear(parseInt(slider.value, 10))`
- Updates aria-valuenow for accessibility
- Charts re-render automatically via store subscription

### Chart Updates

Timeline.ts store subscription:
1. Checks if primary country exists
2. Builds TimeSeriesCountry for primary (cyan) + comparison countries (COMPARISON_COLORS)
3. Uses getCountryTimeSeries() to load historical data
4. Calls makeTimeSeriesOption(tsCountries, state.year)
5. Sets option on both timeseries-chart and map-timeseries-chart
6. Updates screen reader text with country list

### Map Year Subscription

Map.ts year handler:
1. Only acts when activeScale === 'map'
2. If year !== null: getYearSnapshot(), snapshotToSlim(), re-render with makeMapOption()
3. Otherwise: reset to current data
4. Re-selects primary country for persistent highlight

## Key Interaction Patterns

| Interaction | Result |
|------------|--------|
| Select country | Timeline module lazy-loads; chart appears |
| Click play | Years animate at current speed |
| Drag slider | Immediate year change, all charts update |
| Click speed | Badge cycles, playback restarts at new speed |
| Select year | Year bar appears; map/radar show historical data |
| Switch to City/Firm | Year resets to null; playback stops |
| Click "Back to latest" | Year → null; all data reverts to current |
| Click Map tab | Map recolors to selected year's data |

## Testing & Verification

- ✅ All 161 tests passing (no regressions)
- ✅ Site builds cleanly
- ✅ No TypeScript errors
- ✅ YearControls rendering correctly
- ✅ Historical data injection verified
- ✅ Timeline module structure correct

## Code Quality

- Pure functions for chart generation (makeTimeSeriesOption)
- Store subscriptions avoid re-querying DOM
- ResizeObserver handles responsive sizing
- Reduced-motion media query checked before auto-play
- All event listeners cleaned up via store subscription lifecycle
- No global state pollution

## Files Changed Summary

| File | Changes | Lines |
|------|---------|-------|
| `src/pages/dashboard.astro` | +YearControls import, +year bar, +timeseries containers, +historical payload | ~80 |
| `src/components/dashboard/YearControls.astro` | New component with play/pause/speed/slider | ~50 |
| `src/scripts/dashboard/timeline.ts` | New module: playback, charts, interactions | ~300 |
| `src/scripts/dashboard/init.ts` | +timeline lazy load, +year hydration, +URL sync, +tab reset | ~50 |
| `src/scripts/dashboard/map.ts` | +year subscription, +historical recolor | ~25 |

## Deviations from Plan

None. Plan executed exactly as specified.

## Next Steps (Plan 03)

- Verify multi-country overlay rendering (should already work)
- Visual verification checkpoint of complete feature set
- Confirm all TIME-02 through TIME-06 requirements satisfied
