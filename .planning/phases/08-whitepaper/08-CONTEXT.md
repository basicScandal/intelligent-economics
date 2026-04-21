# Phase 8: Whitepaper - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the /whitepaper page — a structured, academically credible MIND framework paper with sticky TOC, KaTeX math rendering, print-friendly CSS, and social sharing. The whitepaper is the movement's intellectual anchor, converting the MIND formula from an interactive toy (Zone Zero) into a rigorous, shareable argument.

</domain>

<decisions>
## Implementation Decisions

### Content Structure & Academic Depth
- 9-section structure: Abstract → Introduction → The GDP Problem → MIND Framework → Mathematical Foundation → Methodology (indicator mapping + normalization) → Country Analysis (3-4 contrasting profiles from committed data) → Policy Implications → Conclusion → References
- Accessible-academic hybrid tone: clear prose with proper citations, "Brookings Institution paper" not "Journal of Economics" — written for policymakers and intellectually curious non-economists
- 3-4 country profiles from the committed `src/data/mind-scores.json`: one thriving (Nordic), one stressed (binding constraint visible), one with a collapsed dimension, one developing with high Intelligence
- Target length: ~3,000-4,000 words (15-20 min read) — substantive but not overwhelming

### Page Layout & Reading Experience
- Left sidebar TOC on desktop (240px wide), collapses to "Contents" dropdown at top on mobile (<1024px breakpoint)
- IntersectionObserver scroll-spy for TOC section highlighting (per PAPER-02)
- Serif body text (Georgia/system serif stack) for academic reading feel; existing sans-serif (Inter/system) for headings and UI chrome
- Light background for whitepaper content area (white/cream) regardless of site dark mode — academic papers read best in light mode. Site chrome (nav, footer) stays in current site theme
- Subtle bioluminescent accents: OKLCH palette for TOC highlights, section dividers, formula backgrounds. No particles or heavy animation — this is a reading experience

### Technical Implementation
- MDX content collection with custom loader in `content.config.ts` — matches existing pattern (stories, experiments), enables remark/rehype plugin chain
- KaTeX integration via `remark-math` + `rehype-katex` plugins — transforms `$...$` and `$$...$$` to rendered HTML at build time. Zero client JS. KaTeX CSS loaded only in whitepaper layout
- Print CSS via `@media print` stylesheet: hide nav, footer, TOC sidebar; force light colors + serif fonts; proper page breaks (`break-inside: avoid` on sections); A4/Letter margins. Applied via `<link media="print">` — zero screen impact
- Static OG image (1200x630) committed to `public/` with MIND formula + site branding. Standard `<meta>` tags in whitepaper layout head. No dynamic generation needed for a single page
- Whitepaper layout extends BaseLayout.astro — adds TOC sidebar, serif typography, print stylesheet

### Claude's Discretion
- Exact whitepaper prose content and citation references
- Section heading wording and numbering scheme
- KaTeX formula formatting choices (display vs inline)
- Color values for formula background highlighting
- Mobile TOC dropdown implementation details (CSS-only vs minimal JS)
- Print page break placement strategy
- OG image design composition

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — base layout to extend for whitepaper
- `src/content.config.ts` — content collection pattern (stories, experiments) to follow for whitepaper MDX
- `src/lib/mind-score.ts` — shared MIND formula for equation consistency in whitepaper math
- `src/data/mind-scores.json` — committed country data for real examples in Country Analysis section
- `src/styles/global.css` — OKLCH design tokens and existing typography
- `src/components/Nav.astro`, `src/components/Footer.astro` — site chrome to include

### Established Patterns
- Astro content collections with glob loader and zod schema validation
- TypeScript strict mode throughout
- Tailwind v4 CSS-first utilities with OKLCH custom properties
- `client:visible` / `client:idle` for interactive islands (TOC scroll-spy may need client JS)
- No `@astrojs/mdx` integration currently — needs to be added

### Integration Points
- New content collection entry in `content.config.ts` for whitepaper
- New page at `src/pages/whitepaper.astro` (or `[...slug].astro` if collection-driven)
- New layout at `src/layouts/WhitepaperLayout.astro`
- Nav component needs "Whitepaper" link (deferred to Phase 12 NAV-01)
- `package.json` needs `@astrojs/mdx`, `remark-math`, `rehype-katex`, `katex` dependencies
- `astro.config.mjs` needs MDX integration with remark/rehype plugins

</code_context>

<specifics>
## Specific Ideas

- The Mathematical Foundation section should render the exact formula from `src/lib/mind-score.ts`: $P = \left(\frac{M}{100} \cdot \frac{I}{100} \cdot \frac{N}{100} \cdot \frac{D}{100}\right)^{0.25} \times 100$
- Country Analysis should pull real scores from `mind-scores.json` — not made-up numbers
- The whitepaper should explain WHY multiplication (not addition) and WHY the zero-floor property matters — these are the MIND framework's key differentiators from GDP
- Methodology section should list all 16 World Bank indicators and explain the normalization approach (percentile-capped min-max), connecting back to what Phase 7 built

</specifics>

<deferred>
## Deferred Ideas

- Nav link to whitepaper — Phase 12 (NAV-01)
- Inline mini-chart components in whitepaper prose — Phase 11 (LINK-01)
- Bidirectional navigation between whitepaper and dashboard — Phase 11 (LINK-02)

</deferred>
