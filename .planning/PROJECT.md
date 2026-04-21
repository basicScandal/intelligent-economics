# Intelligent Economics

## What This Is

A modern movement platform for the MIND framework (Material x Intelligence x Network x Diversity = Prosperity) — a post-GDP measure of economic health. Built on Astro with Tailwind v4, deployed on Netlify. The site converts intellectual explorers into active volunteers through an interactive experience (Three.js particles, Zone Zero simulator, GSAP animations) backed by a working conversion pipeline (Netlify Forms, MailerLite email sequences, Discord community).

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

### Active

- [ ] MIND framework HTML whitepaper accessible to general public and policymakers
- [ ] Multi-scale interactive MIND dashboard (firm → city → country → global)
- ✓ Real data integration via World Bank API (16 indicators, 217 countries) — v1.1 Phase 7
- [ ] Hierarchical aggregation visualization showing MIND score composition upward

## Current Milestone: v1.1 MIND Intelligence Layer

**Goal:** Give the MIND framework intellectual credibility with a public whitepaper and real-world proof via an interactive multi-scale dashboard.

**Target features:**
- HTML whitepaper — publishable MIND framework paper on the site
- Multi-scale MIND dashboard — interactive data visualization at 4 levels: firm → city → country → global
- Real data integration — World Bank API for countries, public APIs for cities/firms, user-input hybrid where unavailable
- Hierarchical aggregation — visual showing how MIND scores compose upward

### Out of Scope

- MIND Score whitepaper / academic paper — moved to Active (v1.1)
- Real MIND dashboard with World Bank data — moved to Active (v1.1)
- "MIND Score for My City" tool — future (P3)
- Multi-language support — future (P3)
- Volunteer matching & project boards — future (P3)
- MIND Score API — future (P3)
- OAuth/magic link login — not needed for current flow
- User accounts / authentication — not needed for v1

## Context

- **v1.1 Phase 7 complete** — Shared MIND score library (`src/lib/mind-score.ts`), World Bank data pipeline, 217-country JSON baseline committed
- **Shipped v1.0** — 37 source files, 6,281 LOC (TypeScript + Astro + CSS), 66 commits
- **Tech stack:** Astro 5.18.x, Tailwind v4 (CSS-first), Three.js, GSAP, TypeScript strict, Netlify
- **Site architecture:** 14+ Astro components, 6 content collection entries, 8 TypeScript modules, 1 Netlify Function
- **Form pipeline:** VolunteerForm + EmailCapture → Netlify Forms → submission-created function → MailerLite
- **Performance:** 3-tier device detection (full/reduced/minimal), IntersectionObserver render pausing, CSS gradient fallbacks
- **Analytics:** Plausible with 6 custom events (Form Viewed/Started/Submitted, Simulator Opened/Interacted/Shared)
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
| P0+P1 scope for v1 | Fix funnel + growth engine before platform features | ✓ Good |
| Discord over Slack | Free, public communities, role-based channels | -- Pending |
| No Netlify adapter for static | Adapter only needed for SSR; static output auto-detected | ✓ Good |
| Vanilla script tags over framework islands | No React/Svelte needed; Astro native script bundling works | ✓ Good |
| MailerLite for email | Free tier (1K subscribers), automation, API v2 | -- Pending |
| Tailwind v4 CSS-first config | No JS config file needed, @theme directive, OKLCH native | ✓ Good |

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
*Last updated: 2026-04-21 after Phase 7 completion*
