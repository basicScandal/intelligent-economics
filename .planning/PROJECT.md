# Intelligent Economics

## What This Is

A movement platform proposing the MIND framework (Material x Intelligence x Network x Diversity = Prosperity) as a post-GDP measure of economic health. The site is the movement's front door — converting intellectual explorers into active volunteers, and giving policy practitioners the tools to evaluate MIND for their jurisdictions. Currently a visually striking but functionally broken single-page site; this milestone transforms it into a modern, conversion-ready platform.

## Core Value

**The volunteer conversion pipeline must work.** Every visitor who wants to join this movement must be captured, welcomed, and given a path to meaningful contribution. Without people, there is no movement.

## Requirements

### Validated

- Site content and intellectual framework (MIND model, Zone Zero simulator, historical case studies, nucleation strategy) — existing, compelling, well-written
- Visual design language (dark-first bioluminescent palette, Three.js particles, GSAP animations) — existing, striking
- Privacy policy page — existing
- Basic accessibility (aria labels, reduced motion, focus-visible) — existing

### Active

- [ ] Migrate from monolithic HTML to Astro component architecture
- [ ] Deploy on Netlify with CI/CD from main branch
- [ ] Real form backend that persists volunteer data
- [ ] Privacy-respecting analytics (Plausible)
- [ ] Honest partner organizations section (no implied endorsements)
- [ ] Email-first lightweight signup near hero section
- [ ] Community infrastructure (Discord with role-based channels)
- [ ] Team/About section with named founder(s)
- [ ] Welcome email sequence (4 emails over 14 days)
- [ ] Mobile performance optimization (conditional particle reduction)

### Out of Scope

- MIND Score whitepaper / academic paper — deferred to next milestone (P2)
- Real MIND dashboard with World Bank data — deferred to next milestone (P2)
- "MIND Score for My City" tool — future (P3)
- Multi-language support — future (P3)
- Volunteer matching & project boards — future (P3)
- MIND Score API — future (P3)
- OAuth/magic link login — not needed for v1 signup flow

## Context

- **Beyond GDP movement** is at a UN-level inflection point (2024-2025). No existing framework treats dimensional zero as categorically fatal or includes an Intelligence/AI dimension. This is academically novel.
- **Current site** is a 5,127-line monolithic HTML file (226KB) with inline CSS/JS. Three.js particle hero (4,000 particles), GSAP scroll animations, interactive Zone Zero simulator with 4 MIND dimension sliders. Visually impressive but unmaintainable.
- **Form is broken** — `e.preventDefault()` fakes success, data is discarded. Every volunteer "signup" is lost.
- **No analytics** — flying blind on visitor behavior, funnel effectiveness, content engagement.
- **Countdown timer** targets 1000-day window ending 2029-01-09.
- **Form submissions** currently configured for FormSubmit.co to Rob@theoradical.ai but need confirmation click.
- **Existing planning docs:** SPEC.md (full product spec), BRAINSTORM.md (site analysis), BUSINESS-PANEL.md (strategic analysis), RESEARCH.md (competitive landscape), SPEC-PANEL.md (technical review).

## Constraints

- **Tech Stack**: Astro static site generator — component-based, zero JS by default, Netlify-native
- **Hosting**: Netlify — handles forms natively, easy CI/CD, already partially configured
- **Privacy**: No third-party tracking cookies. Analytics must be GDPR-compliant (Plausible).
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile. Particles reduced on constrained devices.
- **Budget**: Volunteer/side project — prefer free tiers and open source tooling
- **Accessibility**: WCAG 2.1 Level AA target

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js/SvelteKit | Static site with islands of interactivity — no server needed, Netlify-native, zero JS by default | -- Pending |
| Netlify over GitHub Pages | Native form handling, better CI/CD, already partially configured | -- Pending |
| Plausible over PostHog | Lighter weight, privacy-first, simpler for a movement site | -- Pending |
| P0+P1 scope for v1 milestone | Fix the funnel + build growth engine before expanding platform features | -- Pending |
| Discord over Slack for community | Free, better for public communities, role-based channels | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-21 after initialization*
