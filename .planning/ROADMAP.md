# Roadmap: Intelligent Economics

## Overview

Transform the existing monolithic HTML site into a modern Astro-based movement platform with a working volunteer conversion pipeline. The journey progresses from project scaffold and deployment, through content migration preserving all visual quality, to a functioning form backend and email pipeline, analytics instrumentation, mobile performance optimization, and finally the full growth engine (welcome sequence, Discord, team page). The site should be deployable and useful after the content migration phase, with conversion and growth capabilities layered on top.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Deploy** - Astro project scaffold with Tailwind v4, CI/CD to Netlify, email DNS records for domain warming
- [ ] **Phase 2: Content Migration** - All 14+ existing sections migrated to Astro components with Three.js/GSAP preserved
- [ ] **Phase 3: Conversion Pipeline** - Working forms, email capture, MailerLite integration, and partner section fix
- [ ] **Phase 4: Analytics and Tracking** - Plausible analytics with funnel and engagement event tracking
- [ ] **Phase 5: Performance Optimization** - Device tier detection, adaptive particle counts, render loop management, Lighthouse targets
- [ ] **Phase 6: Growth Engine** - Welcome email sequence, Discord community, team page, organizational identity

## Phase Details

### Phase 1: Foundation and Deploy
**Goal**: A deployable Astro project exists on Netlify with the build system, styling foundation, and email infrastructure ready for content
**Depends on**: Nothing (first phase)
**Requirements**: ARCH-01, ARCH-02, ARCH-03, ARCH-04
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` produces a static site with zero errors
  2. Pushing to main branch triggers an automatic Netlify deploy that completes successfully
  3. PRs generate preview deploy URLs that are visitable
  4. Tailwind v4 utility classes render correctly with the bioluminescent OKLCH palette
  5. SPF, DKIM, and DMARC DNS records are configured on the domain (verified via MXToolbox or equivalent)
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Astro 5.18.x scaffold with Tailwind v4 OKLCH design tokens and placeholder pages
- [ ] 01-02-PLAN.md — Netlify CI/CD pipeline, GitHub Pages cleanup, and email DNS documentation

### Phase 2: Content Migration
**Goal**: Every section of the existing site lives in maintainable Astro components with all visual fidelity preserved — the site looks and feels identical to the original
**Depends on**: Phase 1
**Requirements**: CPRE-01, CPRE-02, CPRE-03, CPRE-04, CPRE-05, CPRE-06, CPRE-07, CPRE-08, ARCH-07, ARCH-08
**Success Criteria** (what must be TRUE):
  1. All 14+ content sections are visible and navigable on the deployed site
  2. Three.js particle hero animates on page load with scroll-driven morph behavior
  3. Zone Zero simulator responds to all 4 MIND dimension sliders with visual feedback
  4. GSAP ScrollTrigger animations fire at correct scroll positions with diagonal clip-path wipes
  5. Dark/light theme toggle switches all sections correctly
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD
- [ ] 02-04: TBD

### Phase 3: Conversion Pipeline
**Goal**: Volunteer signups and email captures are reliably persisted — no submission is ever silently lost again
**Depends on**: Phase 2
**Requirements**: CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, CONV-06, CONV-10
**Success Criteria** (what must be TRUE):
  1. Submitting the volunteer form shows a real success message only after data appears in Netlify Forms dashboard
  2. If submission fails (network error, server error), user sees an error message with a retry button
  3. A single-field email capture is visible within the first 2 viewport heights without scrolling past the hero
  4. Submitting the email capture adds the subscriber to MailerLite and triggers the automation sequence
  5. Partner organizations section displays "Organizations working in this space" framing with visible disclaimer
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

### Phase 4: Analytics and Tracking
**Goal**: The team can see exactly how visitors move through the site and where the funnel leaks
**Depends on**: Phase 3
**Requirements**: CONV-07, CONV-08, CONV-09
**Success Criteria** (what must be TRUE):
  1. Plausible dashboard shows page views, scroll depth, traffic sources, and geographic distribution
  2. Form funnel events (viewed, started filling, submitted) appear as trackable goals in Plausible
  3. Zone Zero simulator engagement events (opened, interacted, shared) appear in analytics
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

### Phase 5: Performance Optimization
**Goal**: The site runs smoothly on mid-range mobile devices without draining battery or dropping frames
**Depends on**: Phase 2
**Requirements**: ARCH-05, ARCH-06, PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06
**Success Criteria** (what must be TRUE):
  1. Lighthouse scores meet or exceed 90 (desktop) and 75 (mobile) on the deployed site
  2. On a mid-range phone, frame rate stays above 24fps during scroll with particles active
  3. Visiting the site with `prefers-reduced-motion: reduce` shows zero particle animation (CSS fallback only)
  4. Scrolling past a Three.js section pauses its render loop (verified via DevTools frame counter)
  5. CSS and JS assets have content-hashed filenames and return proper cache headers
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD
- [ ] 05-03: TBD

### Phase 6: Growth Engine
**Goal**: New signups receive a structured welcome experience that moves them from email subscriber to active community member
**Depends on**: Phase 3
**Requirements**: GROW-01, GROW-02, GROW-03, GROW-04, GROW-05, GROW-06, GROW-07
**Success Criteria** (what must be TRUE):
  1. A new email subscriber receives 4 emails over 14 days, each with a single clear CTA and unsubscribe link
  2. Discord server has role-based channels and the invite link appears on the form success screen
  3. Team/About section shows at least one named person with photo and bio
  4. Organizational status ("Forming as a nonprofit" or equivalent) is visible on the about section
  5. Contact method (email or form) is available on the team page
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD
- [ ] 06-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6
Note: Phase 4 depends on Phase 3. Phase 5 depends on Phase 2 (can run in parallel with 3/4/6). Phase 6 depends on Phase 3.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Deploy | 0/2 | Planning complete | - |
| 2. Content Migration | 0/4 | Not started | - |
| 3. Conversion Pipeline | 0/3 | Not started | - |
| 4. Analytics and Tracking | 0/1 | Not started | - |
| 5. Performance Optimization | 0/3 | Not started | - |
| 6. Growth Engine | 0/3 | Not started | - |
