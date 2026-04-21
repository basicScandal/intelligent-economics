# Project Research Summary

**Project:** Intelligent Economics — MIND Intelligence Layer (v1.1)
**Domain:** Policy-oriented academic whitepaper + interactive multi-scale economic dashboard added to existing Astro movement site
**Researched:** 2026-04-21
**Confidence:** HIGH

## Executive Summary

This milestone extends an already-complete Astro 5.x movement site with two new capabilities: a publishable HTML whitepaper for the MIND framework, and an interactive multi-scale dashboard backed by real World Bank data. The foundational stack (Astro, Tailwind v4, Three.js, GSAP, Netlify Forms, MailerLite) is validated and unchanged. New additions are narrow and justified: MDX + @tailwindcss/typography for the whitepaper, Apache ECharts 6 for the dashboard, and a build-time World Bank API data pipeline. The architecture extends cleanly without introducing frameworks, SSR, or runtime data fetching.

The critical strategic posture for this milestone is data-first design. The MIND framework covers four dimensions at four scale levels (firm, city, country, global), but publicly available free data is essentially only reliable at the country level via the World Bank API. City data is US-only for large populations via Census ACS. Firm-level data does not exist via free public APIs — the user-input self-assessment model IS the firm experience, not a fallback. Building UX before confirming data availability is the single most likely way this milestone fails. Every design decision must start with "what data actually exists for this."

The main technical risks are dashboard performance (the new ECharts island + existing Three.js must stay within the 200KB JS budget by keeping dashboard on its own /dashboard route), build-time data brittleness (World Bank API must never block a deploy — commit a JSON snapshot and refresh on a schedule), and aggregation methodology (the multiplicative MIND formula must be defined in the whitepaper before the dashboard implements it, or credibility suffers). These risks are all preventable with the right phase order: shared library extraction and data inventory before any UI work.

## Key Findings

### Recommended Stack

The v1.0 stack is unchanged. The v1.1 additions are: `@astrojs/mdx` (5.0.x) for whitepaper content collection with inline interactive components; `@tailwindcss/typography` (0.5.x) for prose styles via `@plugin` directive; `remark-math` + `rehype-katex` for build-time math rendering (zero client JS — KaTeX produces static HTML); `remark-gfm` for footnotes (required explicitly when custom remark plugins are added). For the dashboard: Apache ECharts 6 (tree-shakeable ES modules, built-in radar/bar/treemap/map, no React dependency, Apache 2.0 license). Data: World Bank API v2 (free, no key, 217 countries, CORS-safe from Node.js). Architecture research prefers Chart.js 4.4 for simplicity; STACK.md prefers ECharts 6 for feature depth. Resolution: use ECharts — it handles treemap/sunburst/drill-down/map that Chart.js cannot without plugins.

**Core new technologies:**
- `@astrojs/mdx` 5.0.x: MDX content collection for whitepaper — enables embedding interactive Astro components inline with prose
- `@tailwindcss/typography` 0.5.x: Battle-tested prose styles, avoids writing 20+ custom element overrides
- `rehype-katex` 7.0.x + `remark-math` 7.0.x: Build-time math rendering, zero runtime JS, ~28KB CSS only on whitepaper page
- Apache ECharts 6.0.x: Hierarchical drill-down, radar, bar, world map — one dependency, Apache 2.0, tree-shakeable to ~200KB
- World Bank API v2: 217 countries, 1600+ indicators, free, no key required, annual data suitable for build-time fetch

**Do not add:** D3.js (5-10x more code for same charts), React/Preact (no reason — ECharts is vanilla JS), Plotly (3MB bundle), any database (all data is static JSON).

### Expected Features

**Must have (whitepaper):**
- Structured long-form HTML page: title, abstract, sections, subsections, TOC, citations
- Sticky TOC sidebar with scroll-spy highlighting (IntersectionObserver, Astro `getHeadings()`)
- Responsive reading layout (65-75 char line length, sidebar collapses to top-nav on mobile)
- Print/PDF-friendly CSS (`@media print`, linearized layout, no Puppeteer needed)
- Citation and reference formatting (remark-gfm footnote syntax sufficient for v1.1)
- Social sharing meta tags (og:title, og:description, og:image with designed card)

**Must have (dashboard):**
- Country-level MIND score visualization for 217 countries (World Bank data)
- Radar chart showing M/I/N/D dimension balance per country
- Bar chart comparing dimensions across countries
- Country search/selection
- Binding constraint identification ("Nigeria's binding constraint is Network at 31")
- Data source attribution with vintage year on every chart
- Loading and error states (never show a blank panel)
- Mobile-responsive charts

**Should have (differentiators):**
- Multi-scale drill-down (country first, city as 5-10 curated showcase, firm as user-input only)
- Side-by-side country comparison (2-4 countries, overlaid radar charts)
- Zone Zero integration: "See this country in the simulator" pre-loads real MIND scores via existing URL param system
- Whitepaper-dashboard cross-linking: MDX inline `<MindMiniChart />` widgets embedded in whitepaper prose
- MIND methodology transparency panel (which World Bank indicators feed each dimension)
- Hierarchical aggregation visualization (firm scores compose to city, city to country, etc.)

**Defer to post-v1.1:**
- Time-series animation (Gapminder-style) — high complexity, data is available, defer to v1.2
- Choropleth world map — adds 1-2MB GeoJSON, minimal analytical value over sortable table
- Custom indicator selection — undermines the opinionated MIND methodology
- User accounts — URL state encoding is sufficient, no backend exists
- Automated city/firm data from APIs — does not exist as free public data

### Architecture Approach

The existing single-page `index.astro` is untouched. Two new routes are added: `/whitepaper` (MDX content collection rendered with WhitepaperLayout) and `/dashboard` (dashboard page composing ECharts islands). Shared MIND score logic is extracted from `zone-zero.ts` into `src/lib/mind-score.ts` so both Zone Zero and the dashboard produce identical scores. World Bank data is fetched via a standalone Node.js script (`npm run fetch-data`), written to `src/data/dashboard-data.json` (committed to git), and injected into the dashboard page at build time via `data-*` attributes. No SSR, no runtime API calls from the browser, no framework islands.

**Major components:**
1. `src/lib/mind-score.ts` — shared `calcScore()`, `getHealthState()`, `getBindingConstraint()`, `normalize()` — single source of truth for all MIND math
2. `src/lib/world-bank-loader.ts` + `scripts/fetch-data.ts` — build-time data pipeline; transforms World Bank API v2 responses into normalized 0-100 MIND scores per country
3. `src/data/dashboard-data.json` — committed baseline; updated by `npm run fetch-data`; decouples data freshness from site deployability
4. `src/layouts/WhitepaperLayout.astro` — two-column layout: sticky TOC sidebar + prose content area; no Three.js/GSAP loaded
5. `src/content/whitepaper/mind-framework.mdx` — whitepaper content as MDX; embeds `<MindEquation />`, `<Callout />`, `<MindMiniChart />` components inline
6. `src/components/dashboard/DashboardPanel.astro` — ECharts container with data injected via `data-countries` attribute; script reads on hydration
7. `src/scripts/dashboard.ts` — client-side ECharts initialization, country selection, scale switching; imports from `mind-score.ts`

**Key patterns:**
- Build-time data injection via `data-*` attributes (matches existing Zone Zero `data-target` pattern)
- Progressive enhancement: server-render a country ranking table as static HTML; JavaScript replaces with interactive charts
- Page-specific layouts (WhitepaperLayout, DashboardLayout) that extend BaseLayout patterns without polluting global styles
- Shared library extraction: any logic used by more than one module lives in `src/lib/`

### Critical Pitfalls

1. **Firm/City Data Desert** — No free public APIs provide MIND-relevant data for most firms and cities. Inventory data availability per scale level BEFORE designing UX. The user-input self-assessment IS the firm-level experience, not a fallback.

2. **Build-Time Fetch Brittleness** — World Bank API outage during `astro build` fails the deploy. Commit baseline `dashboard-data.json` to git. Run `npm run fetch-data` on a schedule separate from deploys. Site must build with network disconnected.

3. **Dashboard Performance Budget Breach** — ECharts + Three.js combined exceed 200KB if co-located. Keep dashboard on its own `/dashboard` route. Use `client:visible` + dynamic `import()` for ECharts. Dashboard page JS budget: ~200KB gzipped.

4. **Aggregation Math Mismatch** — Arithmetic mean of multiplicative MIND scores hides zeros. Define aggregation methodology in the whitepaper (geometric mean preserves zero-floor) before implementing dashboard aggregation logic. Methodology must precede code.

5. **Stale Data Without Timestamps** — World Bank data is typically 1-3 years behind. Make `source`, `year`, and `accessedDate` first-class schema fields from day one. Every chart must display vintage year.

6. **CORS Blocking in Production** — World Bank API CORS behavior undocumented for browser use. All client-side data fetching (if any) must route through a Netlify Function proxy. Primary architecture uses build-time data, so this is a safety constraint for future drill-down features.

## Implications for Roadmap

Based on the dependency chain across all four research files, the natural phase structure is:

### Phase 1: Shared Foundation + Data Inventory
**Rationale:** Everything downstream depends on (a) the shared MIND score library and (b) confirmed data availability per scale level. Starting with UI design before data inventory is the most common failure mode identified in PITFALLS.md. Zone Zero refactor proves the extraction works before adding new features.
**Delivers:** `src/lib/mind-score.ts` extracted and tested; Zone Zero refactored to import from it; `src/lib/indicators.ts` with World Bank indicator mapping and normalization functions; `src/data/dashboard-data.json` baseline fetch; data availability confirmed per scale level; API roster locked at max 3 sources (World Bank, Census ACS, SEC EDGAR); data schema with `source`, `year`, `accessedDate` fields defined
**Addresses:** Data pipeline foundation, MIND score consistency across all features
**Avoids:** Firm/City Data Desert, Build-Time Brittleness, API Source Proliferation, Stale Data, Aggregation Math Mismatch

### Phase 2: Whitepaper
**Rationale:** Zero dependency on the data pipeline — can ship independently. Establishes intellectual credibility before the dashboard exists. Also must define the aggregation methodology that Phase 3 implements.
**Delivers:** `/whitepaper` route with MDX content, sticky TOC sidebar, responsive reading layout, print CSS, remark-gfm footnotes, social meta tags; WhitepaperLayout with scoped typography; whitepaper MDX with embedded `<MindEquation />` and `<Callout />` components; aggregation methodology formally documented
**Uses:** `@astrojs/mdx`, `@tailwindcss/typography`, `remark-math`, `rehype-katex`, `remark-gfm`
**Avoids:** Whitepaper Content Destroying Site Cohesion (dedicated layout, no Three.js/GSAP loaded on whitepaper page), Aggregation Math Mismatch (define before building)

### Phase 3: Country Dashboard Core
**Rationale:** Phase 1 provides shared score library and baseline data JSON. Phase 2 provides the aggregation methodology definition. Dashboard can now be built on solid foundation.
**Delivers:** `/dashboard` route with ECharts radar + bar charts for 217 countries; country search/selection; binding constraint callout; data source attribution with vintage year; loading + error states; mobile-responsive layout; progressive enhancement (server-rendered ranking table before JS)
**Uses:** Apache ECharts 6 (tree-shaken to ~200KB, `client:visible`), `src/lib/mind-score.ts`, `src/data/dashboard-data.json`
**Implements:** DashboardPanel, ScaleSelector, data-attribute injection pattern
**Avoids:** Dashboard Performance Budget Breach (own route, `client:visible`, dynamic imports), CORS Blocking

### Phase 4: Country Comparison + Zone Zero Integration
**Rationale:** Moderate effort on top of Phase 3. High value for policy practitioners. Zone Zero pre-loading requires only URL parameter extension — the system already exists.
**Delivers:** 2-4 country comparison with overlaid radar charts; "Compare with..." UI; "See this country in the simulator" button pre-loading Zone Zero with real MIND scores; bookmarkable `/dashboard?countries=NGA,JPN,BRA&view=radar` URLs; social sharing extended from Zone Zero pattern; Plausible custom events for dashboard interactions

### Phase 5: Whitepaper-Dashboard Cross-Linking + City/Firm Scales
**Rationale:** Requires both whitepaper (Phase 2) and dashboard (Phase 3+4). City and firm scales are the multi-scale differentiator but require curated data assembly (city) and self-assessment UX (firm).
**Delivers:** MDX inline `<MindMiniChart country="NGA" />` widgets embedded in whitepaper; bidirectional whitepaper/dashboard linking; 5-10 curated showcase city profiles with manually assembled MIND indicators; firm self-assessment UI (Zone Zero slider pattern reused); "Submit your city's data" form for community expansion

### Phase 6: Hierarchical Aggregation Visualization + Polish
**Rationale:** The aggregation tree is the "aha moment" for the framework but requires all four scale levels to be meaningful. Comes last.
**Delivers:** `AggregationTree.astro` — SVG hierarchical composition showing how MIND scores roll up across scales; Nav updates (Whitepaper and Dashboard links); full accessibility audit (screen reader alternatives for charts, aria-labels); Lighthouse audit on dashboard page (mobile >= 75 target)

### Phase Ordering Rationale

- Phase 1 before everything: shared score library is a blocking dependency for Zone Zero refactor and dashboard. Data inventory prevents UX built on data that doesn't exist.
- Phases 2 and 3 can run in parallel after Phase 1 — they share no dependencies beyond the shared score lib.
- Phase 3 before Phase 4: comparison view is an extension of single-country view.
- Phase 5 requires Phases 2+3+4 to cross-link meaningfully.
- Phase 6 requires all scales to exist before the aggregation visualization is coherent.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Data Inventory):** World Bank indicator coverage varies by country and year. Normalization methodology (min-max bounds, null value handling, regional median gap-fill) needs validation against actual API responses. Run `npm run fetch-data` early and inspect real data gaps before finalizing the schema.
- **Phase 3 (ECharts data injection):** The `define:vars` pattern with 80KB+ JSON payloads is standard but untested at this data volume. Validate with a prototype before committing — alternative is a separate JSON fetch that's explicitly isolated to the `/dashboard` route.
- **Phase 5 (City Data Assembly):** Manual curation of 5-10 city profiles requires deciding which indicators to use for non-US cities where Census ACS doesn't apply. This is a methodology decision, not just a data task — needs explicit scoping before the phase begins.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Whitepaper):** MDX content collections in Astro are well-documented with official recipes. `getHeadings()` + IntersectionObserver TOC is a solved pattern. No surprises expected.
- **Phase 4 (Zone Zero Integration):** URL parameter system already exists and works. Extending it to accept a `country` parameter is a small, low-risk change.
- **Phase 6 (Polish/Analytics):** Plausible custom events already implemented for 6 events in v1.0. Extension is straightforward.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against live npm packages and official docs. One disagreement between ARCHITECTURE.md (Chart.js) and STACK.md (ECharts) — resolved in favor of ECharts for feature depth. |
| Features | HIGH | Validated against live World Bank API (CORS confirmed, indicator coverage assessed). Competitive analysis against UNDP HDI, OECD Better Life Index, Gapminder is thorough. |
| Architecture | HIGH | Based on analysis of existing v1.0 codebase (14+ components). Recommended patterns all match existing Zone Zero/MindDashboard patterns — no greenfield assumptions. |
| Pitfalls | HIGH | World Bank ESG data coverage gaps independently verified. CORS behavior confirmed. Rate limits documented with sources. Aggregation math pitfall is analytically correct. |

**Overall confidence:** HIGH

### Gaps to Address

- **Normalization bounds for World Bank indicators:** Min-max normalization requires deciding whether bounds are theoretical (0-100 for percentages) or empirical (min/max in current dataset). Empirical bounds shift as countries change. Resolve in Phase 1 and document in `indicators.ts`.

- **Aggregation formula for multi-scale:** Geometric mean preserves zero-floor, but the whitepaper must specify how to weight firms within a city (equally? by employment? by revenue?). This weighting choice significantly affects city MIND scores. Resolve in Phase 2 (whitepaper) before Phase 5 (city scale).

- **ECharts `define:vars` payload size:** Architecture calls for injecting ~80KB JSON via data attributes. Validate this approach with a prototype — if Astro's bundler double-serializes the data, switch to a separate static JSON import on the `/dashboard` route.

- **Census ACS API key for production:** Free Census API without a key is rate-limited to 500 queries/day per IP. A Netlify build with city data needs a Census API key as a Netlify environment variable. Free (instant registration) but must be set up before Phase 5.

- **Chart.js vs ECharts decision:** ARCHITECTURE.md recommends Chart.js 4.4 for simplicity; STACK.md recommends ECharts 6 for feature depth. This summary resolves in favor of ECharts. The roadmapper should note this and flag it for confirmation before Phase 3 begins.

## Sources

### Primary (HIGH confidence)
- World Bank API v2 documentation — indicator codes, CORS behavior, pagination (verified live 2026-04-21)
- Astro 5.x docs — content collections, MDX integration, `getHeadings()`, client directives, islands architecture
- Apache ECharts 6 documentation — tree-shaking, ECharts-in-Astro pattern, drill-down with dataGroupId
- Tailwind CSS v4 + `@tailwindcss/vite` — Vite-native, no PostCSS config, `@plugin` directive
- remark-math + rehype-katex — build-time math rendering, npm versions confirmed
- World Bank ESG data coverage gaps research — 50%+ indicators missing for most recent year
- Netlify Forms usage and billing docs — free unlimited on new credit-based plans

### Secondary (MEDIUM confidence)
- Census ACS API rate limits and coverage — 65,000+ population threshold for single-year estimates
- SEC EDGAR API — 10 req/sec limit, User-Agent requirement; cannot meaningfully yield MIND data without NLP
- ECharts vs D3 comparison — multiple independent sources agree ECharts is better fit for standard chart types
- echarts-countries-js — community-maintained GeoJSON, stable but not official ECharts project

### Tertiary (LOW confidence)
- Aggregation methodology for hierarchical MIND scores — inferred from multiplicative framework philosophy; not yet formally specified in whitepaper
- OECD vs World Bank indicator coverage for Beyond GDP frameworks — summary from secondary literature, not direct API comparison

---
*Research completed: 2026-04-21*
*Ready for roadmap: yes*
