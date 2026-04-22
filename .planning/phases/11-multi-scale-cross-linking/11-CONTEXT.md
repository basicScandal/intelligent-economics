# Phase 11: Multi-Scale + Cross-Linking - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add multi-scale MIND framework demonstration (firm, city, country) to the dashboard with scale navigation, curated city profiles, and firm self-assessment. Create bidirectional linking between the whitepaper and dashboard with inline SVG mini-charts embedded in the whitepaper prose.

</domain>

<decisions>
## Implementation Decisions

### Multi-Scale Data & Navigation
- Tab bar at top of dashboard: "Country" (default), "City", "Firm" — each loads different content in the same page
- City profiles: manually curated JSON file `src/data/city-profiles.json` with 7-8 cities across regions: Singapore, Copenhagen, Austin, Medellín, Kigali, Dubai, Shenzhen. Each has 4 dimension scores (0-100) + brief 1-line context note
- City display: card grid (2-3 per row desktop), showing city name, country flag emoji, 4 dimension scores as colored bars, overall MIND score, context note. Click/tap for detail view with radar chart
- Firm self-assessment: reuse Zone Zero slider pattern — 4 sliders (M/I/N/D, 0-100) with live MIND score and binding constraint callout. Uses existing `calcScore()` and `getBindingConstraint()` from shared library. No saved state

### Cross-Linking & Inline Charts
- Inline mini-charts (LINK-01): custom MDX component `<MindRadar country="DNK" />` rendered at build time as static SVG inline in whitepaper prose. No ECharts in whitepaper — zero JS. SVG generated from country data during Astro build
- SVG generation: build-time Astro component using template literals for basic radar polygon math (~150x150px). No external SVG library
- Whitepaper → Dashboard links (LINK-02): inline links like "Explore Denmark's full profile →" linking to `/dashboard/?country=DNK`. Dashboard URL hydration (Phase 10) handles state restore
- Dashboard → Whitepaper links: "Learn more about MIND methodology →" in methodology panel and "Read the whitepaper →" in dashboard header. Simple `<a>` tags to `/whitepaper`

### Claude's Discretion
- Exact city dimension scores (manually estimated)
- City context note text
- Tab bar styling and active state
- Firm self-assessment layout (side-by-side sliders vs stacked)
- SVG mini-chart visual style (colors, axis labels, size)
- Exact placement of cross-links in whitepaper prose
- Dashboard breadcrumb when referred from whitepaper

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/mind-score.ts` — calcScore(), getBindingConstraint() for firm self-assessment
- `src/scripts/zone-zero.ts` — slider pattern, dimension colors, health states, insight texts
- `src/data/mind-scores.json` — country data for inline mini-charts
- `src/scripts/dashboard/state.ts` — pub/sub store, extend for scale tabs
- `src/scripts/dashboard/charts.ts` — radar/bar chart configs, extend for city radar
- `src/pages/dashboard.astro` — dashboard page to extend with tab bar and new sections

### Established Patterns
- ECharts with tree-shaken imports and SVG renderer
- IntersectionObserver for lazy loading
- Build-time data processing in Astro frontmatter
- MDX content collection with remark/rehype plugins
- URL state encoding via query params

### Integration Points
- Extend `dashboard.astro` with tab navigation and city/firm sections
- Extend `init.ts` with tab switching logic and firm slider wiring
- Add new city data file and city card components
- Add `<MindRadar />` MDX component for whitepaper inline charts
- Add cross-link `<a>` tags in both whitepaper and dashboard

</code_context>

<specifics>
## Specific Ideas

- The firm self-assessment should feel like a lightweight version of Zone Zero — same slider UX but without the particle visualization
- City profiles should span diverse development levels: Singapore (high-tech hub), Copenhagen (sustainability model), Austin (innovation ecosystem), Medellín (transformation story), Kigali (leapfrog development), Dubai (wealth-driven), Shenzhen (manufacturing to innovation)
- The whitepaper inline charts should appear in the Country Analysis section, next to each country profile paragraph

</specifics>

<deferred>
## Deferred Ideas

- Automated city data from Census ACS — v1.2 (DATA-05)
- Automated firm data from SEC EDGAR — v1.2 (DATA-06)
- Full aggregation visualization — Phase 12 (AGG-01)

</deferred>
