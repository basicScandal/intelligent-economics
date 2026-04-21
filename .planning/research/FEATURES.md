# Feature Landscape: MIND Intelligence Layer (v1.1)

**Domain:** Policy-oriented academic whitepaper + interactive multi-scale economic dashboard
**Researched:** 2026-04-21
**Confidence:** HIGH (stack verified against live APIs and existing codebase)

## Context: What Already Exists

The v1.0 site is a fully functioning movement platform with:
- 14+ Astro components, Three.js particle hero, GSAP scroll animations
- Zone Zero simulator: 4-slider MIND score demo with particle visualization, collapse detection, health states, social sharing
- MindDashboard component: static equation display + animated bar chart with hardcoded global estimates (M:72, I:58, N:45, D:39)
- Volunteer signup + email capture forms (Netlify Forms backend)
- MailerLite welcome sequence, Plausible analytics with 6 custom events
- Device capability detection (3-tier: full/reduced/minimal) shared across modules
- Content collections: 6 stories (Medici, Bell Labs, Mondragon, etc.) and 4 experiment scales

**v1.1 adds three capabilities:** a publishable HTML whitepaper, a multi-scale data dashboard, and real data integration.

---

## Table Stakes

Features that users of a policy-oriented dashboard and academic paper expect. Missing these makes the product feel amateur or incomplete.

### Whitepaper Features

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|-------------|-------|
| Structured long-form HTML page with proper headings | Academic readers expect a paper that reads like a paper: title, abstract, sections, subsections, conclusion. Anything less feels like a blog post, not a framework. | LOW | Astro page routing, MDX integration | Use MDX in content collection. Astro's built-in markdown pipeline handles heading IDs. Single `/whitepaper` route. |
| Sticky table of contents sidebar | Long academic documents without navigation are unusable. UNDP HDR, OECD reports, and every academic publisher (Nature, Lancet) provide section-level TOC. | LOW | rehype-slug (auto heading IDs), Astro `getHeadings()` API | Astro exposes headings from MDX as `{ depth, slug, text }[]`. Build TOC component from this array. Highlight active section via IntersectionObserver. |
| Responsive reading layout (readable line length) | Policy readers are on varied devices. 65-75 character line length is the typographic standard for comfortable reading. Full-width text on desktop is unreadable. | LOW | Tailwind prose/typography utilities | `max-w-prose` or `max-w-[65ch]` on content container. Sidebar collapses to top-of-page TOC on mobile. |
| Proper citation and reference formatting | Academic credibility requires verifiable claims. In-line citations linked to a bibliography section are non-negotiable for policy audiences. | MEDIUM | rehype-citation plugin or manual HTML `<sup>` + `<a>` links | rehype-citation supports BibTeX/CSL-JSON bibliography files. Alternative: manual footnotes with remark-gfm (supports `[^1]` syntax natively). Manual is simpler for a single paper. |
| Print-friendly / PDF-downloadable version | Policy practitioners need to share documents in meetings, email to colleagues, print for committees. HTML-only is insufficient for institutional use. | MEDIUM | CSS `@media print` styles, optional PDF generation | CSS print stylesheet is lightweight: hide nav/footer, linearize layout, show full URLs. Actual PDF generation (via Puppeteer or pre-built) is optional but valuable. |
| Semantic HTML and accessibility | Screen readers, institutional accessibility requirements. `<article>`, `<section>`, `<aside>` for TOC, proper heading hierarchy. | LOW | Already established in v1.0 components | Extend existing WCAG 2.1 AA patterns. Use `<article>` wrapper, `role="doc-bibliography"` for references. |
| Meta tags for social sharing | When shared on Twitter/LinkedIn (primary channels for policy audiences), the whitepaper must have a compelling preview card. | LOW | Astro `<BaseLayout>` already has og:tags pattern | Add `og:title`, `og:description`, `og:image` with a designed social card image for the whitepaper. |

### Dashboard Features

| Feature | Why Expected | Complexity | Dependencies | Notes |
|---------|--------------|------------|-------------|-------|
| Country-level MIND score visualization | The core promise: see how countries score on M, I, N, D dimensions. Without this, there is no dashboard. Every comparable tool (HDI Data Center, OECD Better Life Index, Gapminder) shows country-level data as the primary view. | HIGH | World Bank API integration, data normalization pipeline, charting library | 4 sub-indicators per dimension aggregated into dimension scores, then multiplied for composite MIND score. Build-time fetch + client-side rendering. |
| Radar/spider chart for dimension comparison | The MIND framework has 4 dimensions -- this maps perfectly to a radar chart that shows balance vs. imbalance at a glance. OECD uses flower charts, HDI uses bar charts, but radar is the clearest way to show "how balanced is this entity." | MEDIUM | Observable Plot (radar chart support) or SVG hand-rolled | Observable Plot supports radar charts via azimuthal equidistant projection. Alternative: custom SVG radar is ~100 lines for 4 axes. Reuse MIND color tokens (M=green, I=purple, N=blue, D=gold). |
| Bar chart comparing dimensions across entities | Users need to compare Nigeria vs. Japan vs. Brazil side-by-side on each dimension. This is the bread-and-butter of index dashboards. | MEDIUM | Observable Plot (barY/barX marks) | Group by country, color by dimension. Observable Plot handles this with a few lines of declarative API. |
| Country selection / search | Users want to find their country or compare specific countries. A dropdown or search is minimum viable interaction. | LOW | Static country list from World Bank API (fetched at build time) | 217 countries in World Bank data. Autocomplete search with ISO codes. |
| Loading and error states | Real API data means real failures. Empty states, loading spinners, and "no data available" messages are table stakes for any data product. | LOW | None | Show skeleton loaders during data fetch. Handle null values gracefully (many indicators return null for some countries). |
| Data source attribution | Academic and policy credibility requires citing where the data comes from. "Source: World Bank World Development Indicators, 2021" must appear on every chart. | LOW | None | Footer on each visualization. Link to specific indicator documentation. |
| Mobile-responsive charts | Policy researchers increasingly use tablets and phones. Charts must be readable (not just technically visible) on small screens. | MEDIUM | Observable Plot handles responsive SVG; custom sizing logic needed | Reduce legend complexity on mobile. Stack charts vertically. Touch-friendly tooltips. |

---

## Differentiators

Features that set the MIND dashboard apart from HDI, OECD Better Life Index, Gapminder, DEAL City Portraits. These are what make someone bookmark this tool.

| Feature | Value Proposition | Complexity | Dependencies | Notes |
|---------|-------------------|------------|-------------|-------|
| Multi-scale drill-down (firm -> city -> country -> global) | No existing Beyond GDP dashboard offers hierarchical aggregation across scales. HDI is country-only. OECD is country-only. DEAL City Portraits are consultant-made, not interactive. The MIND framework's unique contribution is showing how prosperity composes upward from firms through cities to nations to the global system. | HIGH | Country data from World Bank API; city/firm data from user input or curated datasets; aggregation logic | **Phase this.** Start with country (API data available). Add city as curated showcase (5-10 cities with manually assembled data). Firm level is user-input only (no public firm-level API for these dimensions). Global is aggregated from country data. |
| Hierarchical aggregation visualization | Visual showing how firm MIND scores roll up to city, city to country, country to global. This is the "aha moment" for the framework -- just like Zone Zero shows collapse, this shows composition. | HIGH | Multi-scale data, custom visualization (treemap, sankey, or nested radar) | Could reuse Three.js particle metaphor: particles cluster into city blobs, city blobs into country shapes, countries into a globe. Or simpler: nested/stacked radar charts with drill-in animation. |
| Binding constraint identification | The Zone Zero simulator already shows "Diversity (40) is the binding constraint." Extending this to real data -- "Nigeria's binding constraint is Network Capital at 31" -- makes the framework prescriptive, not just descriptive. | MEDIUM | MIND score calculation (already implemented in `calcScore()` function in zone-zero.ts) | Reuse the geometric mean calculation from Zone Zero. The `calcScore()` function already handles the multiplicative zero-floor logic. Add a `findBindingConstraint()` helper. |
| Side-by-side entity comparison | Select 2-4 countries and see their MIND profiles overlaid. OECD does this but only for their 38 member countries. MIND covers 217 countries via World Bank data. | MEDIUM | Radar chart overlay, selection state management | Observable Plot supports layered marks -- overlay multiple radar traces. Color-code by country. Limit to 4 simultaneous comparisons for readability. |
| Time-series animation ("Gapminder-style") | Show how a country's MIND profile has changed over 10-20 years. Gapminder popularized this with Hans Rosling's TED talks. Powerful for showing policy impact. | HIGH | Multi-year World Bank data (available via date range parameter), animation system | World Bank API supports `date=2010:2022` range queries. GSAP can animate between data states. This is a "wow" feature but complex -- defer to late in milestone or future. |
| Zone Zero integration: "See this country in the simulator" | Link from a country's dashboard profile directly into the Zone Zero simulator with that country's real MIND scores pre-loaded. Bridges the static data view with the interactive "what if" tool. | MEDIUM | Zone Zero already supports URL parameter sharing (`?m=70&i=60&n=50&d=40`) | Update Zone Zero's URL parsing to accept a `country` parameter. Load real data, let user explore "what if we improved Diversity by 10 points?" |
| Whitepaper-dashboard cross-linking | When the whitepaper discusses "the multiplicative trap," an inline widget shows the actual current global MIND score. When it discusses "Nigeria's Intelligence deficit," a mini chart appears. Living document, not static PDF. | MEDIUM | MDX components that render inline dashboard widgets | This is where MDX shines -- embed `<MindMiniChart country="NGA" />` directly in whitepaper prose. Astro islands hydrate these on demand via `client:visible`. |
| Export/share individual country profiles | "Share Nigeria's MIND profile" with a permalink and social card. Policymakers share these in presentations and reports. | LOW | URL state encoding (already done in Zone Zero share feature), og:image generation | Zone Zero already has share infrastructure (copy link, Twitter, LinkedIn). Extend pattern to dashboard URLs. |
| MIND score methodology transparency | Show exactly which World Bank indicators feed each dimension, the normalization formula, the weighting. Full transparency builds academic credibility that black-box indices lack. | LOW | Documentation component showing indicator mapping | A collapsible "How is this calculated?" panel on each dimension. Links to World Bank indicator documentation. |

---

## Anti-Features

Features to explicitly NOT build for v1.1.

| Anti-Feature | Why It Seems Tempting | Why Avoid | What to Do Instead |
|--------------|----------------------|-----------|-------------------|
| Real-time data fetching on every page load | "Always show the latest data" | World Bank data updates annually at most. Client-side fetching adds latency (400-800ms per API call), creates CORS dependency on external service, risks API downtime breaking the dashboard. | **Build-time fetch** via Astro's data fetching at `astro build`. Regenerate with scheduled builds (weekly/monthly Netlify cron). Fallback: bundled JSON snapshot. |
| User accounts to save dashboard preferences | "Let users save their country comparisons" | Massive authentication overhead. No backend currently. Zero users to justify the infrastructure. | URL state encoding (already proven in Zone Zero). Bookmarkable URLs like `/dashboard?countries=NGA,JPN,BRA&view=radar`. |
| Custom indicator selection (pick your own World Bank indicators) | "Let policy researchers customize what feeds each MIND dimension" | Turns a clear opinionated framework into an open-ended data explorer. Undermines the MIND methodology. Adds enormous UI complexity. | Publish the indicator methodology transparently. Accept feedback via GitHub issues. Curate the indicator selection editorially. |
| City-level data from automated APIs | "Scrape OpenDataSoft, city open data portals" | City data is wildly inconsistent across jurisdictions. No single API covers even 50 cities globally. Scraping is fragile and legally questionable. | Curate 5-10 showcase cities with manually assembled data. Provide a "Submit your city's data" form for community-driven expansion (P3). |
| Firm-level data from financial APIs | "Pull from SEC filings, Bloomberg" | Financial APIs are paid and gated. ESG data is proprietary. Mapping corporate data to MIND dimensions requires subjective judgment. | Firm level is user-input only: "Rate your organization" with sliders (reuse Zone Zero pattern). Frame as self-assessment, not authoritative scoring. |
| Interactive world map (choropleth) | "Color countries by MIND score on a globe" | Choropleth maps require GeoJSON boundaries (~1-2MB), complex interaction handling, and add minimal analytical value over a sortable table or bar chart. Leaflet/D3 geo adds significant bundle weight. | Sortable country ranking table + radar chart comparison. If map is demanded later, use a static SVG world map with CSS-colored countries (no runtime library). |
| Academic peer review system built into the site | "Let scholars comment on and review the whitepaper" | Moderation nightmare. Requires user accounts. Low volume makes it feel dead. | Link to discussion on GitHub Discussions or a dedicated academic forum. Collect feedback via a simple form. |
| Real-time collaboration on city data | "Let multiple researchers edit city MIND scores" | Full CMS/collaboration system. Enormous scope. | Google Sheets for collaborative data entry. Import curated data at build time. |

---

## Feature Dependencies

```
[HTML Whitepaper Page]
    |-- requires --> [MDX integration in Astro]
    |-- requires --> [Content collection for whitepaper]
    |-- requires --> [TOC component (rehype-slug + getHeadings)]
    |-- optional --> [rehype-citation for bibliography]
    |-- optional --> [Print CSS stylesheet]
    |-- enhances --> [Dashboard cross-links via MDX components]

[Country-Level Dashboard]
    |-- requires --> [World Bank API data pipeline (build-time fetch)]
    |-- requires --> [Data normalization: raw indicators -> 0-100 MIND dimensions]
    |-- requires --> [Charting library (Observable Plot)]
    |-- requires --> [Country selection UI]
    |-- reuses  --> [calcScore() from zone-zero.ts]
    |-- reuses  --> [DeviceCapability from device-detect.ts]
    |-- reuses  --> [trackEvent() from analytics.ts]
    |-- reuses  --> [MIND color tokens (M=green, I=purple, N=blue, D=gold)]

[Multi-Scale Drill-Down]
    |-- requires --> [Country-Level Dashboard (foundation)]
    |-- requires --> [Curated city dataset (manual assembly)]
    |-- requires --> [Firm self-assessment UI (slider reuse from Zone Zero)]
    |-- requires --> [Global aggregation view]
    |-- requires --> [Scale navigation UI (breadcrumb or tabs)]

[Hierarchical Aggregation Visualization]
    |-- requires --> [Multi-Scale Drill-Down data]
    |-- requires --> [Custom visualization (nested radar, treemap, or sankey)]
    |-- optional --> [Three.js particle clustering (reuses hero infrastructure)]

[Zone Zero <-> Dashboard Integration]
    |-- requires --> [Country-Level Dashboard]
    |-- reuses  --> [Zone Zero URL parameter system]
    |-- reuses  --> [Zone Zero slider + canvas infrastructure]

[Whitepaper <-> Dashboard Cross-Links]
    |-- requires --> [HTML Whitepaper Page]
    |-- requires --> [Country-Level Dashboard]
    |-- requires --> [MDX inline components (mini-charts)]
```

### Critical Path

The dependency chain dictates build order:

1. **Data pipeline first** -- World Bank API fetch, normalization, bundled JSON
2. **Charting library integration** -- Observable Plot in Astro island
3. **Country dashboard page** -- core visualization with real data
4. **Whitepaper page** -- MDX content with TOC and citations
5. **Cross-linking** -- whitepaper embeds live dashboard widgets
6. **Multi-scale** -- city (curated) and firm (user-input) layers
7. **Aggregation visualization** -- the hierarchical "aha moment"

---

## World Bank API: Indicator Mapping to MIND Dimensions

Verified against live API (2026-04-21). All indicators return JSON with CORS (`Access-Control-Allow-Origin: *`), no authentication required, 217 countries available.

### Material Capital (Infrastructure, energy, housing, physical commons)

| Indicator Code | Name | Coverage | Notes |
|---------------|------|----------|-------|
| EG.ELC.ACCS.ZS | Access to electricity (% of population) | Excellent | Near-universal data availability |
| SH.H2O.BASW.ZS | People using basic drinking water (%) | Good | WHO/UNICEF joint monitoring |
| IS.RRS.TOTL.KM | Rail lines (total route-km) | Good | Infrastructure proxy |
| NY.GDP.MKTP.CD | GDP (current US$) | Excellent | Normalize per capita for comparison |
| EN.ATM.CO2E.PC | CO2 emissions (metric tons per capita) | Good | Inverse indicator (lower = better for sustainability) |

### Intelligence Capital (Education, open knowledge, cognitive infrastructure)

| Indicator Code | Name | Coverage | Notes |
|---------------|------|----------|-------|
| HD.HCI.OVRL | Human Capital Index (0-1 scale) | Good (217 countries, 2020) | World Bank's own composite -- strong proxy |
| GB.XPD.RSDV.GD.ZS | R&D expenditure (% of GDP) | Moderate | Many developing countries lack data |
| SE.ADT.LITR.ZS | Literacy rate, adult total (%) | Moderate | Many developed countries return null (assumed ~100%) |
| SE.XPD.TOTL.GD.ZS | Government expenditure on education (% of GDP) | Good | Policy input indicator |
| IP.PAT.RESD | Patent applications, residents | Good | Innovation output proxy |

### Network Capital (Cooperative density, trust, connectivity)

| Indicator Code | Name | Coverage | Notes |
|---------------|------|----------|-------|
| IT.NET.USER.ZS | Individuals using Internet (%) | Excellent | Digital connectivity proxy |
| TG.VAL.TOTL.GD.ZS | Merchandise trade (% of GDP) | Good | Economic interconnection |
| BX.KLT.DINV.CD.WD | Foreign direct investment, net inflows | Good | Capital network flows |
| IC.BUS.EASE.XQ | Ease of doing business score | Moderate | Institutional connectivity (discontinued 2020) |
| SM.POP.NETM | Net migration | Good | Human network flows |

### Diversity Capital (Cognitive, cultural, ecological, economic variety)

| Indicator Code | Name | Coverage | Notes |
|---------------|------|----------|-------|
| EN.BIO.LCBD.LG | Red List Index (composite) | Good | Biodiversity proxy |
| SL.TLF.CACT.FE.ZS | Labor force participation, female (%) | Good | Gender economic diversity |
| NV.IND.MANF.ZS | Manufacturing value added (% of GDP) | Good | Economic diversification proxy |
| AG.LND.FRST.ZS | Forest area (% of land area) | Good | Ecological diversity proxy |
| SE.ENR.TERT.FM.ZS | Gender parity index, tertiary education | Moderate | Cognitive diversity proxy |

**Data quality note:** Most indicators have 2-3 year lag. Latest reliable data for most countries is 2021-2022. The `lastupdated` field from the API (2026-04-08) refers to the dataset update, not the data year. Handle null values explicitly -- they are common, especially for small island nations and developing economies.

---

## User Journey: Exploring MIND Scores at Different Scales

### Entry Points

1. **From homepage** -- "Explore Real Data" CTA below existing MindDashboard section links to `/dashboard`
2. **From whitepaper** -- inline mini-charts in the paper link to full dashboard with context
3. **From Zone Zero** -- "See real countries" link after playing with simulator
4. **Direct link** -- shared URL like `/dashboard?country=NGA` from social media or email

### Journey Flow

```
1. LANDING: Global Overview
   - World ranking table: all countries sorted by MIND score
   - Global aggregate radar chart showing humanity's current MIND profile
   - "The binding constraint globally is Diversity at 39" (echoes existing MindDashboard)
   - CTA: "Select a country to explore"

2. COUNTRY DEEP-DIVE: Selected Country Profile
   - Radar chart: 4 MIND dimensions for this country
   - Dimension breakdown: which indicators feed each score
   - Binding constraint callout: "Nigeria's binding constraint is Network (31)"
   - Comparison: "Compare with..." adds 1-3 more countries
   - "Explore in Simulator" button -> opens Zone Zero pre-loaded with this country's scores

3. COMPARISON VIEW: Side-by-Side
   - Overlaid radar charts (max 4 countries)
   - Dimension-by-dimension bar chart comparison
   - "What would it take?" -- highlights the binding constraint for each

4. MULTI-SCALE (Progressive Disclosure):
   a. GLOBAL: Aggregated radar + ranking table (available immediately)
   b. COUNTRY: 217 countries from World Bank API (available immediately)
   c. CITY: 5-10 curated showcase cities (available at launch, expandable)
      - "Want to see your city? Submit data" form
   d. FIRM: Self-assessment tool (user-input only)
      - Reuses Zone Zero slider pattern
      - "Rate your organization on each MIND dimension"

5. ACTION: Converting Insight to Engagement
   - "This data matters. Help improve it." -> Volunteer form
   - "Share this country's profile" -> Social sharing (reuse Zone Zero share pattern)
   - "Read the methodology" -> Whitepaper deep link
   - "Try the simulator" -> Zone Zero with real scores pre-loaded
```

### Key UX Principles (Learned from OECD Better Life Index and Gapminder)

1. **Information hierarchy**: Most important insight at a glance, details revealed on demand. OECD's flower chart shows the overall shape immediately; petals reveal dimension names on hover.
2. **Opinionated defaults**: Start with a meaningful view (global overview, user's detected country). Don't show a blank "please select" state.
3. **Progressive complexity**: Global (simple) -> Country (moderate) -> Comparison (complex) -> Multi-scale (expert). Each level is useful on its own.
4. **Conversion integration**: Every data view has a path to action (volunteer, share, explore further). Data without action is a dead end for a movement site.
5. **Mobile-first simplification**: On mobile, show the radar chart and binding constraint callout. Full comparison and time-series are desktop features.

---

## MVP Recommendation for v1.1

### Build First (Core Milestone)

1. **HTML Whitepaper** -- MDX page with TOC, citations, responsive reading layout, print CSS
   - Establishes intellectual credibility immediately
   - Low technical risk, high impact
   - No external API dependency

2. **World Bank data pipeline** -- Build-time fetch, normalization to 0-100 scores, bundled JSON
   - Foundation for everything else
   - Validate data quality and coverage before building UI

3. **Country-level dashboard** -- Radar chart + bar chart + binding constraint for 217 countries
   - The core promise of the milestone
   - Reuses Zone Zero's `calcScore()` and color tokens
   - Observable Plot for charts in Astro islands

4. **Country comparison** -- Select 2-4 countries, overlay radar charts
   - Moderate effort on top of single-country view
   - High value for policy practitioners

5. **Zone Zero integration** -- "See this country in the simulator" pre-loads real scores
   - Low effort (URL parameter system already exists)
   - Connects existing and new features into a cohesive experience

### Defer (Add After Core)

- **Whitepaper-dashboard cross-links** (MDX inline widgets) -- valuable but not blocking
- **City-level curated data** -- requires manual data assembly, launch with "coming soon"
- **Firm self-assessment** -- reuses Zone Zero pattern but needs separate page and UX
- **Time-series animation** -- complex, high wow-factor but not table stakes
- **Hierarchical aggregation visualization** -- the "aha moment" but requires multi-scale data to be meaningful
- **Global aggregation view** -- computed from country data, low effort but prioritize country view first

### Explicitly Out of Scope for v1.1

- Choropleth world map
- Custom indicator selection
- User accounts
- Automated city/firm data from APIs
- Real-time data fetching (build-time only)
- PDF generation of whitepaper (CSS print is sufficient)

---

## Complexity Budget

| Feature | Estimated Effort | Technical Risk | Notes |
|---------|-----------------|----------------|-------|
| MDX whitepaper page | 2-3 days | LOW | Well-documented Astro pattern |
| TOC sidebar component | 0.5 days | LOW | Astro `getHeadings()` + IntersectionObserver |
| Citation/bibliography | 1 day | LOW | remark-gfm footnotes or rehype-citation |
| Print CSS | 0.5 days | LOW | Standard `@media print` |
| World Bank data pipeline | 2-3 days | MEDIUM | API is stable but data normalization requires methodology decisions |
| Observable Plot integration | 1-2 days | LOW | Framework-agnostic, vanilla JS, CDN-loadable |
| Radar chart component | 1-2 days | LOW | Observable Plot or custom SVG |
| Country dashboard page | 3-4 days | MEDIUM | State management, routing, responsive layout |
| Country comparison | 1-2 days | LOW | Extension of single-country view |
| Zone Zero integration | 0.5 days | LOW | URL parameter system exists |
| Analytics events | 0.5 days | LOW | Extend existing `trackEvent()` pattern |
| **Total estimate** | **13-19 days** | | Core milestone without deferred items |

---

## Competitive Analysis: Dashboard Comparison

| Feature | UNDP HDI Data Center | OECD Better Life Index | Gapminder | Our World in Data | MIND Dashboard (Planned) |
|---------|---------------------|----------------------|-----------|-------------------|--------------------------|
| Country count | 193 | 38 (OECD members) | ~200 | ~200 | 217 (all World Bank) |
| Multi-scale | Country only | Country only | Country only | Country only | **Firm -> City -> Country -> Global** |
| User weighting | No | Yes (11 sliders) | No | No | **Yes (via Zone Zero integration)** |
| Multiplicative model | No (additive) | No (additive) | N/A (raw indicators) | N/A | **Yes (zero-floor collapse)** |
| Binding constraint | No | No | No | No | **Yes (highlighted per entity)** |
| Time-series | Yes (static table) | Limited | Yes (animated) | Yes (interactive) | Planned (deferred) |
| Interactive simulator | No | Basic (slider weights) | Motion chart | Toggle controls | **Zone Zero (4-slider particle sim)** |
| Open methodology | Partial | Documented | Open data | Open data + code | **Full transparency planned** |
| Mobile experience | Responsive tables | Responsive | Desktop-optimized | Good | Responsive charts + simplified mobile |

**MIND Dashboard's unique position:** The only Beyond GDP tool combining multiplicative zero-floor scoring, multi-scale drill-down, interactive simulation, and binding constraint identification. The OECD comes closest with user weighting, but covers only 38 countries and uses additive (not multiplicative) aggregation.

---

## Sources

- [World Bank Indicators API v2](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation) -- API structure, indicator codes, pagination (verified live 2026-04-21, CORS: `Access-Control-Allow-Origin: *`)
- [World Bank API Basic Call Structures](https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures) -- Base URL `https://api.worldbank.org/v2/`, JSON format, per_page parameter
- [World Bank Development Best Practices](https://datahelpdesk.worldbank.org/knowledgebase/articles/902064-development-best-practices) -- Caching recommendation (data updates infrequently)
- [Observable Plot](https://observablehq.com/plot/) -- Charting library, vanilla JS + CDN, layered marks API, radar chart support
- [Observable Plot npm](https://www.npmjs.com/package/@observablehq/plot) -- Framework-agnostic, ES module, D3 dependency bundled
- [UNDP HDI Data Center](https://hdr.undp.org/data-center) -- Competitor dashboard design, country insights pattern
- [OECD Better Life Index](https://www.oecd.org/en/data/tools/well-being-data-monitor/better-life-index.html) -- Flower chart visualization, user weighting system, information hierarchy
- [Truth & Beauty - OECD BLI Design](https://truth-and-beauty.net/projects/oecd-better-life-index) -- Design philosophy: "hierarchy of information that presents the most important values at a glance"
- [Astro Academic Project Template](https://github.com/RomanHauksson/academic-project-astro-template) -- MDX + components for research papers
- [Astro Markdown Content](https://docs.astro.build/en/guides/markdown-content/) -- MDX integration, remark/rehype plugin configuration, `getHeadings()` API
- [rehype-citation](https://www.timlrx.com/blog/streamlining-citations-in-markdown/) -- Academic citation plugin for rehype/Astro pipeline
- [remark-gfm](https://github.com/remarkjs/remark-gfm) -- GitHub Flavored Markdown with footnote support
- [Astro TOC Implementation](https://noahflk.com/blog/astro-table-of-contents) -- Building auto-generated TOC with IntersectionObserver
- [Beyond GDP Database (Nature, 2024)](https://www.nature.com/articles/s41597-024-04006-4) -- Comprehensive Beyond-GDP database, WISE framework convergence
- [Lancet Beyond GDP Framework (2024)](https://www.sciencedirect.com/science/article/pii/S2542519624001475) -- Review of measurement frameworks, conceptual grounding

---
*Feature research for: MIND Intelligence Layer (v1.1) -- Whitepaper + Multi-Scale Dashboard*
*Researched: 2026-04-21*
*Supersedes: v1.0 feature research (movement platform table stakes)*
