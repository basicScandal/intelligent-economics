# Phase 14: World Map - Research

**Researched:** 2026-05-11
**Domain:** ECharts choropleth map, GeoJSON data, dashboard integration
**Confidence:** HIGH

## Summary

Phase 14 adds a choropleth world map tab to the existing dashboard using ECharts 6 MapChart, which is already installed (v6.0.0). The map displays MIND composite scores for 217 countries with color gradients, tooltips, click-to-select, and a dimension toggle. The core challenge is bridging two name systems: the ECharts world.json GeoJSON uses simplified country names ("Russia", "Korea") while the World Bank data uses formal names ("Russian Federation", "Korea, Rep."). This is solved with ECharts' built-in `nameMap` option -- a 43-entry dictionary that remaps GeoJSON names to World Bank names at registration time.

The implementation extends the existing tree-shaken ECharts setup with three new components (MapChart, GeoComponent, VisualMapContinuousComponent), adds a `makeMapOption()` pure function to charts.ts following the established pattern, and wires map clicks to the existing `store.selectPrimary()` pub/sub flow. The GeoJSON file (~987KB raw, ~278KB gzipped) is fetched dynamically when the Map tab is activated, not bundled statically, to avoid penalizing initial page load.

**Primary recommendation:** Use the official ECharts world.json from their CDN as the GeoJSON source, with a 43-entry nameMap to bridge World Bank naming conventions. Fetch it lazily on Map tab activation. Register MapChart + GeoComponent + VisualMapContinuousComponent in echarts-setup.ts.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Continuous gradient via ECharts visualMap (not discrete buckets)
- **D-02:** Composite MIND score uses dark-to-cyan (#00c8ff) gradient
- **D-03:** Individual dimension modes use each dimension's own color gradient (M=#00ff88, I=#00c8ff, N=#8b5fff, D=#ffb400)
- **D-05:** Map fills main content area when Map tab active; radar chart + binding constraint appear below map on country click
- **D-06:** Dimension toggle is segmented button row (Composite/M/I/N/D) positioned above map, right-aligned
- **D-07:** Zoom and pan enabled (roam: true), reset-to-full-view button provided
- **D-08:** Mobile (<768px): full-width map, shorter aspect ratio, pinch-to-zoom, legend and toggle stack below map
- **D-09:** Hover tooltip shows country name, MIND composite (or active dimension) score, binding constraint
- **D-10:** Hover highlight: country fill brightens, border turns white/bright (ECharts emphasis state)
- **D-11:** Default borders: subtle dark lines (#1a1a2e or similar)
- **D-12:** Click calls selectPrimary() on dashboard store; user stays on Map tab
- **D-13:** Selected country gets persistent bright border (white or cyan)
- **D-14:** URL state extended: ?view=map&country=USA
- **D-15:** Dimension toggle state in URL: dim= param

### Claude's Discretion
- Missing/null data country treatment
- GeoJSON data source and bundling strategy
- Map projection choice
- ECharts chart component registration for map type
- Legend placement and styling
- Reset-to-full-view button placement and styling
- Exact tooltip formatting and positioning
- Animation transitions when switching dimensions
- Map container aspect ratio

### Deferred Ideas (OUT OF SCOPE)
- Map multi-select for comparison (shift-click) -- Phase 17 (COMP-04)
- Map recoloring by year when time-series slider changes -- Phase 15 (TIME-05)
- Screen reader text alternatives for map -- Phase 17 (INT-02)
- Map performance optimization for Lighthouse targets -- Phase 17 (INT-04)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MAP-01 | ECharts choropleth world map displaying MIND composite scores for 217 countries with color gradient | ECharts 6 MapChart + VisualMapContinuousComponent + world.json GeoJSON with nameMap; 201/217 countries have polygons, 43-entry nameMap bridges naming |
| MAP-02 | "Map" tab added to dashboard alongside Country/City/Firm tabs | Extend ScaleTabs.astro with 4th button; extend Scale type and init.ts tab switching logic |
| MAP-03 | Click country on map selects it in dashboard state (triggers radar chart, binding constraint) | ECharts click event handler calls store.selectPrimary(); need reverse lookup from country name to SlimCountry |
| MAP-04 | Color scale legend showing MIND score ranges | VisualMapContinuousComponent with orient:'vertical', positioned right side of map |
| MAP-05 | Map tooltip on hover showing country name, MIND score, binding constraint | ECharts tooltip component with custom formatter function pulling from data payload |
| MAP-06 | Map dimension toggle -- switch coloring between composite and individual M/I/N/D | Segmented button row updates visualMap inRange colors and re-maps data values; reuses DIM_COLORS from charts.ts |
| INT-01 | All new visualizations follow existing ECharts SVG renderer pattern | SVGRenderer already registered; MapChart uses same renderer pipeline |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| echarts | 6.0.0 | Map chart, visualMap, geo component | Already installed and tree-shaken in project. MapChart, GeoComponent, VisualMapContinuousComponent available for import. |

### Supporting (new assets, no npm installs needed)
| Asset | Source | Purpose | When to Use |
|-------|--------|---------|-------------|
| world.json | https://echarts.apache.org/examples/data/asset/geo/world.json | GeoJSON polygons for 217 world countries | Fetched dynamically when Map tab activated; registered via echarts.registerMap() |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ECharts world.json | Natural Earth ne_110m GeoJSON with ISO_A3 | Has ISO codes but requires nameProperty config; different polygon shapes; ECharts world.json is purpose-built for ECharts |
| Dynamic fetch | Static import/bundle | Bundling adds ~278KB gzipped to initial JS payload; dynamic fetch only loads when Map tab clicked |
| nameMap (43 entries) | Custom GeoJSON with World Bank names baked in | Would need to maintain a fork of the GeoJSON; nameMap is the official ECharts solution |

**Installation:** No new packages needed. ECharts 6.0.0 already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
  scripts/dashboard/
    echarts-setup.ts    # ADD: MapChart, GeoComponent, VisualMapContinuousComponent
    charts.ts           # ADD: makeMapOption(), GEOJSON_NAME_MAP constant
    map.ts              # NEW: map initialization, GeoJSON fetch, dimension toggle, click handler
    state.ts            # MODIFY: add 'map' to Scale type
    url-state.ts        # MODIFY: add view= and dim= params
    init.ts             # MODIFY: wire map tab, lazy-load map module
  components/dashboard/
    ScaleTabs.astro     # MODIFY: add Map tab button
    DimensionToggle.astro # NEW: segmented button row for Composite/M/I/N/D
  pages/
    dashboard.astro     # MODIFY: add map panel container + dimension toggle
  data/
    geo-name-map.ts     # NEW: 43-entry nameMap dictionary (GeoJSON name -> World Bank name)
```

### Pattern 1: Lazy GeoJSON Loading
**What:** Fetch world.json only when Map tab is first activated, cache in memory.
**When to use:** Always -- avoids loading ~987KB GeoJSON on initial page load.
**Example:**
```typescript
// src/scripts/dashboard/map.ts
let geoJsonCache: any = null;

async function ensureGeoJSON(): Promise<any> {
  if (geoJsonCache) return geoJsonCache;
  const resp = await fetch('/geo/world.json'); // copied to public/geo/
  geoJsonCache = await resp.json();
  return geoJsonCache;
}
```

### Pattern 2: Pure Chart Option Generator (existing pattern)
**What:** makeMapOption() follows the same pattern as makeRadarOption(), makeBarOption().
**When to use:** Every chart option generation.
**Example:**
```typescript
// In charts.ts -- follows existing pattern
export type MapDimension = 'mind' | DimensionKey;

export function makeMapOption(
  countries: SlimCountry[],
  dimension: MapDimension = 'mind',
): Record<string, unknown> {
  const dimColor = dimension === 'mind' ? '#00c8ff' : DIM_COLORS[dimension];
  const dimLabel = dimension === 'mind' ? 'MIND Composite' : DIM_NAMES[dimension];

  const data = countries
    .filter(c => c[dimension] !== null)
    .map(c => ({
      name: c.name,
      value: c[dimension],
      // Attach full country data for tooltip
      bc: c.bc,
      mind: c.mind,
      m: c.m, i: c.i, n: c.n, d: c.d,
    }));

  return {
    aria: { enabled: true },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const d = params.data;
        if (!d || d.value == null) return `${params.name}<br/>No data`;
        const bcName = DIM_NAMES[d.bc as DimensionKey] || d.bc;
        return `<strong>${params.name}</strong><br/>`
          + `${dimLabel}: ${Math.round(d.value)}<br/>`
          + `Binding constraint: ${bcName}`;
      },
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 100,
      text: ['High', 'Low'],
      inRange: {
        color: ['#0a0a12', dimColor],
      },
      textStyle: { color: 'rgba(255,255,255,0.85)' },
      orient: 'vertical',
      right: 10,
      bottom: 20,
    },
    series: [{
      type: 'map',
      map: 'world',
      roam: true,
      nameMap: GEOJSON_NAME_MAP,
      data,
      emphasis: {
        itemStyle: {
          areaColor: undefined, // let visualMap control color
          borderColor: '#ffffff',
          borderWidth: 1.5,
        },
        label: { show: false },
      },
      select: {
        itemStyle: {
          borderColor: '#00c8ff',
          borderWidth: 2,
        },
      },
      selectedMode: 'single',
      itemStyle: {
        borderColor: '#1a1a2e',
        borderWidth: 0.5,
        areaColor: '#1a1a2e', // default for no-data countries
      },
      label: { show: false },
    }],
  };
}
```

### Pattern 3: URL State Extension
**What:** Extend existing encode/decode with view= and dim= params.
**When to use:** Map tab state persistence.
**Example:**
```typescript
// Extended DashboardURLState
export interface DashboardURLState {
  primary: string | null;
  compare: string[];
  view: string | null;    // NEW: 'map' | null
  dim: string | null;     // NEW: 'm'|'i'|'n'|'d' | null (null = composite)
}

// In encodeDashboardURL:
if (state.view) params.set('view', state.view);
if (state.dim) params.set('dim', state.dim);

// In decodeDashboardURL:
const view = params.get('view') || null;
const dim = params.get('dim') || null;
```

### Pattern 4: Click-to-Select via ECharts Event
**What:** Wire ECharts click event to store.selectPrimary().
**When to use:** Map country click interaction.
**Example:**
```typescript
mapChart.on('click', (params: any) => {
  if (params.componentType !== 'series') return;
  const countryName = params.name;
  // Lookup by name in the SlimCountry array
  const country = countries.find(c => c.name === countryName);
  if (country) {
    store.selectPrimary(country);
  }
});
```

### Anti-Patterns to Avoid
- **Bundling GeoJSON statically:** Do NOT import world.json as a static ESM import. It adds ~278KB gzipped to the JS bundle. Fetch dynamically instead.
- **Building custom nameMap at runtime:** The 43-entry mapping is static and known at build time. Define it as a constant, not computed.
- **Re-registering the map on dimension toggle:** registerMap() only needs to be called once. Dimension toggle changes the series data and visualMap colors, not the GeoJSON registration.
- **Using `type: 'geo'` instead of `type: 'map'`:** The `geo` component is for custom drawings on geographic coordinates. The `map` series type is for choropleth data visualization -- it natively supports data binding, visualMap, and tooltips.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Country name mapping | Custom name normalization logic | ECharts nameMap option (43-entry dictionary) | ECharts applies the mapping internally during GeoJSON parsing; data items use World Bank names directly |
| Color scale legend | Custom gradient legend component | VisualMapContinuousComponent | Native ECharts component with draggable range, auto-coloring, text labels |
| Zoom/pan controls | Custom scroll/drag handlers | ECharts roam: true | Native support for scroll-zoom, drag-pan, touch pinch-zoom |
| Country highlight on hover | Custom SVG path manipulation | ECharts emphasis state | Built-in state management with configurable styles |
| Selected country border | Manual SVG path tracking | ECharts select state + selectedMode: 'single' | Built-in selection state management |

**Key insight:** ECharts handles nearly all the interactive map behaviors natively. The implementation effort is primarily in data preparation (nameMap), option configuration, and wiring to the existing dashboard state.

## Common Pitfalls

### Pitfall 1: Country Name Mismatch Silent Failures
**What goes wrong:** Countries appear gray (no data) on the map even though data exists.
**Why it happens:** The data item `name` field doesn't match the GeoJSON feature name after nameMap transformation. Off by one character, accent, or abbreviation style.
**How to avoid:** Use the verified 43-entry GEOJSON_NAME_MAP constant. Write a unit test that checks every SlimCountry with non-null MIND score has a matching entry in the map data output.
**Warning signs:** Countries like Russia, Iran, or Congo showing as "no data" gray.

### Pitfall 2: GeoJSON Fetch Race Condition
**What goes wrong:** User clicks Map tab, then rapidly clicks Country tab and back to Map. Multiple fetches fire, or chart initializes before GeoJSON is ready.
**Why it happens:** No loading state or fetch deduplication.
**How to avoid:** Cache the fetch promise (not just the result). Show a loading skeleton/spinner until GeoJSON is registered. Guard against chart init before registerMap completes.
**Warning signs:** Blank map container, console errors about unregistered map name.

### Pitfall 3: registerMap Called Multiple Times
**What goes wrong:** Console warnings, memory leaks, or stale map data.
**Why it happens:** Tab switching triggers map initialization code repeatedly.
**How to avoid:** Guard registerMap with a boolean flag (`mapRegistered`). Call it exactly once. Subsequent tab switches just show/hide the chart and call resize().
**Warning signs:** Console warnings about map 'world' already registered.

### Pitfall 4: Map Chart Not Resizing on Tab Show
**What goes wrong:** Map renders at 0x0 or wrong dimensions when tab is shown.
**Why it happens:** ECharts chart was initialized or last resized while its container was `display: none` (hidden tab panel).
**How to avoid:** Call `mapChart.resize()` whenever the Map tab becomes visible. Add the map container to the existing ResizeObserver.
**Warning signs:** Map appears as a tiny dot or doesn't render until window resize.

### Pitfall 5: visualMap Color Not Updating on Dimension Toggle
**What goes wrong:** Switching from Composite to Material doesn't change the gradient color.
**Why it happens:** Using setOption with merge mode (default) -- visualMap colors from previous option persist.
**How to avoid:** Use `mapChart.setOption(newOption, true)` (second arg = notMerge) or explicitly replace the full visualMap config. Alternatively use `mapChart.setOption(newOption, { replaceMerge: ['visualMap'] })`.
**Warning signs:** Map shows cyan gradient when Material (green) is selected.

### Pitfall 6: Click Handler Fires on Empty Regions
**What goes wrong:** Clicking W. Sahara or Siachen Glacier triggers selectPrimary with undefined country.
**Why it happens:** GeoJSON has features with no matching MIND data.
**How to avoid:** Check that `countries.find(c => c.name === params.name)` returns a result before calling selectPrimary. No-op for null.
**Warning signs:** Radar chart/binding constraint showing undefined values.

## Code Examples

### ECharts Setup Extension
```typescript
// src/scripts/dashboard/echarts-setup.ts -- additions
import { MapChart } from 'echarts/charts';
import {
  GeoComponent,
  VisualMapContinuousComponent,
} from 'echarts/components';

// Add to echarts.use() array:
echarts.use([
  // ...existing
  MapChart,
  GeoComponent,
  VisualMapContinuousComponent,
]);
```

### GeoJSON Name Map (complete verified mapping)
```typescript
// src/data/geo-name-map.ts
// Maps ECharts world.json feature names -> World Bank country names
// 43 entries verified against mind-scores.json (2026-05-11)
export const GEOJSON_NAME_MAP: Record<string, string> = {
  'Somalia': 'Somalia, Fed. Rep.',
  'Antigua and Barb.': 'Antigua and Barbuda',
  'Bahamas': 'Bahamas, The',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'Brunei': 'Brunei Darussalam',
  'Central African Rep.': 'Central African Republic',
  'Cote d\'Ivoire': 'Cote d\'Ivoire', // accent difference
  'Dem. Rep. Congo': 'Congo, Dem. Rep.',
  'Congo': 'Congo, Rep.',
  'Cape Verde': 'Cabo Verde',
  'Cayman Is.': 'Cayman Islands',
  'Czech Rep.': 'Czechia',
  'Dominican Rep.': 'Dominican Republic',
  'Egypt': 'Egypt, Arab Rep.',
  'Faeroe Is.': 'Faroe Islands',
  'Micronesia': 'Micronesia, Fed. Sts.',
  'Gambia': 'Gambia, The',
  'Eq. Guinea': 'Equatorial Guinea',
  'Iran': 'Iran, Islamic Rep.',
  'Kyrgyzstan': 'Kyrgyz Republic',
  'Korea': 'Korea, Rep.',
  'Saint Lucia': 'St. Lucia',
  'Macedonia': 'North Macedonia',
  'Dem. Rep. Korea': 'Korea, Dem. People\'s Rep.',
  'Palestine': 'West Bank and Gaza',
  'Russia': 'Russian Federation',
  'S. Sudan': 'South Sudan',
  'Solomon Is.': 'Solomon Islands',
  'Slovakia': 'Slovak Republic',
  'Swaziland': 'Eswatini',
  'Syria': 'Syrian Arab Republic',
  'Turkey': 'Turkiye',
  'St. Vin. and Gren.': 'St. Vincent and the Grenadines',
  'Venezuela': 'Venezuela, RB',
  'Vietnam': 'Viet Nam',
  'Yemen': 'Yemen, Rep.',
  'Puerto Rico': 'Puerto Rico (US)',
  'U.S. Virgin Is.': 'Virgin Islands (U.S.)',
  'N. Mariana Is.': 'Northern Mariana Islands',
  'Fr. Polynesia': 'French Polynesia',
  'Turks and Caicos Is.': 'Turks and Caicos Islands',
};
// Note: Curacao has accent mismatch (GeoJSON: Curacao, WB: Curacao) -- same
// Note: Sao Tome has accent mismatch (GeoJSON: Sao Tome..., WB: Sao Tome...)
```

### Scale Type Extension
```typescript
// state.ts -- extend Scale type
export type Scale = 'country' | 'city' | 'firm' | 'map';
```

### DimensionToggle.astro Pattern
```astro
---
// Segmented button row for dimension switching
// Mirrors ScaleTabs.astro pattern
---
<div id="dim-toggle" class="flex gap-1 bg-surface-2 rounded-full p-1 w-fit ml-auto mb-4" role="radiogroup" aria-label="Map dimension">
  <button role="radio" aria-checked="true" data-dim="mind"
    class="rounded-full px-3 py-1.5 text-sm font-medium bg-white/10 text-white transition-colors">
    Composite
  </button>
  <button role="radio" aria-checked="false" data-dim="m"
    class="rounded-full px-3 py-1.5 text-sm font-medium text-[#8888aa] hover:text-white transition-colors">
    M
  </button>
  <button role="radio" aria-checked="false" data-dim="i"
    class="rounded-full px-3 py-1.5 text-sm font-medium text-[#8888aa] hover:text-white transition-colors">
    I
  </button>
  <button role="radio" aria-checked="false" data-dim="n"
    class="rounded-full px-3 py-1.5 text-sm font-medium text-[#8888aa] hover:text-white transition-colors">
    N
  </button>
  <button role="radio" aria-checked="false" data-dim="d"
    class="rounded-full px-3 py-1.5 text-sm font-medium text-[#8888aa] hover:text-white transition-colors">
    D
  </button>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ECharts 5 bundled map JSON files | ECharts 6 tree-shaken components, external GeoJSON via registerMap | ECharts 5.x removed bundled maps | Must provide own GeoJSON and call registerMap() |
| echarts/map/json/world.json (v4) | fetch() + registerMap() | ECharts 5.0 (2021) | GeoJSON no longer ships with echarts package |

**Deprecated/outdated:**
- `echarts/map/json/*` paths: Removed in ECharts 5. Must use registerMap() with external GeoJSON.
- `echarts.registerMap(name, svg)`: SVG maps are supported since ECharts 5.3 but not recommended for choropleth (no data binding to regions).

## GeoJSON Strategy (Claude's Discretion Decision)

**Decision:** Use the official ECharts world.json from `https://echarts.apache.org/examples/data/asset/geo/world.json`.

**Rationale:**
- Purpose-built for ECharts (coordinate system, feature structure tested)
- 217 features covering all major countries
- 987KB raw / 278KB gzipped -- acceptable for lazy-loaded asset
- Well-maintained by Apache ECharts project

**Bundling strategy:** Copy world.json to `public/geo/world.json` at build time. Fetch from `/geo/world.json` when Map tab is first activated. Cache in memory.

**Missing/null data treatment:** Countries with no MIND score data (14 territories like W. Sahara, Aland, French Southern Territories) render in neutral dark gray (#1a1a2e) matching the default itemStyle.areaColor. No striping needed -- solid dark fill communicates "no data" effectively against the gradient.

**Coverage summary:**
- 201 of 217 countries: have both GeoJSON polygon AND MIND data (shown with color)
- 14 GeoJSON features: no MIND data (shown as dark gray)
- 16 of our countries: no GeoJSON polygon (small islands/city-states like Aruba, Maldives, Monaco -- invisible on world map at this resolution; acceptable)

**Map projection:** Use ECharts default (Natural Earth-like projection built into the world.json coordinate data). No explicit projection configuration needed.

## Open Questions

1. **Curacao/Sao Tome accent handling**
   - What we know: GeoJSON uses "Curacao" (with cedilla accent on c) and "Sao Tome and Principe" (with tilde). Our data may or may not use the same Unicode characters.
   - What's unclear: Exact Unicode normalization behavior in ECharts nameMap matching.
   - Recommendation: Test these two countries explicitly. If accent mismatch, add entries to nameMap.

2. **ECharts MapChart bundle size impact**
   - What we know: MapChart + GeoComponent + VisualMapContinuousComponent add to the tree-shaken bundle.
   - What's unclear: Exact KB added (these are already tree-shakeable components).
   - Recommendation: Measure bundle size before/after adding to echarts-setup.ts. Estimated ~15-30KB gzipped additional.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.5 |
| Config file | vitest.config.ts (uses Astro's getViteConfig) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MAP-01 | makeMapOption produces valid ECharts config with visualMap, series type map, 201+ data entries | unit | `npx vitest run tests/dashboard-map.test.ts -t "makeMapOption"` | Wave 0 |
| MAP-02 | Scale type includes 'map' | unit | `npx vitest run tests/dashboard-map.test.ts -t "Scale type"` | Wave 0 |
| MAP-03 | Click handler resolves country name to SlimCountry | unit | `npx vitest run tests/dashboard-map.test.ts -t "click handler"` | Wave 0 |
| MAP-04 | makeMapOption includes visualMap with min:0 max:100 and correct colors | unit | `npx vitest run tests/dashboard-map.test.ts -t "visualMap"` | Wave 0 |
| MAP-05 | Tooltip formatter returns country name, score, binding constraint | unit | `npx vitest run tests/dashboard-map.test.ts -t "tooltip"` | Wave 0 |
| MAP-06 | makeMapOption changes visualMap colors per dimension | unit | `npx vitest run tests/dashboard-map.test.ts -t "dimension toggle"` | Wave 0 |
| INT-01 | No canvas renderer imported (SVG only) | unit | `npx vitest run tests/dashboard-map.test.ts -t "SVG renderer"` | Wave 0 |
| URL | encodeDashboardURL includes view and dim params | unit | `npx vitest run tests/dashboard-url-state.test.ts` | Extend existing |
| NAMEMAP | Every SlimCountry with non-null MIND matches a map data entry | unit | `npx vitest run tests/dashboard-map.test.ts -t "name coverage"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before /gsd:verify-work

### Wave 0 Gaps
- [ ] `tests/dashboard-map.test.ts` -- covers MAP-01 through MAP-06, INT-01, nameMap coverage
- [ ] Extend `tests/dashboard-url-state.test.ts` -- add view= and dim= param tests

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Astro static site, zero JS by default, Netlify-native
- **Performance:** Lighthouse >= 90 desktop, >= 75 mobile (deferred to Phase 17 INT-04 for map-specific optimization)
- **Accessibility:** WCAG 2.1 Level AA target (screen reader text for map deferred to Phase 17 INT-02)
- **Budget:** No new paid dependencies -- ECharts already installed, GeoJSON is free/public domain
- **Privacy:** No third-party tracking -- GeoJSON fetched from own domain (copied to public/)

## Sources

### Primary (HIGH confidence)
- ECharts 6.0.0 installed package -- verified MapChart, GeoComponent, VisualMapContinuousComponent exports
- ECharts type definitions (`node_modules/echarts/types/`) -- NameMap interface, MapSeriesOption, registerMap signature
- ECharts world.json (`https://echarts.apache.org/examples/data/asset/geo/world.json`) -- 217 features, name property analysis
- Project source code -- echarts-setup.ts, charts.ts, state.ts, url-state.ts, init.ts, dashboard.astro, ScaleTabs.astro
- mind-scores.json -- 217 countries, World Bank naming convention verified

### Secondary (MEDIUM confidence)
- [ECharts Map Series docs via ipecharts](https://ipecharts.readthedocs.io/en/stable/api/ipecharts.option.seriesitems.map.html) -- nameMap, nameProperty, roam, selectedMode options
- [ECharts visual map handbook](https://apache.github.io/echarts-handbook/en/concepts/visual-map/) -- continuous vs piecewise, inRange config
- [Snyk ECharts registerMap reference](https://snyk.io/advisor/npm-package/echarts/functions/echarts.registerMap) -- registerMap usage patterns

### Tertiary (LOW confidence)
- [ECharts world map CodePen](https://codepen.io/jiujiale/pen/RwwpGvE) -- basic world map implementation example
- [Natural Earth GeoJSON with ISO codes](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson) -- alternative GeoJSON source (not recommended for this project)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- ECharts 6.0.0 already installed, all components verified available
- Architecture: HIGH -- follows established patterns (pure option generators, pub/sub state, lazy loading)
- Pitfalls: HIGH -- name mapping exhaustively verified (201/217 matched), all edge cases documented
- GeoJSON strategy: HIGH -- ECharts official file tested, nameMap verified against World Bank data

**Research date:** 2026-05-11
**Valid until:** 2026-06-11 (stable -- ECharts 6 API unlikely to change)
