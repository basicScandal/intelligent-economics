# Phase 9: Country Dashboard Core - Research

**Researched:** 2026-04-21
**Domain:** Interactive data visualization dashboard (ECharts + Astro islands)
**Confidence:** HIGH

## Summary

Phase 9 builds a /dashboard page where policy practitioners explore MIND scores for 217 countries via radar charts, bar chart comparisons, and a searchable interface. The data layer is complete from Phase 7 -- `mind-scores.json` contains all 217 countries with dimension scores, binding constraints, and indicator metadata. The charting library is ECharts 6.0.0 (locked decision), loaded via Astro island with `client:visible` for deferred hydration.

The critical technical challenges are: (1) tree-shaking ECharts to import only radar + bar chart types (~minimizing the ~57MB unpacked package to a reasonable bundle), (2) progressive enhancement via a build-time static ranking table that displays before JS loads, (3) handling 19 countries with null MIND scores gracefully, and (4) responsive chart layouts for mobile. The data injection pattern uses static JSON import at build time passed via data attributes to the island -- zero runtime API calls.

**Primary recommendation:** Build in layers: static ranking table first (SSR, zero JS), then chart island with ECharts tree-shaken imports (radar + bar only), then search/selection interactivity. Use SVG renderer for better mobile memory and accessibility.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Page structure: Top search bar -> Middle: selected country detail (radar chart + binding constraint callout + methodology panel) -> Bottom: multi-country comparison bar chart. Single page, sections appear as countries are selected
- Hybrid selection model: primary country shows radar + callout detail; up to 4 countries can be added for the comparison bar chart. Primary selection drives the detail view, comparison is secondary
- Default state (before selection): server-rendered ranking table showing top 20 countries by MIND score with search bar above. Satisfies DASH-07 progressive enhancement -- content visible before JS loads
- Chart colors: existing Zone Zero dimension colors -- M=#00ff88 (green), I=#00c8ff (blue), N=#7b4bff (purple), D=#ffb400 (gold). Consistent across the site
- ECharts 6 loaded via Astro island with `client:visible` directive -- only loads when dashboard enters viewport. Import radar and bar chart types only (not full library)
- Data injection: static import of `mind-scores.json` in Astro page, passed as `data-scores` attribute on chart container. Island script reads at hydration time -- zero runtime API calls
- Progressive enhancement: Astro generates a static HTML `<table>` of top 20 countries (sorted by MIND score) from `mind-scores.json` at build time. Visible immediately. ECharts overlays after hydration
- Methodology transparency panel (DATA-04): expandable HTML `<details>` accordion per dimension showing which 4 World Bank indicators feed it, with indicator codes and descriptions. Collapsed by default, no JS needed
- Client-side fuzzy search: case-insensitive substring matching over 217 country names from JSON data. Keyboard navigable dropdown (arrow keys + Enter). Astro island with `client:idle`
- Mobile layout (<768px): single column stack -- search -> radar chart (full width, smaller) -> binding constraint callout -> methodology panel -> comparison bar chart (horizontal bars instead of vertical). TOC/sidebar hidden
- Chart accessibility: each chart has `aria-label` describing the data, plus visually-hidden `<table>` equivalent rendered by Astro at build time. ECharts `aria` option enabled
- Data attribution (DASH-05): small caption below each chart -- "Source: World Bank World Development Indicators, {year}. Accessed {date}." Read from metadata in `mind-scores.json`

### Claude's Discretion
- ECharts chart configuration details (animation, tooltip formatting, legend position)
- Exact search dropdown styling and positioning
- Radar chart axis label placement and sizing
- Bar chart orientation and grouping logic for multi-country comparison
- Responsive breakpoint fine-tuning
- Loading/hydration transition animation (if any)
- Ranking table column selection and sorting

### Deferred Ideas (OUT OF SCOPE)
- Side-by-side comparison overlay on radar charts -- Phase 10 (DASH-08)
- Zone Zero integration with real data pre-loading -- Phase 10 (DASH-09)
- Bookmarkable dashboard URLs -- Phase 10 (DASH-10)
- Multi-scale navigation (firm/city/country) -- Phase 11 (SCALE-03)
- Nav link to dashboard -- Phase 12 (NAV-01)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DASH-01 | Country-level MIND score radar chart showing M/I/N/D dimension balance for any country | ECharts 6 RadarChart + RadarComponent with tree-shaken imports; radar indicators map to 4 MIND dimensions with max=100 |
| DASH-02 | Bar chart comparing MIND dimensions across selected countries | ECharts 6 BarChart + GridComponent; grouped bars with up to 4 countries, dimension colors from Zone Zero |
| DASH-03 | Country search/selection with autocomplete for 217 countries | Client-side substring search over pre-loaded country names array; keyboard-navigable dropdown; `client:idle` island |
| DASH-04 | Binding constraint identification callout per country | Data already in mind-scores.json `bindingConstraint` field; reuse DIM_INSIGHTS pattern from zone-zero.ts |
| DASH-05 | Data source attribution with vintage year on every chart | Metadata in mind-scores.json: `generatedAt`, `worldBankLastUpdated`; indicator-level `year` and `source` fields |
| DASH-06 | Mobile-responsive charts with simplified mobile layout | ECharts resize() with ResizeObserver; horizontal bars on mobile; single-column stack below 768px |
| DASH-07 | Progressive enhancement -- server-rendered ranking table before JS hydration | Astro build-time static HTML table from mind-scores.json; 198 countries have valid scores, top 20 displayed |
| DATA-04 | Indicator methodology transparency panel showing which World Bank indicators feed each dimension | HTML `<details>` accordion; 16 indicators organized by 4 dimensions from `indicators` object in mind-scores.json |
</phase_requirements>

## Standard Stack

### Core (Phase-specific additions)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| echarts | 6.0.0 | Radar + bar charts, data visualization | Locked decision. Tree-shakeable, SVG/Canvas renderers, built-in ARIA support, dark theme. Latest stable. |

### Supporting (already in project)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro | ^5.18.0 | Static site generator, build-time data processing | Page generation, static table rendering, island orchestration |
| tailwindcss | ^4.2.0 | Dashboard layout, responsive utilities | All layout and styling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ECharts 6 | Chart.js | Lighter but lacks radar chart depth, tree-map, drill-down. ECharts is locked decision. |
| SVG renderer | Canvas renderer | Canvas better for >1k data points; SVG better for mobile memory, accessibility, and our ~4-20 data point charts |
| Full ECharts import | Tree-shaken import | Full package is ~57MB unpacked. Tree-shaking with radar+bar+tooltip+grid+aria reduces to ~100-150KB gzipped estimate |

**Installation:**
```bash
npm install echarts@6.0.0
```

**Version verification:** echarts 6.0.0 confirmed as latest stable on npm (2026-04-21). No beta/RC concerns.

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    dashboard.astro          # Page entry — builds static table, mounts island
  components/
    dashboard/
      DashboardIsland.astro  # Island wrapper — client:visible, passes data
      RankingTable.astro     # Static HTML table (build-time, no JS)
      MethodologyPanel.astro # <details> accordion (no JS)
      BindingConstraint.astro # Callout component (static until JS adds dynamic)
  scripts/
    dashboard/
      charts.ts              # ECharts init, radar config, bar config
      search.ts              # Country search + dropdown logic
      state.ts               # Dashboard selection state management
      echarts-setup.ts       # Tree-shaken ECharts imports + registration
  lib/
    mind-score.ts            # (existing) calcScore, getBindingConstraint
  data/
    mind-scores.json         # (existing) 217 countries with scores
```

### Pattern 1: ECharts Tree-Shaken Setup
**What:** Import only needed chart types and components to minimize bundle
**When to use:** Always -- never import the full `echarts` package
**Example:**
```typescript
// src/scripts/dashboard/echarts-setup.ts
import * as echarts from 'echarts/core';
import { RadarChart, BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  RadarComponent,
  LegendComponent,
  AriaComponent,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  RadarChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  RadarComponent,
  LegendComponent,
  AriaComponent,
  SVGRenderer,
]);

export { echarts };
```

### Pattern 2: Data Injection via Data Attributes
**What:** Pass build-time JSON data to client-side island via HTML data attributes
**When to use:** When Astro frontmatter data must reach client-side scripts without runtime API calls
**Example:**
```astro
---
// dashboard.astro (frontmatter)
import scores from '../data/mind-scores.json';
const topCountries = Object.entries(scores.countries)
  .filter(([_, c]) => c.mind !== null)
  .sort((a, b) => b[1].mind - a[1].mind)
  .slice(0, 20);
const dataPayload = JSON.stringify(scores);
---
<div id="dashboard-app" data-scores={dataPayload}>
  <!-- Static content renders here at build time -->
</div>
```

```typescript
// Client-side island reads at hydration
const container = document.getElementById('dashboard-app');
const scores = JSON.parse(container?.dataset.scores || '{}');
```

**Note on payload size:** The full mind-scores.json with 217 countries and 16 indicators per country is substantial (~500KB+). Consider a slimmed payload for the data attribute containing only what charts need (country name, code, dimension scores, mind score, binding constraint) and a separate fetch or inline script for the full indicator detail needed by the methodology panel.

### Pattern 3: ResizeObserver for Chart Responsiveness
**What:** Watch chart container dimensions and call echarts.resize()
**When to use:** Always -- window resize events miss container-only size changes
**Example:**
```typescript
const chart = echarts.init(container, null, { renderer: 'svg' });
const ro = new ResizeObserver(() => {
  chart.resize();
});
ro.observe(container);
```

### Pattern 4: Progressive Enhancement Layer
**What:** Static HTML table visible immediately; ECharts overlays after hydration
**When to use:** Dashboard default state (before country selection)
**Example flow:**
1. Astro builds static `<table>` with top 20 countries sorted by MIND score
2. Table is visible immediately (no JS required)
3. `client:visible` island loads ECharts
4. On hydration, island initializes search + charts but does NOT hide the table
5. Table remains visible until user selects a country, then charts appear above/alongside

### Anti-Patterns to Avoid
- **Full ECharts import:** `import * as echarts from 'echarts'` loads entire 57MB package. Always use tree-shaken `echarts/core` path.
- **Runtime API calls for data:** Data is static and available at build time. No fetch() calls to the World Bank API at runtime.
- **Canvas renderer for small datasets:** With only 4-20 data points per chart, SVG renderer is more memory-efficient on mobile and produces accessible DOM elements.
- **Hiding static table on hydration:** The ranking table should remain visible as useful content, not disappear when JS loads. It's the default view before any country is selected.
- **Single monolithic island script:** Split chart setup, search logic, and state management into separate modules for maintainability.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Radar chart rendering | Custom SVG/Canvas radar | ECharts RadarChart | Tooltip, animation, responsive resize, ARIA built in |
| Bar chart rendering | Custom bar chart | ECharts BarChart | Grouped bars, tooltips, axis formatting are complex |
| Chart accessibility | Manual aria-label generation | ECharts AriaComponent | Auto-generates descriptions from chart data |
| Chart dark mode | Manual color scheme | ECharts custom theme object with transparent bg | Inherits site dark/light tokens |
| Fuzzy search | npm fuzzy search library | Simple substring filter | 217 items is trivial; substring match on country names is sufficient per locked decision |

**Key insight:** ECharts handles the hard parts (tooltips, animation, accessibility, responsive resize). The custom code should focus on data transformation, state management, and the dashboard shell (search, layout, methodology panel).

## Common Pitfalls

### Pitfall 1: Null MIND Scores
**What goes wrong:** 19 of 217 countries have null MIND scores (incomplete data). Rendering these in charts or the ranking table causes NaN displays or chart errors.
**Why it happens:** Some countries lack data for entire dimensions (e.g., Kosovo has null Intelligence and Diversity scores).
**How to avoid:** Filter to `mind !== null` for ranking table and comparison charts. Show "Incomplete data" indicator in search results for null-score countries. Allow viewing available dimensions in radar chart even with incomplete data.
**Warning signs:** NaN in chart tooltips, empty radar polygons, sorting errors in ranking table.

### Pitfall 2: ECharts v6 Default Theme Override
**What goes wrong:** ECharts 6 has a completely new default theme with different colors, legend position (now bottom), and axis behavior. Charts don't match the site's bioluminescent palette.
**Why it happens:** v6 redesigned the default theme. The dark theme also has a fixed dark blue background (#100C2A) that clashes with the site's #050508.
**How to avoid:** Initialize with a custom theme object: `echarts.init(dom, customTheme)` where customTheme sets `backgroundColor: 'transparent'`, uses the MIND dimension colors, and matches the site's text/border tokens.
**Warning signs:** Charts have a visible background box that doesn't match the page, or legend appears at bottom instead of expected position.

### Pitfall 3: Data Attribute Size Limit
**What goes wrong:** Encoding the full mind-scores.json (~500KB+) as a data attribute bloats the HTML document and slows parsing.
**Why it happens:** Each country has 16 indicators with raw values, normalized scores, years, and sources.
**How to avoid:** Create a slimmed-down payload for the data attribute containing only what charts need: `{code, name, mind, m, i, n, d, bindingConstraint}` per country. Load full indicator detail lazily (inline `<script type="application/json">` block or separate request) for the methodology panel.
**Warning signs:** HTML document size >1MB, slow initial paint, large DOM attribute warnings.

### Pitfall 4: ECharts Resize Not Triggering
**What goes wrong:** Charts don't resize when the container changes size (e.g., sidebar collapse, mobile rotation).
**Why it happens:** ECharts does NOT auto-resize. The `window.resize` event misses container-only changes. The built-in autoResize option only watches window events.
**How to avoid:** Use ResizeObserver on the chart container element and call `chart.resize()` in the callback.
**Warning signs:** Charts overflow container, get clipped, or show at wrong dimensions after viewport changes.

### Pitfall 5: Rich Text Label Style Inheritance (v6 Breaking Change)
**What goes wrong:** Rich text labels in tooltips or axis names inherit font styles from parent label, causing unexpected sizing.
**Why it happens:** ECharts v6 changed label.rich inheritance behavior. fontStyle, fontWeight, fontSize, fontFamily now cascade from parent.
**How to avoid:** Set `richInheritPlainLabel: false` at option root if rich text label styles are unexpected. Or explicitly set all font properties in rich text fragments.
**Warning signs:** Tooltip text suddenly larger/different weight than intended.

### Pitfall 6: AriaComponent Not Imported
**What goes wrong:** Setting `aria: { show: true }` in options has no effect -- screen readers get nothing.
**Why it happens:** Since ECharts v5, AriaComponent must be explicitly imported and registered when using tree-shaking.
**How to avoid:** Always include `AriaComponent` in the `echarts.use([...])` registration array.
**Warning signs:** No `aria-label` attribute on the chart container SVG element.

## Code Examples

### Radar Chart Configuration for MIND Dimensions
```typescript
// Source: ECharts radar chart documentation + project dimension colors
import type { DimensionKey } from '../lib/mind-score';

const DIM_COLORS: Record<DimensionKey, string> = {
  m: '#00ff88',
  i: '#00c8ff',
  n: '#7b4bff',
  d: '#ffb400',
};

const DIM_NAMES: Record<DimensionKey, string> = {
  m: 'Material',
  i: 'Intelligence',
  n: 'Network',
  d: 'Diversity',
};

function makeRadarOption(country: { name: string; m: number; i: number; n: number; d: number }) {
  return {
    aria: { enabled: true },
    tooltip: {
      trigger: 'item',
    },
    radar: {
      shape: 'polygon',
      indicator: [
        { name: 'Material', max: 100, color: DIM_COLORS.m },
        { name: 'Intelligence', max: 100, color: DIM_COLORS.i },
        { name: 'Network', max: 100, color: DIM_COLORS.n },
        { name: 'Diversity', max: 100, color: DIM_COLORS.d },
      ],
      splitNumber: 5,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [country.m, country.i, country.n, country.d],
        name: country.name,
        areaStyle: { opacity: 0.25 },
        lineStyle: { width: 2 },
        itemStyle: { color: '#00ff88' },
      }],
    }],
  };
}
```

### Bar Chart for Multi-Country Comparison
```typescript
function makeBarOption(countries: Array<{ name: string; m: number; i: number; n: number; d: number }>) {
  return {
    aria: { enabled: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: countries.map(c => c.name), textStyle: { color: '#8888aa' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Material', 'Intelligence', 'Network', 'Diversity'],
      axisLabel: { color: '#8888aa' },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { color: '#8888aa' },
    },
    series: countries.map(c => ({
      name: c.name,
      type: 'bar',
      data: [c.m, c.i, c.n, c.d],
    })),
  };
}
```

### Custom ECharts Theme for Site Integration
```typescript
const siteTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#e8e8f0', fontFamily: "'Satoshi', 'Inter', sans-serif" },
  title: { textStyle: { color: '#e8e8f0' } },
  legend: { textStyle: { color: '#8888aa' } },
  color: ['#00ff88', '#00c8ff', '#7b4bff', '#ffb400'],
};

// Usage: echarts.init(container, siteTheme, { renderer: 'svg' });
```

### Slim Data Payload for Data Attribute
```typescript
// Build-time in Astro frontmatter -- create slim payload
import fullScores from '../data/mind-scores.json';

interface SlimCountry {
  code: string;
  name: string;
  mind: number | null;
  m: number | null;
  i: number | null;
  n: number | null;
  d: number | null;
  bc: string;
}

const slim: SlimCountry[] = Object.entries(fullScores.countries).map(([code, c]) => ({
  code,
  name: c.name,
  mind: c.mind,
  m: c.dimensions.m.score,
  i: c.dimensions.i.score,
  n: c.dimensions.n.score,
  d: c.dimensions.d.score,
  bc: c.bindingConstraint,
}));
// ~15KB instead of ~500KB
```

### Keyboard-Navigable Search Dropdown
```typescript
// Key event handling pattern for search autocomplete
function handleSearchKeydown(e: KeyboardEvent, items: HTMLElement[], activeIndex: number) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      return Math.min(activeIndex + 1, items.length - 1);
    case 'ArrowUp':
      e.preventDefault();
      return Math.max(activeIndex - 1, 0);
    case 'Enter':
      e.preventDefault();
      items[activeIndex]?.click();
      return activeIndex;
    case 'Escape':
      // Close dropdown
      return -1;
    default:
      return activeIndex;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ECharts 5.x default theme | ECharts 6 new theme system with design tokens | 2026 (v6.0.0) | Must use custom theme or `echarts/theme/v5.js` to control appearance |
| `aria.show: true` | `aria: { enabled: true }` + AriaComponent import | ECharts 5+ | AriaComponent must be tree-shaken imported explicitly |
| Rich text labels independent | Rich text inherits parent font styles | ECharts 6 | Set `richInheritPlainLabel: false` if needed |
| Legend at top by default | Legend at bottom by default | ECharts 6 | Override legend.top in config |
| Light theme at `echarts/src/theme/light.ts` | Moved to `echarts/theme/rainbow.js` | ECharts 6 | Import path change if using built-in themes |

## Open Questions

1. **Optimal data payload size for data attribute**
   - What we know: Full JSON is ~500KB+; slim version is ~15KB for 217 countries
   - What's unclear: Whether the methodology panel needs full indicator data inline or can lazy-load
   - Recommendation: Use slim payload in data attribute for charts; embed full indicator metadata in a `<script type="application/json">` block for the methodology panel (parsed on demand, not blocking render)

2. **ECharts 6 tree-shaken bundle size**
   - What we know: Full package is 57MB unpacked; tree-shaking is well-documented and critical
   - What's unclear: Exact gzipped size of radar+bar+tooltip+grid+aria+SVGRenderer after tree-shaking
   - Recommendation: Measure after implementation with `npx vite-bundle-visualizer`. Budget estimate: 80-150KB gzipped.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.5 |
| Config file | vitest.config.ts (uses Astro's getViteConfig) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DASH-01 | Radar chart option generation produces valid ECharts config for any country | unit | `npx vitest run tests/dashboard-charts.test.ts -t "radar" -x` | Wave 0 |
| DASH-02 | Bar chart option generation produces valid grouped config for 1-4 countries | unit | `npx vitest run tests/dashboard-charts.test.ts -t "bar" -x` | Wave 0 |
| DASH-03 | Search filters 217 countries by substring, returns sorted matches | unit | `npx vitest run tests/dashboard-search.test.ts -x` | Wave 0 |
| DASH-04 | Binding constraint callout uses correct dimension and insight text | unit | `npx vitest run tests/dashboard-charts.test.ts -t "binding" -x` | Wave 0 |
| DASH-05 | Data attribution string includes year and source from metadata | unit | `npx vitest run tests/dashboard-charts.test.ts -t "attribution" -x` | Wave 0 |
| DASH-06 | Mobile chart config switches bar orientation for <768px | unit | `npx vitest run tests/dashboard-charts.test.ts -t "mobile" -x` | Wave 0 |
| DASH-07 | Ranking table data sorted by MIND score, null scores excluded, top 20 | unit | `npx vitest run tests/dashboard-data.test.ts -t "ranking" -x` | Wave 0 |
| DATA-04 | Methodology panel data maps 16 indicators to 4 dimensions correctly | unit | `npx vitest run tests/dashboard-data.test.ts -t "methodology" -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/dashboard-charts.test.ts` -- covers DASH-01, DASH-02, DASH-04, DASH-05, DASH-06
- [ ] `tests/dashboard-search.test.ts` -- covers DASH-03
- [ ] `tests/dashboard-data.test.ts` -- covers DASH-07, DATA-04

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Astro static site generator with islands architecture
- **Performance:** Lighthouse >= 90 desktop, >= 75 mobile. ECharts must load via `client:visible` to defer
- **JS Budget:** Total < 200KB loaded on demand (Three.js + GSAP already ~180KB; ECharts adds to this, must tree-shake aggressively)
- **Accessibility:** WCAG 2.1 Level AA target -- ECharts aria option required, visually-hidden table equivalents
- **Privacy:** No third-party tracking cookies (no external chart services)
- **Budget:** Free/open source only (ECharts is Apache 2.0 licensed)
- **Astro Islands Strategy:** ECharts dashboard is `client:visible`, search is `client:idle`

## Sources

### Primary (HIGH confidence)
- mind-scores.json inspected directly -- 217 countries, 198 with valid MIND scores, 19 null
- mind-score.ts inspected directly -- calcScore, getBindingConstraint, normalize exports
- zone-zero.ts inspected directly -- DIM_COLORS, DIM_NAMES, DIM_INSIGHTS patterns
- npm registry: echarts@6.0.0 confirmed latest stable
- ECharts v6 upgrade guide: https://echarts.apache.org/handbook/en/basics/release-note/v6-upgrade-guide/
- ECharts tree-shaking docs: https://apache.github.io/echarts-handbook/en/basics/import/
- ECharts radar chart docs: https://mintlify.wiki/apache/echarts/charts/radar
- ECharts ARIA docs: https://echarts.apache.org/handbook/en/best-practices/aria/
- ECharts Canvas vs SVG: https://apache.github.io/echarts-handbook/en/best-practices/canvas-vs-svg/

### Secondary (MEDIUM confidence)
- ECharts 6 feature overview: https://echarts.apache.org/handbook/en/basics/release-note/v6-feature/
- Astro client-side scripts docs: https://docs.astro.build/en/guides/client-side-scripts/
- Bundlephobia echarts: https://bundlephobia.com/package/echarts@6.0.0

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- ECharts 6.0.0 is locked decision, version verified on npm, tree-shaking pattern documented
- Architecture: HIGH -- Astro islands pattern established in project, data layer complete from Phase 7
- Pitfalls: HIGH -- ECharts v6 breaking changes documented officially, null data issue verified by data inspection
- Code examples: MEDIUM -- Radar/bar configs based on official docs but not run-tested against v6 specifically

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (ECharts 6.0.0 is stable release, unlikely to change rapidly)
