# Phase 12: Aggregation Visualization + Polish - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Final milestone phase: add hierarchical aggregation visualization showing MIND score composition across scales, update site navigation with Whitepaper and Dashboard links, audit all charts for accessibility (WCAG 2.1 AA), and verify Lighthouse performance targets are met on the dashboard page.

</domain>

<decisions>
## Implementation Decisions

### Aggregation Visualization (AGG-01)
- Interactive SVG pyramid/tree diagram showing 3 levels: Firm (bottom) → City (middle) → Country (top). Each node shows a sample MIND score
- Click a level to navigate to that tab on the dashboard
- Built with SVG + CSS (not ECharts) — keep it lightweight, no additional library
- Placed on the index page between Zone Zero and the CTA section, titled "MIND Across Scales"
- Also linked from dashboard methodology panel

### Navigation (NAV-01)
- Add "Whitepaper" and "Dashboard" links to existing Nav component, visible on all pages
- Place after existing nav items, before any CTA button
- Match existing nav link styling — no special treatment
- Mobile hamburger menu: new items appear in the same list

### Accessibility (A11Y-01)
- Audit all ECharts instances: verify `aria-label` on every chart container
- Ensure hidden `<table>` alternatives (sr-only) exist for each chart with full data description
- Chart text alternatives format: "Denmark MIND score: 56. Material: 89, Intelligence: 66, Network: 31, Diversity: 54. Binding constraint: Network."
- Verify all interactive elements have keyboard support (search, tabs, sliders, city cards)
- Verify color contrast meets WCAG AA on all chart colors against dark background
- Fix anything missing from prior phases

### Performance (PERF-01)
- Run Lighthouse CI on /dashboard page
- Target: >= 90 desktop, >= 75 mobile
- Key mitigations already in place: ECharts via IntersectionObserver, search via requestIdleCallback, SVG renderer
- Fix any remaining issues: image optimization, CSS purging, font loading, render-blocking resources

### Claude's Discretion
- Aggregation pyramid visual design (colors, node shapes, animation)
- Exact sr-only text wording per chart instance
- Lighthouse optimization specifics (case-by-case fixes)
- Nav link ordering relative to existing items
- Whether to add focus indicators or skip-to-content links

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/Nav.astro` — existing navigation to extend
- `src/pages/index.astro` — main page to add aggregation section
- All dashboard chart containers already have `aria-hidden="true"` that need updating
- ECharts `aria` option already imported in `echarts-setup.ts` (AriaComponent)
- `src/scripts/dashboard/init.ts` — already sets aria-labels on some charts dynamically

### Established Patterns
- Tailwind utility classes for responsive design
- OKLCH design tokens for color consistency
- IntersectionObserver for deferred loading
- Build-time data processing in Astro frontmatter

### Integration Points
- `Nav.astro` — add 2 new links
- `index.astro` — add aggregation section
- `dashboard.astro` — add sr-only text alternatives
- `init.ts` — ensure dynamic aria-labels on all chart renders
- Lighthouse CI — run and verify

</code_context>

<specifics>
## Specific Ideas

- The aggregation pyramid should visually connect to the bioluminescent design language — use the OKLCH accent colors for nodes
- Each pyramid level should show: icon, scale name, sample score, brief label
- The sr-only chart descriptions should be generated at the same time as chart rendering, not hardcoded

</specifics>

<deferred>
## Deferred Ideas

- Time-series animation (Gapminder-style) — v1.2 (DASH-11)
- Choropleth world map — v1.2 (DASH-12)
- Custom indicator selection — v1.2 (DASH-13)
- Automated city data from Census ACS — v1.2 (DATA-05)
- Automated firm data from SEC EDGAR — v1.2 (DATA-06)

</deferred>
