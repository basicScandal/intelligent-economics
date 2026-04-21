# Technology Stack

**Project:** Intelligent Economics v1.1 -- MIND Intelligence Layer
**Researched:** 2026-04-21
**Scope:** NEW stack additions for whitepaper page and multi-scale MIND dashboard. Existing validated stack (Astro 5.18.x, Tailwind v4, Three.js, GSAP, Netlify) is NOT re-researched.

## New Stack Additions for v1.1

### Whitepaper Content Pipeline

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @astrojs/mdx | 5.0.x | MDX support for whitepaper page | Enables embedding interactive Astro components (charts, callouts, MIND formula visualizations) inside markdown-authored whitepaper content. Astro's native .md only renders static HTML -- MDX lets us drop `<MindFormula />` or `<InteractiveChart />` components inline. First-party Astro integration, well-maintained. | HIGH |
| @tailwindcss/typography | 0.5.x | `prose` classes for long-form academic content | Provides beautiful typographic defaults for rendered markdown/MDX. Headings, paragraphs, blockquotes, tables, code blocks, footnotes all styled automatically. Avoids writing hundreds of lines of custom CSS for whitepaper layout. Compatible with Tailwind v4 via `@plugin` directive in CSS. | HIGH |
| remark-math | 7.0.x | LaTeX math syntax in MDX | Parses `$inline$` and `$$block$$` math expressions in MDX. The MIND framework formula (M x I x N x D = P) and any economic equations need proper mathematical typesetting. | HIGH |
| rehype-katex | 7.0.x | Renders math as HTML/CSS (KaTeX) | Transforms parsed math nodes into rendered KaTeX output. KaTeX over MathJax because: 3x faster rendering, smaller bundle (~28KB CSS + fonts vs ~200KB for MathJax), server-side rendering compatible (renders at build time in Astro, zero client JS). | HIGH |
| remark-gfm | 4.0.x | GitHub Flavored Markdown extensions | Tables, footnotes, strikethrough, task lists. Already default in Astro, but required explicitly when adding custom remark plugins (Astro resets defaults). Footnotes essential for academic whitepaper citations. | HIGH |

### Data Visualization & Dashboard

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Apache ECharts | 6.0.x | Multi-scale MIND dashboard charts | Best fit for this project because: (1) Built-in hierarchical chart types -- treemap, sunburst, and drill-down with `dataGroupId` for firm->city->country->global navigation. (2) Tree-shakeable ES modules -- import only bar, radar, treemap, map, and sunburst components to reduce from ~1MB full to ~200KB used. (3) Canvas + SVG dual renderer -- use SVG for accessibility (screen readers), canvas for performance on large datasets. (4) Framework-agnostic vanilla JS -- fits Astro's script tag pattern, no React/Vue wrapper needed. (5) Built-in responsive and mobile touch support (pinch-to-zoom on data series). | HIGH |
| echarts-countries-js | (latest) | GeoJSON country boundaries for world map view | Pre-packaged GeoJSON for 214 countries. ECharts `registerMap()` loads these for the global MIND score map view. Community-maintained but stable (geographic boundaries don't change often). | MEDIUM |

### Data Fetching & APIs

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| World Bank API v2 | (REST API) | Country-level MIND indicator data | Free, no API key required, JSON format, 1600+ indicators covering all four MIND dimensions. Rate limit: 10 req/sec. Fetch at build time via Astro frontmatter `fetch()`. Key indicator codes mapped below. | HIGH |
| US Census ACS API | (REST API) | City-level education, income, diversity data | American Community Survey provides city/county-level data for education attainment, median income, racial diversity index. Free API key required (instant registration). Covers US cities with pop > 65,000 at 1-year estimates. | MEDIUM |
| SEC EDGAR API | (REST API) | Firm-level financial and innovation data | Free, no API key (just User-Agent header with email). RESTful JSON from `data.sec.gov`. Provides company financials (10-K/10-Q XBRL data), patent-related filings, R&D expenditure from financial statements. Rate limit: 10 req/sec. | MEDIUM |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| katex | 0.16.x | KaTeX CSS and fonts | Peer dependency of rehype-katex. Include CSS via `<link>` in whitepaper layout head. Fonts auto-load from CSS. |

## DO NOT Add (Already Covered or Unnecessary)

| Technology | Why Not Needed |
|------------|----------------|
| D3.js | ECharts covers all dashboard needs with less code. D3 is low-level -- would require 5-10x more code for the same treemap/radar/map charts. Only add D3 if a visualization is truly custom beyond ECharts' capabilities (unlikely for this scope). |
| Chart.js | Too simple for hierarchical drill-down and map visualizations. No treemap, no sunburst, no map chart. Would need multiple plugins to match ECharts baseline. |
| React / Preact | ECharts works as vanilla JS in Astro `<script>` tags. Adding a framework just for chart wrapper components adds unnecessary weight and complexity. |
| Plotly | Large bundle (~3MB), React-oriented, overkill for this use case. |
| rehype-mathjax | KaTeX is faster and lighter. MathJax only needed for LaTeX features beyond basic math (e.g., custom macros, chemistry notation). |
| rehype-citation | Academic citation management overkill for a movement whitepaper. Simple footnotes via remark-gfm + manual reference list is sufficient. Add later if the whitepaper grows to full academic paper length with 50+ citations. |
| @astrojs/netlify adapter | Already validated in v1.0 that static output works without adapter. Adapter only needed for SSR/server islands. Keep static. |
| Any database | All data fetched at build time from public APIs and cached as static JSON. No runtime data layer needed at this scale. |

## World Bank API Indicator Mapping for MIND Framework

The MIND formula is **M x I x N x D = Prosperity**. Each dimension maps to World Bank indicators:

### Material (M) -- Economic Foundation
| Indicator Code | Name | Notes |
|---------------|------|-------|
| NY.GDP.MKTP.CD | GDP (current US$) | Primary economic output |
| NY.GDP.PCAP.CD | GDP per capita (current US$) | Per-person economic capacity |
| SI.POV.DDAY | Poverty headcount ratio ($2.15/day) | Material deprivation floor |
| SL.UEM.TOTL.ZS | Unemployment (% of total labor force) | Labor market health |

### Intelligence (I) -- Knowledge & Innovation
| Indicator Code | Name | Notes |
|---------------|------|-------|
| GB.XPD.RSDV.GD.ZS | R&D expenditure (% of GDP) | Innovation investment |
| IP.PAT.RESD | Patent applications (residents) | Innovation output |
| SE.XPD.TOTL.GD.ZS | Education expenditure (% of GDP) | Knowledge investment |
| SE.TER.ENRR | Tertiary education enrollment (% gross) | Higher education access |

### Network (N) -- Connectivity & Infrastructure
| Indicator Code | Name | Notes |
|---------------|------|-------|
| IT.NET.USER.ZS | Individuals using Internet (%) | Digital connectivity |
| IT.CEL.SETS.P2 | Mobile cellular subscriptions (per 100) | Communication reach |
| IS.RRS.TOTL.KM | Rail lines (total route-km) | Physical infrastructure |
| TG.VAL.TOTL.GD.ZS | Trade (% of GDP) | Economic connectivity |

### Diversity (D) -- Inclusion & Pluralism
| Indicator Code | Name | Notes |
|---------------|------|-------|
| SI.POV.GINI | Gini index (World Bank estimate) | Inequality (invert for diversity) |
| SG.GEN.PARL.ZS | Women in parliament (% of seats) | Gender representation |
| SE.ENR.PRSC.FM.ZS | Gender parity index (primary school) | Educational equality |

**API query pattern:**
```
https://api.worldbank.org/v2/country/{ISO3}/indicator/{CODE}?format=json&date=2015:2024&per_page=100
```

Multiple indicators per call (semicolon-separated):
```
https://api.worldbank.org/v2/country/USA;GBR;JPN/indicator/NY.GDP.PCAP.CD;GB.XPD.RSDV.GD.ZS?format=json&date=2020:2024&per_page=500
```

## Data Fetching Architecture

### Strategy: Build-Time Fetch + Static JSON Cache

```
[Build time - Astro frontmatter]
    1. Fetch World Bank API for ~50 countries, ~15 indicators
    2. Fetch Census API for ~20 US cities  
    3. Fetch SEC EDGAR for ~20 sample firms
    4. Transform raw data -> MIND scores per entity
    5. Write computed scores to static JSON files in src/data/
    6. Astro builds pages with embedded data

[Runtime - Browser]
    - ECharts loads precomputed static JSON via <script> or import
    - Dashboard is fully interactive (drill-down, tooltips, filters)
    - Zero API calls from the browser
    - User-input mode: client-side MIND calculation (no server needed)
```

**Why build-time, not runtime:**
1. World Bank data updates annually -- no need for real-time
2. Zero CORS issues (data is static JSON served from same origin)
3. No API rate limit concerns for visitors
4. Faster page loads (data bundled, not fetched)
5. Works offline once loaded
6. Free -- no serverless function invocations

**Rebuild trigger:** Schedule weekly Netlify build via build hook + cron, or manual rebuild when new World Bank data releases (typically annually in Q2).

### Build Script Pattern

```typescript
// src/data/build-world-bank.ts (run as part of Astro build)
// Called from astro.config.mjs via integration hook or content collection loader

const INDICATORS = [
  'NY.GDP.PCAP.CD', 'GB.XPD.RSDV.GD.ZS', 'IP.PAT.RESD',
  'IT.NET.USER.ZS', 'SI.POV.GINI', 'SE.XPD.TOTL.GD.ZS'
  // ... full list
];

const COUNTRIES = ['USA', 'GBR', 'JPN', 'DEU', 'FRA', 'CHN', 'IND', 'BRA', ...];

async function fetchWorldBankData() {
  const codes = INDICATORS.join(';');
  const countries = COUNTRIES.join(';');
  const url = `https://api.worldbank.org/v2/country/${countries}/indicator/${codes}?format=json&date=2015:2024&per_page=10000`;
  
  const response = await fetch(url);
  const [metadata, data] = await response.json();
  return data;
}
```

## ECharts Integration with Astro Islands

### Pattern: Astro Component with `<script>` Tag

ECharts works in Astro without any framework wrapper. The pattern uses Astro's script processing:

```astro
---
// MindDashboard.astro
import mindScores from '../data/mind-scores.json';
const serializedData = JSON.stringify(mindScores);
---

<div id="mind-dashboard" class="w-full h-[600px]"></div>

<script define:vars={{ serializedData }}>
  // This runs client-side. Astro bundles and deduplicates.
  import('echarts/core').then(async (echarts) => {
    const { BarChart, TreemapChart, RadarChart } = await import('echarts/charts');
    const { TooltipComponent, GridComponent } = await import('echarts/components');
    const { CanvasRenderer } = await import('echarts/renderers');
    
    echarts.use([BarChart, TreemapChart, RadarChart, TooltipComponent, GridComponent, CanvasRenderer]);
    
    const chart = echarts.init(document.getElementById('mind-dashboard'));
    const data = JSON.parse(serializedData);
    chart.setOption(/* ... */);
    
    window.addEventListener('resize', () => chart.resize());
  });
</script>
```

**Alternative pattern for larger dashboards:** Create a standalone `.ts` file in `src/scripts/` that initializes ECharts, imported by an Astro component. Astro bundles it automatically.

### Islands Strategy Update for v1.1

| Component | Island? | Directive | Rationale |
|-----------|---------|-----------|-----------|
| MIND Dashboard (main) | YES | `client:visible` | Heavy (ECharts + data). Defer until user scrolls to dashboard section. Tree-shake ECharts to ~200KB. |
| MIND Radar Chart (per-entity) | YES | `client:visible` | Smaller ECharts instance. Shows M/I/N/D breakdown. Loads when visible. |
| World Map View | YES | `client:visible` | ECharts map + GeoJSON. Largest component. Defer aggressively. |
| User Input Calculator | YES | `client:visible` | "Score Your Firm/City" form. Pure client-side calculation, no API call. |
| Whitepaper Math (KaTeX) | NO | -- | Rendered at build time by rehype-katex. Zero client JS. Static HTML + CSS. |
| Whitepaper Body | NO | -- | Static MDX rendered to HTML at build. `prose` classes handle typography. |
| Whitepaper TOC | MAYBE | `client:idle` | If auto-scroll-spy TOC desired, needs JS. Otherwise static anchor links suffice. |

## Whitepaper Page Architecture

### Content Authoring: MDX in Content Collection

```
src/content/whitepaper/
  mind-framework.mdx      # Main whitepaper content
  references.yaml          # Bibliography data (optional)
```

### MDX Configuration in astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://intelligenteconomics.ai',
  integrations: [
    mdx({
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### CSS Entry Point Update

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* KaTeX CSS for math rendering */
/* Include via <link> in whitepaper layout, or import here */
```

### Whitepaper Layout Pattern

```astro
---
// layouts/WhitepaperLayout.astro
---
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16/dist/katex.min.css" />
</head>
<body>
  <article class="prose prose-lg prose-invert max-w-none lg:max-w-4xl mx-auto">
    <slot />
  </article>
</body>
</html>
```

## Alternatives Considered (v1.1 Specific)

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Charts | Apache ECharts 6 | D3.js | D3 requires 5-10x more code for same charts. ECharts has built-in treemap, sunburst, radar, map, and drill-down transitions. Solo dev project needs speed. |
| Charts | Apache ECharts 6 | Chart.js | No treemap, no map chart, no drill-down. Would need @chartjs/chart-geo and multiple plugins. ECharts is one dependency for everything. |
| Charts | Apache ECharts 6 | Recharts | React dependency. Project has no React. |
| Charts | Apache ECharts 6 | Highcharts | Commercial license required. Budget constraint. ECharts is Apache 2.0 (free). |
| Math | KaTeX via rehype-katex | MathJax | KaTeX is 3x faster render, ~28KB vs ~200KB. Build-time rendering means speed difference is compile-only, but smaller CSS payload matters for page weight. |
| Math | KaTeX via rehype-katex | Plain HTML/CSS | MIND formula is simple, but whitepaper may include economic equations, statistical notation. KaTeX future-proofs with zero runtime cost (build-time only). |
| Whitepaper format | MDX page | Plain .md | Need to embed interactive components (charts, formula visualizers) inline with whitepaper text. Plain markdown cannot import components. |
| Whitepaper format | MDX page | Separate PDF | PDF is not web-native, not indexable by search engines, not accessible, cannot embed interactive visualizations. HTML whitepaper is the product. |
| Typography | @tailwindcss/typography | Custom CSS | Typography plugin provides battle-tested prose styles. Customizing 20+ element styles by hand is error-prone and slow. |
| Typography | @tailwindcss/typography | tw-prose (CSS-only) | Official plugin is better maintained, larger community, documented Astro recipe. CSS-only variant is newer with less adoption. |
| Data fetch | Build-time static | Runtime API calls | World Bank data is annual. Runtime fetch adds CORS complexity, loading states, error handling, and API rate limit risk for visitors. Build-time is simpler and faster. |
| Data fetch | Native fetch() | axios/got | Astro frontmatter supports native `fetch()`. No HTTP client library needed. |
| Country data | World Bank API | OECD API | World Bank covers more countries (217 vs ~38 OECD members). Broader global coverage essential for a "post-GDP" framework. OECD could supplement for richer data on developed nations later. |
| City data | Census ACS API | Manually curated | API provides standardized, updatable data. Manual curation doesn't scale and goes stale. |
| Firm data | SEC EDGAR + user input | Bloomberg/Refinitiv API | Bloomberg costs $24K/year. SEC EDGAR is free. For firms not in EDGAR, user-input hybrid fills gaps. |

## Updated Installation

```bash
# v1.1 additions only (run from project root)

# Whitepaper content pipeline
npm install @astrojs/mdx remark-math rehype-katex remark-gfm

# Typography for whitepaper prose
npm install @tailwindcss/typography

# Data visualization
npm install echarts

# Country map boundaries (optional, can also load GeoJSON at build time)
npm install echarts-countries-js
```

## Updated Performance Budget (v1.1)

| Metric | Target | How |
|--------|--------|-----|
| Lighthouse Desktop | >= 90 | Whitepaper is static HTML (KaTeX rendered at build). Dashboard deferred via `client:visible`. |
| Lighthouse Mobile | >= 75 | ECharts tree-shaken to ~200KB. Loaded only on dashboard page, not homepage. |
| JS Bundle (dashboard page) | < 250KB gzipped | ECharts core (~100KB) + charts (~60KB) + components (~30KB) + renderer (~10KB) = ~200KB. Plus data JSON. |
| JS Bundle (whitepaper page) | < 5KB | Zero JS if no interactive components. KaTeX CSS is ~28KB but that's CSS, not JS. |
| JS Bundle (homepage) | Unchanged | No new JS on homepage. Dashboard and whitepaper are separate pages. |
| KaTeX CSS | ~28KB | Loaded only on whitepaper page via conditional `<link>` in layout. Cached aggressively. |
| Build data JSON | < 500KB | ~50 countries x 15 indicators x 10 years. Compresses well (repetitive structure). |

## Sources

- @astrojs/mdx 5.0.3: https://www.npmjs.com/package/@astrojs/mdx
- @astrojs/mdx docs: https://docs.astro.build/en/guides/integrations-guide/mdx/
- @tailwindcss/typography: https://www.npmjs.com/package/@tailwindcss/typography
- Tailwind Typography + Astro recipe: https://docs.astro.build/en/recipes/tailwind-rendered-markdown/
- Tailwind v4 @plugin directive: https://tailwindcss.com/blog/tailwindcss-v4
- Apache ECharts 6.0: https://www.npmjs.com/package/echarts
- ECharts 6 features: https://echarts.apache.org/handbook/en/basics/release-note/v6-feature/
- ECharts tree-shaking guide: https://apache.github.io/echarts-handbook/en/basics/import/
- ECharts drill-down (dataGroupId): https://echarts.apache.org/handbook/en/basics/release-note/5-2-0/
- ECharts in Astro pattern: https://davidgasquez.com/apache-echarts-astro/
- echarts-countries-js (GeoJSON maps): https://github.com/echarts-maps/echarts-countries-js
- remark-math + rehype-katex: https://github.com/remarkjs/remark-math
- remark-gfm 4.0: https://www.npmjs.com/package/remark-gfm
- rehype-katex 7.0: https://www.npmjs.com/package/rehype-katex
- World Bank API v2 documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-indicator-api-queries
- World Bank indicator browser: https://data.worldbank.org/indicator
- World Bank API basic calls: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures
- SEC EDGAR APIs: https://www.sec.gov/search-filings/edgar-application-programming-interfaces
- SEC EDGAR API guide: https://tldrfiling.com/blog/sec-edgar-api-guide/
- US Census ACS API: https://www.census.gov/programs-surveys/acs/data/data-via-api.html
- Census API developer portal: https://www.census.gov/data/developers/data-sets.html
- Astro data fetching: https://docs.astro.build/en/guides/data-fetching/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro client-side scripts: https://docs.astro.build/en/guides/client-side-scripts/
- D3 vs ECharts comparison: https://medium.com/data-science-collective/d3-js-vs-echarts-when-to-go-custom-when-to-go-fast-2a922c9956b6
- JS charting libraries 2026: https://www.luzmo.com/blog/best-javascript-chart-libraries
