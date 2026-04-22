# Roadmap: Intelligent Economics

## Milestones

- v1.0 Global Growth Foundation -- Phases 1-6 (shipped 2026-04-21)
- v1.1 MIND Intelligence Layer -- Phases 7-12 (in progress)

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

### v1.1 MIND Intelligence Layer (In Progress)

**Milestone Goal:** Give the MIND framework intellectual credibility with a public whitepaper and real-world proof via an interactive multi-scale dashboard.

- [ ] **Phase 7: Shared Foundation + Data Pipeline** - Extract MIND score library, build World Bank data pipeline, establish data normalization
- [ ] **Phase 8: Whitepaper** - Publishable HTML whitepaper on /whitepaper route with academic formatting and aggregation methodology
- [ ] **Phase 9: Country Dashboard Core** - Interactive country-level MIND dashboard on /dashboard with radar/bar charts for 217 countries
- [x] **Phase 10: Dashboard Advanced** - Country comparison, Zone Zero integration, and bookmarkable URLs (completed 2026-04-22)
- [ ] **Phase 11: Multi-Scale + Cross-Linking** - City profiles, firm self-assessment, scale navigation, and whitepaper-dashboard integration
- [ ] **Phase 12: Aggregation Visualization + Polish** - Hierarchical MIND score composition tree, nav updates, accessibility audit, performance verification

**Note:** Phases 8 and 9 can run in parallel after Phase 7 -- they share no dependencies beyond the shared score library.

## Phase Details

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
- [x] 08-01-PLAN.md — MDX infrastructure: deps, Astro config, content collection, WhitepaperLayout, TOC component, page route, whitepaper CSS
- [x] 08-02-PLAN.md — Full whitepaper prose (3000-4000 words), scroll-spy, print CSS, OG image, social meta tags

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
- [x] 09-01-PLAN.md — ECharts install + TDD data/chart utility layer (echarts-setup, charts, search, dashboard-data + 32 tests)
- [x] 09-02-PLAN.md — Static Astro dashboard page with ranking table, methodology panel, binding constraint components
- [x] 09-03-PLAN.md — Interactive island: ECharts charts, search dropdown, state management, responsive behavior + human verify

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
- [x] 10-01-PLAN.md — Comparison radar chart function + URL state encode/decode utilities (TDD)
- [x] 10-02-PLAN.md — Wire comparison radar, Zone Zero link, and bookmarkable URLs into dashboard island + human verify

### Phase 11: Multi-Scale + Cross-Linking
**Goal**: The MIND framework is demonstrated across firm, city, and country scales, and the whitepaper and dashboard reinforce each other through bidirectional links and embedded visualizations
**Depends on**: Phase 8 (whitepaper), Phase 9 (dashboard core)
**Requirements**: SCALE-01, SCALE-02, SCALE-03, LINK-01, LINK-02
**Success Criteria** (what must be TRUE):
  1. The dashboard offers a scale navigation UI (firm / city / country) and displays 5-10 curated city profiles with MIND dimension data
  2. Users can complete a firm-level MIND self-assessment using slider inputs and see their firm's MIND score and binding constraint
  3. The whitepaper contains inline mini-charts showing real country data within the prose, and links from the whitepaper open the corresponding dashboard view (and vice versa)
**Plans**: TBD
**UI hint**: yes

### Phase 12: Aggregation Visualization + Polish
**Goal**: The site demonstrates how MIND scores compose across scales, navigation includes the new sections, all charts are accessible, and performance targets are met
**Depends on**: Phase 11 (all scales and cross-linking in place)
**Requirements**: AGG-01, NAV-01, A11Y-01, PERF-01
**Success Criteria** (what must be TRUE):
  1. A hierarchical visualization shows how MIND scores compose upward from firm to city to country to global scale
  2. The site navigation includes links to Whitepaper and Dashboard accessible from every page
  3. All charts have screen reader alternatives (aria-labels, text descriptions) passing WCAG 2.1 AA audit
  4. The dashboard page scores Lighthouse >= 90 desktop and >= 75 mobile
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases 8 and 9 can run in parallel after Phase 7. All other phases are sequential.
7 -> 8 (parallel with 9) -> 9 (parallel with 8) -> 10 -> 11 -> 12

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation and Deploy | v1.0 | 2/2 | Complete | 2026-04-21 |
| 2. Content Migration | v1.0 | 4/4 | Complete | 2026-04-21 |
| 3. Conversion Pipeline | v1.0 | 3/3 | Complete | 2026-04-21 |
| 4. Analytics and Tracking | v1.0 | 1/1 | Complete | 2026-04-21 |
| 5. Performance Optimization | v1.0 | 2/2 | Complete | 2026-04-21 |
| 6. Growth Engine | v1.0 | 2/2 | Complete | 2026-04-21 |
| 7. Shared Foundation + Data Pipeline | v1.1 | 2/2 | Complete | 2026-04-21 |
| 8. Whitepaper | v1.1 | 0/2 | Planned | - |
| 9. Country Dashboard Core | v1.1 | 3/3 | Complete | 2026-04-21 |
| 10. Dashboard Advanced | v1.1 | 2/2 | Complete    | 2026-04-22 |
| 11. Multi-Scale + Cross-Linking | v1.1 | 0/0 | Not started | - |
| 12. Aggregation Visualization + Polish | v1.1 | 0/0 | Not started | - |
