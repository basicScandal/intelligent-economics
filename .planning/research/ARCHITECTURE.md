# Architecture Patterns

**Domain:** Movement/advocacy platform with heavy WebGL interactivity
**Researched:** 2026-04-21

## Recommended Architecture

**Astro static site with script-driven interactivity (no UI framework islands).**

The existing site uses vanilla JavaScript exclusively — no React, Svelte, or Vue. Astro's island architecture is designed for framework components, but this project doesn't need framework islands. Instead, use Astro's native `<script>` tag processing (which bundles, deduplicates, and tree-shakes) combined with TypeScript modules for Three.js/GSAP logic.

This is the correct architectural choice because:
1. Three.js and GSAP are imperative libraries — they manipulate canvas/DOM directly, not through a reactive framework
2. Adding React/Svelte wrappers around Three.js adds overhead with zero benefit
3. Astro's script bundling already handles imports, TypeScript, and deduplication

### High-Level Structure

```
src/
  pages/
    index.astro              ← Single page (composes all sections)
    privacy.astro            ← Privacy policy
  layouts/
    BaseLayout.astro         ← <html>, <head>, meta, fonts, analytics
  components/
    nav/
      Nav.astro              ← Fixed nav + theme toggle
    hero/
      Hero.astro             ← Hero markup + particle canvas element
    sections/
      EmailCapture.astro     ← Early CTA email form
      MindDashboard.astro    ← MIND equation + animated bars
      ZoneZeroSimulator.astro ← Full simulator (sliders + canvas + UI)
      Inversion.astro        ← The Inversion section
      MetabolicRift.astro    ← Metabolic Rift section
      Pillars.astro          ← 4 pillar cards
      Stories.astro          ← Historical nucleation (morph scene wrapper)
      StoryPanel.astro       ← Individual story panel (reusable)
      AfterVolunteer.astro   ← What happens after you join
      LocalExperiments.astro ← Tabbed experiment panels
      VolunteerForm.astro    ← Full signup form with role cards
      Paths.astro            ← First steps / paths section
      Partners.astro         ← Partner organizations
      FinalCTA.astro         ← Bottom CTA section
    ui/
      Button.astro           ← Reusable button variants
      SectionLabel.astro     ← "Section label" chip
      Countdown.astro        ← 1000-day countdown timer
      Ticker.astro           ← Scrolling ticker bar
    footer/
      Footer.astro           ← Site footer
  scripts/
    hero-particles.ts        ← Three.js hero particle system
    morph-engine.ts          ← Scroll-driven particle morph (stories)
    zone-zero.ts             ← Zone Zero simulator (Three.js + sliders)
    gsap-reveals.ts          ← GSAP clip-path wipes + scroll reveals
    forms.ts                 ← Form submission handlers
    theme.ts                 ← Dark/light toggle logic
    countdown.ts             ← Timer update logic
    experiments-tabs.ts      ← Tab switching for local experiments
    device-detect.ts         ← Capability detection (mobile, reduced motion)
  styles/
    tokens.css               ← Design tokens (CSS custom properties)
    base.css                 ← Reset + typography
    utilities.css            ← Layout utilities (.container, .section, etc.)
    components/              ← Per-component CSS (co-located or here)
  content/
    stories/                 ← Content collection for case study panels
      medici.md
      bell-labs.md
      mondragon.md
      shenzhen.md
      estonia.md
      silicon-valley.md
    experiments/             ← Content collection for experiment tabs
      neighborhood.md
      startup.md
      company.md
      city.md
  netlify/
    functions/
      submission-created.ts  ← Triggered on form submit (email + Discord)
public/
  fonts/                     ← Self-hosted fonts (if moving off CDN)
  og-render.html             ← OG image renderer (keep as-is)
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `BaseLayout` | HTML shell, `<head>`, fonts, Plausible snippet | All pages |
| `Nav` | Fixed navigation, theme toggle, CTA button | `theme.ts` (via data-attribute) |
| `Hero` | Hero text, countdown, particle canvas element | `hero-particles.ts`, `countdown.ts` |
| `EmailCapture` | Lightweight email form (pre-volunteer) | `forms.ts` → Netlify Forms |
| `MindDashboard` | Static MIND equation display + animated bar chart | `gsap-reveals.ts` |
| `ZoneZeroSimulator` | 4 sliders + canvas + health UI + share buttons | `zone-zero.ts` (self-contained) |
| `Stories` | Morph scene wrapper (sticky + scroll height) | `morph-engine.ts` |
| `StoryPanel` | Individual story content (receives props from content collection) | Parent `Stories` |
| `LocalExperiments` | Tab UI + 4 experiment panels | `experiments-tabs.ts` |
| `VolunteerForm` | Full form (name, email, roles, message) | `forms.ts` → Netlify Forms |
| `Paths` / `Partners` / `FinalCTA` | Static content sections | None (pure Astro markup) |
| `submission-created` | Serverless function: email + Discord webhook | Netlify Forms, SendGrid/Resend, Discord |

---

## Script Architecture: How Three.js/GSAP Integrate with Astro

### Pattern: Bundled TypeScript Modules with DOM Anchoring

Astro processes `<script>` tags by default — bundling imports, supporting TypeScript, and deduplicating across component instances. The pattern for Three.js/GSAP:

1. **Component provides DOM anchors** (canvas elements, data attributes for config)
2. **Script imports are placed in the component's `<script>` tag** — Astro bundles them
3. **Script initializes by querying the DOM** for the canvas/container elements
4. **Device capability is checked first** — graceful degradation if underpowered

```astro
<!-- Hero.astro -->
---
// No frontmatter logic needed for the particle system
---

<section class="hero" aria-label="Hero">
  <canvas id="particle-canvas" aria-hidden="true"></canvas>
  <div class="hero__content">
    <!-- Hero text content -->
  </div>
</section>

<script>
  import { initHeroParticles } from '../scripts/hero-particles';
  
  const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
  if (canvas) {
    initHeroParticles(canvas);
  }
</script>
```

```typescript
// src/scripts/hero-particles.ts
import * as THREE from 'three';
import { getDeviceCapability } from './device-detect';

export function initHeroParticles(canvas: HTMLCanvasElement) {
  const { isMobile, prefersReducedMotion } = getDeviceCapability();
  if (prefersReducedMotion) return; // Graceful exit
  
  const PARTICLE_COUNT = isMobile ? 1500 : 4000;
  // ... Three.js setup using the passed canvas
}
```

### Pattern: GSAP ScrollTrigger with Cleanup

GSAP ScrollTrigger instances must be registered once and cleaned up if Astro view transitions are ever added. For now (single page, no view transitions), the pattern is simpler:

```typescript
// src/scripts/gsap-reveals.ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initClipWipes() {
  const pillarCards = gsap.utils.toArray('.pillar-card') as HTMLElement[];
  pillarCards.forEach((card, i) => {
    // ... clip-path animation setup
  });
}

export function initScrollReveals() {
  // IntersectionObserver-based reveals (lighter than ScrollTrigger for simple fades)
}
```

### Pattern: Zone Zero Simulator (Self-Contained Island)

The Zone Zero simulator is the most complex interactive component. It manages:
- 4 range sliders (input state)
- Three.js particle visualization (output)
- Health assessment UI (derived state)
- URL param sharing (persistence)
- OG meta updates (side effect)

Architecture it as a **single self-contained module** that exports one `initZoneZero(container)` function. All internal state is encapsulated.

```typescript
// src/scripts/zone-zero.ts
import * as THREE from 'three';
import gsap from 'gsap';
import { getDeviceCapability } from './device-detect';

interface ZoneZeroState {
  scores: { m: number; i: number; n: number; d: number };
  isCollapsed: boolean;
}

export function initZoneZero(container: HTMLElement) {
  const { isMobile, prefersReducedMotion } = getDeviceCapability();
  if (prefersReducedMotion) return; // Show static fallback
  
  const canvas = container.querySelector('#zz-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  
  // All state, Three.js scene, event handlers scoped here
  // Hydrate from URL params
  // Return cleanup function (future-proofing for view transitions)
}
```

### Script Loading Strategy

| Script | Load Timing | Rationale |
|--------|------------|-----------|
| `theme.ts` | Immediate (in `<head>` via `is:inline`) | Prevents FOUC on theme |
| `hero-particles.ts` | Page load (default `<script>`) | Above the fold, critical visual |
| `gsap-reveals.ts` | Page load (default `<script>`) | Animations fire on scroll |
| `morph-engine.ts` | Page load (default `<script>`) | Needs ScrollTrigger registered early |
| `zone-zero.ts` | Page load (default `<script>`) | Complex, but user scrolls to it |
| `forms.ts` | Page load (default `<script>`) | Must be ready when user reaches form |
| `countdown.ts` | Page load (default `<script>`) | Lightweight, runs on interval |
| `experiments-tabs.ts` | Page load (default `<script>`) | Lightweight, event handlers only |

**Why not `client:visible` islands?** Because these aren't framework components. Astro's `client:visible` only works with React/Svelte/Vue islands. For vanilla scripts, the equivalent is checking visibility within the script itself (IntersectionObserver) before initializing heavy work — which the existing code already does for the morph engine and Zone Zero simulator.

---

## Data Flow

### Content Flow (Build Time)

```
Content Collections (Markdown)
  └── stories/*.md → Stories.astro → StoryPanel.astro (iterated)
  └── experiments/*.md → LocalExperiments.astro (tab content)

Design Tokens (CSS)
  └── tokens.css → imported in BaseLayout.astro → available globally

Static Assets
  └── public/ → served at root (og-render.html, fonts, favicons)
```

### Form → Email → Community Pipeline (Runtime)

```
User Action                  Backend                         Outcome
───────────                  ───────                         ───────
1. Email capture form     →  Netlify Forms (netlify attr)  → Stored in Netlify dashboard
   (hero section)             └── triggers submission-created.ts
                                    ├── POST to Discord webhook (new-signup channel)
                                    ├── POST to Resend/SendGrid (welcome email #1)
                                    └── Add to email list (Resend audience / Buttondown)

2. Volunteer form         →  Netlify Forms (netlify attr)  → Stored in Netlify dashboard
   (full signup)              └── triggers submission-created.ts
                                    ├── POST to Discord webhook (includes role info)
                                    ├── POST to email service (welcome sequence trigger)
                                    ├── Generate Discord invite link (role-specific)
                                    └── Add to email list with role tags

3. Welcome email sequence →  Email service (Resend/Buttondown) drip campaign
   (4 emails / 14 days)       Email 1: Welcome + Discord invite (immediate)
                               Email 2: MIND framework deep-dive (Day 3)
                               Email 3: Your role, your first task (Day 7)
                               Email 4: Community check-in + next steps (Day 14)
```

### Key Design Decisions for the Pipeline

| Decision | Rationale |
|----------|-----------|
| Netlify Forms over custom backend | Free tier (100 submissions/month), zero infrastructure, native Astro support |
| `submission-created` function | Netlify's built-in event trigger — no polling, no webhook config needed |
| Resend over SendGrid | Better DX, generous free tier (3,000 emails/month), simpler API |
| Discord webhook over bot | Webhooks are stateless, no server needed, free, no bot hosting |
| Single function handles both forms | Check `form-name` field to route logic; simpler than 2 functions |

### Pipeline Architecture Detail

```typescript
// netlify/functions/submission-created.ts
import type { Handler } from '@netlify/functions';

interface FormPayload {
  payload: {
    form_name: string;
    data: {
      email: string;
      name?: string;
      roles?: string;
      message?: string;
    };
  };
}

export const handler: Handler = async (event) => {
  const { payload } = JSON.parse(event.body!) as FormPayload;
  const { form_name, data } = payload;
  
  // Route based on which form submitted
  if (form_name === 'email-capture') {
    await sendWelcomeEmail(data.email);
    await notifyDiscord(`New email signup: ${data.email}`);
  }
  
  if (form_name === 'volunteer-signup') {
    await sendWelcomeEmail(data.email, data.name, data.roles);
    await notifyDiscord(`New volunteer: ${data.name} — Roles: ${data.roles}`);
    await addToEmailList(data.email, { name: data.name, roles: data.roles });
  }
  
  return { statusCode: 200, body: 'OK' };
};
```

---

## Progressive Enhancement Strategy

### Tier 1: Core Content (No JavaScript)

All content is rendered as static HTML at build time by Astro. If JavaScript fails to load or is disabled:
- All text content is readable
- All links work
- Forms display (though submission requires JS for Netlify's AJAX handling — provide a `<noscript>` fallback pointing to Netlify's native POST action)
- Navigation links work (anchor links)
- Images and static elements are visible

### Tier 2: Enhanced Layout (CSS Only)

- Design tokens and responsive layout work without JS
- `@media (prefers-reduced-motion: reduce)` disables all transitions
- Dark theme is default (no FOUC — set in HTML attribute at build time)
- Scroll snap / sticky positioning works natively

### Tier 3: Full Interactivity (JavaScript)

Loaded progressively based on device capability:

```typescript
// src/scripts/device-detect.ts
export interface DeviceCapability {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  supportsWebGL: boolean;
  tier: 'full' | 'reduced' | 'minimal';
}

export function getDeviceCapability(): DeviceCapability {
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const isLowEnd = cores <= 4 && isMobile;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // WebGL check
  let supportsWebGL = false;
  try {
    const c = document.createElement('canvas');
    supportsWebGL = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {}
  
  let tier: 'full' | 'reduced' | 'minimal' = 'full';
  if (prefersReducedMotion || !supportsWebGL) tier = 'minimal';
  else if (isLowEnd) tier = 'reduced';
  
  return { isMobile, isLowEnd, prefersReducedMotion, supportsWebGL, tier };
}
```

### Performance Budget by Tier

| Tier | Particle Count (Hero) | Particle Count (Morph) | Particle Count (ZZ) | GSAP Animations |
|------|----------------------|----------------------|---------------------|-----------------|
| `full` | 4,000 | 3,200 | 1,800 | All clip-path wipes + counters |
| `reduced` | 1,500 | 1,200 | 800 | Simplified (fade only, no clip-path) |
| `minimal` | 0 (static gradient BG) | 0 (static image/CSS fallback) | 0 (sliders + text only) | None (CSS transitions only) |

---

## Patterns to Follow

### Pattern 1: Astro Component as Markup Shell + Script Anchor

**What:** Components provide semantic HTML structure and anchor points. Scripts initialize off DOM queries.

**When:** Always — this is the core pattern for the entire site.

**Example:**
```astro
<!-- ZoneZeroSimulator.astro -->
---
// Props could accept default values or config
interface Props {
  defaults?: { m: number; i: number; n: number; d: number };
}
const { defaults = { m: 70, i: 60, n: 50, d: 40 } } = Astro.props;
---

<section class="zone-zero section" id="zone-zero" 
  data-defaults={JSON.stringify(defaults)}
  aria-label="Zone Zero Simulator">
  
  <div class="zz-canvas-wrap">
    <canvas id="zz-canvas" aria-hidden="true"></canvas>
  </div>
  
  <!-- Slider controls, health UI, etc. -->
  
  <noscript>
    <p class="zz-noscript">Enable JavaScript to use the interactive simulator.</p>
  </noscript>
</section>

<script>
  import { initZoneZero } from '../scripts/zone-zero';
  const container = document.getElementById('zone-zero');
  if (container) initZoneZero(container);
</script>
```

### Pattern 2: Content Collection for Repeating Content

**What:** Use Astro content collections for story panels and experiment tabs — keeps content separate from presentation.

**When:** Any content that repeats a pattern (case studies, experiment types).

**Example:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const stories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    era: z.string(),
    location: z.string(),
    badge: z.string(),
    badgeColor: z.string(),
    statNumber: z.string(),
    statLabel: z.string(),
    shape: z.enum(['network', 'radial', 'rings', 'explosion', 'grid', 'spinout']),
    sortOrder: z.number(),
  }),
});

export const collections = { stories };
```

### Pattern 3: CSS-First Animation with GSAP Enhancement

**What:** CSS handles basic transitions (hover, focus, theme). GSAP adds scroll-triggered reveals only when loaded.

**When:** All non-critical animations.

**Why:** If GSAP fails to load, the page still looks good — just without entrance animations.

```css
/* Base state — visible by default */
.pillar-card {
  opacity: 1;
  transition: transform 0.3s ease;
}

/* Only when JS adds this class do we hide for reveal */
.pillar-card[data-animate] {
  opacity: 0;
  clip-path: polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%);
}

.pillar-card[data-animate].revealed {
  opacity: 1;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
}
```

### Pattern 4: Netlify Forms with Progressive Enhancement

**What:** Forms use standard HTML form attributes for Netlify detection, with JavaScript enhancing the UX.

```astro
<form 
  name="volunteer-signup" 
  method="POST" 
  data-netlify="true"
  netlify-honeypot="bot-field"
  action="/success/"
>
  <input type="hidden" name="form-name" value="volunteer-signup" />
  <p class="hidden"><input name="bot-field" /></p>
  
  <!-- Form fields -->
  
  <button type="submit" class="btn btn--primary">Join the Movement</button>
</form>

<script>
  import { enhanceForm } from '../scripts/forms';
  const form = document.querySelector('[name="volunteer-signup"]') as HTMLFormElement;
  if (form) enhanceForm(form);
</script>
```

The `enhanceForm` function intercepts submit, shows loading state, handles AJAX submission, and displays success UI — but if JS fails, the form still POSTs normally to Netlify's endpoint with a redirect to `/success/`.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Wrapping Three.js in a Framework Island

**What:** Using `<ThreeScene client:load />` with a React/Svelte wrapper around Three.js.

**Why bad:** Adds a framework runtime (React = 40KB+) for zero benefit. Three.js is imperative — it doesn't use reactivity. The wrapper adds latency and complexity.

**Instead:** Use Astro's native `<script>` with TypeScript imports to initialize Three.js directly on canvas elements.

### Anti-Pattern 2: Using `is:inline` for Everything

**What:** Putting all JavaScript in `<script is:inline>` tags to replicate the monolithic HTML behavior.

**Why bad:** Skips Astro's bundling, deduplication, TypeScript processing, and tree-shaking. Results in larger bundles and no import support.

**Instead:** Use default `<script>` tags with imports. Only use `is:inline` for the theme toggle (needs to run before first paint to prevent FOUC) and external CDN scripts (if keeping CDN approach).

### Anti-Pattern 3: Single Monolithic Script File

**What:** Putting all 1,200+ lines of JavaScript in one file.

**Why bad:** No code splitting, no tree-shaking, everything loads regardless of need.

**Instead:** Split into logical modules (hero-particles, morph-engine, zone-zero, etc.) that Astro can bundle per-component.

### Anti-Pattern 4: Using define:vars for Heavy Components

**What:** Using `define:vars` to pass Astro frontmatter data to Three.js scripts.

**Why bad:** `define:vars` disables bundling — the script becomes inline and cannot import npm packages.

**Instead:** Pass configuration via `data-*` attributes on the component's root element, and read them in the script with `element.dataset`.

---

## Scalability Considerations

| Concern | Current (v1) | Future (v2+) |
|---------|-------------|--------------|
| Pages | 2 (index + privacy) | 5-10 (blog, team, whitepaper, city tool) |
| Content | Hardcoded in HTML | Content collections (Markdown) |
| Forms | 2 (email capture + volunteer) | 3-4 (contact, city application) |
| Routing | Single page + privacy | Multi-page with shared layout |
| i18n | English only | Content collections support i18n (future P3) |
| Auth | None | Not needed for v1; magic link if v3 |
| API | None | MIND Score API (P3) via Netlify Functions |

---

## Suggested Build Order (Dependencies)

Phase order matters because later components depend on earlier infrastructure:

```
Phase 1: Foundation (no dependencies)
├── BaseLayout.astro (HTML shell, design tokens, fonts)
├── tokens.css + base.css (design system)
├── device-detect.ts (shared utility)
└── Nav.astro + theme.ts (site-wide)

Phase 2: Static Content Sections (depends on Phase 1)
├── All section components as pure Astro markup
├── Content collections for stories + experiments
├── Footer.astro
└── Privacy page

Phase 3: Interactivity Layer (depends on Phase 1 + 2 markup)
├── hero-particles.ts (Three.js hero)
├── gsap-reveals.ts (scroll animations)
├── morph-engine.ts (story morph)
├── zone-zero.ts (simulator)
├── countdown.ts + experiments-tabs.ts
└── Progressive enhancement (tier system)

Phase 4: Pipeline (depends on form markup from Phase 2)
├── forms.ts (client-side enhancement)
├── Netlify Forms config (netlify attributes on forms)
├── submission-created.ts serverless function
├── Email service integration (Resend)
├── Discord webhook integration
└── Welcome email sequence setup

Phase 5: Polish & Performance
├── Lighthouse optimization pass
├── Mobile performance tuning (particle budgets)
├── Success/error page flows
├── Analytics events (Plausible custom events)
└── OG image generation (keep existing og-render.html)
```

**Build order rationale:**
- Design system and layout must exist before components can be styled
- Static HTML sections must exist before scripts can attach to DOM elements
- Form markup must exist before Netlify can detect forms at deploy time
- Interactivity is layered on top — the site works without it
- Pipeline needs working forms to test end-to-end

---

## Deployment Architecture

```
GitHub (main branch)
  └── Push triggers Netlify CI/CD
        ├── astro build (generates static HTML/CSS/JS)
        ├��─ Netlify detects forms in HTML (data-netlify attribute)
        ├── Netlify deploys functions (netlify/functions/*.ts)
        └── Deploys to CDN edge

Runtime:
  Netlify CDN → serves static assets (HTML, CSS, JS, images)
  Netlify Forms → captures submissions
  Netlify Functions → submission-created triggers on new submission
  Resend API → sends transactional/drip emails
  Discord Webhook → posts to #new-signups channel
  Plausible Cloud → receives analytics pings (no cookie, GDPR-safe)
```

---

## Sources

- [Astro Islands Architecture](https://docs.astro.build/en/concepts/islands/) - Official documentation on island model
- [Astro Scripts and Event Handling](https://docs.astro.build/en/guides/client-side-scripts/) - Script processing behavior
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) - Structured content management
- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) - Official directory conventions
- [Astro Template Directives](https://docs.astro.build/en/reference/directives-reference/) - client:* directives reference
- [GSAP + Three.js + Astro (Codrops)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/) - Production integration pattern
- [Netlify Forms Setup](https://docs.netlify.com/manage/forms/setup/) - Form detection and handling
- [Netlify Form Notifications](https://docs.netlify.com/manage/forms/notifications/) - submission-created event trigger
- [Deploy Astro to Netlify](https://docs.astro.build/en/guides/deploy/netlify/) - Deployment integration
- [Netlify Astro Toolbox Template](https://github.com/netlify-templates/astro-toolbox) - Forms + Functions reference
- [Discord Webhooks](https://discord-media.com/en/news/discord-webhooks-en.html) - Lightweight webhook integration
