# Intelligent Economics - Specification Panel Review

**Date:** 2026-04-16
**Mode:** Critique
**Panel:** Wiegers, Adzic, Cockburn, Fowler, Nygard, Newman, Crispin, Hightower
**Input Documents:** BRAINSTORM.md, RESEARCH.md, BUSINESS-PANEL.md, index.html (5,127 lines)

---

## Quality Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Clarity** | 4.2/10 | Vision is eloquent but requirements are implicit, not specified |
| **Completeness** | 2.8/10 | Critical systems (backend, auth, data, community) entirely absent |
| **Testability** | 1.5/10 | No acceptance criteria, no success metrics, no measurable goals |
| **Consistency** | 5.5/10 | Visual design is consistent; but stated goals vs. actual capabilities diverge |
| **Overall** | 3.5/10 | Strong concept, near-zero specification rigor |

---

## Expert Reviews

---

### Karl Wiegers — Requirements Engineering

**Assessment: The project has no specification. It has a manifesto.**

The entire project exists as a single HTML file with no requirements document, no user stories, no acceptance criteria, and no definition of done. What exists is an implicit specification embedded in code — which means the specification IS the implementation, making it impossible to verify whether the system meets its goals.

**Critical Missing Requirements:**

| ID | Requirement Gap | Severity | Impact |
|----|----------------|----------|--------|
| R-001 | **Form submission backend** — No requirement exists for what happens to volunteer data. The form handler calls `e.preventDefault()` and fakes success. | Critical | Every conversion is lost |
| R-002 | **Data persistence** — No specification for where volunteer records are stored, how they're accessed, or who owns them | Critical | No data layer exists |
| R-003 | **Success metrics** — No definition of what "success" means for this project. Volunteer count? City partnerships? Paper citations? | Critical | Cannot measure progress |
| R-004 | **User authentication/accounts** — If volunteers need ongoing engagement, how do they log in? Track contributions? | High | No retention mechanism |
| R-005 | **Email/notification system** — The success message says "We'll be in touch" but no mechanism exists to reach signups | High | Promise without delivery |
| R-006 | **Content management** — 5,127 lines in one file. No specification for how content is updated, by whom, or how often | High | Maintenance impossible |
| R-007 | **Privacy/data handling** — Form collects name, email, location, expertise. No privacy policy, no GDPR compliance spec | High | Legal liability |
| R-008 | **Performance budgets** — Two Three.js canvases (7,200 total particles), GSAP animations, but no performance targets for mobile/desktop | Medium | Unknown user experience on constrained devices |
| R-009 | **Accessibility requirements** — Some ARIA labels exist but no formal WCAG level target or audit plan | Medium | Unverified accessibility |
| R-010 | **Analytics/telemetry** — No specification for what to measure or how | Medium | No feedback loop |

**The SMART Test Applied:**

The implicit primary requirement is: "Build a volunteer movement to transition from GDP to the MIND framework."

| SMART Criterion | Assessment |
|----------------|-----------|
| **Specific** | Partially — MIND framework is well-defined, but "movement" is vague |
| **Measurable** | No — zero metrics defined (volunteers? cities? papers? score?) |
| **Achievable** | Unknown — no resource assessment, no team inventory |
| **Relevant** | Yes — the Beyond GDP moment is real and timely |
| **Time-bound** | Partially — the 1000-day countdown implies a deadline but its significance is unexplained |

**Wiegers' Verdict:** Before writing another line of code, write a one-page requirements document that answers: (1) Who are the three primary user types? (2) What must each be able to DO on this site? (3) How will you know each goal is met? Until those exist, every feature is a guess.

---

### Gojko Adzic — Specification by Example

**Assessment: Zero executable specifications. Zero examples. Zero validation.**

The project has no test suite, no behavioral specifications, and no acceptance criteria. The only way to verify the system works is to manually open the HTML file in a browser. For a project advocating rigorous measurement (MIND scores), the irony of having zero measurement of its own system is striking.

**Missing Specification-by-Example Scenarios:**

**Volunteer Signup Flow:**
```gherkin
# CRITICAL — This scenario currently FAILS
Scenario: Visitor submits volunteer form
  Given a visitor is on the volunteer section
  And they have selected the "Economist / Theorist" role
  And they have filled in name "Ada Lovelace"
  And they have filled in email "ada@intelligence.coop"
  When they click "Join the Nucleation"
  Then their data should be persisted to [UNDEFINED BACKEND]
  And they should receive a confirmation email within [UNDEFINED TIME]
  And they should see the success message
  And they should be redirected to [UNDEFINED COMMUNITY]

# ACTUAL BEHAVIOR: Form data is discarded. Fake success shown. Data lost.
```

**Zone Zero Simulator:**
```gherkin
Scenario: Collapse mechanic demonstrates multiplicative failure
  Given the Zone Zero simulator is loaded
  And Material is set to 70
  And Intelligence is set to 60
  And Network is set to 50
  And Diversity is set to 40
  When the user drags Diversity to 0
  Then the MIND score should display 0
  And the collapse overlay should appear
  And the collapse reason should mention "Diversity"
  And the particle visualization should show collapse state

Scenario: Share Zone Zero configuration
  Given a user has configured MIND sliders to M=80, I=70, N=60, D=50
  When they click "Copy link"
  Then a URL with query parameters ?m=80&i=70&n=60&d=50 should be copied
  And the OG image for that URL should reflect those values
  # NOTE: OG image relies on Microlink API — untested, possibly broken
```

**Countdown Timer:**
```gherkin
Scenario: Countdown displays correct remaining time
  Given the target date is January 9, 2029
  And today is April 16, 2026
  When the page loads
  Then the countdown should show approximately 998 days
  And hours and minutes should update every 30 seconds

# QUESTION: What happens on January 9, 2029? No specification exists.
```

**Mobile Performance:**
```gherkin
Scenario: Site performs acceptably on mid-range mobile
  Given a user is on a device with 4 CPU cores and Adreno 610 GPU
  When the page loads with Two Three.js canvases
  Then the frame rate should stay above 30fps
  And the page should be interactive within 3 seconds
  And battery drain should not exceed [UNDEFINED] per minute

# NO PERFORMANCE SPECIFICATION EXISTS
```

**Adzic's Verdict:** The project needs a living specification document — 15-20 scenarios covering the core user journeys. Start with the three that are broken: form submission, post-signup experience, and mobile performance. Each scenario becomes a testable contract.

---

### Alistair Cockburn — Use Case Analysis

**Assessment: Three primary actors, zero complete use cases.**

**Actor Identification:**

| Actor | Goal | Current Support | Gap |
|-------|------|-----------------|-----|
| **Intellectual Explorer** | Understand the MIND framework | Strong — 14 sections of content | Cognitive overload, no progressive disclosure |
| **Potential Volunteer** | Find a meaningful role and contribute | Weak — form exists but goes nowhere | No backend, no community, no onboarding |
| **Policy Practitioner** | Evaluate MIND for their jurisdiction | None — no whitepaper, no data tools | No downloadable materials, no API |

**Use Case: Volunteer Signs Up (Main Success Scenario)**

```
PRIMARY ACTOR: Potential Volunteer
PRECONDITION: Visitor has read enough to be interested
TRIGGER: Visitor scrolls to or clicks "Volunteer to Build"

MAIN SUCCESS SCENARIO:
1. Visitor selects one or more role cards
2. Visitor fills in name, email, location, expertise, bandwidth
3. Visitor writes optional first-step message
4. Visitor clicks "Join the Nucleation"
5. System validates input
6. System persists data to volunteer database       ← MISSING
7. System sends confirmation email                   ← MISSING
8. System displays success message                   ← IMPLEMENTED (but premature)
9. System shows next steps with community link       ← MISSING
10. System adds visitor to onboarding email sequence  ← MISSING

EXTENSIONS:
3a. Visitor doesn't select any role:
    3a1. System should prompt for at least one role   ← NOT IMPLEMENTED
5a. Email validation fails:
    5a1. Currently only checks for @ symbol           ← INSUFFICIENT
    5a2. Should validate format and show inline error
6a. Backend is unavailable:
    6a1. NO BACKEND EXISTS — this is the failure case that ALWAYS happens
```

**Use Case: Practitioner Evaluates MIND for City**

```
PRIMARY ACTOR: City Policy Advisor
PRECONDITION: Has heard about MIND from media or academic paper
TRIGGER: Visits site to assess applicability

MAIN SUCCESS SCENARIO:
1. Practitioner reads framework overview              ← OK but buried
2. Practitioner downloads whitepaper/methodology      ← MISSING
3. Practitioner explores Zone Zero simulator          ← WORKS
4. Practitioner finds data sources for their city     ← MISSING
5. Practitioner contacts team for pilot discussion    ← NO CONTACT MECHANISM
6. Practitioner accesses API to run MIND calculation  ← MISSING

CURRENT COMPLETION: 1.5 out of 6 steps possible
```

**Cockburn's Verdict:** The site completes the "learn" phase of all three actor journeys but drops every actor at the "act" phase. The use case analysis makes the gap visceral: steps 6-10 of the volunteer flow literally do not exist. Write the full use cases for all three actors, then build the infrastructure to complete them.

---

### Martin Fowler — Software Architecture & Design

**Assessment: Architecture is a single point of failure with zero separation of concerns.**

**Current Architecture:**
```
[Browser] → loads → [index.html (226KB)]
                     ├── CSS (inline, ~2000 lines)
                     ├── HTML (inline, ~1500 lines)
                     ├── JS (inline, ~1600 lines)
                     │   ├── Nav scroll handler
                     │   ├── Theme toggle
                     │   ├── Countdown timer
                     │   ├── Role card selection
                     │   ├── Form submission (BROKEN)
                     │   ├── Scroll reveal (IntersectionObserver)
                     │   ├── GSAP clip-path animations
                     │   ├── MIND bar counters
                     │   ├── Experiment tabs
                     │   ├── Hero particle system (Three.js, 4000 particles)
                     │   ├── Morph particle engine (Three.js, 3200 particles)
                     │   └── Zone Zero simulator
                     └── External deps (CDN)
                         ├── Three.js r148 (synchronous)
                         ├── GSAP 3.12.5 (synchronous)
                         └── Fontshare (Clash Display + Satoshi)

[Form Submit] → e.preventDefault() → fake success → DATA LOST
```

**Architectural Issues:**

| Issue | Severity | Description |
|-------|----------|-------------|
| **Monolithic HTML** | High | 5,127 lines in a single file. No separation of concerns. Collaboration is impossible. |
| **No build pipeline** | High | No bundler, no minification, no tree-shaking, no code splitting. 226KB delivered as-is. |
| **Synchronous script loading** | Medium | Three.js and GSAP loaded synchronously in `<head>`, blocking first paint. Should be `defer`. |
| **No backend** | Critical | Form submission handler fakes success. Zero data persistence. |
| **No state management** | Medium | Zone Zero simulator state lives only in DOM. No URL persistence (despite share feature existing). |
| **CDN single points of failure** | Low | Three.js from jsdelivr, fonts from fontshare. If either CDN fails, site degrades. |
| **No error boundaries** | Medium | If Three.js fails to load, particle systems silently fail. No user feedback. |

**Recommended Target Architecture:**

```
Phase 1 (Minimal — 1 day):
  index.html (shell only)
  styles.css
  main.js (entry point)
  Form → Formspree/Google Sheets

Phase 2 (Component-based — 1 week):
  Astro or 11ty static site
  ├── src/
  │   ├── pages/index.astro
  │   ├── components/
  │   │   ├── Hero.astro
  │   │   ├── ZoneZeroSimulator.astro
  │   │   ├── MINDDashboard.astro
  │   │   ├── VolunteerForm.astro
  │   │   └── ...
  │   ├── scripts/
  │   │   ├── particles.ts
  │   │   ├── simulator.ts
  │   │   └── animations.ts
  │   └── styles/
  │       ├── tokens.css
  │       └── components/
  └── public/

Phase 3 (Full-stack — 1 month):
  Add: API routes, database, auth, email, dashboard
  Vercel/Cloudflare hosting with edge functions
  Supabase or Planetscale for volunteer data
  Resend or Postmark for transactional email
```

**Fowler's Verdict:** The current architecture is acceptable for a prototype but not for a production movement site. The Phase 1 split (3 files) should happen today. Phase 2 (component architecture) within the first month. Phase 3 only when the organization and use cases justify it. Don't build infrastructure for users you haven't captured yet.

---

### Michael Nygard — Production Readiness & Failure Modes

**Assessment: The system has exactly one failure mode, and it's currently active.**

**Failure Mode Analysis:**

| Failure Mode | Likelihood | Detection | Recovery | Status |
|-------------|-----------|-----------|----------|--------|
| **Form data loss** | 100% (certain) | None (no monitoring) | None (data gone) | **ACTIVE FAILURE** |
| **CDN dependency failure** | Low (~0.1%/month) | None | Graceful degradation for fonts; broken for Three.js/GSAP | Unmitigated |
| **Mobile GPU exhaustion** | Medium (20%+ of mobile visitors) | None | None — tab crashes or drains battery | Unmitigated |
| **Microlink OG API failure** | Unknown | None | Social shares show broken image | Unmitigated |
| **GitHub Pages outage** | Very low | GitHub status page | Wait | Acceptable |

**The Circuit Breaker That Doesn't Exist:**

The form submission is the critical path. In production systems, we'd put a circuit breaker around a failing dependency. Here, the "dependency" (backend) doesn't exist at all. The form handler is essentially:

```javascript
// Current implementation (simplified)
form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!email.includes('@')) return;  // Minimal validation
  this.style.display = 'none';       // Hide form
  success.classList.add('visible');   // Show fake success
  // DATA IS NOW GONE FOREVER
});
```

This is not a bug — it's an architectural absence. The system was built as a front-end prototype without the backend it requires.

**Operational Requirements That Must Exist:**

1. **Uptime target** — What availability does this site need? (99%? 99.9%?)
2. **Performance budget** — First Contentful Paint < 2s, TTI < 4s, LCP < 2.5s
3. **Error budget** — How many form submission failures are acceptable? (Answer: zero)
4. **Monitoring** — What gets alerted on? (Currently: nothing)
5. **Backup/recovery** — Volunteer data backup frequency? (Currently: N/A — no data)

**Nygard's Verdict:** This system is in production with an active, undetected, 100%-rate data loss failure. In any production context, this would be a P0 incident. The fix is trivial (Formspree: 30 minutes). The fact that it hasn't been fixed suggests the project isn't being operated as a production system — which means it isn't one yet, regardless of whether it's publicly accessible.

---

### Sam Newman — Service Boundaries & Integration

**Assessment: The project is a monolith pretending to be a static site.**

The single HTML file contains what should be at least 4-5 distinct bounded contexts:

| Context | Current State | Should Be |
|---------|--------------|-----------|
| **Content/CMS** | Inline HTML in single file | Headless CMS or markdown files |
| **Volunteer Management** | Broken form | Service with API, database, email |
| **Interactive Simulations** | Inline JS (Zone Zero, particles) | Standalone embeddable widgets |
| **Analytics/Telemetry** | Non-existent | Third-party service (Plausible) |
| **Community** | Non-existent | Discord/Slack + forum integration |

**API Boundaries That Need Definition:**

```
POST /api/volunteers
  Body: { name, email, location, expertise, bandwidth, roles[], message }
  Response: { id, status: "confirmed" }
  Side effects: Send welcome email, add to newsletter, create community invite

GET /api/mind-score?country=NL
  Response: { material: 72, intelligence: 68, network: 55, diversity: 48, score: 53 }
  Source: Aggregated from World Bank, OECD, custom data

GET /api/zone-zero/share?m=80&i=70&n=60&d=50
  Response: OG image URL with rendered MIND visualization
```

**Newman's Verdict:** Don't build microservices. This project needs a well-structured monolith with clear internal boundaries. Astro + Supabase + Resend covers all current needs without distributed systems complexity. Define the API contracts now even if you implement them as functions in a single codebase.

---

### Lisa Crispin — Testing & Quality Strategy

**Assessment: Zero tests. Zero quality gates. Zero validation.**

**Current Test Coverage:**

| Test Type | Coverage | Target |
|-----------|----------|--------|
| Unit tests | 0% | 80%+ for business logic (MIND calculation, form validation) |
| Integration tests | 0% | Form → backend → email chain |
| E2E tests | 0% | Full volunteer signup flow |
| Visual regression | 0% | Key sections across breakpoints |
| Performance tests | 0% | Lighthouse CI, WebPageTest |
| Accessibility tests | 0% | axe-core, WAVE, keyboard nav |

**Critical Test Scenarios (Priority Order):**

1. **Form submission persists data** — the #1 failure right now
2. **Zone Zero MIND score calculates correctly** — `M * I * N * D / 10^6` (or whatever normalization)
3. **Collapse triggers when any dimension = 0** — the core conceptual claim
4. **Mobile rendering doesn't crash** — 7,200 particles on constrained GPU
5. **Share URL generates correct OG image** — social sharing is a growth mechanism
6. **Countdown displays correct date math** — wrong countdown = credibility loss
7. **Theme toggle preserves state** — minor but polish matters
8. **All external links work** — partner org links, CDN resources

**Minimum Viable Test Suite:**

```
tests/
├── unit/
│   ├── mind-score.test.js      # MIND calculation logic
│   ├── form-validation.test.js  # Input validation rules
│   └── countdown.test.js        # Date math
├── integration/
│   ├── form-submission.test.js  # Form → backend → confirmation
│   └── share-url.test.js        # URL params → OG image
├── e2e/
│   ├── volunteer-flow.spec.js   # Full signup journey
│   └── simulator.spec.js        # Zone Zero interaction
└── accessibility/
    └── axe-audit.spec.js        # WCAG 2.1 AA compliance
```

**Crispin's Verdict:** A project advocating for rigorous measurement of economic systems has zero measurement of its own system. The irony writes itself. Start with 3 tests: form submission works, MIND score calculates correctly, and the page passes Lighthouse performance audit. These three tests would catch the three biggest current failures.

---

### Kelsey Hightower — Cloud Native & Operations

**Assessment: No operational specification whatsoever.**

**Current Deployment:**
```
Developer → git push → GitHub Actions → Upload artifact → GitHub Pages
```

This is fine for a static site. But the project's stated goals require:
- Form data persistence (needs a backend)
- Email delivery (needs a transactional email service)
- Analytics (needs a tracking service)
- Community (needs Discord/Slack integration)
- Data dashboard (needs API integration + compute)

**Recommended Operational Spec:**

```yaml
# deployment.yaml (specification, not implementation)
hosting:
  platform: Vercel OR Cloudflare Pages  # Free tier covers needs
  region: Global edge (static), US-East (API)
  custom_domain: intelligenteconomics.ai

backend:
  database: Supabase (free tier: 500MB, 50K rows)
  email: Resend (free tier: 100 emails/day) OR Buttondown
  analytics: Plausible Cloud ($9/mo) OR self-hosted
  
monitoring:
  uptime: UptimeRobot (free, 5-min checks)
  errors: Sentry (free tier)
  performance: Lighthouse CI in GitHub Actions

data_pipeline:
  sources: [World Bank API, OECD Data Explorer, DBnomics]
  refresh: Daily cron job (GitHub Actions)
  cache: Edge CDN, 24hr TTL
  storage: Static JSON files in repo OR Supabase

ci_cd:
  build: GitHub Actions
  tests: Unit + E2E on every PR
  deploy: Auto-deploy on merge to main
  preview: Deploy previews on PRs
```

**Cost Estimate (Year 1):**

| Service | Tier | Monthly Cost |
|---------|------|-------------|
| Vercel | Free/Hobby | $0-20 |
| Supabase | Free | $0 |
| Resend | Free | $0 |
| Plausible | Cloud | $9 |
| Domain | Annual | ~$1 |
| **Total** | | **$10-30/month** |

**Hightower's Verdict:** The operational requirements for Phase 1-2 can be met for under $30/month using free tiers. There is no resource constraint preventing the form from working, analytics from existing, or email from being sent. The constraint is organizational, not technical or financial.

---

## Consolidated Findings

### Critical Issues (Must Fix)

| # | Issue | Expert(s) | Fix |
|---|-------|-----------|-----|
| 1 | **Form discards all data** | All 8 experts | Formspree or Supabase — 30 min |
| 2 | **No requirements document** | Wiegers, Adzic, Cockburn | Write 1-page requirements + 15 scenarios — 1 day |
| 3 | **No success metrics defined** | Wiegers, Crispin | Define: volunteer count, signup rate, 30-day retention — 1 hour |
| 4 | **No tests of any kind** | Crispin, Adzic | 3 critical tests (form, MIND calc, Lighthouse) — 1 day |
| 5 | **Monolithic architecture** | Fowler, Newman | Split into 3 files minimum — 1 day |

### High-Priority Issues

| # | Issue | Expert(s) | Fix |
|---|-------|-----------|-----|
| 6 | No post-signup experience | Cockburn, Nygard | Welcome email + community link — 1 week |
| 7 | No monitoring or alerting | Nygard, Hightower | Plausible + UptimeRobot — 2 hours |
| 8 | No privacy policy | Wiegers | Draft and link — 2 hours |
| 9 | Missing use cases for practitioners | Cockburn | Whitepaper + data download — 2 weeks |
| 10 | No performance budget | Nygard, Hightower | Lighthouse CI baseline — 2 hours |

### Medium-Priority Issues

| # | Issue | Expert(s) | Fix |
|---|-------|-----------|-----|
| 11 | Zone Zero share URL untested | Adzic, Crispin | E2E test for share flow — 4 hours |
| 12 | Mobile particle performance unspecified | Nygard | Performance budget + conditional rendering — 1 day |
| 13 | MIND calculation not extracted/testable | Fowler, Crispin | Extract to module with unit tests — 4 hours |
| 14 | No API contracts defined | Newman | Spec 3 endpoints (volunteer, MIND score, share) — 4 hours |
| 15 | Email validation is minimal | Adzic | Proper regex + inline error UX — 2 hours |

---

## Recommended Specification Document

The panel unanimously recommends creating a `SPEC.md` with the following structure:

```markdown
# Intelligent Economics — Product Specification

## 1. Vision & Success Metrics
- Primary objective: [measurable]
- 90-day targets: [specific numbers]
- Key results: [testable criteria]

## 2. User Personas & Use Cases
- Intellectual Explorer: learn → share → return
- Potential Volunteer: learn → signup → onboard → contribute
- Policy Practitioner: evaluate → download → pilot → report

## 3. Functional Requirements (prioritized)
- P0: Form submission, data persistence, welcome email
- P1: Analytics, community link, newsletter
- P2: MIND dashboard with real data, whitepaper download
- P3: API, multi-language, city-level tool

## 4. Non-Functional Requirements
- Performance: FCP < 2s, TTI < 4s, mobile 30fps+
- Accessibility: WCAG 2.1 AA
- Privacy: GDPR-compliant data handling
- Availability: 99.9% uptime

## 5. Architecture
- Phase 1: Static site + Formspree
- Phase 2: Astro + Supabase + Resend
- Phase 3: Full-stack with API + data pipeline

## 6. Acceptance Criteria (BDD scenarios)
- 15-20 Given/When/Then scenarios covering core flows

## 7. Test Strategy
- Unit: MIND calculation, validation, date math
- Integration: Form → backend → email
- E2E: Full volunteer journey
- Performance: Lighthouse CI
- Accessibility: axe-core audit
```

---

## Panel Consensus Statement

> "The Intelligent Economics project has a genuinely novel intellectual contribution (the MIND multiplicative model) wrapped in a genuinely beautiful visual presentation (the website design). But it has zero specification rigor. No requirements. No tests. No backend. No metrics. No operational monitoring. The form — the only conversion mechanism — actively discards user data. A project that advocates measuring what matters has measured nothing about itself. The gap between the ambition of the idea and the rigor of the implementation is the single most important thing to close. Write the spec. Fix the form. Add three tests. Then build outward from a foundation that works."

---

*Panel review complete. All 8 experts participated. Findings consolidated with priority rankings and specific remediation recommendations.*
