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
- [ ] **SCALE-02**: Firm self-assessment tool with user-input sliders (Zone Zero pattern reuse)
- [x] **SCALE-03**: Scale navigation UI (firm -> city -> country -> global) with breadcrumb or tabs

### Cross-Linking & Polish

- [ ] **LINK-01**: MDX inline mini-chart components embedded in whitepaper prose
- [ ] **LINK-02**: Bidirectional navigation between whitepaper and dashboard
- [ ] **AGG-01**: Hierarchical aggregation visualization showing MIND score composition across scales
- [ ] **NAV-01**: Site navigation updated with Whitepaper and Dashboard links
- [ ] **A11Y-01**: Accessibility audit — screen reader alternatives for all charts, aria-labels
- [ ] **PERF-01**: Lighthouse verification — dashboard page mobile >= 75, desktop >= 90

## v1.2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Dashboard Enhancements

- **DASH-11**: Time-series animation (Gapminder-style) showing MIND score changes over 10-20 years
- **DASH-12**: Choropleth world map colored by MIND score
- **DASH-13**: Custom indicator selection for researchers

### Data Expansion

- **DATA-05**: Automated city-level data from Census ACS and international equivalents
- **DATA-06**: Automated firm-level data from SEC EDGAR and financial APIs

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time data fetching on page load | World Bank data updates annually — build-time fetch is sufficient |
| User accounts / saved preferences | URL state encoding is sufficient, no backend exists |
| Custom indicator selection | Undermines opinionated MIND methodology |
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
| SCALE-02 | Phase 11 | Pending |
| SCALE-03 | Phase 11 | Complete |
| LINK-01 | Phase 11 | Pending |
| LINK-02 | Phase 11 | Pending |
| AGG-01 | Phase 12 | Pending |
| NAV-01 | Phase 12 | Pending |
| A11Y-01 | Phase 12 | Pending |
| PERF-01 | Phase 12 | Pending |

**Coverage:**
- v1.1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-04-21 after roadmap creation*
