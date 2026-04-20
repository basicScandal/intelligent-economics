# Project Research Summary

**Project:** Intelligent Economics (MIND Framework Movement Platform)
**Domain:** Movement/advocacy platform — Beyond GDP economic reform with WebGL interactivity
**Researched:** 2026-04-21
**Confidence:** HIGH

## Executive Summary

Intelligent Economics is a movement platform for the MIND (Measure, Integrate, Nurture, Direct) economic framework — a novel Beyond GDP approach that adds an Intelligence dimension not found in competitors like Doughnut Economics (DEAL), WEAll, or OECD's framework. The current site is technically impressive (Three.js particles, GSAP scroll animations, Zone Zero simulator) but has a broken conversion funnel: form submissions route to FormSubmit.co but were never confirmed, meaning every volunteer signup is silently lost. The primary engineering challenge is not building new features — it is migrating the existing monolithic HTML into a structured Astro component architecture while fixing the conversion pipeline and preserving the visual quality.

The recommended approach is Astro 5.x (stable) with Tailwind v4, vanilla TypeScript scripts for Three.js/GSAP (no framework wrappers), Netlify Forms replacing FormSubmit.co, and MailerLite for welcome sequence automation. The architecture avoids React/Svelte entirely — Three.js and GSAP are imperative libraries that work better as bundled TypeScript modules with DOM anchoring than as reactive framework components. The email pipeline (Netlify Forms → submission-created function → MailerLite API) is well-documented and zero-infrastructure. Discord handles community identity; no custom auth is needed or appropriate.

The dominant risks are: (1) Three.js SSR crashes during migration if not handled with `client:only` or scoped `<script>` tags; (2) Netlify Forms not detecting forms inside client-rendered components; (3) email deliverability failure on a new .ai domain without SPF/DKIM/DMARC setup; and (4) mobile thermal/battery drain from three simultaneous WebGL render loops. All four risks have well-understood mitigations and must be addressed in Phase 1. The movement's competitive differentiation — a live Zone Zero simulator and an authentic 1000-day policy countdown — is already built and just needs to survive the migration intact.

## Key Findings

### Recommended Stack

The stack is entirely built around Astro's static-first architecture with Netlify as the platform layer. Astro 5.x (not the Astro 6 beta) is the correct choice for production reliability. Tailwind v4 replaces the existing inline CSS with a utility-first system that is Vite-native and requires no PostCSS config. Three.js and GSAP are already used in the site and remain the right choices — GSAP is now fully free including all plugins, and Three.js 0.184 is actively maintained. The form-to-email pipeline uses exclusively platform services (Netlify Forms, Netlify Functions, MailerLite) with zero custom backend infrastructure.

**Core technologies:**
- Astro 5.18.x: Static site generator — zero JS by default, content-first, Netlify-native
- Three.js 0.184.x: Hero particles, morph engine, Zone Zero simulator — already in site, use vanilla (no R3F)
- GSAP 3.15.x: Scroll animations, ScrollTrigger — now 100% free including SplitText/MorphSVG
- Tailwind CSS 4.2.x: Utility CSS with OKLCH bioluminescent palette — Vite-native, no tailwind.config.js needed
- Netlify Forms: Volunteer and email capture form backend — free, zero-config, replaces FormSubmit.co
- MailerLite: Welcome sequence automation — free tier covers 1,000 subscribers + full automation builder
- Plausible Analytics: Privacy-first analytics — proxied via Netlify redirects to bypass ad blockers

### Expected Features

**Must have (table stakes) — P0:**
- Working email capture form: stops losing every signup (current FormSubmit.co is broken/unconfirmed)
- Privacy-respecting analytics (Plausible) with ad-blocker proxy
- Honest partner section: remove implied endorsements, use "Organizations working in this space" framing
- Mobile-responsive design: 60%+ of traffic is mobile; current Three.js needs conditional degradation

**Must have (table stakes) — P1:**
- Lightweight email signup near hero (minimal friction, email-only)
- Welcome email sequence (4 emails / 14 days): immediate confirmation + nurture to Discord
- Discord community with seeded activity before public launch (role-based channels, max 5 at start)
- Team/About page: named founder, brief bio, trust signals

**Should have (competitive differentiators):**
- Zone Zero simulator: already built, unique in the Beyond GDP space — needs mobile optimization
- 1000-day countdown timer: already built, authentic urgency tied to real policy deadlines
- Explicit ladder of engagement: Email → Discord → Working Group → Chapter Lead
- 4-email welcome sequence that explicitly drives progression through the ladder

**Defer to P2:**
- MIND Score dashboard with World Bank data (requires stable architecture first)
- Academic whitepaper / methodology publication
- Newsletter system (requires having content worth sharing)

**Defer to P3+:**
- "MIND Score for My City" tool (complex, requires validated methodology)
- Multi-language support (permanent resource drain; English-first)
- Volunteer matching / project boards (requires critical mass first)
- Donation functionality (legal complexity; premature before traction)

### Architecture Approach

The correct architecture is Astro as a markup shell with vanilla TypeScript modules for interactivity — not framework islands. Three.js and GSAP are imperative DOM-manipulation libraries that don't benefit from React/Svelte reactivity wrappers, and adding a framework runtime (React = 40KB+) provides zero value here. Instead, components provide semantic HTML structure and data-attribute anchors; bundled TypeScript scripts initialize by querying the DOM. This is the same pattern as the existing site, just structured as components rather than one monolithic file.

**Major components:**
1. BaseLayout.astro — HTML shell, design tokens, Plausible analytics snippet, font loading
2. Hero.astro + hero-particles.ts — particle canvas element + Three.js initialization on DOM query
3. ZoneZeroSimulator.astro + zone-zero.ts — self-contained module with all state encapsulated
4. Stories.astro + morph-engine.ts — scroll-driven particle morph; IntersectionObserver pauses off-screen
5. EmailCapture.astro + VolunteerForm.astro — static HTML forms with `data-netlify="true"`; JS enhances UX
6. submission-created.ts (Netlify Function) — routes form submissions to MailerLite and Discord webhook
7. Content collections (stories/, experiments/) — Markdown-driven story panels and experiment tabs
8. device-detect.ts (shared utility) — three-tier capability detection: full / reduced / minimal

### Critical Pitfalls

1. **Three.js SSR crash** — Never use `client:load` or `client:visible` for Three.js; use `client:only` or native Astro `<script>` tags (which are client-only by nature). Guard all Three.js code against server execution.

2. **Netlify Forms not detected** — Forms must exist in server-rendered Astro HTML, not inside `client:only` components. Add a static HTML form blueprint in `public/` as a deploy-time fallback. Verify form appears in Netlify dashboard post-deploy before considering it done.

3. **Email deliverability death spiral** — Configure SPF, DKIM, and DMARC records before sending a single email. Use MailerLite (handles authentication automatically). Warm the domain gradually. Start DMARC at `p=none`. The `.ai` TLD triggers heightened scrutiny from Gmail/Outlook.

4. **Mobile thermal/battery drain from three simultaneous WebGL loops** — All three Three.js scenes (hero, morph, Zone Zero) run continuous `requestAnimationFrame` loops. Pause off-screen loops with IntersectionObserver. Consider replacing the morph scene with CSS/SVG on mobile, keeping only one Three.js instance active at a time.

5. **GSAP ScrollTrigger zombie instances** — If View Transitions are ever added, use `gsap.context()` + `ctx.revert()` on `astro:before-swap`. Even without View Transitions, scope all ScrollTrigger instances for future-proofing.

## Implications for Roadmap

Based on combined research, the suggested phase structure follows a strict dependency order: fix what's broken first, then build the growth engine, then establish intellectual credibility, then scale.

### Phase 1: Fix the Broken Funnel (P0)

**Rationale:** Every day the form is broken is a volunteer permanently lost. This is not optional and has no prerequisites. It is also the highest-confidence work — the failure mode is precisely understood.

**Delivers:** Working conversion pipeline. Email submissions captured and confirmed. Analytics measuring the funnel. Partner section no longer a legal liability.

**Addresses:** Working email capture form, Plausible analytics, honest partner section fix.

**Avoids:** Pitfall 3 (Netlify Forms detection), Pitfall 11 (FormSubmit.co zombie), Pitfall 9 (Plausible ad-blocker gap), Pitfall 14 (partner endorsement liability).

**Note:** Also set up SPF/DKIM/DMARC DNS records in this phase even though email sequences don't send until Phase 2.

### Phase 2: Build the Growth Engine (P1)

**Rationale:** With the funnel working, the priority shifts to nurturing signups into community members. This phase builds the full acquisition-to-activation pipeline. Discord must be seeded before being publicly linked. Mobile performance must be fixed before the site can be the primary conversion surface.

**Delivers:** Full email-to-Discord pipeline, 4-email welcome sequence, mobile-performant Three.js, Team/About page, hero email capture form, ladder of engagement visible on site.

**Addresses:** Lightweight hero signup, welcome sequence (4 emails/14 days), Discord community, Team/About, mobile performance optimization, Zone Zero mobile fix, ladder of engagement.

**Avoids:** Pitfall 4 (email deliverability), Pitfall 5 (mobile battery drain), Pitfall 10 (Discord ghost town), Pitfall 7 (form spam flood).

**Research flag:** Welcome sequence email content is a creative/strategic deliverable, not a technical one — needs review of timing and messaging before MailerLite automation setup.

### Phase 3: Astro Migration and Component Architecture (P1 parallel or sequential)

**Rationale:** The monolithic HTML must be decomposed into Astro components to enable maintainability, content collections, and the data pipeline. This is the most technically complex phase. It can proceed in parallel with Phase 2 or follow it, but must be complete before any P2 features.

**Delivers:** Astro 5.x project with Tailwind v4, all sections as components, content collections for stories/experiments, TypeScript scripts for all Three.js/GSAP logic, progressive enhancement tiers.

**Uses:** Full recommended stack — Astro 5.18, Tailwind 4.2, Three.js 0.184, GSAP 3.15, @astrojs/netlify.

**Avoids:** Pitfall 1 (Three.js SSR), Pitfall 2 (GSAP ScrollTrigger zombies), Pitfall 6 (hydration overuse), Pitfall 8 (CSS token splitting), Pitfall 12 (Three.js version pinning), Pitfall 13 (countdown timezone).

**Research flag:** Needs careful visual regression testing at each component extraction step. Side-by-side screenshot comparison required.

### Phase 4: Credibility and Data Tools (P2)

**Rationale:** Once the funnel is working and you have 100+ email subscribers, the priority shifts to intellectual credibility. The MIND Score dashboard differentiates from all competitors (DEAL has static diagrams, OECD has PDFs). Academic paper publication establishes the framework's legitimacy.

**Delivers:** MIND Score dashboard with World Bank API data, academic whitepaper published, newsletter system for ongoing communication, testimonials from early community members.

**Addresses:** MIND Score dashboard, academic whitepaper, newsletter system, testimonials/social proof.

**Research flag:** World Bank API integration and D3/Observable visualization for MIND Score dashboard will need a dedicated research phase — data normalization methodology and API authentication patterns are non-trivial.

### Phase 5: Scale and Localization (P3+)

**Rationale:** Deferred until movement has 500+ subscribers and 20+ active Discord members. Features in this phase require critical mass to avoid empty project board and ghost town effects.

**Delivers:** "MIND Score for My City" tool, volunteer matching/project boards, multi-language support (if organic demand exists), action tools (petitions, letter-writing) tied to specific policy campaigns.

**Research flag:** "MIND Score for My City" requires dedicated research into city-level data sources and validated methodology. Do not start until the national MIND Score dashboard is proven out.

### Phase Ordering Rationale

- Phases 1 and 2 are driven by lost-signup urgency — the cost of delay is permanent and compounding.
- Phase 3 (migration) is a prerequisite for Phase 4 (data tools) but can overlap with Phase 2 since form backend changes are deployment-level, not architecture-level.
- Discord setup must precede Phase 2 email sequences because welcome email #3 invites to Discord — sending that email to an empty/unseeded server would trigger the ghost town pitfall.
- SPF/DKIM/DMARC (Phase 1 DNS work) must precede Phase 2 email sending — DNS propagation takes 24-72 hours.
- Visual regression testing during Phase 3 migration prevents the CSS token splitting pitfall from compounding across later phases.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4 (MIND Score dashboard):** World Bank API integration, D3/Observable visualization patterns, data normalization for MIND dimensions — non-trivial, needs dedicated research-phase.
- **Phase 5 (City tool):** City-level data sources, input validation methodology, UX for policy practitioners — requires validated national methodology first.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Fix funnel):** Netlify Forms, Plausible proxy — well-documented with official guides.
- **Phase 2 (Growth engine):** MailerLite automation, Discord setup — standard patterns, MailerLite docs are excellent.
- **Phase 3 (Astro migration):** Astro + Three.js + GSAP integration — documented in Codrops tutorial (2026-02-02), official Astro docs are comprehensive.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs and npm. GSAP free license confirmed. Tailwind v4 Vite-native confirmed. Astro 6 beta deliberately excluded. |
| Features | HIGH | Competitor analysis against DEAL, WEAll, 350.org, Sunrise Movement. Ladder of engagement pattern well-documented. |
| Architecture | HIGH | Astro vanilla script pattern confirmed via Codrops tutorial and official Astro client-side scripts docs. Anti-patterns clearly identified. |
| Pitfalls | HIGH | All critical pitfalls have cited GitHub issues, forum threads, and official troubleshooting docs. Netlify Forms + Astro detection issue confirmed in multiple forum reports. |

**Overall confidence:** HIGH

### Gaps to Address

- **MailerLite vs. Resend discrepancy:** STACK.md recommends MailerLite; ARCHITECTURE.md data flow references Resend. Resolution: MailerLite is the correct choice (automation sequences, 1,000 free subscribers). Resend is transactional-only. Update architecture docs accordingly.
- **Three.js version pinning:** PITFALLS.md recommends pinning to `three@0.148.0` initially; STACK.md recommends `three@0.184.0`. Confirm which version the existing site uses before migration to avoid API breakage. Pin to current site version first, upgrade deliberately after migration.
- **Discord timeline dependency:** Welcome email sequence and Discord setup must be coordinated — email #3 (Day 7) invites to Discord. Discord must have visible activity before that email sends. Plan seeding period before go-live.
- **Netlify Forms free tier limits:** Post-September 2025 credit-based plans changed Netlify pricing. Verify current submission limits before relying on free tier at scale.

## Sources

### Primary (HIGH confidence)
- Astro 5.18 official docs — Islands, client directives, content collections, project structure
- Tailwind CSS v4 release blog — Vite-native integration, OKLCH color space, single-import config
- GSAP pricing page — Confirmed 100% free including all plugins (2025 license change)
- Netlify Forms docs — Static form detection, submission-created function trigger, spam filters
- MailerLite features page — Automation builder, free tier limits, REST API
- Plausible Netlify proxy guide — Redirect rules for ad-blocker bypass
- Codrops: Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro (2026-02-02) — Production integration pattern

### Secondary (MEDIUM confidence)
- GSAP community forums — ScrollTrigger + Astro View Transitions cleanup patterns
- Netlify Answers community — Astro static site form detection issues (multiple confirmed reports)
- 350.org, Sunrise Movement, DEAL, WEAll — Competitor feature analysis (live site observation)
- CiviClick, Beautiful Trouble — Ladder of engagement framework documentation

### Tertiary (LOW confidence)
- Netlify credit-based pricing post-Sept 2025 — Exact submission limits need direct verification
- Discord growth best practices — Community-specific, verify timing with actual Discord server analytics

---
*Research completed: 2026-04-21*
*Ready for roadmap: yes*
