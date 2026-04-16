# Intelligent Economics — Product Specification

**Version:** 1.0
**Date:** 2026-04-16
**Status:** Draft
**Derived from:** BRAINSTORM.md, RESEARCH.md, BUSINESS-PANEL.md, SPEC-PANEL.md

---

## 1. Vision & Success Metrics

### Vision Statement

Build the definitive measurement framework and interactive toolset for post-GDP economic health assessment, anchored by the MIND multiplicative model (Material × Intelligence × Network × Diversity = Prosperity).

### 90-Day Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Volunteer signups captured | 200+ | Database count (currently: 0 — form is broken) |
| Email list subscribers | 500+ | Newsletter provider dashboard |
| Active community members | 50+ | Discord/Slack weekly active users |
| Academic paper | Published pre-print | SSRN + arXiv submission |
| Named founding team | 3-5 people | Public team page on site |
| Pilot city conversations | 3+ jurisdictions contacted | CRM/tracker |
| Site analytics baseline | Established | Plausible dashboard with 30 days of data |

### North Star Metric

**Volunteer-to-active-contributor conversion rate** — the percentage of signups who complete at least one meaningful action within 30 days.

---

## 2. User Personas

### Persona 1: The Intellectual Explorer

- **Who:** Educated generalist, follows economic/tech discourse, reads Substack/longform
- **Job to be Done:** "Help me understand why the economy feels broken and give me a framework to think about it"
- **Entry point:** Social media share, search result, or friend's link
- **Success state:** Understands MIND model, shares Zone Zero simulator, bookmarks site
- **Current support:** Strong (14 sections of content, compelling writing)
- **Gap:** Cognitive overload — too many novel concepts on one page

### Persona 2: The Potential Volunteer

- **Who:** Purpose-driven professional (economist, engineer, designer, organizer) seeking meaningful contribution
- **Job to be Done:** "Give me something meaningful to contribute to — a role, a community, a sense of agency"
- **Entry point:** Direct link to volunteer section, or scrolled from Explorer experience
- **Success state:** Signed up, joined community, received first task within 7 days
- **Current support:** Weak — form exists but data is discarded, no community exists
- **Gap:** Entire post-signup journey is missing

### Persona 3: The Policy Practitioner

- **Who:** City planner, policy advisor, municipal economist, think tank researcher
- **Job to be Done:** "Help me evaluate whether MIND measurement could work in my jurisdiction"
- **Entry point:** Academic paper citation, conference mention, peer recommendation
- **Success state:** Downloaded whitepaper, ran MIND calculation for their city, contacted team
- **Current support:** None — no whitepaper, no data tools, no contact mechanism
- **Gap:** No practitioner-facing materials exist

---

## 3. Functional Requirements

### P0 — Critical (Must fix this week)

#### FR-001: Form Submission Backend
**Description:** Volunteer form data must be persisted when submitted.
**Current state:** `e.preventDefault()` → fake success → data discarded.
**Requirement:** On form submit, POST data to a backend service. Persist: first_name, last_name, email, location, expertise, bandwidth, roles, message, timestamp.
**Acceptance criteria:**
- Form data appears in a queryable datastore within 5 seconds of submission
- User sees real success confirmation only after data is confirmed persisted
- If submission fails, user sees an error message with retry option
- Duplicate email submissions are flagged but not rejected

**Implementation:** Formspree (immediate) or Supabase (Phase 2).

#### FR-002: Analytics Integration
**Description:** Track visitor behavior to measure funnel effectiveness.
**Requirement:** Privacy-respecting analytics capturing: page views, scroll depth, form start/completion, Zone Zero interactions, role card selections.
**Acceptance criteria:**
- Dashboard shows daily visitor count, traffic sources, and geographic distribution
- Scroll depth heatmap shows where visitors drop off
- Form funnel shows: viewed form → started filling → submitted
- Zone Zero engagement tracked: opened, interacted, shared

**Implementation:** Plausible Analytics (script tag + dashboard).

#### FR-003: Honest Partner Organizations Section
**Description:** Current section implies endorsement from OpenAI, Anthropic, Brookings, etc.
**Requirement:** Rename to "Organizations Aligned with This Vision" or "Complementary Work in the Ecosystem." Add disclaimer: "These are independent organizations doing parallel work. Listing does not imply partnership or endorsement."
**Acceptance criteria:**
- Section title does not use the word "partner"
- Disclaimer text is visible without scrolling within the section
- No org logo or branding is used without permission

---

### P1 — High Priority (Month 1)

#### FR-004: Email-First Lightweight Signup
**Description:** Capture interested visitors before they reach the full form.
**Requirement:** Single-field email capture near the hero section (after the first scroll). On submit, add to newsletter list. Show: "We'll send your first mission in 24 hours."
**Acceptance criteria:**
- Email input + submit button visible within first 2 viewport heights
- Submission adds email to newsletter provider (Buttondown/Substack)
- Auto-welcome email sent within 24 hours with: MIND explainer, Zone Zero link, community invite
- Does not duplicate with full volunteer form (if same email, merge records)

#### FR-005: Community Infrastructure
**Description:** Post-signup destination for volunteers.
**Requirement:** Discord server (or Slack) with channels: #introductions, #economists, #engineers, #designers, #organizers, #researchers, #policymakers, #zone-zero-ideas, #general.
**Acceptance criteria:**
- Invite link shown on form success screen
- Invite link included in welcome email
- Auto-role assignment based on selected volunteer role
- At least one pinned "Start Here" message in each channel

#### FR-006: Team / About Section
**Description:** Visible founding team with credentials.
**Requirement:** Section or page showing: founder name(s), relevant credentials, organizational form (or intent), and contact method.
**Acceptance criteria:**
- At least one named person with photo/avatar and bio
- Contact email or form available
- Organizational status stated (e.g., "Forming as a nonprofit" or "Fiscally sponsored by X")

#### FR-007: Welcome Email Sequence
**Description:** Automated onboarding for new volunteers.
**Requirement:** 4-email sequence over 14 days:
1. Day 0: Welcome + MIND explainer + community invite
2. Day 3: Zone Zero simulator deep-dive + share challenge
3. Day 7: "Choose your first micro-task" based on selected role
4. Day 14: Progress update + ask for feedback
**Acceptance criteria:**
- Emails are sent on schedule via transactional email service
- Each email has a single clear CTA
- Unsubscribe link in every email
- Open/click rates tracked

#### FR-008: Mobile Performance Optimization
**Description:** Site must perform acceptably on mid-range mobile devices.
**Requirement:** Conditionally reduce particle count on constrained devices. Detect via `navigator.hardwareConcurrency <= 4` or viewport width < 768px.
**Acceptance criteria:**
- Hero particles: 4000 → 1500 on mobile
- Morph particles: 3200 → 1200 on mobile
- Zone Zero particles: 1800 → 800 on mobile
- Frame rate stays above 24fps on Pixel 7a / iPhone 12 equivalent
- `prefers-reduced-motion: reduce` disables all particle animation entirely

---

### P2 — Medium Priority (Months 2-3)

#### FR-009: MIND Score Whitepaper
**Description:** Downloadable academic formalization of the MIND framework.
**Content requirements:**
- Mathematical definition of MIND score (geometric mean formulation)
- Theoretical justification for multiplicative aggregation vs. additive
- Comparison to HDI geometric mean reform (2010) — why MIND goes further
- Intelligence dimension justification (citing St. Louis Fed AI capex data)
- Proposed measurement methodology for each dimension
- Limitations and open questions
**Format:** PDF, 8-15 pages, citable (with DOI via Zenodo or SSRN)

#### FR-010: Site Architecture Split
**Description:** Decompose 5,127-line monolithic HTML into maintainable structure.
**Requirement:**
- Phase 1: Split into `index.html` + `styles.css` + `main.js`
- Phase 2: Migrate to Astro with component-per-section architecture
**Acceptance criteria:**
- No single file exceeds 500 lines
- CSS and JS are externalized and cacheable
- Build pipeline produces optimized output (minified, tree-shaken)
- Lighthouse performance score >= 90 on desktop, >= 75 on mobile

#### FR-011: Real MIND Dashboard Prototype
**Description:** Dashboard showing actual MIND-proxy scores for real countries.
**Data sources:** World Bank API, OECD Data Explorer, DBnomics
**Requirement:** Interactive visualization showing MIND scores for 20+ countries using publicly available proxy indicators.
**Acceptance criteria:**
- At least 20 countries displayed with M, I, N, D sub-scores
- Data sources cited with methodology transparency
- User can compare 2-3 countries side-by-side
- Scores update when upstream data refreshes (daily cron or manual trigger)

#### FR-012: Countdown Context
**Description:** Explain the 1000-day window.
**Requirement:** Tooltip or expandable explanation on the countdown that answers: Why 1000 days? What happens at zero? What milestone does this target?
**Acceptance criteria:**
- Clicking/tapping the countdown reveals a 2-3 sentence explanation
- Explanation ties to a concrete milestone (paper publication, pilot launch, etc.)

---

### P3 — Future (Months 4+)

#### FR-013: "MIND Score for My City" Tool
Users input their city → system pulls available data → calculates proxy MIND score → generates shareable result.

#### FR-014: Multi-Language Support
Start with Spanish, French, Mandarin. Use i18n framework (Astro i18n or similar).

#### FR-015: Volunteer Matching & Project Boards
Authenticated volunteer dashboard. Browse open tasks. Claim work. Track contributions.

#### FR-016: API for MIND Score Calculation
```
GET /api/mind-score?country=NL
→ { material: 72, intelligence: 68, network: 55, diversity: 48, score: 53, sources: [...] }
```

---

## 4. Non-Functional Requirements

### NFR-001: Performance

| Metric | Desktop Target | Mobile Target |
|--------|---------------|---------------|
| First Contentful Paint | < 1.5s | < 2.5s |
| Largest Contentful Paint | < 2.0s | < 3.5s |
| Time to Interactive | < 3.0s | < 5.0s |
| Cumulative Layout Shift | < 0.1 | < 0.15 |
| Frame rate (with particles) | 60fps | 24fps+ |
| Lighthouse Performance | >= 90 | >= 75 |

### NFR-002: Accessibility

- **Target:** WCAG 2.1 Level AA
- All interactive elements keyboard-navigable
- `prefers-reduced-motion` fully supported — disables all animation
- Color contrast ratios meet AA minimums (4.5:1 body text, 3:1 large text)
- All form inputs have associated labels
- Canvas elements have `aria-label` descriptions
- Screen reader can navigate all content sections

### NFR-003: Privacy & Data Handling

- No third-party tracking cookies
- Analytics must be privacy-respecting (Plausible, Fathom, or equivalent)
- Volunteer data: name, email, location stored with encryption at rest
- Privacy policy page linked from form and footer
- GDPR-compliant: right to access, right to deletion, data portability
- No volunteer data shared with third parties without explicit consent

### NFR-004: Availability & Operations

- **Uptime target:** 99.5% (allows ~44 hours downtime/year)
- **Monitoring:** UptimeRobot (5-min checks) with email/Slack alerts
- **Error tracking:** Sentry free tier for JS errors
- **Backup:** Volunteer database backed up daily (automated by Supabase)
- **Deployment:** Auto-deploy on merge to `main` via GitHub Actions

### NFR-005: Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 15+
- Mobile Safari (iOS 15+)
- Chrome Android 90+
- Graceful degradation: Three.js features disabled if WebGL unavailable, replaced with static gradient

### NFR-006: Security

- Form inputs sanitized server-side (XSS prevention)
- Rate limiting on form submission endpoint (10 submissions/IP/hour)
- No secrets in client-side code
- HTTPS enforced (GitHub Pages / Vercel default)
- Content Security Policy headers configured
- Dependency audit (no known CVEs in Three.js r148, GSAP 3.12.5)

---

## 5. Architecture

### Current State (v0 — Single File)

```
[Browser] → [index.html (226KB, 5127 lines)]
             ├── Inline CSS (~2000 lines)
             ├── Inline HTML (~1500 lines)
             └── Inline JS (~1600 lines)
                 ├── UI handlers (nav, theme, tabs, form)
                 ├── Three.js hero particles (4000)
                 ├── Three.js morph engine (3200)
                 ├── Three.js Zone Zero simulator (1800)
                 ├── GSAP ScrollTrigger animations
                 └── Zone Zero: calcScore(), updateUI(), share helpers

[Form] → e.preventDefault() → fake success → DATA LOST
```

### Target State Phase 1 (v1 — Split Files)

```
index.html          (HTML shell only, ~800 lines)
styles.css          (all CSS, ~2000 lines)
main.js             (all JS, ~1600 lines)
  └── Scripts loaded with defer attribute

[Form] → POST → Formspree → Email notification + Google Sheets
```

### Target State Phase 2 (v2 — Component Architecture)

```
src/
├── pages/
│   └── index.astro
├── components/
│   ├── Nav.astro
│   ├── Hero.astro
│   ├── Inversion.astro
│   ├── MetabolicRift.astro
│   ├── Pillars.astro
│   ├── MINDDashboard.astro
│   ├── ZoneZeroSimulator.astro    ← standalone, embeddable
│   ├── Stories.astro
│   ├── Experiments.astro
│   ├── VolunteerForm.astro
│   ├── Paths.astro
│   ├── Organizations.astro
│   ├── CTA.astro
│   └── Footer.astro
├── scripts/
│   ├── hero-particles.ts
│   ├── morph-engine.ts
│   ├── zone-zero.ts
│   ├── mind-score.ts              ← extracted, testable
│   ├── animations.ts
│   └── form-handler.ts
├── styles/
│   ├── tokens.css
│   ├── base.css
│   └── components/
└── lib/
    └── mind-calculator.ts          ← pure function, unit-testable

public/
├── og-render.html
├── robots.txt
├── sitemap.xml
└── privacy.html
```

### Target State Phase 3 (v3 — Full Stack)

```
Adds:
├── src/pages/api/
│   ├── volunteers.ts       → Supabase INSERT
│   ├── mind-score.ts       → Calculate from World Bank/OECD data
│   └── og-image.ts         → Dynamic OG image generation (Satori)
├── src/pages/
│   ├── about.astro
│   ├── research.astro
│   ├── dashboard.astro     → Real MIND data visualization
│   └── privacy.astro

Hosting: Vercel (static + edge functions)
Database: Supabase (volunteers, MIND data cache)
Email: Resend (transactional) + Buttondown (newsletter)
Analytics: Plausible Cloud
Monitoring: UptimeRobot + Sentry
```

---

## 6. Core Business Logic

### MIND Score Calculation

```typescript
/**
 * Calculate MIND score using geometric mean.
 * All inputs 0-100. Output 0-100.
 * Zero in ANY dimension = zero total (multiplicative trap).
 */
function calcMINDScore(m: number, i: number, n: number, d: number): number {
  if (m <= 0 || i <= 0 || n <= 0 || d <= 0) return 0;
  return Math.round(
    Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100
  );
}
```

### Health State Classification

| Score Range | State | Badge | Description |
|------------|-------|-------|-------------|
| 70-100 | Symbiotic Zone | Thriving | All capitals mutually reinforcing |
| 50-69 | Healthy System | Thriving | Above stability threshold |
| 35-49 | Under Stress | Stressed | Multiplicative penalty visible |
| 20-34 | Critical Threshold | Critical | Near collapse floor |
| 1-19 | Pre-Collapse | Critical | Any further decline triggers cascade |
| 0 | Systemic Collapse | Collapsed | One dimension at zero = total failure |

### Collapse Floor

`FLOOR = 15` — Below this value, dimension shows warning state. At 0, collapse overlay activates.

### Binding Constraint

The dimension with the lowest value. In a multiplicative system, raising the binding constraint yields the highest marginal return on total score.

---

## 7. Acceptance Criteria (BDD Scenarios)

### Volunteer Signup

```gherkin
Scenario: Successful volunteer signup
  Given a visitor is on the volunteer section
  And they have entered first name "Ada"
  And they have entered last name "Lovelace"
  And they have entered email "ada@intelligence.coop"
  And they have selected the "Economist / Theorist" role
  When they click "Join the Nucleation"
  Then their data should be persisted to the volunteer datastore
  And the success message should display
  And a welcome email should be queued for delivery within 24 hours
  And the community invite link should be visible

Scenario: Invalid email rejected
  Given a visitor has filled in the form
  But the email field contains "not-an-email"
  When they click "Join the Nucleation"
  Then the email field should show an inline validation error
  And the form should not submit
  And no data should be sent to the backend

Scenario: Duplicate email handled gracefully
  Given "ada@intelligence.coop" has already signed up
  When a visitor submits the form with the same email
  Then the system should update (not duplicate) the existing record
  And the success message should display normally
```

### Zone Zero Simulator

```gherkin
Scenario: MIND score calculates correctly
  Given the Zone Zero simulator is loaded
  When M=70, I=60, N=50, D=40
  Then the MIND score should display 53
  And the health state should be "Healthy System"
  And the binding constraint should identify "Diversity (40)"

Scenario: Zero triggers collapse
  Given M=70, I=60, N=50, D=40
  When the user drags Diversity to 0
  Then the MIND score should display 0
  And the collapse overlay should appear
  And the overlay should read "Diversity at Zero"
  And the particle visualization should show scatter/collapse state

Scenario: Floor warning appears
  Given all dimensions are at defaults
  When the user drags Material below 15
  Then a floor warning should appear on the Material slider
  And the warning text should read "Floor reached — cascade collapse"

Scenario: Reset restores defaults
  Given the user has modified slider values
  When they click the reset button
  Then M=70, I=60, N=50, D=40 should be restored
  And the MIND score should display 53
  And URL parameters should be cleared

Scenario: Share URL preserves configuration
  Given M=80, I=70, N=60, D=50
  When the user clicks "Copy link"
  Then the clipboard should contain a URL with ?m=80&i=70&n=60&d=50#zone-zero
  And loading that URL should hydrate the simulator with those values
  And the shared-config banner should appear

Scenario: All dimensions at 100
  When M=100, I=100, N=100, D=100
  Then the MIND score should display 100
  And the health state should be "Symbiotic Zone"
```

### Countdown Timer

```gherkin
Scenario: Countdown shows correct remaining days
  Given the target date is 2029-01-09T00:00:00Z
  And today is 2026-04-16
  Then the countdown should show approximately 998 days
  And the display should update every 30 seconds

Scenario: Countdown reaches zero
  Given the current date is 2029-01-10
  Then the countdown should show 000 days, 00 hours, 00 minutes
```

### Theme Toggle

```gherkin
Scenario: Theme switches between dark and light
  Given the page is loaded in dark theme (default)
  When the user clicks the theme toggle
  Then the page should switch to light theme
  And the toggle icon should change to a moon
  When the user clicks the theme toggle again
  Then the page should switch back to dark theme
```

### Mobile Performance

```gherkin
Scenario: Particle count reduced on mobile
  Given the user is on a device with viewport width < 768px
  When the page loads
  Then the hero should render <= 1500 particles
  And the morph engine should render <= 1200 particles
  And the Zone Zero simulator should render <= 800 particles

Scenario: Reduced motion respected
  Given the user has prefers-reduced-motion: reduce enabled
  When the page loads
  Then no particle animations should run
  And no GSAP scroll animations should play
  And all content should be immediately visible (no reveal delays)
```

---

## 8. Test Strategy

### Unit Tests

| Test | Module | What It Validates |
|------|--------|-------------------|
| MIND score calculation | `mind-calculator` | Geometric mean formula, zero-floor behavior, boundary values |
| Health state classification | `mind-calculator` | Correct state for each score range boundary |
| Binding constraint identification | `mind-calculator` | Lowest dimension correctly identified |
| Form input validation | `form-handler` | Email format, required fields, sanitization |
| Countdown date math | `countdown` | Correct days/hours/mins from target date |
| Share URL generation | `zone-zero` | Correct query params, proper encoding |
| Share URL hydration | `zone-zero` | Params parsed correctly, values clamped 0-100 |

### Integration Tests

| Test | Components | What It Validates |
|------|-----------|-------------------|
| Form → backend | Form + Formspree/Supabase | Data reaches datastore with correct schema |
| Form → email | Form + Resend/Buttondown | Welcome email sent within SLA |
| Share URL → OG image | URL params + Microlink/Satori | Correct image generated for shared config |

### E2E Tests (Playwright)

| Test | Flow | What It Validates |
|------|------|-------------------|
| Volunteer signup | Load → scroll → select role → fill form → submit → see success | Full happy path works |
| Zone Zero interact | Load → scroll to simulator → drag sliders → see score change → share | Interactive flow works |
| Mobile experience | Load on 375px viewport → scroll → interact with simulator → submit form | Responsive layout + touch interactions |
| Theme toggle | Load → toggle to light → verify colors → toggle back | Theme persistence |

### Performance Tests (Lighthouse CI)

Run on every PR via GitHub Actions:
- Performance >= 75 (mobile), >= 90 (desktop)
- Accessibility >= 90
- Best Practices >= 90
- SEO >= 90

### Accessibility Audit

- axe-core automated scan (zero critical/serious violations)
- Manual keyboard navigation test (all interactive elements reachable)
- Screen reader test (VoiceOver on Safari, NVDA on Chrome)
- Color contrast verification (all text meets AA ratios)

---

## 9. Operational Runbook

### Deployment

```bash
# Current: push to main triggers GitHub Actions → GitHub Pages
git push origin main

# Phase 2+: Vercel auto-deploy on merge
# Preview deploys on every PR
```

### Monitoring Checklist

| Check | Tool | Frequency | Alert |
|-------|------|-----------|-------|
| Site up | UptimeRobot | 5 min | Email + Slack |
| JS errors | Sentry | Real-time | Email (>10/hour) |
| Form submissions | Formspree/Supabase | Daily review | None (dashboard) |
| Analytics | Plausible | Weekly review | None (dashboard) |
| Lighthouse score | GitHub Actions | Every PR | PR comment |
| Dependency CVEs | GitHub Dependabot | Auto | PR created |

### Incident Response

| Severity | Example | Response Time | Who |
|----------|---------|---------------|-----|
| P0 | Form data loss, site down | 1 hour | Founding team |
| P1 | Broken feature, wrong MIND calculation | 24 hours | Founding team |
| P2 | Visual bug, minor UX issue | 1 week | Any contributor |
| P3 | Enhancement request | Backlog | Triaged monthly |

---

## 10. Cost Estimate (Year 1)

| Service | Purpose | Monthly Cost |
|---------|---------|-------------|
| Vercel Hobby | Hosting + edge functions | $0-20 |
| Supabase Free | Volunteer database | $0 |
| Formspree Free | Form backend (interim) | $0 |
| Plausible Cloud | Analytics | $9 |
| Resend Free | Transactional email (100/day) | $0 |
| Buttondown Free | Newsletter (100 subscribers) | $0 |
| UptimeRobot Free | Uptime monitoring | $0 |
| Sentry Free | Error tracking | $0 |
| Domain renewal | intelligenteconomics.ai | ~$15/yr |
| **Total Year 1** | | **$120-360/year** |

---

## 11. Implementation Phases

### Phase 0: Emergency Fixes (Week 1)
- [ ] FR-001: Wire form to Formspree
- [ ] FR-002: Add Plausible analytics script
- [ ] FR-003: Rename partner organizations section
- [ ] Add `defer` to Three.js and GSAP script tags
- [ ] Add `robots.txt` and basic `sitemap.xml`

### Phase 1: Foundation (Months 1-3)
- [ ] FR-004: Email-first signup near hero
- [ ] FR-005: Discord community setup
- [ ] FR-006: Team/about section
- [ ] FR-007: Welcome email sequence
- [ ] FR-008: Mobile particle performance
- [ ] FR-010: Split into HTML + CSS + JS files
- [ ] FR-012: Countdown explanation
- [ ] Privacy policy page
- [ ] Unit tests for MIND calculator
- [ ] Lighthouse CI in GitHub Actions

### Phase 2: Proof (Months 4-6)
- [ ] FR-009: MIND whitepaper (PDF)
- [ ] FR-010: Migrate to Astro component architecture
- [ ] FR-011: Real MIND dashboard prototype
- [ ] E2E tests (Playwright)
- [ ] Supabase migration (from Formspree)
- [ ] Transactional email (Resend)

### Phase 3: Scale (Months 7-12)
- [ ] FR-013: "MIND Score for My City" tool
- [ ] FR-014: i18n (3 languages)
- [ ] FR-015: Volunteer dashboard
- [ ] FR-016: Public MIND API
- [ ] Multi-page site with audience segmentation

---

## Appendix A: Data Model

### Volunteer Record

```typescript
interface Volunteer {
  id: string;               // UUID
  first_name: string;
  last_name: string;
  email: string;            // unique, indexed
  location?: string;
  expertise?: string;
  bandwidth?: string;
  roles: string[];          // e.g., ["economist", "researcher"]
  message?: string;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
  onboarding_step: number;  // 0-4 (maps to email sequence)
  community_joined: boolean;
  source?: string;          // "hero-capture" | "full-form" | "api"
}
```

### MIND Score Record (for dashboard)

```typescript
interface MINDScore {
  country_code: string;     // ISO 3166-1 alpha-2
  country_name: string;
  year: number;
  material: number;         // 0-100
  intelligence: number;     // 0-100
  network: number;          // 0-100
  diversity: number;        // 0-100
  score: number;            // geometric mean × 100
  health_state: string;
  binding_constraint: string;
  data_sources: DataSource[];
  calculated_at: Date;
}
```

## Appendix B: MIND Score Formula

```
MIND Score = ⁴√(M/100 × I/100 × N/100 × D/100) × 100

Where:
  M = Material Capital     (0-100): infrastructure, energy, housing, physical commons
  I = Intelligence Capital  (0-100): education, R&D, AI access, cognitive infrastructure
  N = Network Capital      (0-100): cooperative density, trust, inter-node connectivity
  D = Diversity Capital    (0-100): cognitive, cultural, ecological, economic variety

Properties:
  - All at 100 → Score = 100
  - Any at 0   → Score = 0 (multiplicative trap)
  - Geometric mean ensures no dimension can compensate for another's collapse
  - Binding constraint = dimension with lowest value (highest marginal return)
```

## Appendix C: External Dependencies

| Dependency | Version | Purpose | Risk if Unavailable |
|-----------|---------|---------|---------------------|
| Three.js | r148 (UMD) | Particle visualizations | Hero, morph, Zone Zero all fail — show static fallback |
| GSAP | 3.12.5 | Scroll animations | Animations don't play — content still visible |
| ScrollTrigger | 3.12.5 | Scroll-triggered effects | Same as GSAP |
| Fontshare | N/A | Clash Display + Satoshi fonts | Falls back to system sans-serif |
| Microlink API | N/A | OG image generation | Social shares show default image |

---

*Specification complete. This document should be updated as requirements evolve and implementation progresses.*
