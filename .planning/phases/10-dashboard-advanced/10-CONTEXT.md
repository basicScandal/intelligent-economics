# Phase 10: Dashboard Advanced - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add three advanced features to the existing /dashboard: overlaid radar chart comparison for 2-4 countries, a deep link from dashboard to Zone Zero simulator with real MIND scores, and bookmarkable/shareable dashboard URLs via query parameter state encoding.

</domain>

<decisions>
## Implementation Decisions

### Comparison View
- Single radar chart with semi-transparent overlapping polygons, one per country in distinct colors. Legend shows country names + MIND scores
- Fixed comparison palette: country 1 = #FF6B6B (red), country 2 = #4ECDC4 (teal), country 3 = #FFE66D (yellow), country 4 = #A8E6CF (mint). Primary country retains dimension colors for its standalone radar
- "Compare" button appears when 1+ countries selected. Adds comparison section below primary detail
- Countries added to comparison via the same search with "Add to comparison" option in results

### Zone Zero Integration
- Button on country detail view: `<a href="/?m={M}&i={I}&n={N}&d={D}#zone-zero">See this country in simulator</a>`
- Zone Zero already hydrates from URL params (zone-zero.ts:454-474) — no new simulator code needed
- Dimension scores from `mind-scores.json` used as-is (already 0-100 scale matching simulator range)

### Bookmarkable URLs
- Query param encoding: `?country=USA&compare=DEU,JPN,NOR` — ISO3 codes keep URLs short and readable
- `history.replaceState` updates URL without page reload on every state change
- URL hydration on page load: `init.ts` reads `URLSearchParams`, selects primary country, adds comparison countries, triggers chart rendering. Same flow as user interaction
- State changes that update URL: primary country selection, comparison add/remove. NOT: methodology panel open/close, mobile breakpoint

### Claude's Discretion
- Radar chart overlay transparency level and visual treatment
- Compare button placement and styling
- "Add to comparison" vs "Compare" wording in search results
- Zone Zero link button styling and placement
- URL update debouncing if needed
- Transition animations between comparison states

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/scripts/dashboard/state.ts` — pub/sub store with selectPrimary, addToComparison, removeFromComparison (comparison already in state model!)
- `src/scripts/dashboard/charts.ts` — getRadarOption, getBarOption (extend for multi-series radar)
- `src/scripts/dashboard/init.ts` — main island script, chart rendering, search UI
- `src/scripts/zone-zero.ts:454-474` — URL param hydration (m, i, n, d params) already working
- `src/scripts/zone-zero.ts:477-486` — buildShareURL helper for constructing param URLs

### Established Patterns
- State changes via `state.subscribe(listener)` — add URL update as a subscriber
- ECharts `setOption` for dynamic chart updates
- `history.replaceState` already used in Zone Zero for share URLs

### Integration Points
- Extend `charts.ts` with `getComparisonRadarOption()` for multi-series radar
- Extend `init.ts` with URL hydration on load and state-to-URL sync
- Add "See in simulator" link to country detail section in dashboard.astro
- Add comparison chips/tags UI for removing countries from comparison

</code_context>

<specifics>
## Specific Ideas

- The comparison radar should use `areaStyle: { opacity: 0.25 }` for semi-transparent fills so overlapping regions are visible
- Zone Zero link should show the country name: "See {Country} in Zone Zero simulator"
- URL should be sharable — paste into a new tab and get the same dashboard state
- Consider adding a "Share dashboard" button that copies the current URL (similar to Zone Zero's copy-link functionality)

</specifics>

<deferred>
## Deferred Ideas

- Time-series animation (Gapminder-style) — v1.2 (DASH-11)
- Choropleth world map — v1.2 (DASH-12)
- Custom indicator selection — v1.2 (DASH-13)

</deferred>
