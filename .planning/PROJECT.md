# Intelligent Economics

## What This Is

A modern movement platform for the MIND framework (Material x Intelligence x Network x Diversity = Prosperity) — a post-GDP measure of economic health. Built on Astro with Tailwind v4, deployed on Netlify. The site converts intellectual explorers into active volunteers through an interactive experience (Three.js particles, Zone Zero simulator, GSAP animations) backed by a working conversion pipeline (Netlify Forms, MailerLite email sequences, Discord community). Now includes a data-backed whitepaper, interactive multi-scale MIND dashboard with real World Bank data, and a firm-level self-assessment tool.

## Core Value

**The volunteer conversion pipeline must work.** Every visitor who wants to join this movement must be captured, welcomed, and given a path to meaningful contribution. Without people, there is no movement.

## Requirements

### Validated

- ✓ Astro component architecture with Tailwind v4 OKLCH design tokens — v1.0
- ✓ Netlify CI/CD with auto-deploy and PR previews — v1.0
- ✓ All 14+ content sections migrated to Astro components — v1.0
- ✓ Three.js particles, GSAP animations, Zone Zero simulator preserved — v1.0
- ✓ Real form backend via Netlify Forms (no more fake success) — v1.0
- ✓ Email-first capture near hero with MailerLite integration — v1.0
- ✓ Plausible analytics with form funnel and simulator engagement tracking — v1.0
- ✓ Honest partner organizations section (no implied endorsements) — v1.0
- ✓ Welcome email sequence templates (4 emails over 14 days) — v1.0
- ✓ Discord community setup with role-based channels — v1.0
- ✓ Team/About section with founder identity and org status — v1.0
- ✓ Mobile performance optimization (3-tier adaptive particles) — v1.0
- ✓ Reduced-motion CSS fallbacks and render loop pausing — v1.0
- ✓ Content-hashed immutable cache headers — v1.0
- ✓ MIND framework HTML whitepaper with KaTeX math, scroll-spy TOC, print CSS — v1.1
- ✓ Real data integration via World Bank API (16 indicators, 217 countries) — v1.1
- ✓ Country-level MIND dashboard with ECharts radar/bar charts, search, comparison — v1.1
- ✓ Multi-scale dashboard: country + curated city profiles + firm self-assessment — v1.1
- ✓ Whitepaper ↔ dashboard bidirectional cross-linking with inline SVG charts — v1.1
- ✓ Hierarchical aggregation visualization (firm → city → country pyramid) — v1.1
- ✓ Site navigation with Whitepaper and Dashboard links — v1.1
- ✓ WCAG 2.1 AA accessibility audit on all charts — v1.1
- ✓ Lighthouse performance targets met (desktop 92, mobile 86) — v1.1

### Active

(No active requirements — define in next milestone)

## Shipped Milestones

- **v1.0 MVP** — Movement platform with conversion pipeline (shipped 2026-04-21)
- **v1.1 MIND Intelligence Layer** — Whitepaper + multi-scale dashboard + real data (shipped 2026-04-22)

### Out of Scope

- "MIND Score for My City" tool — future (P3)
- Multi-language support — future (P3)
- Volunteer matching & project boards — future (P3)
- MIND Score API — future (P3)
- OAuth/magic link login — not needed for current flow
- User accounts / authentication — not needed
- Time-series animation (Gapminder-style) — v1.2 candidate
- Choropleth world map — v1.2 candidate
- Custom indicator selection — v1.2 candidate
- Automated city/firm data from Census ACS / SEC EDGAR — v1.2 candidate

## Context

- **Shipped v1.1** — 9,553 LOC across 50+ source files (TypeScript + Astro + CSS + MDX), ~115 commits total
- **Tech stack:** Astro 5.18.x, Tailwind v4, Three.js, GSAP, ECharts 6, TypeScript strict, Netlify
- **Data layer:** `src/lib/mind-score.ts` shared library, `src/data/mind-scores.json` (217 countries, 16 World Bank indicators), `src/data/city-profiles.json` (7 curated cities)
- **Pages:** index (home), /whitepaper (3,800-word academic paper with KaTeX), /dashboard (multi-scale MIND explorer), /privacy
- **Dashboard features:** country search, radar/bar charts, comparison overlay, bookmarkable URLs, Zone Zero deep link, city profiles, firm self-assessment
- **Form pipeline:** VolunteerForm + EmailCapture → Netlify Forms → submission-created function → MailerLite
- **Performance:** Lighthouse desktop 92, mobile 86. ECharts lazy-loaded via IntersectionObserver. 82 vitest tests passing
- **Beyond GDP movement** at UN inflection point — MIND framework is academically novel (multiplicative zero-floor, Intelligence dimension)
- **Operational setup needed:** MailerLite account + API key, Plausible account ($9/mo), Discord server creation, replace PLACEHOLDER invite links

## Constraints

- **Tech Stack**: Astro static site generator — component-based, zero JS by default, Netlify-native
- **Hosting**: Netlify — handles forms natively, CI/CD from main branch
- **Privacy**: No third-party tracking cookies. Plausible analytics (GDPR-compliant).
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile. Adaptive particle counts.
- **Budget**: Volunteer/side project — free tiers where possible (Plausible is $9/mo)
- **Accessibility**: WCAG 2.1 Level AA target

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js/SvelteKit | Static site with islands — no server, Netlify-native, zero JS default | ✓ Good |
| Netlify over GitHub Pages | Native forms, CI/CD, preview deploys | ✓ Good |
| Plausible over PostHog | Lightweight, privacy-first, GDPR-compliant | ✓ Good |
| Discord over Slack | Free, public communities, role-based channels | -- Pending |
| MailerLite for email | Free tier (1K subscribers), automation, API v2 | -- Pending |
| Tailwind v4 CSS-first config | No JS config file needed, @theme directive, OKLCH native | ✓ Good |
| ECharts 6 over Chart.js | Feature depth: radar, treemap, SVG renderer, tree-shaking | ✓ Good |
| Build-time World Bank fetch | No runtime API calls, committed JSON baseline, offline builds | ✓ Good |
| MDX for whitepaper | Content collection with remark/rehype plugins, KaTeX math | ✓ Good |
| Empirical normalization (1st/99th percentile) | Avoids micro-state skew, reflects real data range | ✓ Good |
| Geometric mean MIND formula | Multiplicative — zero-floor property IS the MIND thesis | ✓ Good |
| SVG renderer for ECharts | Better a11y, lower mobile memory, faster for small data sets | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 after v1.1 milestone completion*
