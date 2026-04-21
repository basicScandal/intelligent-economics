# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Global Growth Foundation

**Shipped:** 2026-04-21
**Phases:** 6 | **Plans:** 14 | **Commits:** 77

### What Was Built
- Astro 5.18.x scaffold with Tailwind v4 CSS-first OKLCH design tokens and Netlify CI/CD
- All 14+ content sections migrated to Astro components with Three.js particles, GSAP animations, and Zone Zero simulator preserved
- Fetch-based Netlify Forms for volunteer signup and email capture with inline success/error states
- Partner section rewritten with honest framing and visible disclaimer
- Netlify Function syncing form submissions to MailerLite for welcome sequence automation
- Plausible analytics with 6 custom events (form funnel + simulator engagement)
- 3-tier device detection with adaptive particle counts, render loop pausing, reduced-motion fallbacks, and immutable cache headers
- Team/About section with founder identity, Discord invite CTA, 4-email welcome sequence templates, and Discord server setup guide

### What Worked
- **GSD workflow discipline** — 6 phases, 14 plans, all executed systematically with verification at each step
- **Plan-before-code approach** — every phase had context docs and detailed plans before touching code, preventing mid-phase scope drift
- **Component extraction pattern** — migrating monolithic HTML to Astro components was clean because the CSS split (sections.css) happened early in Phase 2
- **Vanilla JS over framework islands** — Astro's native script bundling with TypeScript modules avoided framework overhead entirely. No React, no Svelte, just typed scripts
- **npm imports over CDN** — Three.js and GSAP via npm (not CDN globals) enabled tree-shaking and deterministic builds
- **Parallel phase execution** — Phases 4, 5, 6 were correctly identified as parallelizable after Phase 3, enabling efficient batching

### What Was Inefficient
- **All 6 phases completed in one day** — the plans were documentation-first (templates, guides, setup instructions) rather than heavy implementation, so execution was fast but operational setup (MailerLite, Plausible, Discord accounts) remains undone
- **ARCH-04 left pending** — Netlify auto-deploy verification requires a live site, which couldn't be tested in the planning-heavy workflow
- **Phase verification was partial** — Phases 4-6 had "skipped" verification because they produce operational artifacts (analytics dashboards, email sequences, Discord servers) that can't be verified without accounts
- **ROADMAP checkboxes inconsistency** — phase-level checkboxes weren't checked even though all plans were marked complete. Minor bookkeeping issue caught at milestone close

### Patterns Established
- CSS-first Tailwind v4 with `@theme` directive and OKLCH color space — no JS config file
- `device-detect.ts` as shared utility for tier-based Three.js optimization
- Netlify Forms AJAX pattern: fetch POST to current URL with URLSearchParams body
- Netlify Functions v2 format with graceful degradation (always returns 200)
- Plausible queue stub pattern for early event capture before script loads
- IntersectionObserver pattern: separate observers for analytics vs. render loop pausing

### Key Lessons
1. **Documentation-as-deliverable is fast but creates operational debt** — welcome email templates, Discord setup guides, and DNS docs shipped quickly but the operational work of setting up accounts/pasting templates is a separate effort the project owner must do
2. **Content migration is the hardest phase** — Phase 2 had the most plans (4) and most files (58). Monolith-to-component extraction with Three.js/GSAP preservation required careful ordering
3. **Verification needs live environments** — several phases couldn't be fully verified because they depend on third-party services (Netlify, Plausible, MailerLite, Discord). Future milestones should budget for operational setup as a phase

### Cost Observations
- Model mix: primarily Opus for execution, Sonnet for summaries/docs
- Sessions: ~5 sessions across 6 days
- Notable: entire v1.0 planned and executed in under a week due to GSD workflow efficiency

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~5 | 6 | Established GSD workflow, plan-then-execute pattern |

### Cumulative Quality

| Milestone | Requirements | Coverage | Tech Debt Items |
|-----------|-------------|----------|-----------------|
| v1.0 | 38/39 | 97% | 7 (all operational) |

### Top Lessons (Verified Across Milestones)

1. Plan-before-code prevents scope drift and enables parallel execution
2. Operational setup (accounts, API keys, DNS) should be tracked as explicit tasks, not assumed
