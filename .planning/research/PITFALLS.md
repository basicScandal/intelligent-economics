# Domain Pitfalls

**Domain:** Movement platform migration (monolithic HTML to Astro with Three.js/GSAP/Netlify Forms)
**Researched:** 2026-04-21

## Critical Pitfalls

Mistakes that cause rewrites, lost conversions, or major rework.

---

### Pitfall 1: Three.js SSR Crashes via `window`/`document` References

**What goes wrong:** Three.js requires browser globals (`window`, `document`, `WebGLRenderingContext`). Astro renders components at build time by default. Any Three.js code that runs during SSR will crash the build with `window is not defined`.

**Why it happens:** Developers wrap Three.js in a standard Astro component or React/Svelte component and forget that Astro's island architecture still attempts server-side rendering before hydration unless explicitly told otherwise.

**Consequences:** Build failures. Intermittent "works in dev, breaks in production" because Vite's dev server is more permissive than the production build.

**Prevention:**
- Use `client:only="react"` (or `client:only="svelte"`) directive exclusively for Three.js wrapper components. This skips SSR entirely.
- NEVER use `client:load` or `client:visible` for Three.js components -- these still attempt server render first.
- For the raw `<script>` approach (no framework wrapper), use Astro's `<script>` tag which only runs client-side, but guard all Three.js code with `if (typeof window !== 'undefined')` as defensive measure.
- The current codebase uses inline `<script>` blocks with IIFE patterns -- these translate cleanly to Astro `<script>` tags which are naturally client-only.

**Detection:** Build errors mentioning `window`, `document`, or `navigator` during `astro build`. Blank/missing canvas in production but working in dev.

**Phase:** Migration (component architecture phase)

---

### Pitfall 2: GSAP ScrollTrigger Zombie Instances After Navigation

**What goes wrong:** ScrollTrigger instances persist across Astro page navigations (especially with View Transitions). On returning to a page, new instances stack on top of old ones, causing doubled animations, incorrect scroll positions, and memory leaks.

**Why it happens:** Astro's View Transitions API swaps DOM content without full page reloads. GSAP ScrollTrigger attaches scroll listeners and creates DOM wrappers (pins, spacers) that don't automatically clean up between navigations.

**Consequences:** Animations fire multiple times, pinned elements stack incorrectly, memory usage grows with each navigation, and eventually the page becomes unresponsive.

**Prevention:**
- Use `gsap.context()` to scope all animations, then call `ctx.revert()` on cleanup.
- Listen for `astro:before-swap` event to revert all GSAP contexts before DOM swap.
- Listen for `astro:after-swap` to reinitialize animations on the new DOM.
- If NOT using View Transitions (single-page site with anchor links only), this pitfall is less severe but still applies if sections are dynamically loaded.
- Pattern:
  ```javascript
  let ctx;
  document.addEventListener('astro:after-swap', () => {
    if (ctx) ctx.revert();
    ctx = gsap.context(() => {
      // All ScrollTrigger animations here
    });
  });
  document.addEventListener('astro:before-swap', () => {
    if (ctx) ctx.revert();
  });
  ```

**Detection:** Animations playing twice. Console warnings about duplicate ScrollTrigger IDs. Memory profiler showing growing detached DOM nodes.

**Phase:** Migration (animation integration phase). Note: since the current site is essentially a single page and may remain so initially, this is CRITICAL if View Transitions are added later.

---

### Pitfall 3: Netlify Forms Not Detected at Deploy Time

**What goes wrong:** Netlify's form detection works by parsing static HTML during post-processing. If forms exist only inside JavaScript-rendered components (client:only islands), Netlify never sees them and form submissions silently fail -- returning 404 or being dropped.

**Why it happens:** The volunteer signup form currently exists in the monolithic HTML. When migrated to an Astro component that's rendered client-side (e.g., because it has interactive role-selection cards), the form may not appear in the build output HTML.

**Consequences:** The most critical conversion path (volunteer signup) breaks silently. Users see success states (from JS) but data is never captured. This is EXACTLY the current broken state and risks being recreated.

**Prevention:**
- Ensure the form is in a server-rendered Astro component (NOT `client:only`). The form HTML itself needs no JS -- only the submission handler does.
- Add a hidden static HTML form "blueprint" in `public/` as a fallback. This file contains an identical form with all field names, `data-netlify="true"`, and `netlify-honeypot="bot-field"`. Netlify detects it at deploy time.
- After deploy, verify form appears in Netlify dashboard under Forms before considering migration complete.
- The interactive role-selection UI can be a separate `client:visible` island INSIDE the server-rendered form -- Astro supports nested islands.

**Detection:** Form not appearing in Netlify dashboard after deploy. Test submission returning non-200 status. Check Netlify deploy logs for "Form detected" messages.

**Phase:** Form backend phase (P0 -- this is the PRIMARY broken thing to fix)

---

### Pitfall 4: Email Deliverability Death Spiral on New Domain

**What goes wrong:** Welcome sequence emails land in spam or are silently dropped. New domain (intelligenteconomics.ai) has zero sender reputation. Gmail/Outlook apply strict scrutiny to first-time senders, especially on newer TLDs (.ai).

**Why it happens:** Domain reputation starts at zero (not neutral -- actively suspicious). Sending even modest volume (50+ emails/day) from a new domain without warming triggers spam filters. Missing or misconfigured SPF/DKIM/DMARC records guarantee spam folder placement.

**Consequences:** Every volunteer who signs up gets a welcome sequence they never see. They disengage before receiving onboarding. The entire conversion funnel after signup is broken invisibly.

**Prevention:**
- Configure SPF, DKIM, and DMARC records BEFORE sending any email. Start DMARC at `p=none` to monitor.
- Use a reputable email service (Buttondown, Resend, or Mailchimp) that handles authentication automatically.
- Warm the domain gradually: week 1-2 send to 5-10 confirmed subscribers daily, scaling over 4-6 weeks.
- Keep the welcome sequence to 4 emails over 14 days (already planned -- this is correct).
- Include a plain-text version of every email.
- Monitor bounce rate (<2%) and spam complaints (<0.1% -- Gmail's hard ceiling).
- Consider using a subdomain (e.g., `mail.intelligenteconomics.ai`) to isolate sender reputation from the primary domain.

**Detection:** Check email service dashboard for delivery rates. Test with mail-tester.com before launch. Gmail Postmaster Tools for domain reputation monitoring.

**Phase:** Email sequence phase (P1). Must start SPF/DKIM/DMARC setup in P0 even if emails don't send until P1.

---

### Pitfall 5: Particle System Killing Mobile Battery and Thermals

**What goes wrong:** Three continuous `requestAnimationFrame` loops (hero particles, morph scene, Zone Zero simulator) running simultaneously drain mobile batteries in minutes, trigger thermal throttling, and cause frame drops that make the entire page feel broken.

**Why it happens:** The current code reduces particle count on mobile (4000 to 1500 for hero, 3200 to 1200 for morph, 1800 to 800 for Zone Zero) but ALL THREE render loops still run continuously, even when off-screen. Each maintains its own WebGL context. Mobile GPUs cannot sustain three simultaneous WebGL renderers.

**Consequences:** Page feels sluggish on mobile. Users bounce before reaching the signup form. Lighthouse mobile score tanks below 50. Battery drain creates negative association with the brand.

**Prevention:**
- Pause render loops when canvas is not visible using IntersectionObserver. Only animate the currently visible Three.js scene.
- Share a single WebGL renderer across all three scenes (or at minimum, dispose off-screen renderers).
- On mobile, consider replacing the morph scene with CSS/SVG animations and keeping only ONE Three.js instance (hero OR simulator, not both).
- Use `renderer.dispose()` and null out references when switching contexts.
- Set a frame budget: if `requestAnimationFrame` delta exceeds 32ms (below 30fps), reduce particle count dynamically.
- The existing `_isMobile` detection is crude (width < 768 OR hardwareConcurrency <= 4). Add `navigator.deviceMemory` and `navigator.connection.effectiveType` checks for more nuanced degradation.

**Detection:** Test on actual mid-range Android device (not just Chrome DevTools throttling). Monitor FPS with `stats.js` during development. Lighthouse mobile performance score.

**Phase:** Performance optimization (P0/P1 -- must be addressed during migration, not after)

---

## Moderate Pitfalls

---

### Pitfall 6: Hydration Directive Overuse Negates Astro's Performance Advantage

**What goes wrong:** Developers default to `client:load` on every interactive component, shipping unnecessary JavaScript and eliminating Astro's zero-JS-by-default benefit. The migrated site ends up heavier than the monolithic original.

**Why it happens:** When migrating, the instinct is "this had JavaScript in the original, so it needs hydration." But many behaviors (scroll reveals, theme toggle, nav highlight) can be plain `<script>` tags without framework hydration overhead.

**Prevention:**
- Audit each interactive behavior: does it need React/Svelte state management, or is it a simple DOM manipulation?
- Use Astro's native `<script>` tags for: theme toggle, nav scroll behavior, countdown timer, intersection observer reveals, scroll-spy highlighting.
- Reserve `client:only` for: Three.js scenes, Zone Zero simulator.
- Use `client:visible` for: GSAP ScrollTrigger animations (they don't need to load until the section scrolls into view).
- Use `client:idle` for: non-critical interactivity like role selection cards.

**Detection:** Compare final bundle size against original 226KB. If larger, hydration is being overused. Check Network tab for framework JS being loaded.

**Phase:** Migration (component architecture)

---

### Pitfall 7: Netlify Forms Spam Flood Despite Honeypot + reCAPTCHA

**What goes wrong:** Spam submissions overwhelm the form inbox. Honeypot fields alone are ineffective against modern bots. Netlify community reports persistent spam even with reCAPTCHA enabled -- "significantly surging spam submissions" reported in late 2024/early 2025.

**Why it happens:** Sophisticated bots identify and avoid honeypot fields. The Netlify free tier's spam filtering is limited. Movement sites with public-facing "join us" messaging attract both bot crawlers and bad-faith submissions.

**Prevention:**
- Layer defenses: honeypot field + Netlify's built-in spam detection + a custom JS time-based check (reject submissions under 3 seconds).
- Add a non-obvious field validation (e.g., "What year is it?" or a simple checkbox like "I'm a human joining this movement").
- Use Netlify's `data-netlify-recaptcha="true"` as additional layer.
- Implement rate limiting via Netlify Functions if spam volume becomes unmanageable.
- Consider Buttondown for the email capture (hero) and only use Netlify Forms for the detailed volunteer form -- separates concerns and reduces attack surface.
- Monitor form submissions weekly in early launch period.

**Detection:** Check Netlify Forms dashboard for spam percentage. Set up Netlify email notifications for form submissions to spot patterns early.

**Phase:** Form backend (P0)

---

### Pitfall 8: CSS/Design Token Splitting Breaks Visual Consistency

**What goes wrong:** When splitting the 2,066+ lines of CSS from the monolithic file into component-scoped styles, design tokens get duplicated, cascade ordering changes, and subtle visual regressions appear (spacing inconsistencies, color mismatches, transition timing differences).

**Why it happens:** The monolithic file relies on CSS cascade ordering and specificity battles that work because everything is in one file. Astro's scoped styles break these implicit dependencies.

**Prevention:**
- Extract ALL design tokens (CSS custom properties from `:root`) into a single `global.css` that's imported in the Astro layout FIRST.
- Keep utility classes (`.reveal`, `.visible`, `.section-label`) in global CSS rather than scoping them.
- Component-scoped styles should ONLY contain component-specific rules, never override tokens.
- Use Astro's `is:global` directive sparingly for styles that genuinely need global scope.
- Do a side-by-side visual regression check (screenshot comparison) after each component extraction.

**Detection:** Visual differences between original and migrated site. Use Percy or manual screenshot comparison at each breakpoint.

**Phase:** Migration (component splitting)

---

### Pitfall 9: Plausible Analytics Blocked by Ad Blockers Without Proxy

**What goes wrong:** 30-40% of tech-savvy visitors (exactly the "intellectual explorers" this movement targets) use ad blockers that block Plausible's script, making analytics data incomplete and unreliable for funnel optimization.

**Why it happens:** Ad blockers maintain blocklists that include `plausible.io` domains. Without proxying through your own domain, the analytics script is blocked before it loads.

**Prevention:**
- Set up Plausible proxy through Netlify `_redirects` file:
  ```
  /js/script.js https://plausible.io/js/script.js 200
  /api/event https://plausible.io/api/event 200
  ```
- Use non-obvious path names (avoid `/analytics/`, `/stats/`, `/plausible/`).
- Disable Netlify's "Bundle JS" and "Minify JS" asset optimization to prevent URL rewriting of the proxied script.
- Test with uBlock Origin enabled to verify proxy works.

**Detection:** Compare server-side page view counts (from Netlify Analytics if available) with Plausible counts. Large discrepancy indicates blocking.

**Phase:** Analytics setup (P0)

---

### Pitfall 10: Discord Community Ghost Town Effect

**What goes wrong:** Discord server is set up with many channels but no activity. New volunteers join, see empty channels, and immediately disengage. The "ghost town" impression kills the sense of momentum a movement needs.

**Why it happens:** Launching a community server before you have a critical mass of active participants. Too many channels dilute conversation, making each one look dead.

**Prevention:**
- Start with MAXIMUM 5 channels: #welcome, #general, #introductions, #resources, #volunteer-coordination.
- Do NOT create role-specific channels until there are 20+ active members in each role.
- Seed initial conversations (Rob + early volunteers) before sending anyone from the site.
- Set up an auto-welcome bot that gives new joiners a specific first task ("introduce yourself and tell us what aspect of MIND interests you most").
- Include activity in the Discord as part of the welcome email sequence -- give people a reason to return.
- Only link the Discord from the site AFTER there's visible activity.

**Detection:** Track join-to-first-message ratio. If below 30%, the onboarding is failing. Monitor 7-day retention rate.

**Phase:** Community infrastructure (P1). Do NOT launch publicly until P1 email sequences are driving engaged users there.

---

## Minor Pitfalls

---

### Pitfall 11: FormSubmit.co Confirmation Loop Persisting After Migration

**What goes wrong:** The current FormSubmit.co integration requires Rob to click a confirmation email before submissions are delivered. If the migration doesn't fully remove FormSubmit.co references and replace them with Netlify Forms, some form submissions could route to both systems or to the broken one.

**Prevention:** Search the codebase for ALL instances of `formsubmit.co` and `Rob@theoradical.ai` and verify they're fully replaced. There are currently at least 2 instances (early email capture + volunteer form).

**Phase:** Form backend (P0) -- first thing to fix

---

### Pitfall 12: Three.js Version Pinning Trap

**What goes wrong:** The current site pins Three.js r148 with a CDN comment noting it's "last reliable UMD global build." Migrating to npm imports may pull a much newer version with breaking API changes (geometry constructors, material properties, etc.).

**Prevention:**
- Pin to `three@0.148.0` in package.json initially. Upgrade deliberately after migration is complete.
- If upgrading: `BufferGeometry` is now just `Geometry` in newer versions; `PointsMaterial` API may have changed; check migration guide for the target version.
- Use ES module imports (`import * as THREE from 'three'`) rather than UMD global.

**Detection:** Console errors about undefined constructors or deprecated methods after installation.

**Phase:** Migration (dependency setup)

---

### Pitfall 13: Countdown Timer Timezone Inconsistency

**What goes wrong:** The 1000-day countdown (targeting 2029-01-09) may show different values depending on visitor timezone, and during migration, the timer logic could break if moved to a server-rendered component.

**Prevention:** Keep countdown as a client-only `<script>` tag. Use `new Date('2029-01-09T00:00:00Z')` (UTC) for consistency. Display "approximately X days" rather than exact to avoid confusion.

**Phase:** Migration (component splitting) -- low risk, just don't overcomplicate it

---

### Pitfall 14: Partner Organizations Section Legal Liability

**What goes wrong:** Listing partner organizations without explicit consent implies endorsement. For a movement proposing novel economic frameworks, implied endorsement from established institutions (UN, World Bank, etc.) could trigger cease-and-desist or reputation damage.

**Prevention:** PROJECT.md already flags "Honest partner organizations section (no implied endorsements)." Implementation must use language like "Organizations working in this space" or "Related initiatives" -- never "Partners" or "Supporters" without written consent. Include disclaimer.

**Detection:** Review copy for any language suggesting organizational endorsement before deploy.

**Phase:** Content migration -- copy review needed

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Component splitting | CSS cascade breakage (#8) | Extract tokens first, visual regression test after each component |
| Three.js islands | SSR crash (#1), hydration overuse (#6) | Use `client:only` exclusively, never `client:load` for WebGL |
| Form backend | Netlify detection failure (#3), spam (#7) | Static HTML blueprint in public/, test post-deploy |
| GSAP animations | ScrollTrigger zombies (#2) | Use `gsap.context()`, cleanup on navigation events |
| Email automation | Deliverability death spiral (#4) | SPF/DKIM/DMARC before first send, warm gradually |
| Mobile performance | Battery/thermal kill (#5) | IntersectionObserver pause, single renderer, frame budget |
| Analytics | Ad blocker gap (#9) | Proxy via Netlify redirects, verify with blocker enabled |
| Community (Discord) | Ghost town (#10) | Seed before linking, minimal channels, delayed public launch |
| Domain/DNS | Email auth records | Set up SPF/DKIM/DMARC in P0 even if emails start in P1 |
| View Transitions | GSAP re-initialization | Avoid View Transitions initially OR implement full cleanup pattern |

## Sources

- [Astro Framework Components - Client Directives](https://docs.astro.build/en/guides/framework-components/)
- [Astro Troubleshooting Docs](https://docs.astro.build/en/guides/troubleshooting/)
- [GSAP ScrollTrigger + Astro View Transitions](https://gsap.com/community/forums/topic/40950-compatibility-with-gsap-scrolltrigger-astro-view-transitiosn-api/)
- [Astro View Transitions Breaks ScrollTrigger](https://gsap.com/community/forums/topic/41197-astro-viewtransitions-breaks-scrolltrigger-the-second-time-i-enter-a-page/)
- [ScrollTrigger Cleanup in SPAs](https://gsap.com/community/forums/topic/40561-single-page-cannot-completely-destroy-scrolltrigger/)
- [GSAP kill() Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/kill()/)
- [Netlify Forms Troubleshooting Tips](https://docs.netlify.com/manage/forms/troubleshooting-tips/)
- [Netlify Forms Spam Filters](https://docs.netlify.com/manage/forms/spam-filters/)
- [Netlify Forms on Astro - Forum Discussion](https://answers.netlify.com/t/netlify-forms-on-astro-no-framework-doesnt-work/103723)
- [Netlify Forms Not Found with Astro](https://answers.netlify.com/t/no-form-submission-with-astro-static-generator/113932)
- [Netlify Forms Usage and Billing](https://docs.netlify.com/manage/forms/usage-and-billing/)
- [Plausible Proxy via Netlify](https://plausible.io/docs/proxy/guides/netlify)
- [Email Warm-Up Best Practices 2025](https://www.mailpool.ai/blog/email-warm-up-best-practices-complete-2025-guide)
- [DKIM DMARC SPF Best Practices 2025](https://saleshive.com/blog/dkim-dmarc-spf-best-practices-email-security-deliverability/)
- [Three.js Performance Tips](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [GSAP Accessible Animation (prefers-reduced-motion)](https://gsap.com/resources/a11y/)
- [Astro client:only SSR issue #5601](https://github.com/withastro/astro/issues/5601)
- [Discord Guide for Progressive Organizers and Movements](https://commonslibrary.org/ecda-how-to-use-discord-a-guide-for-progressive-organizers-parties-movements/)
- [Building Nonprofit Communities on Discord](https://bluewing.co/blog/building-strong-nonprofit-communities-on-discord-a-comprehensive-guide/)
- [Buttondown Welcome Sequence Docs](https://docs.buttondown.com/welcome-sequence)
- [Scroll-Revealed WebGL Gallery with GSAP, Three.js, Astro (Codrops 2026)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
