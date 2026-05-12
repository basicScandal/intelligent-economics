# Phase 15: Time-Series Visualization - Research

**Researched:** 2026-05-12
**Domain:** ECharts line chart, animated playback controls, year slider, dashboard state extension
**Confidence:** HIGH

## Summary

Phase 15 adds time-series visualization to an existing ECharts-based dashboard. The codebase already has: (1) historical MIND score data for 2014-2024 in `mind-scores-historical.json` (318 KB raw, ~41 KB gzipped), (2) query helpers (`getCountryTimeSeries`, `getYearSnapshot`, `getAvailableYears`), (3) a pub/sub state store, (4) tree-shaken ECharts with SVG renderer, and (5) a working world map with dimension toggle. The phase adds `LineChart` to the ECharts registration, extends the dashboard store with a `year` field, builds a `makeTimeSeriesOption()` pure function, wires playback controls via `setInterval`, and connects year changes to map recoloring via `getYearSnapshot` + `makeMapOption`.

No new dependencies are needed. ECharts `LineChart` is already available in `echarts/charts` (verified in ECharts 6.0.0 installed). The `MarkLineComponent` export is available for a vertical current-year indicator line. Historical data lacks `bc` (binding constraint) but this is trivially derived from dimension scores using the existing `getBindingConstraint()` function.

**Primary recommendation:** Extend the existing dashboard architecture -- add `LineChart` + `MarkLineComponent` to echarts-setup.ts, add `year` to DashboardState, create pure `makeTimeSeriesOption()` in charts.ts, build a `timeline.ts` module (loaded lazily like map.ts), and add HTML controls + chart container to dashboard.astro.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Time-series line chart appears below the map in the country detail section -- gains a line chart alongside radar chart. Consistent with Phase 14's map-click-to-detail flow
- **D-02:** Use ECharts LineChart -- already tree-shaken in the project, reuses echarts-setup.ts pattern. No new dependency
- **D-03:** Multi-country overlays reuse existing comparison state -- selected primary + up to 3 compare countries show as colored lines using COMPARISON_COLORS from charts.ts
- **D-04:** Mobile layout: full-width chart with controls stacking below. Chart aspect ratio ~16:9 on desktop, ~4:3 on mobile. Matches Phase 14 mobile pattern
- **D-05:** Year slider is a full-width range input styled as a scrubber bar below the chart. Year labels at ends (2014/2024), thumb shows current year. Native HTML range input with custom styling
- **D-06:** 3 animation speeds: 1x (1s/year), 2x (500ms/year), 0.5x (2s/year). Cycle button next to play/pause. 11 frames (2014-2024) = 11s at 1x
- **D-07:** When year changes, ALL dashboard charts update to selected year -- radar chart, binding constraint, ranking table reflect that year's data. Year resets to "latest" when leaving timeline mode
- **D-08:** Play/pause button positioned left of the year slider, inline. Play/pause icon + speed badge in a compact control row. Matches media player convention
- **D-09:** Map recolors for selected year by refetching year-specific data from historical JSON via `getSlimPayload(year)`, then re-calling `makeMapOption()`. Year selector dispatches to store, map subscribes
- **D-10:** Historical data uses Phase 13's year-indexed structure -- `getSlimPayload(year)` returns SlimCountry[] for any year. Already built in Phase 13
- **D-11:** Missing historical data for a country/year: gray out country on map + "No data for {year}" in tooltip. Line chart shows gap in series. Consistent with Phase 14's null-data treatment
- **D-12:** Year controls appear in a shared bar above the main content when any year != latest -- accessible from Map and Country tabs. Timeline tab always shows them

### Claude's Discretion
- Line chart styling (line width, point markers, area fill)
- Animation easing function for playback
- Year slider thumb design and styling
- Exact layout of play/pause + speed controls
- How to show/hide year controls when switching between tabs
- Line chart tooltip format for multi-country overlay
- Whether dimension lines (M/I/N/D) show by default or are toggleable
- Loading state while fetching historical data for a year

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TIME-02 | Time-series line chart showing MIND score evolution for a selected country | `makeTimeSeriesOption()` pure function using ECharts LineChart with `getCountryTimeSeries()` data. Years on xAxis (category), scores on yAxis (value 0-100). Up to 5 series: MIND composite + M/I/N/D dimensions. |
| TIME-03 | Animated playback controls (play/pause/speed) for score evolution across years | `setInterval`-based playback in timeline.ts. Store dispatches `setYear(year+1)` at configured speed. Three speeds: 500ms/1000ms/2000ms per frame. Play/pause toggle + speed cycle button. |
| TIME-04 | Year slider/scrubber for manual year selection | Native `<input type="range" min="2014" max="2024" step="1">` with custom Tailwind styling. Dispatches `setYear()` on input event. Bidirectional sync with playback position. |
| TIME-05 | Time-series integration with world map -- map recolors to selected year's data | `getYearSnapshot(year)` returns country scores, converted to SlimCountry[] via a new `snapshotToSlim()` helper, then passed to existing `makeMapOption()`. Map subscribes to year changes in store. |
| TIME-06 | Multi-country time-series overlay (compare 2-4 countries over time) | Multiple series in LineChart using `COMPARISON_COLORS`. Each comparison country adds a series via `getCountryTimeSeries()`. Legend shows country names. Tooltip shows all series values for hovered year. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** Astro static site, zero JS by default, islands architecture
- **Performance:** Lighthouse >= 90 desktop, >= 75 mobile
- **Accessibility:** WCAG 2.1 Level AA target
- **Budget:** Free tiers, open source tooling
- **Privacy:** No third-party tracking cookies
- **ECharts pattern:** Tree-shaken imports via echarts/core, SVG renderer, pure option generator functions
- **Dashboard pattern:** Pub/sub state store, lazy dynamic imports, ResizeObserver for chart containers
- **Testing:** Vitest with node environment, pure function unit tests

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| echarts | 6.0.0 | LineChart for time-series, MarkLineComponent for year indicator | Already installed and tree-shaken. Add LineChart + MarkLineComponent to registration. |
| vitest | 4.1.5 | Unit tests for pure option generators and data transforms | Already configured, 130 tests passing. |

### New ECharts Components to Register
| Component | Import Path | Purpose |
|-----------|-------------|---------|
| `LineChart` | `echarts/charts` | Line series rendering |
| `MarkLineComponent` | `echarts/components` | Vertical line indicator for current year on chart |

### No New Dependencies
All functionality is achievable with existing installed packages. Historical data helpers exist in `src/lib/historical-data.ts`. Chart option pattern exists in `src/scripts/dashboard/charts.ts`.

## Architecture Patterns

### Recommended File Structure
```
src/
  scripts/dashboard/
    state.ts          # ADD: year field, setYear(), LATEST_YEAR constant
    charts.ts         # ADD: makeTimeSeriesOption(), snapshotToSlim()
    echarts-setup.ts  # ADD: LineChart, MarkLineComponent registration
    timeline.ts       # NEW: playback logic, year control wiring, historical data loading
    init.ts           # MODIFY: wire year controls, subscribe map to year changes
    url-state.ts      # ADD: year param encoding/decoding
    map.ts            # MODIFY: subscribe to year changes, re-render with historical data
  components/dashboard/
    YearControls.astro # NEW: play/pause, speed toggle, year slider HTML
  lib/
    historical-data.ts # EXISTING: getCountryTimeSeries, getYearSnapshot, getAvailableYears
  data/
    mind-scores-historical.json  # EXISTING: 318 KB year-indexed data
```

### Pattern 1: State Extension for Year
**What:** Add `year` field to DashboardState, default to `null` (meaning "latest/current data").
**When to use:** Any year != null means "historical mode" -- all charts show that year's data.

```typescript
// In state.ts
export interface DashboardState {
  primary: SlimCountry | null;
  comparison: SlimCountry[];
  isMobile: boolean;
  activeScale: Scale;
  year: number | null;  // null = latest, 2014-2024 = historical
}

// New method on DashboardStore
setYear: (year: number | null) => void;
```

### Pattern 2: Pure Option Generator (follows existing makeRadarOption/makeMapOption pattern)
**What:** `makeTimeSeriesOption()` takes country time-series data + comparison data + config, returns ECharts option.
**When to use:** Called on every state change that affects the time-series chart.

```typescript
// In charts.ts
export interface TimeSeriesCountry {
  name: string;
  code: string;
  color: string;
  data: { year: number; mind: number | null; m: number | null; i: number | null; n: number | null; d: number | null }[];
}

export function makeTimeSeriesOption(
  countries: TimeSeriesCountry[],
  currentYear: number | null,
  showDimensions: boolean,
): Record<string, unknown> {
  // xAxis: category with years 2014-2024
  // yAxis: value 0-100
  // series: one line per country (MIND composite)
  // optional: M/I/N/D dimension lines for primary country
  // markLine: vertical line at currentYear if set
  // tooltip: trigger 'axis' showing all series values
}
```

### Pattern 3: Lazy Module Loading (follows map.ts pattern)
**What:** `timeline.ts` loaded dynamically on first interaction with year controls.
**When to use:** Historical data (41 KB gzipped) should not load until user actually engages timeline.

```typescript
// In init.ts, when year controls first activated:
import('./timeline').then((timelineMod) => {
  timelineMod.initTimeline(echarts, store, countries);
});
```

### Pattern 4: Historical Data to SlimCountry Conversion
**What:** Convert `getYearSnapshot()` output to `SlimCountry[]` for reuse with existing `makeMapOption()`.
**When to use:** When year changes, map needs SlimCountry[] in the same shape as current data.

```typescript
// In charts.ts
export function snapshotToSlim(
  snapshot: Record<string, YearScores>,
  countryNames: Record<string, string>,  // iso3 -> name lookup
): SlimCountry[] {
  return Object.entries(snapshot).map(([code, scores]) => ({
    code,
    name: countryNames[code] || code,
    mind: scores.mind,
    m: scores.m,
    i: scores.i,
    n: scores.n,
    d: scores.d,
    bc: scores.m !== null && scores.i !== null && scores.n !== null && scores.d !== null
      ? getBindingConstraint({ m: scores.m, i: scores.i, n: scores.n, d: scores.d })
      : '',
  }));
}
```

**Key insight:** Historical data does NOT include `bc` field. It must be derived using `getBindingConstraint()` from `mind-score.ts`. This is the lowest-scoring dimension key among m/i/n/d. Countries with any null dimension get `bc: ''`.

### Pattern 5: Playback via setInterval
**What:** Play/pause animation cycles through years using `setInterval` + store dispatch.
**When to use:** TIME-03 playback controls.

```typescript
// In timeline.ts
const SPEEDS = { '0.5x': 2000, '1x': 1000, '2x': 500 };
let intervalId: number | null = null;
let currentSpeed: keyof typeof SPEEDS = '1x';

function startPlayback(store: DashboardStore, years: number[]) {
  stopPlayback();
  intervalId = window.setInterval(() => {
    const current = store.get().year ?? years[years.length - 1];
    const idx = years.indexOf(current);
    if (idx >= years.length - 1) {
      stopPlayback(); // Reached end
      return;
    }
    store.setYear(years[idx + 1]);
  }, SPEEDS[currentSpeed]);
}

function stopPlayback() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
```

### Anti-Patterns to Avoid
- **Loading historical JSON eagerly:** The 318 KB file should only load when timeline features are first used, via dynamic `import()`.
- **Re-registering ECharts map on year change:** `registerMap('world', geoJson)` is already done once in map.ts. Year changes only call `setOption()` with new data, never re-register.
- **Mutating state directly:** Always use store methods (`setYear`, `selectPrimary`) -- never mutate state object directly.
- **Forgetting null handling:** 2024 data has only 98 countries with MIND scores (vs 179 in 2014). Every data access must handle nulls. Use `'-'` in ECharts data arrays to represent gaps.
- **Not clearing interval on unmount:** Playback interval must be cleared when leaving timeline mode or navigating away.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Line chart rendering | Custom SVG/Canvas drawing | ECharts LineChart | Already in the bundle, handles animation, tooltips, responsive resize |
| Data transition animation | Manual tweening between data states | ECharts `setOption()` built-in animation | ECharts auto-diffs data and applies transition animations |
| Binding constraint for historical years | Custom min-finding logic | `getBindingConstraint()` from mind-score.ts | Already tested, handles edge cases |
| Country name lookup for ISO3 codes | Hardcoded map | Build lookup from existing `countries` array (already in init.ts) | SlimCountry[] already has code->name mapping |
| Year snapshot to SlimCountry | Manual per-field mapping | `snapshotToSlim()` helper (new, but reuses existing types) | Centralizes the conversion, testable |

## Common Pitfalls

### Pitfall 1: Historical Data Missing Binding Constraint
**What goes wrong:** `getYearSnapshot()` returns `{ m, i, n, d, mind }` without `bc`. Passing this directly where `SlimCountry` is expected causes runtime errors or empty binding constraint displays.
**Why it happens:** Phase 13 optimized payload by storing only scores, not derived fields.
**How to avoid:** Always convert via `snapshotToSlim()` which derives `bc` using `getBindingConstraint()`.
**Warning signs:** Binding constraint callout shows empty text or "undefined" when viewing historical year.

### Pitfall 2: 2024 Data Sparsity
**What goes wrong:** 2024 has only 98 countries with complete MIND scores (vs 179 in 2014). Charts look empty or broken for recent years.
**Why it happens:** World Bank reporting lag -- recent years have fewer published indicators.
**How to avoid:** Show "Data limited for recent years" indicator. Handle null gracefully in line charts (use `'-'` for gaps). Gray out countries on map.
**Warning signs:** Dramatic visual drop-off at chart's right edge (2023-2024).

### Pitfall 3: Playback Interval Not Cleared
**What goes wrong:** Multiple intervals stack up, causing rapid/chaotic year cycling.
**Why it happens:** Clicking play multiple times without stopping, or switching tabs without cleanup.
**How to avoid:** Always call `stopPlayback()` before `startPlayback()`. Clear on tab switch. Clear on component teardown.
**Warning signs:** Year advancing faster than expected, console shows multiple setYear calls per tick.

### Pitfall 4: Chart Container Hidden During Render
**What goes wrong:** ECharts renders to a 0x0 container, chart appears blank when shown.
**Why it happens:** Chart is in a hidden tab/section when `setOption` is called.
**How to avoid:** Call `chart.resize()` after container becomes visible (use setTimeout 50ms pattern from map.ts). ResizeObserver handles subsequent resizes.
**Warning signs:** Chart container shows but is empty until window resize.

### Pitfall 5: URL State Year Param Stale After Navigation
**What goes wrong:** User bookmarks URL with `year=2018`, returns later, dashboard shows 2018 data but year controls are not visible.
**Why it happens:** Year hydration happens before timeline module loads.
**How to avoid:** Store year in URL state, hydrate after timeline module loads. Show year controls whenever `year != null` in state.
**Warning signs:** Dashboard shows old data with no way to change year.

### Pitfall 6: Map Data Not Updating on Year Change
**What goes wrong:** Year slider moves but map still shows current-year coloring.
**Why it happens:** map.ts doesn't subscribe to year changes -- it only subscribes to primary/dimension changes.
**How to avoid:** Add year subscription in map.ts that re-calls `makeMapOption()` with year-specific SlimCountry[] data.
**Warning signs:** Map colors don't change when scrubbing years, but radar chart does update.

### Pitfall 7: Country Name Mismatch Between Historical and Current Data
**What goes wrong:** `snapshotToSlim()` produces entries with ISO3 codes as names instead of human-readable names.
**Why it happens:** Historical data is keyed by ISO3 code, but SlimCountry needs `.name` for display and map matching.
**How to avoid:** Build a `code -> name` lookup from the already-loaded `countries` array in init.ts. Pass it to `snapshotToSlim()`.
**Warning signs:** Map tooltip shows "USA" instead of "United States", chart legends show ISO3 codes.

## Code Examples

### Adding LineChart to ECharts Registration
```typescript
// src/scripts/dashboard/echarts-setup.ts -- add to imports and registration
import { RadarChart, BarChart, MapChart, LineChart } from 'echarts/charts';
import { MarkLineComponent } from 'echarts/components';

echarts.use([
  RadarChart, BarChart, MapChart, LineChart,  // ADD LineChart
  TitleComponent, TooltipComponent, GridComponent,
  RadarComponent, LegendComponent, AriaComponent,
  GeoComponent, VisualMapContinuousComponent,
  MarkLineComponent,  // ADD for year indicator
  SVGRenderer,
]);
```

### Time-Series Option Generator
```typescript
// src/scripts/dashboard/charts.ts
export function makeTimeSeriesOption(
  countries: TimeSeriesCountry[],
  currentYear: number | null,
): Record<string, unknown> {
  const years = Array.from({ length: 11 }, (_, i) => String(2014 + i));

  const series = countries.map((c) => ({
    name: c.name,
    type: 'line',
    data: years.map((y) => {
      const entry = c.data.find((d) => String(d.year) === y);
      return entry?.mind ?? '-';  // '-' = gap in ECharts
    }),
    lineStyle: { width: 2, color: c.color },
    itemStyle: { color: c.color },
    symbol: 'circle',
    symbolSize: 6,
    emphasis: { focus: 'series' },
  }));

  // Add vertical marker line for current year
  const markLineData = currentYear ? [{
    xAxis: String(currentYear),
    lineStyle: { color: '#ffffff', width: 1, type: 'dashed' },
    label: { show: true, formatter: String(currentYear), position: 'start' },
  }] : [];

  if (series.length > 0 && markLineData.length > 0) {
    (series[0] as any).markLine = {
      silent: true,
      data: markLineData,
      symbol: 'none',
    };
  }

  return {
    aria: { enabled: true },
    ...siteTheme,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line' },
    },
    legend: {
      data: countries.map((c) => c.name),
      textStyle: { color: 'rgba(255,255,255,0.85)' },
    },
    grid: { containLabel: true, left: 10, right: 30, bottom: 10, top: 40 },
    xAxis: { type: 'category', data: years, boundaryGap: false },
    yAxis: { type: 'value', min: 0, max: 100 },
    series,
  };
}
```

### Year Slider HTML
```html
<!-- In YearControls.astro -->
<div id="year-controls" class="hidden flex items-center gap-3 px-4 py-2 bg-surface-2 rounded-lg mb-4">
  <button id="year-play" class="flex items-center gap-1 text-sm text-white/80 hover:text-white" aria-label="Play year animation">
    <span id="year-play-icon">&#9654;</span>
    <span id="year-speed-badge" class="text-xs text-text-muted">1x</span>
  </button>
  <span id="year-label-start" class="text-xs text-text-muted">2014</span>
  <input
    type="range"
    id="year-slider"
    min="2014"
    max="2024"
    step="1"
    value="2024"
    class="flex-1 h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer accent-[#00c8ff]"
    aria-label="Select year"
    aria-valuemin="2014"
    aria-valuemax="2024"
    aria-valuenow="2024"
  />
  <span id="year-label-end" class="text-xs text-text-muted">2024</span>
  <span id="year-current" class="text-sm font-medium text-[#00c8ff] min-w-[3ch] text-center">2024</span>
</div>
```

### Snapshot to SlimCountry Conversion
```typescript
// In charts.ts
import { getBindingConstraint, type DimensionKey } from '../../lib/mind-score';
import type { YearScores } from '../../lib/historical-data';

export function snapshotToSlim(
  snapshot: Record<string, YearScores>,
  nameMap: Record<string, string>,
): SlimCountry[] {
  return Object.entries(snapshot).map(([code, s]) => {
    let bc: string = '';
    if (s.m !== null && s.i !== null && s.n !== null && s.d !== null) {
      bc = getBindingConstraint({ m: s.m, i: s.i, n: s.n, d: s.d });
    }
    return { code, name: nameMap[code] || code, mind: s.mind, m: s.m, i: s.i, n: s.n, d: s.d, bc };
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| ECharts timeline component | `setOption()` with `setInterval` | ECharts 5.x+ | Timeline component is heavy and opinionated. Manual setInterval + setOption is lighter and gives full control over playback UX. |
| Canvas renderer default | SVG renderer for dashboard | Project convention | SVG is better for accessibility (DOM-based), smaller for simple charts, and allows CSS styling. Already established in echarts-setup.ts. |
| Full echarts import | Tree-shaken imports | ECharts 5.0+ | Only imports needed chart types. Adding LineChart + MarkLineComponent adds minimal bundle overhead. |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.5 |
| Config file | vitest.config.ts (via astro/config) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TIME-02 | makeTimeSeriesOption generates correct line chart config | unit | `npx vitest run tests/dashboard-charts.test.ts -t "makeTimeSeriesOption"` | Wave 0 |
| TIME-02 | snapshotToSlim converts historical data with derived bc | unit | `npx vitest run tests/dashboard-charts.test.ts -t "snapshotToSlim"` | Wave 0 |
| TIME-03 | Playback speed constants are correct (500/1000/2000ms) | unit | `npx vitest run tests/timeline.test.ts -t "speed"` | Wave 0 |
| TIME-04 | Year state encodes/decodes in URL | unit | `npx vitest run tests/dashboard-url-state.test.ts -t "year"` | Wave 0 |
| TIME-05 | snapshotToSlim produces valid SlimCountry[] for makeMapOption | unit | `npx vitest run tests/dashboard-charts.test.ts -t "snapshotToSlim"` | Wave 0 |
| TIME-06 | makeTimeSeriesOption handles multiple countries with COMPARISON_COLORS | unit | `npx vitest run tests/dashboard-charts.test.ts -t "multi-country"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/dashboard-charts.test.ts` -- add makeTimeSeriesOption and snapshotToSlim tests
- [ ] `tests/timeline.test.ts` -- new file for playback logic constants and helpers
- [ ] `tests/dashboard-url-state.test.ts` -- add year param encode/decode tests

## Open Questions

1. **Dimension lines default visibility**
   - What we know: Each country has m/i/n/d dimension scores over time. Showing all 5 lines (MIND + 4 dims) can be visually noisy.
   - What's unclear: Whether to show dimension lines by default or make them toggleable.
   - Recommendation: Show MIND composite only by default. Add a small toggle to show/hide individual dimension lines. This keeps the chart clean for casual users while allowing deep analysis.

2. **Loading state for historical data fetch**
   - What we know: Historical JSON is 41 KB gzipped, loads via dynamic import. First load may take 100-500ms.
   - What's unclear: Exact UX during that brief loading period.
   - Recommendation: Show a subtle inline spinner in the year controls area during first load. After cached, subsequent year changes are instant (data is already in memory).

3. **Year controls placement across tabs**
   - What we know: D-12 says year controls appear in a shared bar above main content when year != latest.
   - What's unclear: Exact show/hide behavior when switching between Country/Map tabs (both use year) vs City/Firm tabs (which don't).
   - Recommendation: Year controls bar is always in DOM (above ScaleTabs). Hidden by default. Shown when `state.year !== null`. When switching to City/Firm tabs, controls remain visible but add a "Reset to latest" button. On City/Firm tab switch, auto-reset year to null.

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `src/scripts/dashboard/state.ts`, `charts.ts`, `echarts-setup.ts`, `init.ts`, `map.ts`, `url-state.ts`, `search.ts`
- Codebase inspection: `src/lib/historical-data.ts`, `src/lib/mind-score.ts`, `src/lib/dashboard-data.ts`
- Codebase inspection: `src/data/mind-scores-historical.json` structure verified (11 years, 217 countries, m/i/n/d/mind per entry)
- ECharts 6.0.0 installed: `LineChart` and `MarkLineComponent` exports verified via node require
- Vitest 4.1.5: 130 tests passing, config at vitest.config.ts

### Secondary (MEDIUM confidence)
- [ECharts Handbook - Basic Line Chart](https://apache.github.io/echarts-handbook/en/how-to/chart-types/line/basic-line/) - line series configuration
- [ECharts Handbook - Dynamic Data](https://apache.github.io/echarts-handbook/en/how-to/data/dynamic-data/) - setOption animation pattern
- [ECharts Handbook - Import / Tree Shaking](https://apache.github.io/echarts-handbook/en/basics/import/) - tree-shaken component registration
- [ECharts Documentation](https://echarts.apache.org/en/option.html) - full option reference

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and verified, no new deps
- Architecture: HIGH - extends established patterns (state store, pure option generators, lazy loading)
- Pitfalls: HIGH - identified from direct codebase analysis (null handling, bc derivation, data sparsity verified with real data)
- Data layer: HIGH - historical data structure and completeness verified with actual JSON inspection

**Research date:** 2026-05-12
**Valid until:** 2026-06-12 (stable -- no external dependency changes expected)
