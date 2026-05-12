# Phase 14: World Map - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a "Map" tab to the existing /dashboard that displays a choropleth world map color-coded by MIND scores for all 217 countries. Users can hover for tooltips, click to select a country (updating the dashboard state), toggle between composite MIND and individual M/I/N/D dimension coloring, and see a color scale legend. The map integrates with the existing dashboard state, radar chart, and URL encoding.

</domain>

<decisions>
## Implementation Decisions

### Color Scheme & Scale
- **D-01:** Continuous gradient via ECharts visualMap (not discrete buckets) — shows fine-grained differences between countries
- **D-02:** Composite MIND score uses a dark-to-cyan (#00c8ff) gradient. Low scores = dark/muted, high scores = bright cyan. Fits the existing bioluminescent/dark theme
- **D-03:** Individual dimension modes use each dimension's own color gradient: Material = dark-to-#00ff88, Intelligence = dark-to-#00c8ff, Network = dark-to-#8b5fff, Diversity = dark-to-#ffb400. Matches the radar chart dimension color convention

### Map Layout & Controls
- **D-05:** Map fills the main content area when Map tab is active. When a country is clicked, radar chart + binding constraint callout appear below the map (same section layout as Country tab but map on top instead of search)
- **D-06:** Dimension toggle is a segmented button row (Composite / M / I / N / D) positioned above the map, right-aligned. Matches the ScaleTabs pattern
- **D-07:** Zoom and pan enabled (ECharts `roam: true`). Scroll wheel zooms, drag pans. Reset-to-full-view button provided. Essential for clicking small countries
- **D-08:** Mobile (<768px): full-width map with shorter aspect ratio, pinch-to-zoom and drag-to-pan, legend and toggle stack below map, country detail stacks underneath

### Tooltip & Hover Style
- **D-09:** Hover tooltip shows: country name, MIND composite score (or active dimension score when toggled), and binding constraint dimension name
- **D-10:** Hover highlight: country fill brightens, border turns white/bright. Use ECharts emphasis state (native support)
- **D-11:** Default (non-hover) borders: subtle dark lines (#1a1a2e or similar) between countries. Countries defined by color fill differences rather than heavy lines

### Click-to-Dashboard Flow
- **D-12:** Clicking a country calls `selectPrimary()` on the dashboard store. User stays on the Map tab — radar chart + binding constraint appear below the map. Can click another country to change selection
- **D-13:** Selected country gets a persistent bright border (white or cyan) on the map until another country is clicked
- **D-14:** URL state extended: `?view=map&country=USA` — Map tab state is shareable. Extends existing `url-state.ts` pattern
- **D-15:** Dimension toggle state encoded in URL as `dim=` param (e.g., `?view=map&dim=i&country=USA`). Full map view is shareable including dimension selection

### Claude's Discretion
- Missing/null data country treatment (suggested: neutral gray solid or striped)
- GeoJSON data source and bundling strategy
- Map projection choice (Natural Earth, Mercator, etc.)
- ECharts chart component registration for map type (extending echarts-setup.ts)
- Legend placement and styling
- Reset-to-full-view button placement and styling
- Exact tooltip formatting and positioning
- Animation transitions when switching dimensions
- Map container aspect ratio (desktop and mobile)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dashboard Architecture
- `src/scripts/dashboard/state.ts` — Dashboard pub/sub store: selectPrimary(), comparison, scale tabs
- `src/scripts/dashboard/charts.ts` — Chart option generators, DIM_COLORS, DIM_NAMES, siteTheme, COMPARISON_COLORS
- `src/scripts/dashboard/echarts-setup.ts` — Tree-shaken ECharts registration (needs MapChart + GeoComponent + VisualMapComponent added)
- `src/scripts/dashboard/init.ts` — Main 27KB dashboard island script, state wiring, chart rendering
- `src/scripts/dashboard/url-state.ts` — URL encode/decode with history.replaceState (needs view= and dim= params)

### Data Layer
- `src/lib/dashboard-data.ts` — Data transformation: getSlimPayload(), CountryData types, SlimCountry
- `src/lib/mind-score.ts` — DimensionKey type, calcScore(), getBindingConstraint()
- `src/data/mind-scores.json` — 217 countries with dimension scores, binding constraints, metadata

### Dashboard Page & Components
- `src/pages/dashboard.astro` — Dashboard page with island containers
- `src/components/dashboard/ScaleTabs.astro` — Existing tab pattern (Country/City/Firm — Map tab added here)
- `src/components/dashboard/BindingConstraint.astro` — Binding constraint callout component
- `src/components/dashboard/RankingTable.astro` — Server-rendered ranking table pattern

### Existing Patterns
- `src/scripts/dashboard/search.ts` — SlimCountry type definition used across dashboard

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `echarts-setup.ts`: Tree-shaken ECharts registration — extend with MapChart, GeoComponent, VisualMapComponent
- `charts.ts`: DIM_COLORS, DIM_NAMES, siteTheme — reuse for map option generation
- `state.ts`: DashboardStore with selectPrimary() — map click handler calls this directly
- `dashboard-data.ts`: getSlimPayload() produces SlimCountry[] with m/i/n/d/mind/bc fields — map data source
- `url-state.ts`: URL encode/decode pattern — extend with view and dim params

### Established Patterns
- ECharts 6 with SVG renderer, tree-shaken imports, `client:visible` island directive
- Pure chart option generator functions (makeRadarOption, makeBarOption) — add makeMapOption
- Dashboard state pub/sub: state changes → chart re-renders via subscribers
- Dark theme with transparent backgrounds, dimension colors (M=#00ff88, I=#00c8ff, N=#8b5fff, D=#ffb400)
- ARIA enabled on all ECharts charts

### Integration Points
- `ScaleTabs.astro`: Add "Map" tab alongside Country/City/Firm
- `init.ts`: Add map rendering logic, dimension toggle handler, click-to-selectPrimary wiring
- `echarts-setup.ts`: Register MapChart + GeoComponent + VisualMapComponent
- `url-state.ts`: Extend encode/decode for view= and dim= params
- GeoJSON data: Need world map geometry (likely bundled as static asset or imported from echarts extension)

</code_context>

<specifics>
## Specific Ideas

- The map should feel like part of the existing dashboard — same dark theme, same dimension colors, same state model
- Dimension toggle should mirror the segmented control pattern used in ScaleTabs
- The bioluminescent glow aesthetic: high-scoring countries should "glow" bright on the dark background
- Country selection on the map should feel identical to selecting a country via search — same state change, same radar chart update

</specifics>

<deferred>
## Deferred Ideas

- Map multi-select for comparison (shift-click) — Phase 17 (COMP-04)
- Map recoloring by year when time-series slider changes — Phase 15 (TIME-05)
- Screen reader text alternatives for map — Phase 17 (INT-02)
- Map performance optimization for Lighthouse targets — Phase 17 (INT-04)

</deferred>

---

*Phase: 14-world-map*
*Context gathered: 2026-05-11*
