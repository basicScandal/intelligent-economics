---
phase: 02-content-migration
plan: 02
subsystem: ui
tags: [astro, content-collections, zod, markdown, components]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Astro project scaffold, BaseLayout, global CSS"
provides:
  - "Content collection schemas for stories and experiments (src/content.config.ts)"
  - "6 story Markdown files with typed frontmatter"
  - "4 experiment Markdown files with full HTML panel content"
  - "ZoneZeroSimulator component with all 28 DOM anchor IDs"
  - "Stories component with content-collection-driven morph scene"
  - "StoryPanel reusable component"
  - "LocalExperiments tabbed interface component"
affects: [02-content-migration, 03-conversion-funnel, 05-performance]

# Tech tracking
tech-stack:
  added: [astro-content-collections, zod-schemas, glob-loader]
  patterns: [content-collection-with-glob-loader, data-driven-components, set-html-rendering]

key-files:
  created:
    - src/content.config.ts
    - src/content/stories/medici.md
    - src/content/stories/bell-labs.md
    - src/content/stories/mondragon.md
    - src/content/stories/shenzhen.md
    - src/content/stories/estonia.md
    - src/content/stories/silicon-valley.md
    - src/content/experiments/neighborhood.md
    - src/content/experiments/startup.md
    - src/content/experiments/company.md
    - src/content/experiments/city.md
    - src/components/ZoneZeroSimulator.astro
    - src/components/Stories.astro
    - src/components/StoryPanel.astro
    - src/components/LocalExperiments.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "Used Astro 5 glob() loader for content collections instead of legacy type:'content' API"
  - "Preserved full HTML markup in experiment Markdown bodies for pixel-identical rendering via set:html"
  - "Story panel body content stored as Markdown with HTML entities for rich formatting"

patterns-established:
  - "Content collection pattern: glob loader + Zod schema + getCollection() in components"
  - "Component data flow: getCollection -> sort by sortOrder -> map to child components"
  - "DOM anchor preservation: all IDs from monolith HTML kept verbatim for script attachment"

requirements-completed: [CPRE-03, CPRE-04, ARCH-07]

# Metrics
duration: 5min
completed: 2026-04-21
---

# Phase 02 Plan 02: Content Collections & Section Components Summary

**Astro content collections with typed Zod schemas for 6 case studies and 4 experiments, plus Zone Zero simulator, Stories morph scene, and tabbed experiments components**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-21T07:15:50Z
- **Completed:** 2026-04-21T07:21:25Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Created content collection infrastructure with Zod-typed schemas for stories (9 fields) and experiments (4 fields) using Astro 5's glob loader API
- Extracted all 10 content files from the 5,127-line monolith HTML preserving exact text, stats, badge colors, and panel markup
- Built ZoneZeroSimulator component with all 28 DOM anchor IDs preserved for script attachment in Plan 03
- Built data-driven Stories and LocalExperiments components that render via getCollection(), eliminating hardcoded HTML

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content collections schema and Markdown content files** - `4fc1084` (feat)
2. **Task 2: Build ZoneZeroSimulator, Stories, StoryPanel, and LocalExperiments components** - `d7a789b` (feat)

## Files Created/Modified
- `src/content.config.ts` - Defines stories and experiments collections with Zod schemas and glob loaders
- `src/content/stories/medici.md` - Medici Bank case study (network shape, sortOrder 1)
- `src/content/stories/bell-labs.md` - Bell Labs case study (radial shape, sortOrder 2)
- `src/content/stories/mondragon.md` - Mondragon case study (rings shape, sortOrder 3)
- `src/content/stories/shenzhen.md` - Shenzhen case study (explosion shape, sortOrder 4)
- `src/content/stories/estonia.md` - Estonia case study (grid shape, sortOrder 5)
- `src/content/stories/silicon-valley.md` - Silicon Valley case study (spinout shape, sortOrder 6)
- `src/content/experiments/neighborhood.md` - Neighborhood MIND Pilot (sortOrder 1)
- `src/content/experiments/startup.md` - Startup blueprint (sortOrder 2)
- `src/content/experiments/company.md` - Corporate geometry change (sortOrder 3)
- `src/content/experiments/city.md` - Municipal Zone Zero (sortOrder 4)
- `src/components/ZoneZeroSimulator.astro` - Full simulator markup with 4 sliders, canvas, score panel, share buttons
- `src/components/Stories.astro` - Content-collection-driven morph scene wrapper
- `src/components/StoryPanel.astro` - Reusable story panel with typed props
- `src/components/LocalExperiments.astro` - Tabbed experiment interface with content collections
- `src/pages/index.astro` - Updated to import and render all new components

## Decisions Made
- **Astro 5 glob loader**: Used `glob({ pattern: '**/*.md', base: './src/content/stories' })` instead of the legacy `type: 'content'` API, which is required for Astro 5.x content collections
- **HTML in Markdown bodies**: Experiment panels contain full HTML markup (metrics, steps, CTA buttons) in their Markdown body content, rendered via `set:html` for pixel-identical output
- **Story body as Markdown with HTML entities**: Story panel bodies use `&amp;` and `<em>` tags in Markdown, rendered via `set:html` to preserve rich formatting from the original

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Used Astro 5 glob loader instead of legacy content API**
- **Found during:** Task 1
- **Issue:** Plan specified `type: 'content'` in defineCollection, but Astro 5.x requires the glob() loader pattern
- **Fix:** Used `loader: glob({ pattern: '**/*.md', base: './src/content/stories' })` syntax
- **Files modified:** src/content.config.ts
- **Verification:** `npm run build` succeeds with content syncing correctly
- **Committed in:** 4fc1084

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Single API adaptation required for Astro 5 compatibility. No scope creep.

## Issues Encountered
None beyond the content API adaptation noted above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Content collections are in place and build-verified for all downstream components
- Zone Zero simulator markup has all DOM anchors ready for script attachment in Plan 03
- Stories morph scene has canvas and panel IDs ready for Three.js and GSAP in Plan 03
- Experiment tabs have data-panel attributes and role attributes ready for tab switching script

## Self-Check: PASSED

All 15 created files verified on disk. Both task commits (4fc1084, d7a789b) verified in git log.

---
*Phase: 02-content-migration*
*Completed: 2026-04-21*
