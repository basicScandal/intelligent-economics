<!-- GSD:project-start source:PROJECT.md -->
## Project

**Intelligent Economics**

A movement platform proposing the MIND framework (Material x Intelligence x Network x Diversity = Prosperity) as a post-GDP measure of economic health. The site is the movement's front door — converting intellectual explorers into active volunteers, and giving policy practitioners the tools to evaluate MIND for their jurisdictions. Currently a visually striking but functionally broken single-page site; this milestone transforms it into a modern, conversion-ready platform.

**Core Value:** **The volunteer conversion pipeline must work.** Every visitor who wants to join this movement must be captured, welcomed, and given a path to meaningful contribution. Without people, there is no movement.

### Constraints

- **Tech Stack**: Astro static site generator — component-based, zero JS by default, Netlify-native
- **Hosting**: Netlify — handles forms natively, easy CI/CD, already partially configured
- **Privacy**: No third-party tracking cookies. Analytics must be GDPR-compliant (Plausible).
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile. Particles reduced on constrained devices.
- **Budget**: Volunteer/side project — prefer free tiers and open source tooling
- **Accessibility**: WCAG 2.1 Level AA target
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro | 5.18.x (stable) | Static site generator, component architecture | Zero JS by default, islands architecture for selective hydration, Netlify-native, content-first. Astro 6 is in beta — use stable 5.x for production reliability. | HIGH |
| @astrojs/netlify | 7.0.x | Netlify adapter | Enables Netlify Forms detection, Image CDN, and serverless functions if needed. Required for form handling. | HIGH |
| Node.js | 22.x | Runtime | Required by Astro 5.18+. Astro 6 drops Node 18/20 support entirely. | HIGH |
### Animation & Visualization
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Three.js | 0.184.x | 3D particle hero, WebGL visualizations | Already used in existing site. Monthly releases, actively maintained. Load via `client:visible` island to defer until viewport entry. | HIGH |
| GSAP | 3.15.x | Scroll-driven animations, ScrollTrigger | Now 100% FREE including all plugins (SplitText, MorphSVG, ScrollTrigger). No license concerns. Standard "no charge" license covers commercial use. | HIGH |
| GSAP ScrollTrigger | (bundled with gsap) | Scroll-linked animations | Part of GSAP core package. Register plugin explicitly. Use with `client:idle` directive for non-critical animations. | HIGH |
### CSS & Styling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.2.x | Utility-first CSS, dark theme, responsive | v4 is Vite-native (via @tailwindcss/vite plugin), no PostCSS config needed, 5x faster full builds, 100x faster incremental. Single `@import "tailwindcss"` line. OKLCH color space for bioluminescent palette. | HIGH |
| @tailwindcss/vite | 4.2.x | Vite plugin for Tailwind | First-party Vite integration. Zero-config with Astro's Vite internals. | HIGH |
| CSS Custom Properties | -- | Theme tokens (bioluminescent palette) | Define color palette as custom properties, reference in Tailwind theme. Enables runtime theming and reduced-motion support. | HIGH |
### Form Handling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Netlify Forms | (platform) | Volunteer signup form, email capture | Free and unlimited on new accounts (post-Sept 2025 credit-based plans). Zero backend code. Spam filtering via honeypot + reCAPTCHA. Platform-native with Astro static output. | HIGH |
| Netlify Functions | (platform) | Webhook to email provider on form submit | Event-driven `submission-created` trigger. Pushes new subscribers to MailerLite via API. Serverless, no infrastructure. | HIGH |
### Email & Newsletter
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| MailerLite | (SaaS) | Welcome sequence automation, subscriber management | Free tier: 1,000 subscribers, 12,000 sends/month, full automation included. Visual automation builder for 4-email welcome sequence. REST API for programmatic subscriber adds. Paid tier starts at $10/mo — gentle growth path. | HIGH |
### Analytics
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Plausible Analytics | (Cloud) | Privacy-first traffic analytics | No cookies, GDPR/CCPA compliant, lightweight script (~1KB). Cloud starts at $9/month for 10k pageviews. No free tier for cloud — budget line item. Embed via `<script>` in Astro layout head. | HIGH |
### Hosting & Deployment
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Netlify | (platform) | Hosting, CDN, CI/CD, forms, functions | Already configured. Git-connected deploys from main branch. Branch previews for PRs. Free tier generous for this scale. | HIGH |
| GitHub Actions | -- | CI (optional) | Lighthouse CI, link checking pre-deploy. Already has workflow files in repo. | MEDIUM |
### Community & Communication
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Discord | (platform) | Community hub, volunteer coordination | Free, better for public communities than Slack, role-based channels, async-friendly. Already decided. | HIGH |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 5.x | Astro 6 beta | Beta instability. Astro 6 requires workerd runtime changes. Wait for stable release. |
| CSS | Tailwind v4 | Vanilla CSS / CSS Modules | Existing site is inline CSS — Tailwind provides utility migration path, responsive helpers, and dark mode baked in. Team familiarity is low-risk for solo dev. |
| CSS | Tailwind v4 | Tailwind v3 | v4 is production-ready, faster, simpler config (no tailwind.config.js needed), native Vite plugin. No reason to use v3 on a greenfield. |
| Forms | Netlify Forms | Formspree / FormGrid | Netlify Forms is free+unlimited on new accounts and zero-config. No external dependency. Platform lock-in is acceptable since we're already on Netlify. |
| Email | MailerLite | Buttondown | Buttondown is newsletter-first (100 free subscribers). MailerLite is automation-first (1,000 free subscribers + automation sequences). We need welcome sequences, not newsletters. |
| Email | MailerLite | Resend | Resend is transactional-only (no marketing automation). We need drip sequences. Resend = 500 emails/mo free cap. |
| Email | MailerLite | Brevo | Brevo's 300/day limit is fine but automation UI is clunkier. MailerLite's automation builder is best-in-class at this tier. |
| Analytics | Plausible Cloud | Plausible Self-Hosted | Self-hosting adds infrastructure burden. $9/mo is acceptable for zero-maintenance analytics on a volunteer project. |
| Analytics | Plausible | PostHog | PostHog is heavier (product analytics, session replay). Overkill for a movement site that just needs traffic + funnel data. |
| 3D | Three.js vanilla | React Three Fiber | No React in the project. R3F adds React dependency. Vanilla Three.js in a `client:visible` island is lighter. |
| Animation | GSAP | Motion (Framer Motion) | GSAP is already used in existing site. Framework-agnostic. ScrollTrigger is unmatched for scroll-driven animations. Now fully free. |
## Astro Islands Strategy
| Component | Island? | Directive | Rationale |
|-----------|---------|-----------|-----------|
| Three.js Particle Hero | YES | `client:visible` | Heavy (Three.js + WebGL). Only load when hero enters viewport. Add `rootMargin` for early hydration start. |
| Zone Zero Simulator | YES | `client:visible` | Interactive canvas + 4 sliders. Defer until user scrolls to it. |
| GSAP Scroll Animations | YES | `client:idle` | Non-critical visual polish. Load after initial page render is complete. |
| Volunteer Signup Form | NO | -- | Static HTML form with `netlify` attribute. No JS needed. Progressive enhancement. |
| Email Capture (hero) | NO | -- | Simple HTML form. Netlify handles submission. Zero JS. |
| Countdown Timer | YES | `client:idle` | Requires JS for time calculation. Low priority, loads after idle. |
| Navigation | NO | -- | Static HTML. Mobile hamburger can use CSS-only `:target` or minimal inline script. |
## Configuration Files
### astro.config.mjs
### CSS Entry Point (src/styles/global.css)
## Installation
# Core
# CSS
# Animation & 3D
# Type support (dev)
## Version Pinning Strategy
## Email Integration Architecture
### Netlify Function (netlify/functions/submission-created.js)
## Performance Budget
| Metric | Target | How |
|--------|--------|-----|
| Lighthouse Desktop | >= 90 | Astro zero-JS default, static HTML, Netlify CDN |
| Lighthouse Mobile | >= 75 | `client:visible` defers Three.js, conditional particle count reduction via `matchMedia` |
| JS Bundle (critical) | < 5KB | Only countdown timer loads eagerly; everything else deferred |
| JS Bundle (total) | < 200KB | Three.js (~150KB gzipped) + GSAP (~30KB gzipped), loaded on demand |
| First Contentful Paint | < 1.5s | Static HTML served from CDN edge |
| Cumulative Layout Shift | < 0.1 | Reserve space for islands with CSS aspect-ratio/min-height |
## Sources
- Astro 5.18 stable: https://www.npmjs.com/package/astro
- Astro Netlify Adapter: https://docs.astro.build/en/guides/integrations-guide/netlify/
- Astro 6 on Netlify (beta): https://www.netlify.com/changelog/2026-03-10-astro-6/
- Three.js 0.184: https://www.npmjs.com/package/three
- GSAP 3.15 (now fully free): https://www.npmjs.com/package/gsap
- GSAP pricing/license: https://gsap.com/pricing/
- Tailwind CSS v4.0 release: https://tailwindcss.com/blog/tailwindcss-v4
- @tailwindcss/vite 4.2.2: https://www.npmjs.com/package/@tailwindcss/vite
- Netlify Forms (free unlimited on new plans): https://docs.netlify.com/manage/forms/usage-and-billing/
- Netlify credit-based pricing: https://www.netlify.com/pricing/
- MailerLite free tier & automation: https://www.mailerlite.com/features/automation
- MailerLite API docs: https://developers.mailerlite.com/
- Plausible Analytics: https://plausible.io/
- Astro client directives: https://docs.astro.build/en/reference/directives-reference/
- Astro Islands architecture: https://docs.astro.build/en/concepts/islands/
- Codrops Three.js + GSAP + Astro tutorial: https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/
- Netlify + MailerLite integration pattern: https://dev.to/duncanteege/how-to-create-an-email-subscription-form-in-nextjs-netlify-and-mailerlite-41mc
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
