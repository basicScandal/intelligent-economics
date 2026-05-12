# Requirements: Intelligent Economics

**Defined:** 2026-04-21
**Core Value:** The volunteer conversion pipeline must work. Every visitor who wants to join this movement must be captured, welcomed, and given a path to meaningful contribution.

## v1.1 Requirements

Requirements for MIND Intelligence Layer milestone. Each maps to roadmap phases.

### Foundation & Data Pipeline

- [x] **DATA-01**: Shared MIND score library extracted from Zone Zero with calcScore(), getBindingConstraint(), normalize() functions
- [x] **DATA-02**: Build-time World Bank API fetch for 16 indicators across 217 countries with committed JSON baseline
- [x] **DATA-03**: Data normalization pipeline transforming raw indicators to 0-100 MIND dimension scores
- [x] **DATA-04**: Indicator methodology transparency panel showing which World Bank indicators feed each MIND dimension

### Whitepaper

- [x] **PAPER-01**: Structured MDX whitepaper page on /whitepaper route with title, abstract, sections, conclusion
- [x] **PAPER-02**: Sticky TOC sidebar with scroll-spy highlighting via IntersectionObserver and getHeadings()
- [x] **PAPER-03**: Math equation rendering via KaTeX (build-time, zero client JS) for MIND formula
- [x] **PAPER-04**: Citation and footnote formatting with remark-gfm for academic references
- [x] **PAPER-05**: Print-friendly CSS (@media print) for PDF-quality output
- [x] **PAPER-06**: Social sharing meta tags (og:title, og:description, og:image) for whitepaper

### Dashboard Core

- [x] **DASH-01**: Country-level MIND score radar chart showing M/I/N/D dimension balance for any country
- [x] **DASH-02**: Bar chart comparing MIND dimensions across selected countries
- [x] **DASH-03**: Country search/selection with autocomplete for 217 countries
- [x] **DASH-04**: Binding constraint identification callout per country
- [x] **DASH-05**: Data source attribution with vintage year on every chart
- [x] **DASH-06**: Mobile-responsive charts with simplified mobile layout
- [x] **DASH-07**: Progressive enhancement — server-rendered ranking table before JS hydration

### Dashboard Advanced

- [x] **DASH-08**: Side-by-side comparison of 2-4 countries with overlaid radar charts
- [x] **DASH-09**: Zone Zero integration — "See this country in simulator" pre-loads real MIND scores via URL params
- [x] **DASH-10**: Bookmarkable dashboard URLs with country/view state encoding

### Multi-Scale

- [x] **SCALE-01**: 5-10 curated city profiles with manually assembled MIND indicator data
- [x] **SCALE-02**: Firm self-assessment tool with user-input sliders (Zone Zero pattern reuse)
- [x] **SCALE-03**: Scale navigation UI (firm -> city -> country -> global) with breadcrumb or tabs

### Cross-Linking & Polish

- [ ] **LINK-01**: MDX inline mini-chart components embedded in whitepaper prose
- [ ] **LINK-02**: Bidirectional navigation between whitepaper and dashboard
- [ ] **AGG-01**: Hierarchical aggregation visualization showing MIND score composition across scales
- [ ] **NAV-01**: Site navigation updated with Whitepaper and Dashboard links
- [x] **A11Y-01**: Accessibility audit — screen reader alternatives for all charts, aria-labels
- [x] **PERF-01**: Lighthouse verification — dashboard page mobile >= 75, desktop >= 90

## v1.2 Requirements

Requirements for Data Visualization Upgrades milestone. Each maps to roadmap phases.

### World Map

- [x] **MAP-01**: ECharts choropleth world map displaying MIND composite scores for 217 countries with color gradient
- [x] **MAP-02**: "Map" tab added to dashboard alongside Country/City/Firm tabs
- [x] **MAP-03**: Click country on map selects it in dashboard state (triggers radar chart, binding constraint)
- [x] **MAP-04**: Color scale legend showing MIND score ranges (low/medium/high)
- [x] **MAP-05**: Map tooltip on hover showing country name, MIND score, and binding constraint
- [x] **MAP-06**: Map dimension toggle — switch map coloring between composite MIND and individual M/I/N/D dimensions

### Time-Series

- [x] **TIME-01**: Extended World Bank data pipeline fetching 10 years of historical data (2014-2024) for all 16 indicators
- [ ] **TIME-02**: Time-series line chart showing MIND score evolution for a selected country
- [ ] **TIME-03**: Animated playback controls (play/pause/speed) for score evolution across years
- [ ] **TIME-04**: Year slider/scrubber for manual year selection
- [ ] **TIME-05**: Time-series integration with world map — map recolors to selected year's data
- [ ] **TIME-06**: Multi-country time-series overlay (compare 2-4 countries over time)

### Custom Indicators

- [ ] **IND-01**: Indicator selection panel listing all 16 World Bank indicators grouped by MIND dimension
- [ ] **IND-02**: Toggle individual indicators on/off with dynamic MIND score recalculation
- [ ] **IND-03**: Visual weight display showing how selected indicators contribute to dimension scores
- [ ] **IND-04**: "Reset to default" button restoring the standard 16-indicator set

### Comparison Enhancements

- [ ] **COMP-01**: Comparison data table with sortable columns showing all 4 dimensions + composite
- [ ] **COMP-02**: Export comparison as CSV download
- [ ] **COMP-03**: Shareable comparison URL encoding selected countries and active view
- [ ] **COMP-04**: Multi-select countries from world map for comparison (click + shift-click or similar)

### Integration & Polish

- [x] **INT-01**: All new visualizations follow existing ECharts SVG renderer pattern
- [ ] **INT-02**: Screen reader text alternatives for map and time-series charts
- [ ] **INT-03**: Mobile-responsive layout for map tab (stacked or simplified view)
- [ ] **INT-04**: Lighthouse performance targets maintained (desktop >= 90, mobile >= 75)

## v1.3 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Data Expansion

- **DATA-05**: Automated city-level data from Census ACS and international equivalents
- **DATA-06**: Automated firm-level data from SEC EDGAR and financial APIs

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time data fetching on page load | World Bank data updates annually — build-time fetch is sufficient |
| User accounts / saved preferences | URL state encoding is sufficient, no backend exists |
| Custom indicator selection (permanent removal) | v1.2 adds opt-in toggling — researchers can explore, but defaults preserve opinionated methodology |
| Automated city/firm data from APIs | Free public APIs don't provide MIND-relevant data at these scales |
| PDF generation via Puppeteer | CSS @media print is sufficient for v1.1 |
| Academic peer review system | Moderation overhead, use GitHub Discussions instead |
| Real-time collaboration on data | Use Google Sheets for collaborative entry, import at build time |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 7 | Complete |
| DATA-02 | Phase 7 | Complete |
| DATA-03 | Phase 7 | Complete |
| DATA-04 | Phase 9 | Complete |
| PAPER-01 | Phase 8 | Complete |
| PAPER-02 | Phase 8 | Complete |
| PAPER-03 | Phase 8 | Complete |
| PAPER-04 | Phase 8 | Complete |
| PAPER-05 | Phase 8 | Complete |
| PAPER-06 | Phase 8 | Complete |
| DASH-01 | Phase 9 | Complete |
| DASH-02 | Phase 9 | Complete |
| DASH-03 | Phase 9 | Complete |
| DASH-04 | Phase 9 | Complete |
| DASH-05 | Phase 9 | Complete |
| DASH-06 | Phase 9 | Complete |
| DASH-07 | Phase 9 | Complete |
| DASH-08 | Phase 10 | Complete |
| DASH-09 | Phase 10 | Complete |
| DASH-10 | Phase 10 | Complete |
| SCALE-01 | Phase 11 | Complete |
| SCALE-02 | Phase 11 | Complete |
| SCALE-03 | Phase 11 | Complete |
| LINK-01 | Phase 11 | Complete |
| LINK-02 | Phase 11 | Complete |
| AGG-01 | Phase 12 | Complete |
| NAV-01 | Phase 12 | Complete |
| A11Y-01 | Phase 12 | Complete |
| PERF-01 | Phase 12 | Complete |
| TIME-01 | Phase 13 | Complete |
| MAP-01 | Phase 14 | Complete |
| MAP-02 | Phase 14 | Complete |
| MAP-03 | Phase 14 | Complete |
| MAP-04 | Phase 14 | Complete |
| MAP-05 | Phase 14 | Complete |
| MAP-06 | Phase 14 | Complete |
| INT-01 | Phase 14 | Complete |
| TIME-02 | Phase 15 | Pending |
| TIME-03 | Phase 15 | Pending |
| TIME-04 | Phase 15 | Pending |
| TIME-05 | Phase 15 | Pending |
| TIME-06 | Phase 15 | Pending |
| IND-01 | Phase 16 | Pending |
| IND-02 | Phase 16 | Pending |
| IND-03 | Phase 16 | Pending |
| IND-04 | Phase 16 | Pending |
| COMP-01 | Phase 17 | Pending |
| COMP-02 | Phase 17 | Pending |
| COMP-03 | Phase 17 | Pending |
| COMP-04 | Phase 17 | Pending |
| INT-02 | Phase 17 | Pending |
| INT-03 | Phase 17 | Pending |
| INT-04 | Phase 17 | Pending |

**Coverage:**
- v1.1 requirements: 29 total -- all Complete
- v1.2 requirements: 22 total -- all mapped to phases
- Mapped to phases: 22/22
- Unmapped: 0

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-05-11 after v1.2 roadmap creation*
