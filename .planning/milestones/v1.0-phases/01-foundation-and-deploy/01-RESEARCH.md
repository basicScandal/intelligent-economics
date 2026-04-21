# Phase 1: Foundation and Deploy - Research

**Researched:** 2026-04-21
**Domain:** Astro static site scaffolding, Tailwind v4 CSS-first configuration, Netlify CI/CD, email DNS authentication
**Confidence:** HIGH

## Summary

Phase 1 creates the foundational Astro project scaffold at the repository root, alongside the existing monolithic `index.html`. The site will be static-only (`output: 'static'`), deployed to Netlify with automatic deploys on push to `main` and preview deploys on PRs. Tailwind v4 integrates via the `@tailwindcss/vite` plugin with OKLCH design tokens matching the existing bioluminescent palette. Email infrastructure (SPF/DKIM/DMARC) must be configured early for domain warming before Phase 6 sends actual emails.

Critical correction from STACK.md: the `@astrojs/netlify` adapter version 7.0.x requires Astro 6 (`astro@^6.0.0`). For Astro 5.x, the correct adapter version is `@astrojs/netlify@6.6.5`. However, for a purely static site, **no adapter is needed at all** -- Netlify auto-detects Astro and builds from `dist/`. The adapter is only needed later if Image CDN or SSR features are desired.

**Primary recommendation:** Scaffold Astro 5.18.x at the project root with `npm create astro@latest . -- --template minimal --typescript strict --no-install`, then manually add Tailwind v4 via `@tailwindcss/vite`, create a root `netlify.toml`, disable the GitHub Pages workflows, and configure email DNS records through the domain registrar.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None explicitly locked -- all implementation choices are at Claude's discretion for this infrastructure phase.

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions. Key technical constraints from research:
- Astro 5.x (not 6 beta) with @astrojs/netlify adapter
- Tailwind v4 via @tailwindcss/vite plugin (no PostCSS config needed)
- OKLCH color space for bioluminescent palette tokens
- TypeScript strict mode for all modules

### Deferred Ideas (OUT OF SCOPE)
None -- infrastructure phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARCH-01 | Site is built with Astro component architecture -- no single file exceeds 500 lines | Astro 5.18.1 project scaffold with src/pages, src/layouts, src/components structure. Existing 5329-line index.html will be decomposed in Phase 2. Phase 1 creates the scaffold only. |
| ARCH-02 | CSS uses Tailwind v4 with design tokens matching existing bioluminescent palette | Tailwind 4.2.3 via @tailwindcss/vite plugin. @theme directive with OKLCH color tokens. Full hex-to-OKLCH conversion needed for 20+ existing design tokens. |
| ARCH-03 | JavaScript/TypeScript modules are bundled per-component with tree-shaking | Astro's Vite bundler handles this natively. TypeScript strict mode via astro/tsconfigs/strict. No additional bundler config needed. |
| ARCH-04 | Site auto-deploys to Netlify from main branch with preview deploys on PRs | Root netlify.toml with build command and publish directory. Netlify auto-detects Astro. Deploy previews are automatic when GitHub repo is connected. Existing GitHub Pages workflows must be disabled. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech Stack**: Astro static site generator -- component-based, zero JS by default, Netlify-native
- **Hosting**: Netlify -- handles forms natively, easy CI/CD, already partially configured
- **Privacy**: No third-party tracking cookies. Analytics must be GDPR-compliant (Plausible)
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile
- **Budget**: Volunteer/side project -- prefer free tiers and open source tooling
- **Accessibility**: WCAG 2.1 Level AA target

## Standard Stack

### Core (Phase 1 only)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.18.1 | Static site generator | Stable release, zero-JS default, Vite-powered. Astro 6 is now stable (6.1.8) but CONTEXT.md specified 5.x. |
| tailwindcss | 4.2.3 | Utility-first CSS | v4 uses @tailwindcss/vite plugin, CSS-first config via @theme directive, OKLCH native |
| @tailwindcss/vite | 4.2.3 | Vite plugin for Tailwind v4 | First-party Vite integration, replaces deprecated @astrojs/tailwind |
| TypeScript | 5.8.x (bundled) | Type safety | Astro bundles its own TS. tsconfig extends astro/tsconfigs/strict |

### Supporting (Phase 1 only)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @astrojs/netlify | 6.6.5 | Netlify adapter | OPTIONAL for Phase 1. Only needed for Netlify Image CDN or SSR. Static sites deploy without it. Install if Image CDN is desired in Phase 2+. |
| @astrojs/check | latest | Astro file type checking | Dev dependency, validates .astro files |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Astro 5.18.1 | Astro 6.1.8 (now stable) | Astro 6 is production-ready as of April 2026 but CONTEXT.md locked to 5.x. If user wants to reconsider, Astro 6 would be viable. @astrojs/netlify@7 would then be the correct adapter. |
| No adapter (static) | @astrojs/netlify@6.6.5 | Adapter adds Netlify Image CDN. Not needed for Phase 1's placeholder page. Can be added in Phase 2 when real images are migrated. |
| @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is the OLD Tailwind v3 integration. Deprecated for v4. Do NOT use it. |

**Installation:**
```bash
# Create Astro project at current directory
npm create astro@latest . -- --template minimal --typescript strict --no-install

# Install dependencies
npm install astro@^5.18.0 tailwindcss@^4.2.0 @tailwindcss/vite@^4.2.0

# Dev dependencies
npm install -D @astrojs/check typescript
```

**Version verification:** All versions confirmed via `npm view` on 2026-04-21:
- `astro`: 5.18.1 (latest 5.x), 6.1.8 (latest overall)
- `@astrojs/netlify`: 6.6.5 (for Astro 5.x), 7.0.7 (for Astro 6.x)
- `tailwindcss`: 4.2.3
- `@tailwindcss/vite`: 4.2.3
- `typescript`: 6.0.3 (latest), but Astro 5 bundles its own

## Architecture Patterns

### Recommended Project Structure (Phase 1)

```
.                              # Existing repo root
├── src/
│   ├── components/            # Reusable Astro components (empty Phase 1)
│   ├── layouts/
│   │   └── BaseLayout.astro   # HTML shell, meta tags, font links, global CSS import
│   ├── pages/
│   │   ├── index.astro        # Placeholder page proving build works
│   │   └── privacy.astro      # Placeholder for privacy policy
│   └── styles/
│       └── global.css         # @import "tailwindcss" + @theme block with OKLCH tokens
├── public/
│   ├── robots.txt             # Moved from root
│   ├── sitemap.xml            # Moved from root
│   └── favicon.svg            # Placeholder
├── astro.config.mjs           # Astro config with Tailwind vite plugin
├── tsconfig.json              # Extends astro/tsconfigs/strict
├── netlify.toml               # Build command + publish directory (NEW, at root)
├── package.json               # Dependencies (NEW)
├── .gitignore                 # Updated with Astro/node patterns
├── index.html                 # PRESERVED -- existing site, not served by Astro
├── privacy.html               # PRESERVED -- existing site
├── og-render.html             # PRESERVED -- existing site
└── .github/workflows/
    ├── deploy.yml             # DISABLED or removed (was GitHub Pages)
    └── static.yml             # DISABLED or removed (was GitHub Pages)
```

### Pattern 1: CSS-First Tailwind v4 Theme

**What:** Define all design tokens in CSS using `@theme` directive instead of tailwind.config.js
**When to use:** Always with Tailwind v4 -- there is no config file approach anymore
**Example:**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Typography */
  --font-display: 'Clash Display', 'Helvetica Neue', sans-serif;
  --font-body: 'Satoshi', 'Inter', sans-serif;

  /* Dark theme - Bioluminescent palette (OKLCH) */
  --color-bg: oklch(0.08 0.01 280);
  --color-surface: oklch(0.12 0.01 280);
  --color-surface-2: oklch(0.15 0.02 280);
  --color-text: oklch(0.93 0.01 280);
  --color-text-muted: oklch(0.62 0.05 280);
  --color-primary: oklch(0.85 0.25 155);          /* #00ff88 bioluminescent green */
  --color-primary-hover: oklch(0.80 0.22 155);
  --color-secondary: oklch(0.55 0.28 295);        /* #7b4bff violet */
  --color-tertiary: oklch(0.72 0.15 220);         /* #00c8ff electric blue */
  --color-border: oklch(0.22 0.03 280);
}
```

Note: The OKLCH values above are APPROXIMATIONS. Exact conversion from the hex palette must be done during implementation using oklch.com or a CSS Color 4 converter tool. The existing palette has 20+ tokens across dark and light themes.

### Pattern 2: Astro BaseLayout

**What:** Single layout component that wraps all pages with HTML shell, meta, fonts, and global CSS
**When to use:** Every page inherits from this layout

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Build the Next World with Intelligent Economics' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Intelligent Economics</title>
    <meta name="description" content={description} />
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### Pattern 3: Static Netlify Deploy Configuration

**What:** Root `netlify.toml` for build configuration
**When to use:** Required for Netlify to build the Astro project

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

### Anti-Patterns to Avoid

- **Using @astrojs/tailwind:** This is the Tailwind v3 integration. It does NOT work with Tailwind v4. Use `@tailwindcss/vite` in the Astro config's `vite.plugins` array instead.
- **Using @astrojs/netlify@7 with Astro 5:** Version 7 requires Astro 6 (`astro@^6.0.0`). For Astro 5.x, use @astrojs/netlify@6.6.5, or skip the adapter entirely for static sites.
- **Creating tailwind.config.js:** Tailwind v4 does not use a JavaScript config file. All configuration is CSS-first via `@theme` in the CSS file.
- **Publishing from root directory:** The existing `.netlify/netlify.toml` publishes from the repo root. Astro builds to `dist/`. The new root `netlify.toml` must set `publish = "dist"`.
- **Keeping GitHub Pages workflows active:** With Netlify as the deploy target, the existing `.github/workflows/deploy.yml` and `static.yml` workflows will conflict. They must be disabled or removed.
- **Running `npm create astro` in a subdirectory:** The Astro project should be at the repo root (where `package.json` lives). Netlify expects the build command to run from the repo root.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Hex to OKLCH conversion | Manual math/guessing | oklch.com or CSS Color 4 tools | OKLCH is perceptually uniform -- eyeballing conversions will produce wrong lightness/chroma values |
| Netlify deploy pipeline | GitHub Actions to Netlify | Netlify's built-in Git integration | Netlify auto-detects pushes, builds, and deploys. GH Actions adds unnecessary complexity |
| Tailwind configuration | tailwind.config.js / PostCSS config | @tailwindcss/vite plugin + @theme CSS directive | v4's CSS-first approach eliminates the config file entirely |
| TypeScript config | Custom tsconfig from scratch | `astro/tsconfigs/strict` preset | Astro's preset handles path aliases, JSX, module resolution correctly |
| Preview deploys | Custom PR workflow | Netlify Deploy Previews | Automatic when GitHub repo is connected to Netlify. URL pattern: `deploy-preview-{PR#}--{site}.netlify.app` |

**Key insight:** Phase 1 is infrastructure scaffolding. Every tool in the stack has a "just works" default configuration. The main risk is over-configuring or using deprecated integration paths.

## Common Pitfalls

### Pitfall 1: Wrong Adapter Version for Astro Major Version

**What goes wrong:** `@astrojs/netlify@7` is installed with Astro 5, causing peer dependency errors or build failures
**Why it happens:** STACK.md recommended version 7, but the major version jump to 7 coincided with Astro 6 compatibility. npm may not error clearly on peer dep mismatches.
**How to avoid:** For Astro 5.x, use `@astrojs/netlify@^6.6.0`. For Astro 6.x, use `@astrojs/netlify@^7.0.0`. Or skip the adapter entirely for static output.
**Warning signs:** `WARN deprecated` or `peer dep` warnings during npm install; build errors mentioning adapter API changes

### Pitfall 2: .netlify/netlify.toml vs Root netlify.toml

**What goes wrong:** The `.netlify/netlify.toml` (auto-generated, currently publishes from root) overrides or conflicts with a new root `netlify.toml`
**Why it happens:** Netlify CLI generates `.netlify/` directory with local config. The root `netlify.toml` is the canonical config file for Git-based deploys.
**How to avoid:** Create `netlify.toml` at the project root. The `.netlify/` directory should be in `.gitignore` (it contains `state.json` with the site ID, which is local state).
**Warning signs:** Netlify builds succeed but serve wrong content (old `index.html` from root instead of `dist/`)

### Pitfall 3: GitHub Pages and Netlify Competing for Deployments

**What goes wrong:** Both GitHub Pages (via Actions) and Netlify deploy on push to main, causing confusion about which URL is canonical
**Why it happens:** Three GitHub Actions workflows exist (deploy.yml, static.yml, manual.yml) that deploy to GitHub Pages. Netlify also auto-deploys on push.
**How to avoid:** Remove or disable the GitHub Pages workflows. Optionally disable GitHub Pages entirely in repo settings.
**Warning signs:** The repo homepage still points to `basicscandal.github.io/intelligent-economics/` while the real site should be on Netlify

### Pitfall 4: Tailwind v4 @theme OKLCH Values Not Matching Existing Palette

**What goes wrong:** The Astro site renders with noticeably different colors than the existing `index.html` because OKLCH conversions were approximate
**Why it happens:** OKLCH color space represents colors differently than sRGB hex. Naive conversion (especially for saturated colors like `#00ff88`) can shift hue or chroma.
**How to avoid:** Use a precision tool (oklch.com, CSS Color 4 converter) for each hex value. Visually compare the Astro placeholder page against the existing site side-by-side.
**Warning signs:** Greens look more yellow, violets look more blue, or dark backgrounds have visible color cast

### Pitfall 5: Astro Scaffold Overwriting Existing Files

**What goes wrong:** `npm create astro@latest .` overwrites existing files like `.gitignore`, `README.md`, or creates conflicts
**Why it happens:** The create-astro CLI generates starter files that may conflict with existing repo content
**How to avoid:** Use `--template minimal` to get the smallest scaffold. Back up `.gitignore` before scaffolding. The `create-astro` CLI typically asks before overwriting, but verify. Alternatively, manually create `astro.config.mjs`, `tsconfig.json`, `package.json`, and `src/` structure without using the scaffold CLI.
**Warning signs:** `.gitignore` loses the existing `*.zip` and `.DS_Store` entries; README gets overwritten

### Pitfall 6: Node.js Version Mismatch on Netlify

**What goes wrong:** Netlify's default Node.js version is older than what Astro 5.18 requires
**Why it happens:** Astro 5.18 requires Node 22.x. Netlify's default may be Node 18 or 20.
**How to avoid:** Set `NODE_VERSION = "22"` in the `[build.environment]` section of `netlify.toml`, or add an `.nvmrc` file with `22` at the project root.
**Warning signs:** Build fails on Netlify with "unsupported engine" or syntax errors from modern JS features

## Code Examples

### astro.config.mjs (Complete Phase 1 Configuration)

```javascript
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://intelligenteconomics.ai',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Note: No `output` key needed (defaults to `'static'`). No `adapter` needed for static builds.

### tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

### .gitignore additions

```gitignore
# Astro
dist/
.astro/

# Dependencies
node_modules/

# Netlify
.netlify/

# Environment
.env
.env.*

# Existing
*.zip
.DS_Store
```

### Placeholder index.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Home">
  <main class="min-h-screen bg-bg text-text flex items-center justify-center">
    <div class="text-center space-y-4">
      <h1 class="font-display text-4xl font-bold text-primary">
        Intelligent Economics
      </h1>
      <p class="font-body text-text-muted text-lg">
        Build the Next World
      </p>
    </div>
  </main>
</BaseLayout>
```

### Email DNS Records (SPF/DKIM/DMARC)

```
# SPF - Allow MailerLite to send on behalf of domain
TXT  @  "v=spf1 include:mlsend.com ~all"

# DKIM - MailerLite provides specific CNAME records after domain authentication
# (Exact values come from MailerLite dashboard after adding the domain)
CNAME  ml._domainkey  ml.domainkey.mlsend.com

# DMARC - Start with monitoring mode
TXT  _dmarc  "v=DMARC1; p=none; rua=mailto:dmarc@intelligenteconomics.ai; pct=100"
```

Note: The DKIM record above is illustrative. MailerLite generates the exact CNAME record values when you add and authenticate your domain in their dashboard. SPF and DMARC can be created in advance.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Tailwind v4 (Jan 2026) | No more PostCSS config, no tailwind.config.js. CSS-first via @theme. |
| tailwind.config.js | @theme CSS directive | Tailwind v4 (Jan 2026) | All tokens defined in CSS. JavaScript config is deprecated. |
| @astrojs/netlify@5 (Astro 4) | @astrojs/netlify@6 (Astro 5) / @7 (Astro 6) | Astro 5 (Dec 2024) | Major version alignment between Astro and adapter |
| Astro output: 'hybrid' | Merged into output: 'static' with per-page opt-out | Astro 5 | 'hybrid' mode removed. Static is default, individual pages can opt into SSR. |
| GitHub Pages (current) | Netlify | This migration | Enables forms, functions, preview deploys, edge functions |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Only works with Tailwind v3. Do not install.
- `tailwind.config.js` / `tailwind.config.ts`: Tailwind v4 is CSS-first. Config files are not used.
- `output: 'hybrid'`: Removed in Astro 5. Use `output: 'static'` with per-page prerender opt-out.

## Open Questions

1. **Astro 5 vs Astro 6 Decision**
   - What we know: CONTEXT.md says "Astro 5.x (not 6 beta)" based on research done 2026-04-21. Astro 6 is now stable at 6.1.8 with multiple patch releases.
   - What's unclear: Whether the user would prefer Astro 6 now that it's stable, or wants to stick with 5.x for the lower-risk path.
   - Recommendation: Proceed with Astro 5.18.1 as specified. The upgrade path from 5 to 6 is straightforward if desired later. The adapter version correction (6.6.5 not 7.0.x) is the important fix.

2. **Domain DNS Access**
   - What we know: The domain is `intelligenteconomics.ai`. SPF/DKIM/DMARC records need to be added. DNS is managed somewhere (registrar or Netlify DNS).
   - What's unclear: Where DNS is managed, whether the planner has access to the DNS provider. Netlify custom domain may or may not be configured yet.
   - Recommendation: Phase 1 plan should document the exact DNS records needed and provide step-by-step instructions. Actual DNS changes may require user action.

3. **Existing Site Availability During Transition**
   - What we know: The site is currently served via GitHub Pages at `basicscandal.github.io/intelligent-economics/`. The domain `intelligenteconomics.ai` appears in sitemap/robots.txt but GitHub Pages has no custom domain configured.
   - What's unclear: Whether the domain currently points to GitHub Pages, Netlify, or is not yet active.
   - Recommendation: Phase 1 should avoid disrupting any live site. The Astro placeholder page will be on Netlify. The old `index.html` can remain on GitHub Pages until Phase 2 migration is complete.

4. **Hex to OKLCH Palette Conversion Accuracy**
   - What we know: 20+ design tokens need conversion from hex to OKLCH. The STACK.md provides approximate values.
   - What's unclear: Exact OKLCH values that produce pixel-identical colors to the current hex palette.
   - Recommendation: Use oklch.com converter during implementation. The planner should include a verification step comparing rendered colors.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build | Yes | 25.4.0 | -- |
| npm | Package management | Yes | 11.7.0 | -- |
| npx | Astro scaffold | Yes | (bundled with npm) | -- |
| gh (GitHub CLI) | Repo management | Yes | (installed) | -- |
| Netlify CLI | Deploy testing | No | -- | Use Netlify web dashboard + Git-based deploys. Not needed for Phase 1. |
| DNS provider access | SPF/DKIM/DMARC | Unknown | -- | Document records; user adds manually |

**Missing dependencies with no fallback:**
- None. All critical tools are available.

**Missing dependencies with fallback:**
- Netlify CLI: Not installed, but Git-based deploys via `netlify.toml` work without it. Netlify auto-builds on push.
- DNS provider access: Cannot be verified programmatically. Phase 1 must produce DNS record documentation for user to apply.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None currently installed. Recommend vitest for future phases. |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (build validation) |
| Full suite command | `npm run build && npx astro check` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARCH-01 | Astro component architecture, no file > 500 lines | smoke | `npm run build` (zero errors) | No -- Wave 0 |
| ARCH-02 | Tailwind v4 with OKLCH palette renders correctly | smoke | `npm run build` + visual check of dev server | No -- Wave 0 |
| ARCH-03 | TS modules bundled with tree-shaking | smoke | `npm run build` + check dist/ output | No -- Wave 0 |
| ARCH-04 | Auto-deploy to Netlify, preview deploys on PRs | integration | Push to main, open PR, verify Netlify URLs | No -- manual |

### Sampling Rate

- **Per task commit:** `npm run build` (must succeed with zero errors)
- **Per wave merge:** `npm run build && npx astro check`
- **Phase gate:** Build succeeds + Netlify deploy URL accessible + Tailwind classes render + DNS records verifiable

### Wave 0 Gaps

- [ ] `package.json` with `build` and `dev` scripts -- created during Astro scaffold
- [ ] `astro.config.mjs` -- created during scaffold
- [ ] `tsconfig.json` -- created during scaffold
- [ ] No unit test framework needed for Phase 1 (build/deploy validation only)

## Sources

### Primary (HIGH confidence)
- npm registry -- `npm view astro`, `npm view @astrojs/netlify`, `npm view tailwindcss`, `npm view @tailwindcss/vite` (verified 2026-04-21)
- @astrojs/netlify@7 peer dep `astro@^6.0.0` -- verified via `npm view @astrojs/netlify@7.0.7 peerDependencies`
- @astrojs/netlify@6 peer dep `astro@^5.7.0` -- verified via `npm view @astrojs/netlify@6.6.5 peerDependencies`
- [Tailwind CSS Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro) -- official step-by-step
- [Astro deploy to Netlify guide](https://docs.astro.build/en/guides/deploy/netlify/) -- static site does not require adapter
- [Astro configuration reference](https://docs.astro.build/en/reference/configuration-reference/) -- output 'static' default, no adapter needed
- [Astro TypeScript strict config](https://github.com/withastro/astro/blob/main/packages/astro/tsconfigs/strict.json) -- extends base.json with strict: true
- [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) -- data-netlify attribute, static HTML detection
- [Netlify Deploy Previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/) -- automatic for connected Git repos
- [Netlify Astro framework guide](https://docs.netlify.com/frameworks/astro/) -- auto-detection, build command, publish directory

### Secondary (MEDIUM confidence)
- [MailerLite domain authentication](https://www.mailerlite.com/help/how-to-verify-and-authenticate-your-domain) -- SPF include:mlsend.com, DKIM CNAME from dashboard
- [MailerLite SPF/DKIM setup](https://dmarcdkim.com/setup/mailerlite-dmarc-dkim-spf-for-domain-authentication) -- cross-verified with official MailerLite docs
- [Netlify file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/) -- netlify.toml at project root
- [Astro project structure](https://docs.astro.build/en/basics/project-structure/) -- standard directory layout

### Tertiary (LOW confidence)
- OKLCH color values in @theme example -- approximations only, must be verified with conversion tools during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified via npm registry, peer deps confirmed
- Architecture: HIGH -- Astro project structure and Tailwind v4 integration well-documented by official sources
- Pitfalls: HIGH -- adapter version mismatch verified empirically; netlify.toml location confirmed by docs
- Email DNS: MEDIUM -- SPF/DMARC records are standard, DKIM specifics require MailerLite dashboard access

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (stable stack, 30-day validity)
