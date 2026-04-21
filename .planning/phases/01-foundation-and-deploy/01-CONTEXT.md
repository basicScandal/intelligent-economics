# Phase 1: Foundation and Deploy - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

A deployable Astro project exists on Netlify with the build system, styling foundation, and email infrastructure ready for content. This phase creates the scaffold that all subsequent phases build on: Astro 5.x project structure, Tailwind v4 with OKLCH design tokens matching the existing bioluminescent palette, TypeScript configuration, Netlify adapter and CI/CD pipeline, and SPF/DKIM/DMARC DNS records for email domain warming.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions. Key technical constraints from research:
- Astro 5.x (not 6 beta) with @astrojs/netlify adapter
- Tailwind v4 via @tailwindcss/vite plugin (no PostCSS config needed)
- OKLCH color space for bioluminescent palette tokens
- TypeScript strict mode for all modules

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Existing index.html contains the full color palette (dark-first bioluminescent theme)
- Privacy policy page (privacy.html) to be preserved
- robots.txt and sitemap.xml templates exist

### Established Patterns
- GitHub Actions workflow exists in .github/workflows/
- Netlify partially configured (.netlify/ directory present)
- FormSubmit.co integration (to be replaced with Netlify Forms in Phase 3)

### Integration Points
- Netlify deploy from main branch
- GitHub repo: basicScandal/intelligent-economics

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
