# Roadmap: Intelligent Economics

## Milestones

- v1.0 Global Growth Foundation -- Phases 1-6 (shipped 2026-04-21)
- v1.1 MIND Intelligence Layer -- Phases 7-12 (shipped 2026-04-22)
- v1.2 Data Visualization Upgrades -- Phases 13-17 (in progress)

## Phases

<details>
<summary>v1.0 Global Growth Foundation (Phases 1-6) -- SHIPPED 2026-04-21</summary>

- [x] Phase 1: Foundation and Deploy (2/2 plans) -- completed 2026-04-21
- [x] Phase 2: Content Migration (4/4 plans) -- completed 2026-04-21
- [x] Phase 3: Conversion Pipeline (3/3 plans) -- completed 2026-04-21
- [x] Phase 4: Analytics and Tracking (1/1 plan) -- completed 2026-04-21
- [x] Phase 5: Performance Optimization (2/2 plans) -- completed 2026-04-21
- [x] Phase 6: Growth Engine (2/2 plans) -- completed 2026-04-21

Full details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

<details>
<summary>v1.1 MIND Intelligence Layer (Phases 7-12) -- SHIPPED 2026-04-22</summary>

- [x] Phase 7: Shared Foundation + Data Pipeline (2/2 plans) -- completed 2026-04-21
- [x] Phase 8: Whitepaper (2/2 plans) -- completed 2026-04-22
- [x] Phase 9: Country Dashboard Core (3/3 plans) -- completed 2026-04-21
- [x] Phase 10: Dashboard Advanced (2/2 plans) -- completed 2026-04-22
- [x] Phase 11: Multi-Scale + Cross-Linking (3/3 plans) -- completed 2026-04-22
- [x] Phase 12: Aggregation Visualization + Polish (2/2 plans) -- completed 2026-04-22

Full details: See v1.1 archive at bottom of this file.

</details>

### v1.2 Data Visualization Upgrades (In Progress)

**Milestone Goal:** Elevate the MIND dashboard from a static country explorer into a dynamic analytical platform with geographic visualization, temporal analysis, and researcher-grade indicator customization.

- [ ] **Phase 13: Historical Data Pipeline** - Extend World Bank fetch to 10 years of historical data with year-indexed storage
- [ ] **Phase 14: World Map** - Choropleth world map tab with country selection, tooltips, legend, and dimension toggle
- [ ] **Phase 15: Time-Series Visualization** - Animated time-series charts with playback controls, year slider, and map integration
- [ ] **Phase 16: Custom Indicator Explorer** - Indicator selection panel with toggle, weight display, and dynamic score recalculation
- [ ] **Phase 17: Comparison Upgrades + Polish** - Data table, CSV export, shareable URLs, map multi-select, accessibility, and performance verification

## Phase Details

### Phase 13: Historical Data Pipeline
**Goal**: The data layer supports year-indexed MIND scores so that all downstream visualizations can query any year from 2014 to 2024
**Depends on**: Phase 12 (v1.1 complete)
**Requirements**: TIME-01
**Success Criteria** (what must be TRUE):
  1. Running the fetch script produces a committed JSON file containing MIND dimension scores for 217 countries across 10 years (2014-2024)
  2. The existing single-year dashboard still works identically -- selecting a country shows the same scores as before the data expansion
  3. The shared MIND score library accepts a year parameter and returns the correct historical scores for that year
  4. The site builds successfully offline using the committed historical JSON baseline without any network calls
**Plans**: TBD

### Phase 14: World Map
**Goal**: Users can visually explore MIND scores across the entire world through a geographic choropleth and drill into any country by clicking it
**Depends on**: Phase 13 (year-indexed data for dimension toggle baseline)
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-06, INT-01
**Success Criteria** (what must be TRUE):
  1. A "Map" tab appears alongside Country/City/Firm in the dashboard, and clicking it displays a color-coded world map showing MIND composite scores for all 217 countries
  2. Hovering over any country on the map shows a tooltip with the country name, MIND composite score, and binding constraint dimension
  3. Clicking a country on the map selects it in the dashboard state, updating the radar chart and binding constraint callout to reflect that country
  4. A color scale legend is visible alongside the map showing what score ranges the colors represent
  5. A dimension toggle lets users switch the map coloring between composite MIND score and individual M/I/N/D dimensions, and the map recolors immediately
**Plans**: TBD
**UI hint**: yes

### Phase 15: Time-Series Visualization
**Goal**: Users can watch how any country's MIND score has evolved over the past decade and compare trajectories across multiple countries
**Depends on**: Phase 13 (historical data), Phase 14 (world map for TIME-05 integration)
**Requirements**: TIME-02, TIME-03, TIME-04, TIME-05, TIME-06
**Success Criteria** (what must be TRUE):
  1. Selecting a country shows a line chart plotting its MIND composite and dimension scores from 2014 to 2024
  2. Play/pause controls animate through years automatically, and a speed toggle changes the animation pace
  3. A year slider lets users scrub to any year manually, and the selected year updates all dashboard charts to show that year's data
  4. When a year is selected (via slider or playback), the world map recolors to reflect that year's MIND scores
  5. Users can overlay 2-4 countries on the same time-series chart to compare their MIND score trajectories over time
**Plans**: TBD
**UI hint**: yes

### Phase 16: Custom Indicator Explorer
**Goal**: Researchers can select which World Bank indicators contribute to MIND scores and see how their choices change country rankings
**Depends on**: Phase 13 (historical data for recalculation)
**Requirements**: IND-01, IND-02, IND-03, IND-04
**Success Criteria** (what must be TRUE):
  1. An indicator selection panel lists all 16 World Bank indicators grouped under their MIND dimension (M/I/N/D), with each indicator togglable on/off
  2. Toggling an indicator off immediately recalculates MIND scores for the selected country and updates all visible charts (radar, bar, map)
  3. A visual weight display shows each active indicator's proportional contribution to its dimension score
  4. A "Reset to default" button restores the standard 16-indicator set and recalculates scores to match the original methodology
**Plans**: TBD
**UI hint**: yes

### Phase 17: Comparison Upgrades + Polish
**Goal**: The comparison workflow is complete with exportable data, shareable URLs, map-driven multi-select, and all new visualizations meet accessibility and performance standards
**Depends on**: Phase 14 (world map for COMP-04), Phase 15 (time-series charts for INT-02 scope), Phase 16 (indicator explorer for INT-02 scope)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, INT-02, INT-03, INT-04
**Success Criteria** (what must be TRUE):
  1. A sortable data table shows all compared countries with columns for each MIND dimension and composite score, and clicking a column header re-sorts the table
  2. Users can download the comparison data as a CSV file that opens correctly in Excel/Sheets
  3. The browser URL encodes the current comparison state (selected countries, active view, active year), and sharing that URL restores the exact view for another user
  4. Users can multi-select countries directly from the world map (shift-click or equivalent) to build comparisons without using the search box
  5. All new charts (map, time-series, indicator panel) have screen reader text alternatives and the map tab is usable on mobile in a stacked layout
  6. The dashboard page maintains Lighthouse scores of >= 90 desktop and >= 75 mobile after all new features are added
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phase 13 first (data foundation). Phase 14 after 13. Phase 15 after 13 + 14. Phase 16 after 13 (can run parallel with 15). Phase 17 after 14 + 15 + 16.
13 -> 14 -> 15 (parallel: 16 after 13) -> 17

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation and Deploy | v1.0 | 2/2 | Complete | 2026-04-21 |
| 2. Content Migration | v1.0 | 4/4 | Complete | 2026-04-21 |
| 3. Conversion Pipeline | v1.0 | 3/3 | Complete | 2026-04-21 |
| 4. Analytics and Tracking | v1.0 | 1/1 | Complete | 2026-04-21 |
| 5. Performance Optimization | v1.0 | 2/2 | Complete | 2026-04-21 |
| 6. Growth Engine | v1.0 | 2/2 | Complete | 2026-04-21 |
| 7. Shared Foundation + Data Pipeline | v1.1 | 2/2 | Complete | 2026-04-21 |
| 8. Whitepaper | v1.1 | 2/2 | Complete | 2026-04-22 |
| 9. Country Dashboard Core | v1.1 | 3/3 | Complete | 2026-04-21 |
| 10. Dashboard Advanced | v1.1 | 2/2 | Complete | 2026-04-22 |
| 11. Multi-Scale + Cross-Linking | v1.1 | 3/3 | Complete | 2026-04-22 |
| 12. Aggregation Visualization + Polish | v1.1 | 2/2 | Complete | 2026-04-22 |
| 13. Historical Data Pipeline | v1.2 | 1/1 | Complete   | 2026-05-12 |
| 14. World Map | v1.2 | 0/? | Not started | - |
| 15. Time-Series Visualization | v1.2 | 0/? | Not started | - |
| 16. Custom Indicator Explorer | v1.2 | 0/? | Not started | - |
| 17. Comparison Upgrades + Polish | v1.2 | 0/? | Not started | - |

---

## v1.1 Archive

<details>
<summary>v1.1 MIND Intelligence Layer -- Phase Details (SHIPPED 2026-04-22)</summary>

### Phase 7: Shared Foundation + Data Pipeline
**Goal**: A single source of truth for MIND score calculation exists and real World Bank data is fetched, normalized, and committed as a build-time baseline
**Depends on**: Phase 6 (v1.0 complete)
**Requirements**: DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. Zone Zero simulator imports calcScore() from the shared library and produces identical scores to before the extraction
  2. Running `npm run fetch-data` produces a committed JSON file containing normalized 0-100 MIND dimension scores for 217 countries
  3. The site builds successfully with no network access (using the committed JSON baseline)
  4. Each country record includes source, year, and accessedDate metadata fields
**Plans:** 2 plans
Plans:
- [x] 07-01-PLAN.md -- Shared MIND score library extraction + test infrastructure (vitest, tsx, calcScore, getBindingConstraint, normalize)
- [x] 07-02-PLAN.md -- World Bank data pipeline: fetch 16 indicators, normalize, commit JSON baseline

### Phase 8: Whitepaper
**Goal**: Visitors can read a structured, academically credible MIND framework whitepaper on the site and share it as a standalone URL
**Depends on**: Phase 7 (shared MIND score library for equation consistency)
**Requirements**: PAPER-01, PAPER-02, PAPER-03, PAPER-04, PAPER-05, PAPER-06
**Success Criteria** (what must be TRUE):
  1. Visiting /whitepaper displays a structured document with title, abstract, numbered sections, and conclusion
  2. A sticky sidebar TOC highlights the current section as the user scrolls through the whitepaper
  3. The MIND formula renders as properly typeset math equations (not plain text or images)
  4. Printing the whitepaper page produces clean, readable PDF-quality output without navigation chrome or broken layout
  5. Sharing the /whitepaper URL on social media displays a rich preview with title, description, and image
**Plans:** 2 plans
Plans:
- [x] 08-01-PLAN.md -- MDX infrastructure: deps, Astro config, content collection, WhitepaperLayout, TOC component, page route, whitepaper CSS
- [x] 08-02-PLAN.md -- Full whitepaper prose (3000-4000 words), scroll-spy, print CSS, OG image, social meta tags

### Phase 9: Country Dashboard Core
**Goal**: Policy practitioners can explore MIND scores for any country through interactive charts backed by real World Bank data
**Depends on**: Phase 7 (data pipeline and shared score library)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DATA-04
**Success Criteria** (what must be TRUE):
  1. Visiting /dashboard shows a searchable interface where typing a country name filters to matching results from 217 countries
  2. Selecting a country displays a radar chart showing M/I/N/D dimension balance and a callout identifying the binding constraint
  3. Users can view a bar chart comparing MIND dimensions across multiple selected countries
  4. Every chart displays data source attribution and the vintage year of the underlying data
  5. On mobile devices, charts reflow to a usable single-column layout; before JavaScript loads, a server-rendered ranking table is visible
**Plans:** 3 plans
Plans:
- [x] 09-01-PLAN.md -- ECharts install + TDD data/chart utility layer (echarts-setup, charts, search, dashboard-data + 32 tests)
- [x] 09-02-PLAN.md -- Static Astro dashboard page with ranking table, methodology panel, binding constraint components
- [x] 09-03-PLAN.md -- Interactive island: ECharts charts, search dropdown, state management, responsive behavior + human verify

### Phase 10: Dashboard Advanced
**Goal**: Policy practitioners can compare countries side-by-side, jump to the Zone Zero simulator with real data, and bookmark or share their dashboard view
**Depends on**: Phase 9 (country dashboard core)
**Requirements**: DASH-08, DASH-09, DASH-10
**Success Criteria** (what must be TRUE):
  1. Users can select 2-4 countries and see overlaid radar charts in a side-by-side comparison view
  2. Clicking "See this country in simulator" on the dashboard opens Zone Zero pre-loaded with that country's real MIND scores
  3. The browser URL updates as users change countries or views, and pasting that URL restores the exact dashboard state
**Plans:** 2/2 plans complete
Plans:
- [x] 10-01-PLAN.md -- Comparison radar chart function + URL state encode/decode utilities (TDD)
- [x] 10-02-PLAN.md -- Wire comparison radar, Zone Zero link, and bookmarkable URLs into dashboard island + human verify

### Phase 11: Multi-Scale + Cross-Linking
**Goal**: The MIND framework is demonstrated across firm, city, and country scales, and the whitepaper and dashboard reinforce each other through bidirectional links and embedded visualizations
**Depends on**: Phase 8 (whitepaper), Phase 9 (dashboard core)
**Requirements**: SCALE-01, SCALE-02, SCALE-03, LINK-01, LINK-02
**Success Criteria** (what must be TRUE):
  1. The dashboard offers a scale navigation UI (firm / city / country) and displays 5-10 curated city profiles with MIND dimension data
  2. Users can complete a firm-level MIND self-assessment using slider inputs and see their firm's MIND score and binding constraint
  3. The whitepaper contains inline mini-charts showing real country data within the prose, and links from the whitepaper open the corresponding dashboard view (and vice versa)
**Plans:** 3/3 plans complete
Plans:
- [x] 11-01-PLAN.md -- Whitepaper inline SVG mini-charts (MindRadar component) and whitepaper-to-dashboard cross-links
- [x] 11-02-PLAN.md -- Dashboard scale tabs (Country/City/Firm), curated city profiles with card grid and detail radar, dashboard-to-whitepaper links
- [x] 11-03-PLAN.md -- Firm self-assessment tool with dimension sliders, live MIND score, and binding constraint callout

### Phase 12: Aggregation Visualization + Polish
**Goal**: The site demonstrates how MIND scores compose across scales, navigation includes the new sections, all charts are accessible, and performance targets are met
**Depends on**: Phase 11 (all scales and cross-linking in place)
**Requirements**: AGG-01, NAV-01, A11Y-01, PERF-01
**Success Criteria** (what must be TRUE):
  1. A hierarchical visualization shows how MIND scores compose upward from firm to city to country to global scale
  2. The site navigation includes links to Whitepaper and Dashboard accessible from every page
  3. All charts have screen reader alternatives (aria-labels, text descriptions) passing WCAG 2.1 AA audit
  4. The dashboard page scores Lighthouse >= 90 desktop and >= 75 mobile
**Plans:** 2/2 plans complete
Plans:
- [x] 12-01-PLAN.md -- Aggregation pyramid SVG component on homepage + Whitepaper/Dashboard nav links (completed 2026-04-22)
- [x] 12-02-PLAN.md -- Dashboard accessibility audit (sr-only text alternatives) + Lighthouse performance verification + human verify
**UI hint**: yes

</details>
