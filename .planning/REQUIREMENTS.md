# Requirements: Intelligent Economics

**Defined:** 2026-04-21
**Core Value:** The volunteer conversion pipeline must work. Every visitor who wants to join this movement must be captured, welcomed, and given a path to meaningful contribution.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Architecture

- [x] **ARCH-01**: Site is built with Astro component architecture — no single file exceeds 500 lines
- [x] **ARCH-02**: CSS uses Tailwind v4 with design tokens matching existing bioluminescent palette
- [x] **ARCH-03**: JavaScript/TypeScript modules are bundled per-component with tree-shaking
- [ ] **ARCH-04**: Site auto-deploys to Netlify from main branch with preview deploys on PRs
- [ ] **ARCH-05**: Device capability detection classifies visitors into full/reduced/minimal tiers
- [ ] **ARCH-06**: Three.js particle count adapts to device tier (full: 4000, reduced: 1500, minimal: CSS fallback)
- [x] **ARCH-07**: Content collections manage case studies, team members, and partner organizations
- [x] **ARCH-08**: Dark/light theme toggle preserved from existing site

### Conversion

- [x] **CONV-01**: Volunteer form data persists to Netlify Forms on submission (name, email, location, expertise, bandwidth, roles, message, timestamp)
- [x] **CONV-02**: User sees real success confirmation only after data is confirmed persisted
- [x] **CONV-03**: If form submission fails, user sees error message with retry option
- [x] **CONV-04**: Duplicate email submissions are flagged but not rejected
- [x] **CONV-05**: Single-field email capture visible within first 2 viewport heights of hero
- [ ] **CONV-06**: Email capture submits to MailerLite and triggers welcome sequence
- [ ] **CONV-07**: Plausible analytics tracks page views, scroll depth, traffic sources, geographic distribution
- [ ] **CONV-08**: Form funnel tracked: viewed form, started filling, submitted
- [ ] **CONV-09**: Zone Zero simulator engagement tracked: opened, interacted, shared
- [x] **CONV-10**: Partner organizations section renamed — no implied endorsements, disclaimer visible

### Growth

- [ ] **GROW-01**: 4-email welcome sequence over 14 days via MailerLite (welcome + MIND explainer, simulator deep-dive, first micro-task by role, progress update + feedback ask)
- [ ] **GROW-02**: Each welcome email has single clear CTA and unsubscribe link
- [ ] **GROW-03**: Discord server with role-based channels (#introductions, #economists, #engineers, #designers, #organizers, #researchers, #policymakers, #zone-zero-ideas, #general)
- [ ] **GROW-04**: Discord invite link shown on form success screen and included in welcome emails
- [ ] **GROW-05**: Team/About section shows at least one named person with photo/avatar and bio
- [ ] **GROW-06**: Contact email or form available on team page
- [ ] **GROW-07**: Organizational status stated (e.g., "Forming as a nonprofit")

### Performance

- [ ] **PERF-01**: Lighthouse performance score >= 90 on desktop, >= 75 on mobile
- [ ] **PERF-02**: Three.js particles reduced on mobile: hero 4000->1500, morph 3200->1200, Zone Zero 1800->800
- [ ] **PERF-03**: `prefers-reduced-motion: reduce` disables all particle animation entirely
- [ ] **PERF-04**: Frame rate stays above 24fps on mid-range mobile devices (Pixel 7a / iPhone 12 equivalent)
- [ ] **PERF-05**: IntersectionObserver pauses off-screen WebGL render loops
- [ ] **PERF-06**: CSS and JS externalized and cacheable with content hashing

### Content Preservation

- [x] **CPRE-01**: All 14+ existing content sections preserved in Astro components
- [x] **CPRE-02**: Three.js particle hero with scroll-driven morph engine preserved
- [x] **CPRE-03**: Interactive Zone Zero simulator with 4 MIND dimension sliders preserved
- [x] **CPRE-04**: 6 historical case study panels preserved
- [x] **CPRE-05**: GSAP ScrollTrigger animations with clip-path diagonal wipes preserved
- [x] **CPRE-06**: Volunteer signup form with role selection cards preserved
- [x] **CPRE-07**: Countdown timer (1000-day window ending 2029-01-09) preserved
- [x] **CPRE-08**: Privacy policy page preserved and linked from form and footer

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Credibility Tools

- **CRED-01**: MIND Score whitepaper — downloadable PDF, 8-15 pages, citable with DOI
- **CRED-02**: Real MIND dashboard with World Bank/OECD data for 20+ countries
- **CRED-03**: Country comparison tool (side-by-side 2-3 countries)
- **CRED-04**: Countdown context tooltip explaining the 1000-day window milestone

### Scale

- **SCAL-01**: "MIND Score for My City" tool with proxy data calculation
- **SCAL-02**: Multi-language support (Spanish, French, Mandarin)
- **SCAL-03**: Volunteer matching and project boards
- **SCAL-04**: MIND Score API endpoint

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | Unnecessary for v1 signup and email flow |
| Donation / payment processing | Premature — no organizational structure to receive funds |
| Blog / CMS | Content is static and curated, not user-generated |
| Gamification / points system | Adds complexity without value at pre-traction stage |
| AI chatbot | Off-brand for an economics framework site |
| View Transitions (Astro) | Risk to GSAP ScrollTrigger stability — defer until core animations stable |
| Server-side rendering | Static site sufficient — no dynamic content requiring SSR |
| OAuth / magic link login | Email capture is sufficient for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ARCH-01 | Phase 1 | Complete |
| ARCH-02 | Phase 1 | Complete |
| ARCH-03 | Phase 1 | Complete |
| ARCH-04 | Phase 1 | Pending |
| ARCH-05 | Phase 5 | Pending |
| ARCH-06 | Phase 5 | Pending |
| ARCH-07 | Phase 2 | Complete |
| ARCH-08 | Phase 2 | Complete |
| CONV-01 | Phase 3 | Complete |
| CONV-02 | Phase 3 | Complete |
| CONV-03 | Phase 3 | Complete |
| CONV-04 | Phase 3 | Complete |
| CONV-05 | Phase 3 | Complete |
| CONV-06 | Phase 3 | Pending |
| CONV-07 | Phase 4 | Pending |
| CONV-08 | Phase 4 | Pending |
| CONV-09 | Phase 4 | Pending |
| CONV-10 | Phase 3 | Complete |
| GROW-01 | Phase 6 | Pending |
| GROW-02 | Phase 6 | Pending |
| GROW-03 | Phase 6 | Pending |
| GROW-04 | Phase 6 | Pending |
| GROW-05 | Phase 6 | Pending |
| GROW-06 | Phase 6 | Pending |
| GROW-07 | Phase 6 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| PERF-05 | Phase 5 | Pending |
| PERF-06 | Phase 5 | Pending |
| CPRE-01 | Phase 2 | Complete |
| CPRE-02 | Phase 2 | Complete |
| CPRE-03 | Phase 2 | Complete |
| CPRE-04 | Phase 2 | Complete |
| CPRE-05 | Phase 2 | Complete |
| CPRE-06 | Phase 2 | Complete |
| CPRE-07 | Phase 2 | Complete |
| CPRE-08 | Phase 2 | Complete |

**Coverage:**
- v1 requirements: 39 total
- Mapped to phases: 39
- Unmapped: 0

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-04-21 after roadmap phase mapping*
