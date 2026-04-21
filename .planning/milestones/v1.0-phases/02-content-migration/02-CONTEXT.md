# Phase 2: Content Migration - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (migration phase — preservation-focused, discuss skipped)

<domain>
## Phase Boundary

Every section of the existing site lives in maintainable Astro components with all visual fidelity preserved. The site looks and feels identical to the original monolithic HTML. This is a migration, not a redesign — the goal is structural decomposition while maintaining pixel-perfect visual fidelity.

The existing index.html (5,127 lines) contains 14+ content sections, Three.js particle systems (hero + morph engine + Zone Zero simulator), GSAP ScrollTrigger animations, interactive elements (sliders, role cards, theme toggle), and a countdown timer.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — migration/preservation phase. Key technical constraints from research:

- Three.js components MUST use `client:only="react"` or vanilla `<script>` tags — NOT `client:load` or `client:visible` (SSR crashes on `window` references)
- GSAP ScrollTrigger needs explicit `gsap.context()` cleanup pattern
- Astro content collections for case studies, team members, partner organizations (ARCH-07)
- Dark/light theme toggle preserved (ARCH-08)
- Existing CSS custom properties (:root block) already migrated to global.css in Phase 1
- No framework islands needed — vanilla JS with TypeScript modules and Astro's `<script>` bundling
- Each section becomes its own Astro component (src/components/)
- Pages compose sections via layout + component imports

### Migration Strategy
- Extract sections one at a time from index.html into src/components/
- Each component is self-contained with its own styles (Tailwind utilities + scoped styles where needed)
- Three.js/GSAP code extracted into src/scripts/ TypeScript modules
- Interactive elements (Zone Zero simulator, theme toggle) are `<script>` tag islands
- Static content sections use pure Astro (zero JS)
- Privacy page content migrated from privacy.html

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- index.html (5,127 lines) — the complete source of truth for all content, styles, and scripts
- privacy.html — privacy policy content
- src/styles/global.css — design tokens already migrated in Phase 1
- src/layouts/BaseLayout.astro — HTML shell with fonts already created in Phase 1

### Established Patterns
- Astro 5.18.x with Tailwind v4 CSS-first configuration (Phase 1)
- TypeScript strict mode
- OKLCH color palette in @theme directive

### Integration Points
- BaseLayout.astro provides the HTML shell
- global.css provides all design tokens
- Netlify deploys from dist/ on push to main

</code_context>

<specifics>
## Specific Ideas

The existing site sections (in order from index.html):
1. Hero with Three.js particle system (4,000 particles)
2. MIND Framework explanation
3. Material dimension
4. Intelligence dimension
5. Network dimension
6. Diversity dimension
7. Zone Zero interactive simulator (4 sliders + canvas + particle system)
8. Historical case studies (6 panels with particle shape morphing)
9. Dual Currency system
10. Guardian Lattice
11. Geometry Engineering
12. 90-day Roadmap
13. Partner Organizations
14. Volunteer Signup Form with role cards
15. Countdown Timer
16. Footer

Each becomes an Astro component. Three.js/GSAP code becomes TypeScript modules.

</specifics>

<deferred>
## Deferred Ideas

None — migration phase with clear scope from existing site.

</deferred>
