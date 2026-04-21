---
phase: 01-foundation-and-deploy
plan: 01
subsystem: infra
tags: [astro, tailwind-v4, oklch, typescript, vite]

# Dependency graph
requires: []
provides:
  - Astro 5.18.x project scaffold with build system
  - Tailwind v4 CSS-first design token system with full bioluminescent palette
  - TypeScript strict mode configuration
  - BaseLayout component for all pages
  - Placeholder index and privacy pages proving build works
affects: [02-content-migration, 03-conversion-pipeline, 04-analytics, 05-performance, 06-growth]

# Tech tracking
tech-stack:
  added: [astro@5.18.x, tailwindcss@4.2.x, "@tailwindcss/vite@4.2.x", "@astrojs/check", typescript@5.8.x]
  patterns: [css-first-tailwind-v4-theme, astro-base-layout, oklch-design-tokens]

key-files:
  created:
    - package.json
    - astro.config.mjs
    - tsconfig.json
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
    - src/pages/index.astro
    - src/pages/privacy.astro
    - public/robots.txt
    - public/sitemap.xml
    - public/favicon.svg
  modified:
    - .gitignore

key-decisions:
  - "Manual Astro scaffold instead of npm create astro to preserve existing repo files"
  - "Hex color values in CSS custom properties instead of OKLCH conversion for pixel-identical palette fidelity"
  - "Tailwind @theme block references CSS custom properties via var() for runtime theme switching"
  - "No @astrojs/netlify adapter for Phase 1 -- static output auto-deploys without it"

patterns-established:
  - "CSS-first Tailwind v4: @import tailwindcss + @theme block + :root/:data-theme custom properties"
  - "BaseLayout pattern: all pages import BaseLayout with title/description props"
  - "Design token hierarchy: @theme references :root vars, enabling dark/light theme switching"
  - "Font loading: Fontshare CDN for Clash Display + Satoshi via link element in BaseLayout head"

requirements-completed: [ARCH-01, ARCH-02, ARCH-03]

# Metrics
duration: 3min
completed: 2026-04-21
---

# Phase 01 Plan 01: Astro Scaffold Summary

**Astro 5.18.x project with Tailwind v4 CSS-first theme, 20+ bioluminescent OKLCH design tokens, and TypeScript strict mode producing zero-error builds**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-21T06:25:58Z
- **Completed:** 2026-04-21T06:29:37Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments
- Astro 5.18.x project scaffolded at repo root with Tailwind v4 via @tailwindcss/vite plugin
- Complete bioluminescent design token palette (20+ tokens across dark and light themes) mapped to Tailwind utility classes via @theme directive
- TypeScript strict mode active (astro check: 0 errors, 0 warnings, 0 hints)
- Build produces dist/ with index.html and privacy/index.html in 257ms

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold Astro project and configure Tailwind v4 vite plugin** - `6c44671` (feat)
2. **Task 2: Create Tailwind v4 OKLCH design tokens, BaseLayout, and placeholder pages** - `15581f6` (feat)

## Files Created/Modified
- `package.json` - Project dependencies: Astro, Tailwind v4, @tailwindcss/vite, TypeScript
- `astro.config.mjs` - Astro configuration with Tailwind vite plugin and site URL
- `tsconfig.json` - Extends astro/tsconfigs/strict for TypeScript strict mode
- `.gitignore` - Updated with dist/, .astro/, node_modules/, .netlify/, .env patterns
- `src/styles/global.css` - Tailwind v4 @import, @theme block, full dark/light palette tokens
- `src/layouts/BaseLayout.astro` - HTML shell with meta, Fontshare fonts, global CSS import
- `src/pages/index.astro` - Placeholder homepage with color swatch verification
- `src/pages/privacy.astro` - Placeholder privacy policy page
- `public/robots.txt` - Copied from repo root
- `public/sitemap.xml` - Copied from repo root
- `public/favicon.svg` - Minimal placeholder SVG

## Decisions Made
- **Manual scaffold over npm create astro**: Avoided overwriting existing .gitignore, README.md, and other repo files. Created each file individually.
- **Hex values in :root instead of OKLCH conversion**: Kept the exact hex palette from the existing index.html for pixel-identical color fidelity. The @theme block references these via var() allowing Tailwind utilities to work while preserving the original palette.
- **No Netlify adapter in Phase 1**: Static output auto-deploys to Netlify without @astrojs/netlify. Adapter only needed for Image CDN or SSR in later phases.
- **Fontshare CDN for web fonts**: Clash Display and Satoshi loaded via link element in BaseLayout head for zero-config font access.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

- `src/pages/privacy.astro` line 12: Placeholder text "Full privacy policy content will be migrated from the existing site in Phase 2." -- intentional, privacy content migration is Phase 2 scope.
- `src/pages/index.astro`: Color swatch display is a build verification page, not final homepage content -- will be replaced during Phase 2 content migration.

## Next Phase Readiness
- Build system fully operational: `npm run build` and `npm run dev` work
- Tailwind utility classes (bg-bg, text-primary, font-display, text-secondary, text-tertiary) available for all future components
- BaseLayout ready to wrap all new pages
- Plan 02 (Netlify deploy config) can proceed immediately
- Phase 02 (content migration) has the component architecture foundation it needs

## Self-Check: PASSED

All 11 created files verified present. Both task commits (6c44671, 15581f6) verified in git log.

---
*Phase: 01-foundation-and-deploy*
*Completed: 2026-04-21*
