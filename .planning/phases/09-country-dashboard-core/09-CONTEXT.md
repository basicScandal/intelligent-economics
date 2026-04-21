# Phase 9: Country Dashboard Core - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the /dashboard page — an interactive country-level MIND score explorer with radar charts, bar chart comparison, country search, binding constraint callouts, methodology transparency, and a server-rendered ranking table for progressive enhancement. Policy practitioners can explore MIND scores for any of 217 countries backed by real World Bank data from Phase 7.

</domain>

<decisions>
## Implementation Decisions

### Dashboard Layout & Interaction Design
- Page structure: Top search bar → Middle: selected country detail (radar chart + binding constraint callout + methodology panel) → Bottom: multi-country comparison bar chart. Single page, sections appear as countries are selected
- Hybrid selection model: primary country shows radar + callout detail; up to 4 countries can be added for the comparison bar chart. Primary selection drives the detail view, comparison is secondary
- Default state (before selection): server-rendered ranking table showing top 20 countries by MIND score with search bar above. Satisfies DASH-07 progressive enhancement — content visible before JS loads
- Chart colors: existing Zone Zero dimension colors — M=#00ff88 (green), I=#00c8ff (blue), N=#7b4bff (purple), D=#ffb400 (gold). Consistent across the site

### Chart Technology & Hydration
- ECharts 6 loaded via Astro island with `client:visible` directive — only loads when dashboard enters viewport. Import radar and bar chart types only (not full library)
- Data injection: static import of `mind-scores.json` in Astro page, passed as `data-scores` attribute on chart container. Island script reads at hydration time — zero runtime API calls
- Progressive enhancement: Astro generates a static HTML `<table>` of top 20 countries (sorted by MIND score) from `mind-scores.json` at build time. Visible immediately. ECharts overlays after hydration
- Methodology transparency panel (DATA-04): expandable HTML `<details>` accordion per dimension showing which 4 World Bank indicators feed it, with indicator codes and descriptions. Collapsed by default, no JS needed

### Search UX & Mobile Responsiveness
- Client-side fuzzy search: case-insensitive substring matching over 217 country names from JSON data. Keyboard navigable dropdown (arrow keys + Enter). Astro island with `client:idle`
- Mobile layout (<768px): single column stack — search → radar chart (full width, smaller) → binding constraint callout → methodology panel → comparison bar chart (horizontal bars instead of vertical). TOC/sidebar hidden
- Chart accessibility: each chart has `aria-label` describing the data, plus visually-hidden `<table>` equivalent rendered by Astro at build time. ECharts `aria` option enabled
- Data attribution (DASH-05): small caption below each chart — "Source: World Bank World Development Indicators, {year}. Accessed {date}." Read from metadata in `mind-scores.json`

### Claude's Discretion
- ECharts chart configuration details (animation, tooltip formatting, legend position)
- Exact search dropdown styling and positioning
- Radar chart axis label placement and sizing
- Bar chart orientation and grouping logic for multi-country comparison
- Responsive breakpoint fine-tuning
- Loading/hydration transition animation (if any)
- Ranking table column selection and sorting

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/mind-scores.json` — 217 countries, 16 indicators, normalized dimension scores, MIND score, binding constraint, metadata (year, source, accessedDate)
- `src/lib/mind-score.ts` — calcScore(), getBindingConstraint(), normalize(), type definitions
- `src/scripts/zone-zero.ts` — dimension colors (M=#00ff88, I=#00c8ff, N=#7b4bff, D=#ffb400), health state thresholds, insight texts
- `src/layouts/BaseLayout.astro` — base layout with `<slot name="head" />` for meta injection
- `src/styles/global.css` — OKLCH design tokens, Tailwind utilities

### Established Patterns
- Astro islands: `client:visible` for heavy components, `client:idle` for non-critical interactive elements
- Content collections with zod schemas and glob loaders
- TypeScript strict mode throughout
- 3-tier device capability detection (full/reduced/minimal)
- IntersectionObserver for render-pause and scroll-spy

### Integration Points
- New page at `src/pages/dashboard.astro`
- New components: `DashboardApp.astro` (island wrapper), chart components
- `package.json` needs `echarts` dependency
- Future Phase 10 will add: side-by-side comparison, Zone Zero integration, bookmarkable URLs
- Future Phase 11 will add: multi-scale navigation, city/firm data
- Nav link deferred to Phase 12 (NAV-01)

</code_context>

<specifics>
## Specific Ideas

- The radar chart should visually match the Zone Zero particle cluster layout conceptually — 4 dimensions at the corners
- Binding constraint callout should reuse the insight text pattern from zone-zero.ts DIM_INSIGHTS
- The methodology panel should list all 16 World Bank indicators organized by dimension, showing indicator code, name, and what it measures
- Search results should show country name + MIND score in the dropdown for quick scanning
- The ranking table should include: Rank, Country, MIND Score, M, I, N, D, Binding Constraint columns

</specifics>

<deferred>
## Deferred Ideas

- Side-by-side comparison overlay on radar charts — Phase 10 (DASH-08)
- Zone Zero integration with real data pre-loading — Phase 10 (DASH-09)
- Bookmarkable dashboard URLs — Phase 10 (DASH-10)
- Multi-scale navigation (firm/city/country) — Phase 11 (SCALE-03)
- Nav link to dashboard — Phase 12 (NAV-01)

</deferred>
