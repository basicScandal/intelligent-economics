# Phase 5: Performance Optimization - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Make the site run smoothly on mid-range mobile devices without draining battery or dropping frames. Implement device capability detection, adaptive particle counts, render loop management, reduced-motion support, and asset optimization to hit Lighthouse targets.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure performance/infrastructure phase. Key constraints:
- device-detect.ts already exists from Phase 2 — enhance with tier classification
- Three.js particle counts: full (4000/3200/1800), reduced (1500/1200/800), minimal (CSS fallback)
- IntersectionObserver pauses off-screen WebGL render loops
- `prefers-reduced-motion: reduce` disables all particle animation
- Lighthouse >= 90 desktop, >= 75 mobile
- Content-hashed filenames for cache headers (Astro/Vite handles this)

</decisions>

<code_context>
## Existing Code Insights

### Key Files to Modify
- src/scripts/device-detect.ts — already has basic detection, needs tier classification (full/reduced/minimal)
- src/scripts/hero-particles.ts — needs to consume device tier for particle count
- src/scripts/morph-engine.ts — needs to consume device tier for particle count
- src/scripts/zone-zero.ts — needs to consume device tier for particle count
- src/styles/global.css — needs reduced-motion media query for CSS fallbacks

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the 8 ARCH/PERF requirements.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
