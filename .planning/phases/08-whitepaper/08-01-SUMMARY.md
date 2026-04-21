---
phase: 08-whitepaper
plan: 01
subsystem: content
tags: [mdx, katex, astro-content-collections, whitepaper, math-rendering, toc]

# Dependency graph
requires:
  - phase: 07-data-pipeline
    provides: MIND score library and normalization definitions referenced in whitepaper math
provides:
  - MDX content collection infrastructure for whitepaper rendering
  - WhitepaperLayout with serif typography and light-mode override
  - TableOfContents component (desktop sidebar + mobile dropdown)
  - KaTeX math rendering pipeline (build-time, zero client JS)
  - /whitepaper route with schema-validated MDX content
affects: [08-02-whitepaper-prose, 09-dashboard]

# Tech tracking
tech-stack:
  added: ["@astrojs/mdx@4.3.14", "remark-math@6.0.0", "rehype-katex@7.0.1", "katex@0.16.45"]
  patterns: [mdx-content-collection, build-time-katex, whitepaper-layout-pattern]

key-files:
  created:
    - src/content/whitepaper/mind-framework.mdx
    - src/layouts/WhitepaperLayout.astro
    - src/components/TableOfContents.astro
    - src/styles/whitepaper.css
  modified:
    - package.json
    - astro.config.mjs
    - src/content.config.ts
    - src/pages/whitepaper.astro

key-decisions:
  - "MDX remarkPlugins and rehypePlugins configured inside mdx() integration, not top-level markdown key"
  - "remarkRehype footnoteLabel set to 'References' for academic paper convention"
  - "Whitepaper uses local light-mode CSS override via custom properties, not global theme switch"
  - "TOC uses details/summary for mobile instead of JS-driven drawer"

patterns-established:
  - "MDX content collection: glob loader with **/*.mdx pattern and schema validation"
  - "Whitepaper layout: two-column CSS Grid with sticky TOC sidebar"
  - "Build-time math: remark-math + rehype-katex in MDX integration config"

requirements-completed: [PAPER-01, PAPER-02, PAPER-03]

# Metrics
duration: 4min
completed: 2026-04-21
---

# Phase 08 Plan 01: Whitepaper MDX Infrastructure Summary

**MDX pipeline with KaTeX math rendering, content collection schema, WhitepaperLayout with sticky TOC sidebar, and /whitepaper route serving stub academic paper**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-21T18:36:43Z
- **Completed:** 2026-04-21T18:41:07Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Full MDX rendering pipeline: @astrojs/mdx with remark-math and rehype-katex producing build-time KaTeX HTML (zero client JS for math)
- Whitepaper content collection with schema validation (title, subtitle, abstract, authors, date, version)
- WhitepaperLayout with serif typography, light background override, two-column CSS Grid, sticky desktop TOC, mobile details/summary TOC
- Stub MDX file with display and inline KaTeX equations proving end-to-end pipeline
- All 22 existing tests still pass

## Task Commits

Each task was committed atomically:

1. **Task 1: Install MDX dependencies and configure Astro MDX integration with KaTeX** - `c158912` (feat)
2. **Task 2: Create WhitepaperLayout, TableOfContents component, page route, and whitepaper CSS** - `d05a479` (feat)

## Files Created/Modified
- `package.json` - Added @astrojs/mdx, remark-math, rehype-katex, katex dependencies
- `astro.config.mjs` - MDX integration with math plugins and footnote label config
- `src/content.config.ts` - Added whitepaper collection with MDX glob loader and schema
- `src/content/whitepaper/mind-framework.mdx` - Stub whitepaper with frontmatter and KaTeX equations
- `src/layouts/WhitepaperLayout.astro` - Two-column layout extending BaseLayout with KaTeX CSS, Nav, Footer
- `src/components/TableOfContents.astro` - Heading-based TOC with desktop sidebar and mobile dropdown
- `src/pages/whitepaper.astro` - Page route fetching whitepaper collection, rendering with layout
- `src/styles/whitepaper.css` - Whitepaper typography, light-mode override, TOC styles, KaTeX styling, print styles

## Decisions Made
- remarkPlugins/rehypePlugins placed inside mdx() integration config (not top-level markdown key) per Astro MDX docs
- remarkRehype footnoteLabel set to 'References' for academic paper convention (PAPER-04 preparation)
- Whitepaper uses scoped light-mode CSS custom properties rather than toggling global theme
- Mobile TOC uses native details/summary element for zero-JS accordion behavior
- Print styles added proactively to hide nav/footer/TOC for clean paper output

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs

The MDX file `src/content/whitepaper/mind-framework.mdx` contains intentional stub content (4 brief sections). This is by design -- Plan 08-02 will replace it with the full 3000-4000 word whitepaper prose.

## Next Phase Readiness
- MDX infrastructure complete, Plan 02 can focus purely on writing full whitepaper prose
- Layout, TOC, CSS, KaTeX rendering all verified working end-to-end
- Content collection schema ready for expanded frontmatter if needed
- Print styles pre-positioned for Plan 02's print/social features

## Self-Check: PASSED

All 5 created files verified present. Both task commits (c158912, d05a479) verified in git log. All 3 modified files verified present.

---
*Phase: 08-whitepaper*
*Completed: 2026-04-21*
