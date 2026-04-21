# Architecture Patterns: v1.1 MIND Intelligence Layer

**Domain:** Whitepaper + multi-scale interactive dashboard integration into existing Astro static site
**Researched:** 2026-04-21
**Confidence:** HIGH (existing codebase fully analyzed, patterns verified against Astro 5.x docs)

## Recommended Architecture

**Extend the existing Astro static site with two new page routes, a shared MIND calculation library, a build-time data layer for World Bank indicators, and a client-side dashboard island.**

The v1.0 site is a single-page app (`index.astro`) with vanilla TypeScript driving Three.js/GSAP interactivity. v1.1 adds two new concerns: (1) a long-form whitepaper page, and (2) a multi-scale data dashboard. These integrate cleanly with the existing architecture without requiring SSR, framework islands, or runtime data fetching.

### Why This Architecture

1. **Whitepaper as MDX content collection entry** -- gets Astro's built-in heading extraction (`getHeadings()`), component embedding, and the same type-safe content pipeline already used for stories/experiments
2. **Dashboard data fetched at build time** -- World Bank data updates annually, not in real-time. Build-time fetch via a custom Astro content loader eliminates CORS issues, removes client-side API dependencies, and produces a static JSON bundle that ships with the page
3. **Dashboard visualization as a `<script>`-driven island** -- matches the existing v1.0 pattern (Zone Zero, morph engine). No React/Svelte needed. Chart.js in a canvas element, hydrated via Astro's native `<script>` tag
4. **Shared MIND calculation module** -- the `calcScore()` function currently lives inside `zone-zero.ts`. Extract it to a shared `src/lib/mind-score.ts` so both Zone Zero and the dashboard use identical logic

## Component Boundaries

### New Files

| Component | Type | Path | Responsibility |
|-----------|------|------|----------------|
| Whitepaper page | Astro page | `src/pages/whitepaper.astro` | Renders MDX whitepaper with WhitepaperLayout, ToC sidebar |
| WhitepaperLayout | Astro layout | `src/layouts/WhitepaperLayout.astro` | Two-column layout: sticky ToC sidebar + prose content area |
| Whitepaper content | MDX collection entry | `src/content/whitepaper/mind-framework.mdx` | The actual whitepaper text with embedded components |
| Dashboard page | Astro page | `src/pages/dashboard.astro` | Composes dashboard components, passes build-time data as props |
| ScaleSelector | Astro component | `src/components/dashboard/ScaleSelector.astro` | Static HTML for firm/city/country/global tab navigation |
| DashboardPanel | Astro component | `src/components/dashboard/DashboardPanel.astro` | Container with canvas elements and score display markup |
| AggregationTree | Astro component | `src/components/dashboard/AggregationTree.astro` | SVG/HTML markup for hierarchical aggregation visualization |
| Dashboard script | TypeScript | `src/scripts/dashboard.ts` | Client-side interactivity: Chart.js rendering, scale switching, score animation |
| MIND score library | TypeScript | `src/lib/mind-score.ts` | Shared `calcScore()`, `getHealthState()`, `getBindingConstraint()` -- used by zone-zero.ts and dashboard.ts |
| World Bank loader | TypeScript | `src/lib/world-bank-loader.ts` | Build-time fetch utility: calls World Bank API v2, transforms to MIND-compatible shape, caches as JSON |
| Indicator mapping | TypeScript | `src/lib/indicators.ts` | Maps World Bank indicator codes to MIND dimensions (M/I/N/D), normalization functions |
| Dashboard data | JSON (generated) | `src/data/dashboard-data.json` | Pre-fetched, normalized World Bank data (committed or generated at build) |

### Modified Files

| File | Change |
|------|--------|
| `src/content.config.ts` | Add `whitepaper` collection with MDX glob pattern |
| `src/scripts/zone-zero.ts` | Import `calcScore` from `src/lib/mind-score.ts` instead of inline definition |
| `src/components/Nav.astro` | Add Whitepaper and Dashboard links |
| `src/layouts/BaseLayout.astro` | No structural changes needed -- new layouts extend independently |
| `astro.config.mjs` | Add `@astrojs/mdx` integration |
| `package.json` | Add `@astrojs/mdx`, `chart.js` dependencies |

## Data Flow

### Whitepaper Data Flow (Build-Time Only)

```
src/content/whitepaper/mind-framework.mdx
    |
    v  (Astro content collection with glob loader)
src/content.config.ts  -- defines 'whitepaper' collection, schema with Zod
    |
    v  (getEntry('whitepaper', 'mind-framework'))
src/pages/whitepaper.astro
    |
    v  (render() from astro:content)
WhitepaperLayout.astro  -- receives headings[] for ToC, <Content /> for body
    |
    v  (static HTML output)
dist/whitepaper/index.html
```

### Dashboard Data Flow (Hybrid: Build-Time Fetch + Client-Side Rendering)

```
BUILD TIME:
  World Bank API v2 (https://api.worldbank.org/v2/...)
      |
      v  (fetch at build via npm script or Astro content loader)
  src/lib/world-bank-loader.ts  -- fetches indicators, normalizes 0-100
      |
      v  (writes to filesystem or feeds content collection)
  src/data/dashboard-data.json  -- {countries: {...}, indicators: {...}}
      |
      v  (imported by dashboard page at build)
  src/pages/dashboard.astro  -- serializes data into <script> tag or data attribute
      |
      v
  dist/dashboard/index.html  -- static HTML with embedded JSON data

CLIENT SIDE:
  <script> in DashboardPanel.astro
      |
      v  (reads JSON from data attribute or inline script)
  src/scripts/dashboard.ts
      |
      v  (Chart.js renders bar/radar charts, calcScore from mind-score.ts)
  Canvas elements in DOM  -- interactive charts, scale switching, score display
```

### Key Design Decision: Build-Time Data Fetch

**Why not client-side fetch from World Bank API?**

1. **CORS uncertainty** -- World Bank API CORS headers are not guaranteed for all browser origins. Build-time fetch from Node.js has zero CORS issues.
2. **Data staleness is acceptable** -- World Development Indicators update annually. Fetching at build time (triggered by deploys) is sufficient.
3. **Performance** -- Zero API latency on page load. Data is pre-embedded in the static HTML.
4. **Reliability** -- No runtime dependency on external API availability. Site works even if World Bank API is down.
5. **Budget** -- No proxy server or serverless function needed for API relay.

**Fallback for missing data:** Pre-commit a baseline `dashboard-data.json` with recent data. The build script updates it when World Bank API is available, but the site builds successfully even if the API is unreachable.

## World Bank Indicator Mapping to MIND Dimensions

### Material Capital (M)
| Indicator Code | Name | Rationale |
|---------------|------|-----------|
| `NY.GDP.PCAP.PP.KD` | GDP per capita (PPP, constant $) | Core material wealth proxy |
| `EG.ELC.ACCS.ZS` | Access to electricity (% of population) | Infrastructure baseline |
| `SH.H2O.BASW.ZS` | Basic water services (% of population) | Physical commons |
| `IT.NET.USER.ZS` | Internet users (% of population) | Digital infrastructure |

### Intelligence Capital (I)
| Indicator Code | Name | Rationale |
|---------------|------|-----------|
| `SE.ADT.LITR.ZS` | Adult literacy rate | Knowledge baseline |
| `SE.TER.ENRR` | Tertiary education enrollment (gross %) | Higher education access |
| `GB.XPD.RSDV.GD.ZS` | R&D expenditure (% of GDP) | Knowledge investment |
| `IP.PAT.RESD` | Patent applications (residents) | Innovation output (normalize per capita) |

### Network Capital (N)
| Indicator Code | Name | Rationale |
|---------------|------|-----------|
| `NE.TRD.GNFS.ZS` | Trade (% of GDP) | Economic interconnection |
| `IT.CEL.SETS.P2` | Mobile subscriptions (per 100 people) | Communication density |
| `BX.TRF.PWKR.CD.DT` | Personal remittances received | Diaspora network strength |
| `IC.BUS.EASE.XQ` | Ease of doing business score | Institutional network quality |

### Diversity Capital (D)
| Indicator Code | Name | Rationale |
|---------------|------|-----------|
| `SL.TLF.CACT.FE.ZS` | Female labor force participation | Gender diversity proxy |
| `SM.POP.NETM` | Net migration | Cultural diversity flow |
| `NV.IND.MANF.ZS` | Manufacturing value added (% of GDP) | Economic diversification (inverse of resource dependence) |
| `EN.ATM.CO2E.PC` | CO2 emissions per capita | Ecological stress (inverse -- lower is better) |

### Normalization Strategy

Each indicator is normalized to 0-100 scale using min-max normalization across all countries in the dataset. Inverse indicators (CO2 emissions) are flipped. Missing values use the regional median. The per-dimension score is the geometric mean of its constituent indicators (matching the MIND multiplicative philosophy). The overall MIND score uses the same geometric mean formula as Zone Zero: `(M/100 * I/100 * N/100 * D/100)^0.25 * 100`.

## Whitepaper Architecture Details

### Content Collection Setup

```typescript
// src/content.config.ts (additions)
const whitepaper = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/whitepaper' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    authors: z.array(z.string()),
    date: z.string(),
    version: z.string(),
    abstract: z.string(),
    sortOrder: z.number().default(1),
  }),
});

export const collections = { stories, experiments, whitepaper };
```

### WhitepaperLayout Pattern

```
+--------------------------------------------------+
| Nav (existing)                                    |
+--------------------------------------------------+
|         |                                         |
|  Sticky |   Prose Content Area                    |
|   ToC   |   (MDX rendered via <Content />)        |
|  Sidebar|                                         |
|         |   - Headings with auto-generated IDs    |
|  h2 ----+   - Embedded components (callouts,      |
|  h2 ----+     equations, MIND diagrams)           |
|    h3 --+   - Footnotes                           |
|  h2 ----+   - Citations                           |
|         |                                         |
+--------------------------------------------------+
| Footer (existing)                                 |
+--------------------------------------------------+
```

**Table of Contents** is generated from `getHeadings()` (built into Astro's MDX processing). No plugin needed. The ToC component receives the headings array and renders a nested list with anchor links. Scroll-spy highlighting uses IntersectionObserver (matching existing reveal pattern).

### MDX Component Overrides

The whitepaper MDX can embed interactive components:

```astro
---
// src/pages/whitepaper.astro
import { getEntry, render } from 'astro:content';
import WhitepaperLayout from '../layouts/WhitepaperLayout.astro';
import MindEquation from '../components/whitepaper/MindEquation.astro';
import Callout from '../components/whitepaper/Callout.astro';
import Citation from '../components/whitepaper/Citation.astro';

const entry = await getEntry('whitepaper', 'mind-framework');
const { Content, headings } = await render(entry);
---
<WhitepaperLayout title={entry.data.title} headings={headings}>
  <Content components={{ MindEquation, Callout, Citation }} />
</WhitepaperLayout>
```

## Dashboard Architecture Details

### Scale Levels

| Scale | Data Source | Interactive? | Notes |
|-------|-----------|-------------|-------|
| **Global** | World Bank aggregates | View-only (build-time data) | World average + regional averages |
| **Country** | World Bank per-country indicators | Selectable country dropdown | ~200 countries, pre-fetched at build |
| **City** | User-input hybrid | Editable sliders (like Zone Zero) | No reliable public API for city-level MIND data. Users input estimates. Links to methodology. |
| **Firm** | User-input only | Editable sliders | No public data source. Self-assessment tool with guided questions. |

### Chart.js Integration

**Why Chart.js over D3.js:**
- 55KB gzipped vs D3's 80KB+ -- smaller bundle for a secondary page
- Canvas rendering (3-9x faster than SVG for this data volume)
- Built-in responsive behavior, animations, and tooltips
- Simpler API for standard chart types (radar, bar) needed here
- D3 is overkill -- we need radar charts and bar charts, not custom force layouts

**Chart types per view:**
- **Radar chart:** 4-axis (M/I/N/D) overlay comparing selected entity vs benchmark
- **Bar chart:** Horizontal bars per sub-indicator with drill-down
- **Aggregation tree:** Custom SVG (not Chart.js) showing how firm->city->country->global compose

### Dashboard Island Pattern

```astro
<!-- src/components/dashboard/DashboardPanel.astro -->
<div id="mind-dashboard" class="dashboard" data-countries={JSON.stringify(countries)}>
  <div class="dashboard__scale-tabs">
    <!-- Static HTML tabs: Global | Country | City | Firm -->
  </div>
  <div class="dashboard__chart-area">
    <canvas id="dashboard-radar" width="400" height="400"></canvas>
    <canvas id="dashboard-bars" width="600" height="300"></canvas>
  </div>
  <div class="dashboard__score-panel">
    <!-- Score display, binding constraint, health state -->
  </div>
  <div class="dashboard__aggregation">
    <!-- SVG aggregation tree -->
  </div>
</div>

<script>
  import { initDashboard } from '../../scripts/dashboard';
  const el = document.getElementById('mind-dashboard');
  if (el) {
    const data = JSON.parse(el.dataset.countries || '{}');
    initDashboard(el, data);
  }
</script>
```

**Data injection:** Build-time data is serialized into a `data-*` attribute on the container element. The client script reads it on hydration. This avoids a separate JSON fetch request and keeps everything in a single HTTP response. For large datasets (200 countries x 16 indicators), this adds ~50-80KB to the HTML payload -- acceptable given the page is specifically for data exploration.

### Shared MIND Score Module

```typescript
// src/lib/mind-score.ts
export interface MindScores {
  m: number; // 0-100
  i: number; // 0-100
  n: number; // 0-100
  d: number; // 0-100
}

export interface HealthState {
  score: number;
  badge: 'thriving' | 'stressed' | 'critical' | 'collapsed';
  name: string;
  insight: string;
}

/** Geometric mean MIND score calculation. Zero in any dimension = zero total. */
export function calcScore(vals: MindScores): number {
  const { m, i, n, d } = vals;
  if (m <= 0 || i <= 0 || n <= 0 || d <= 0) return 0;
  return Math.round(
    Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100
  );
}

/** Health state lookup from MIND score. */
export function getHealthState(score: number): HealthState { ... }

/** Find the dimension with the lowest score (binding constraint). */
export function getBindingConstraint(vals: MindScores): { dim: keyof MindScores; value: number; name: string; insight: string } { ... }

/** Normalize a raw indicator value to 0-100 using min-max bounds. */
export function normalize(value: number, min: number, max: number, invert?: boolean): number { ... }
```

This module is imported by both `zone-zero.ts` and `dashboard.ts`. The Zone Zero refactor is a small change: replace the inline `calcScore` function with an import from `src/lib/mind-score.ts`.

## Build-Time Data Pipeline

### Option A: npm Script (Recommended)

```
npm run fetch-data  -->  src/lib/world-bank-loader.ts  -->  src/data/dashboard-data.json
npm run build       -->  Astro reads JSON, injects into pages
```

A pre-build script fetches from World Bank API v2 and writes `dashboard-data.json`. This file is committed to git so builds never fail due to API unavailability. The script is run manually or in CI before deploy when data refresh is desired.

**Why over Astro custom content loader:** Simpler to debug, doesn't couple data fetching to Astro's build pipeline, the JSON file serves as a clear cache/checkpoint, and the data only needs refreshing when World Bank publishes annual updates (not every build).

### Option B: Astro Custom Content Loader

```typescript
// In content.config.ts
const worldBankData = defineCollection({
  loader: async () => {
    const response = await fetch('https://api.worldbank.org/v2/...');
    // Transform and return entries
  },
  schema: z.object({ ... }),
});
```

More "Astro-native" but adds build-time API dependency. Use only if the team wants data to refresh on every deploy.

### Recommendation: Option A

Commit a baseline JSON file. Provide `npm run fetch-data` for manual refresh. Update in CI monthly or when World Bank publishes new data. This decouples data freshness from site deployability.

## Patterns to Follow

### Pattern 1: Page-Specific Layouts
**What:** Each new page type gets its own layout extending BaseLayout concerns.
**When:** Whitepaper needs two-column ToC layout; dashboard needs full-width chart layout.
```
WhitepaperLayout.astro  -- imports BaseLayout patterns (head, fonts, analytics)
DashboardLayout.astro   -- imports BaseLayout patterns, adds Chart.js-specific meta
```

### Pattern 2: Data Injection via data-* Attributes
**What:** Build-time data serialized into HTML data attributes, read by client scripts.
**When:** Dashboard country data, pre-computed scores.
**Why:** Matches existing pattern (Zone Zero uses `data-target` for bar values). No separate fetch, no CORS, no loading states.

### Pattern 3: Progressive Enhancement for Dashboard
**What:** Dashboard renders meaningful static content (country list, latest scores as text) before JavaScript loads. Charts enhance on hydration.
**When:** Always -- matches the Astro zero-JS-by-default philosophy.
**How:** Server-render a table of top/bottom MIND scores. JavaScript replaces it with interactive charts.

### Pattern 4: Shared Library Extraction
**What:** Move shared logic (MIND scoring, health states, dimension metadata) to `src/lib/`.
**When:** Any logic used by more than one script module.
**Why:** Zone Zero and Dashboard must produce identical scores. Single source of truth prevents divergence.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side API Fetching for World Bank Data
**What:** Calling World Bank API from the browser on page load.
**Why bad:** CORS uncertainty, API latency on every visit, external dependency at runtime, no offline/cache story, wastes user bandwidth on data that changes annually.
**Instead:** Build-time fetch, commit JSON, serve statically.

### Anti-Pattern 2: React/Svelte Island for Dashboard
**What:** Adding a React or Svelte dependency to render the dashboard as a framework island.
**Why bad:** Adds 40-130KB of framework runtime for a component that doesn't need reactive state management. Chart.js is imperative (`.update()` calls), not declarative. Breaks the existing vanilla-TS pattern.
**Instead:** Vanilla TypeScript + Chart.js in an Astro `<script>` tag, matching Zone Zero's architecture.

### Anti-Pattern 3: Whitepaper as a Standalone .astro Page with Inline Content
**What:** Writing the entire whitepaper as HTML inside a single Astro component.
**Why bad:** No heading extraction for ToC, no content/presentation separation, harder to edit prose, no MDX component embedding.
**Instead:** MDX content collection entry rendered via `<Content />` with custom components.

### Anti-Pattern 4: Live Content Collections for Dashboard Data
**What:** Using Astro's experimental live content collections to fetch World Bank data at runtime.
**Why bad:** Experimental feature in Astro 5.x (behind flag), requires SSR mode (currently static-only site), adds server infrastructure costs on Netlify, and the data updates annually -- live fetching adds complexity for zero benefit.
**Instead:** Static build-time data with manual refresh script.

### Anti-Pattern 5: Duplicating calcScore Logic
**What:** Writing a separate MIND score function in dashboard.ts.
**Why bad:** Two implementations will inevitably diverge. Users comparing Zone Zero slider results with dashboard country scores will see inconsistencies.
**Instead:** Single `src/lib/mind-score.ts` imported by both modules.

## Scalability Considerations

| Concern | Current (v1.1) | At 50 Countries Selected | At All 200 Countries |
|---------|----------------|--------------------------|----------------------|
| Data payload | ~50KB JSON in HTML | Same (all data pre-loaded) | ~80KB JSON (acceptable) |
| Chart rendering | Instant (<50ms) | Instant | Instant (Chart.js handles this volume trivially) |
| Build time | +5-10s for World Bank fetch | Same (fetched once) | Same |
| Page weight | +55KB (Chart.js) + data | Same | Same |

The dashboard does not need pagination, lazy loading, or virtualization at this data scale. 200 countries x 16 indicators x ~8 bytes = ~25KB raw data. With country names and metadata, ~80KB total. This is well within a single static page's budget.

## Suggested Build Order

### Phase 1: Shared Foundation (No visible output yet)
1. **Extract `src/lib/mind-score.ts`** from `zone-zero.ts` -- calcScore, getHealthState, getBindingConstraint, dimension metadata
2. **Refactor `zone-zero.ts`** to import from shared lib -- verify Zone Zero still works identically
3. **Create `src/lib/indicators.ts`** -- World Bank indicator code mapping, normalization functions
4. **Update `src/content.config.ts`** -- add whitepaper collection definition

**Rationale:** Everything else depends on the shared score library. Refactoring Zone Zero first proves the extraction works without adding new features. Indicator mapping is needed by both the data pipeline and dashboard.

### Phase 2: Whitepaper Infrastructure
5. **Install `@astrojs/mdx`**, update `astro.config.mjs`
6. **Create `WhitepaperLayout.astro`** -- two-column layout with sticky ToC sidebar
7. **Create `src/components/whitepaper/`** -- Callout, MindEquation, Citation, FigureCaption components
8. **Create `src/content/whitepaper/mind-framework.mdx`** -- initial whitepaper content
9. **Create `src/pages/whitepaper.astro`** -- page route that renders the MDX entry
10. **Create `src/scripts/whitepaper-toc.ts`** -- scroll-spy IntersectionObserver for ToC highlighting

**Rationale:** Whitepaper has zero dependency on the data pipeline or dashboard. It can ship independently. The MDX infrastructure is also useful if future content (blog posts, methodology docs) needs rich formatting.

### Phase 3: Data Pipeline
11. **Create `src/lib/world-bank-loader.ts`** -- Node.js script to fetch and normalize World Bank data
12. **Create `scripts/fetch-data.ts`** -- npm script entry point (`npm run fetch-data`)
13. **Generate `src/data/dashboard-data.json`** -- initial data fetch, commit baseline
14. **Add npm script to `package.json`** -- `"fetch-data": "npx tsx scripts/fetch-data.ts"`

**Rationale:** Data pipeline must exist before dashboard can render anything meaningful. Separating it as a standalone step means the dashboard can develop against the committed JSON file even if the API script needs iteration.

### Phase 4: Dashboard Core
15. **Install `chart.js`**, add types
16. **Create `DashboardLayout.astro`** or extend BaseLayout with dashboard-specific needs
17. **Create `src/components/dashboard/ScaleSelector.astro`** -- tab UI for Global/Country/City/Firm
18. **Create `src/components/dashboard/DashboardPanel.astro`** -- chart containers + score display
19. **Create `src/scripts/dashboard.ts`** -- Chart.js initialization, country selector, scale switching
20. **Create `src/pages/dashboard.astro`** -- page route composing dashboard components with injected data

**Rationale:** Depends on Phase 1 (shared score lib) and Phase 3 (data). The dashboard is the most complex new feature and should come after the foundation is solid.

### Phase 5: Aggregation Visualization + Polish
21. **Create `src/components/dashboard/AggregationTree.astro`** -- hierarchical composition SVG
22. **Create `src/scripts/aggregation.ts`** -- interactive tree animation (click to drill down)
23. **Add City/Firm input modes** -- slider-based input (reusing Zone Zero patterns) for scales without API data
24. **Nav updates** -- add Whitepaper and Dashboard to Nav.astro
25. **Cross-linking** -- whitepaper links to dashboard ("see live data"), dashboard links to whitepaper ("read the methodology")
26. **Analytics events** -- Plausible custom events for dashboard interactions

**Rationale:** Aggregation tree is the most novel visualization and depends on all four scales working. Polish and cross-linking come last because they require both whitepaper and dashboard to exist.

### Dependency Graph

```
Phase 1 (Shared Lib)
    |           \
    v            v
Phase 2       Phase 3
(Whitepaper)  (Data Pipeline)
    |            |
    |            v
    |        Phase 4 (Dashboard Core)
    |            |
    v            v
    Phase 5 (Aggregation + Polish + Cross-linking)
```

**Phases 2 and 3 can run in parallel** -- they share no dependencies beyond Phase 1. Phase 4 requires Phase 3. Phase 5 requires both 2 and 4.

## New Dependencies

| Package | Version | Size (gzipped) | Purpose |
|---------|---------|----------------|---------|
| `@astrojs/mdx` | ^4.x | ~15KB | MDX processing for whitepaper content collection |
| `chart.js` | ^4.4.x | ~55KB | Canvas-based charts for dashboard (radar, bar) |

**Total new JS shipped to client:** ~55KB (Chart.js only, loaded only on `/dashboard/` page). MDX is build-time only. This keeps the homepage unchanged at its current performance budget.

## Sources

- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro Content Loader API: https://docs.astro.build/en/reference/content-loader-reference/
- Astro MDX Integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
- Astro Data Fetching: https://docs.astro.build/en/guides/data-fetching/
- Astro Markdown getHeadings(): https://docs.astro.build/en/guides/markdown-content/
- World Bank Indicators API v2: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
- World Bank Indicator Queries: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-indicator-api-queries
- World Development Indicators catalog: https://datacatalog.worldbank.org/search/dataset/0037712/world-development-indicators
- Worldwide Governance Indicators: https://www.worldbank.org/en/publication/worldwide-governance-indicators
- Chart.js documentation: https://www.chartjs.org/docs/latest/
- Chart.js vs D3.js performance: https://www.xjavascript.com/blog/comparison-between-d3-js-and-chart-js-only-for-charts/
- Astro Live Content Collections: https://astro.build/blog/live-content-collections-deep-dive/
