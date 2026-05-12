# Phase 15: Time-Series Visualization - Context

**Gathered:** 2026-05-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Add time-series visualization to the dashboard: a line chart showing MIND score evolution from 2014-2024 for selected countries, animated playback controls, a year slider/scrubber, multi-country overlay comparison, and world map recoloring to reflect historical year data. Integrates with Phase 13's year-indexed data and Phase 14's world map.

</domain>

<decisions>
## Implementation Decisions

### Chart Layout & Interaction
- **D-01:** Time-series line chart appears below the map in the country detail section — gains a line chart alongside radar chart. Consistent with Phase 14's map-click-to-detail flow
- **D-02:** Use ECharts LineChart — already tree-shaken in the project, reuses echarts-setup.ts pattern. No new dependency
- **D-03:** Multi-country overlays reuse existing comparison state — selected primary + up to 3 compare countries show as colored lines using COMPARISON_COLORS from charts.ts
- **D-04:** Mobile layout: full-width chart with controls stacking below. Chart aspect ratio ~16:9 on desktop, ~4:3 on mobile. Matches Phase 14 mobile pattern

### Playback & Year Controls
- **D-05:** Year slider is a full-width range input styled as a scrubber bar below the chart. Year labels at ends (2014/2024), thumb shows current year. Native HTML range input with custom styling
- **D-06:** 3 animation speeds: 1x (1s/year), 2x (500ms/year), 0.5x (2s/year). Cycle button next to play/pause. 11 frames (2014-2024) = 11s at 1x
- **D-07:** When year changes, ALL dashboard charts update to selected year — radar chart, binding constraint, ranking table reflect that year's data. Year resets to "latest" when leaving timeline mode
- **D-08:** Play/pause button positioned left of the year slider, inline. Play/pause icon + speed badge in a compact control row. Matches media player convention

### Map Integration & Data
- **D-09:** Map recolors for selected year by refetching year-specific data from historical JSON via `getSlimPayload(year)`, then re-calling `makeMapOption()`. Year selector dispatches to store, map subscribes
- **D-10:** Historical data uses Phase 13's year-indexed structure — `getSlimPayload(year)` returns SlimCountry[] for any year. Already built in Phase 13
- **D-11:** Missing historical data for a country/year: gray out country on map + "No data for {year}" in tooltip. Line chart shows gap in series. Consistent with Phase 14's null-data treatment
- **D-12:** Year controls appear in a shared bar above the main content when any year != latest — accessible from Map and Country tabs. Timeline tab always shows them

### Claude's Discretion
- Line chart styling (line width, point markers, area fill)
- Animation easing function for playback
- Year slider thumb design and styling
- Exact layout of play/pause + speed controls
- How to show/hide year controls when switching between tabs
- Line chart tooltip format for multi-country overlay
- Whether dimension lines (M/I/N/D) show by default or are toggleable
- Loading state while fetching historical data for a year

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dashboard Architecture
- `src/scripts/dashboard/state.ts` — Dashboard pub/sub store with Scale type (includes 'map')
- `src/scripts/dashboard/charts.ts` — Chart option generators, makeMapOption, makeRadarOption, DIM_COLORS, DIM_NAMES, COMPARISON_COLORS
- `src/scripts/dashboard/echarts-setup.ts` — Tree-shaken ECharts registration (needs LineChart added)
- `src/scripts/dashboard/init.ts` — Main dashboard island script, state wiring, lazy map loading
- `src/scripts/dashboard/url-state.ts` — URL encode/decode with view/dim params
- `src/scripts/dashboard/map.ts` — Map module with initMap, getCurrentDimension, setCurrentDimension

### Data Layer (Phase 13 outputs)
- `src/lib/dashboard-data.ts` — getSlimPayload() with year parameter support
- `src/data/mind-scores.json` — Year-indexed MIND scores (2014-2024)

### Phase 14 Outputs (integration targets)
- `src/data/geo-name-map.ts` — GeoJSON name mapping
- `src/components/dashboard/DimensionToggle.astro` — Dimension toggle component
- `src/components/dashboard/ScaleTabs.astro` — 4-tab navigation (Country/City/Firm/Map)
- `src/pages/dashboard.astro` — Dashboard page with scale panels and map detail section

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `makeMapOption()` — pure function that takes SlimCountry[] and dimension, returns ECharts option. Can be called with any year's data
- `makeRadarOption()` — pure function for radar chart, reusable with year-specific data
- `COMPARISON_COLORS` — 4-color palette for overlay lines
- `DIM_COLORS` / `DIM_NAMES` — dimension color and label mappings
- `SlimCountry` interface — standard data shape across dashboard

### Established Patterns
- Lazy module loading via dynamic import (map.ts pattern)
- Store subscription for reactive updates
- URL state encoding/decoding with pushDashboardURL
- ECharts tree-shaken component registration
- ResizeObserver for chart containers

### Integration Points
- `state.ts` DashboardStore needs year field
- `init.ts` needs year control wiring
- `map.ts` needs to subscribe to year changes and re-render
- `dashboard.astro` needs time-series chart container and year controls HTML

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches following established dashboard patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 15-time-series-visualization*
*Context gathered: 2026-05-12 via Smart Discuss*
