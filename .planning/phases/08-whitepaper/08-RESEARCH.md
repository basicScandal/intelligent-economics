# Phase 8: Whitepaper - Research

**Researched:** 2026-04-21
**Domain:** Astro MDX content collections, KaTeX math rendering, print CSS, scroll-spy TOC
**Confidence:** HIGH

## Summary

Phase 8 builds a single `/whitepaper` page displaying a structured MIND framework paper with academic formatting. The core technical challenge is integrating `@astrojs/mdx` (new to this project) with `remark-math` + `rehype-katex` for build-time LaTeX rendering, creating a scroll-spy TOC via IntersectionObserver, and producing clean print output via `@media print` CSS.

The existing codebase already uses content collections (stories, experiments) with `glob` loaders, providing a proven pattern to follow. The whitepaper collection will be a single MDX entry. `@astrojs/mdx@4.3.14` is the correct version for Astro 5.x (v5.0.x targets Astro 6). It bundles `remark-gfm@^4.0.1` which provides footnote support (PAPER-04) out of the box.

**Primary recommendation:** Use `@astrojs/mdx@4.3.14` with `remark-math@6.0.0` + `rehype-katex@7.0.1` for build-time math rendering. Import KaTeX CSS from `node_modules` in the whitepaper layout frontmatter. Use a minimal `<script>` tag (not an island) for IntersectionObserver scroll-spy. Commit a static OG image to `public/`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 9-section structure: Abstract, Introduction, The GDP Problem, MIND Framework, Mathematical Foundation, Methodology, Country Analysis (3-4 profiles from committed data), Policy Implications, Conclusion, References
- Accessible-academic hybrid tone ("Brookings Institution paper" style)
- 3-4 country profiles from committed `src/data/mind-scores.json`
- Target length: ~3,000-4,000 words (15-20 min read)
- Left sidebar TOC on desktop (240px wide), collapses to "Contents" dropdown on mobile (<1024px)
- IntersectionObserver scroll-spy for TOC highlighting
- Serif body text (Georgia/system serif stack) for whitepaper content; existing sans-serif for headings/UI
- Light background for whitepaper content area regardless of site dark mode
- Subtle bioluminescent accents (OKLCH palette for TOC highlights, section dividers, formula backgrounds)
- MDX content collection with custom loader in `content.config.ts`
- KaTeX via `remark-math` + `rehype-katex` (build-time, zero client JS for math)
- Print CSS via `@media print` (hide nav/footer/TOC, force light colors, proper page breaks)
- Static OG image (1200x630) committed to `public/`
- WhitepaperLayout extends BaseLayout.astro

### Claude's Discretion
- Exact whitepaper prose content and citation references
- Section heading wording and numbering scheme
- KaTeX formula formatting choices (display vs inline)
- Color values for formula background highlighting
- Mobile TOC dropdown implementation details (CSS-only vs minimal JS)
- Print page break placement strategy
- OG image design composition

### Deferred Ideas (OUT OF SCOPE)
- Nav link to whitepaper -- Phase 12 (NAV-01)
- Inline mini-chart components in whitepaper prose -- Phase 11 (LINK-01)
- Bidirectional navigation between whitepaper and dashboard -- Phase 11 (LINK-02)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAPER-01 | Structured MDX whitepaper page on /whitepaper route with title, abstract, sections, conclusion | MDX content collection with glob loader + WhitepaperLayout + `src/pages/whitepaper.astro` rendering page |
| PAPER-02 | Sticky TOC sidebar with scroll-spy highlighting via IntersectionObserver and getHeadings() | `render()` returns `headings` array; IntersectionObserver pattern documented; sticky sidebar via CSS `position: sticky` |
| PAPER-03 | Math equation rendering via KaTeX (build-time, zero client JS) for MIND formula | `remark-math@6.0.0` + `rehype-katex@7.0.1` transform `$...$` and `$$...$$` at build time; KaTeX CSS imported from node_modules |
| PAPER-04 | Citation and footnote formatting with remark-gfm for academic references | `@astrojs/mdx@4.3.14` bundles `remark-gfm@^4.0.1` which includes footnote support (`[^1]` syntax); `remarkRehype: { footnoteLabel: 'References' }` configurable |
| PAPER-05 | Print-friendly CSS (@media print) for PDF-quality output | `@media print` stylesheet with `break-inside: avoid`, hidden chrome, forced light colors, serif fonts, A4/Letter margins |
| PAPER-06 | Social sharing meta tags (og:title, og:description, og:image) for whitepaper | Static `<meta>` tags in WhitepaperLayout head; static OG image at `public/og-whitepaper.png` |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/mdx | 4.3.14 | MDX integration for Astro | Last v4 release, requires `astro: ^5.0.0`. v5.x targets Astro 6 -- do NOT use. Bundles remark-gfm for footnotes. |
| remark-math | 6.0.0 | Parse `$...$` and `$$...$$` math syntax in MDX | Standard unified ecosystem plugin for LaTeX math in markdown |
| rehype-katex | 7.0.1 | Render parsed math nodes as KaTeX HTML at build time | Server-side KaTeX rendering -- zero client JS for math. Depends on katex@^0.16.0 |
| katex | 0.16.45 | KaTeX engine + CSS stylesheet | Required by rehype-katex. CSS imported from `katex/dist/katex.min.css` in layout frontmatter |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| remark-gfm | (bundled) | Footnotes, tables, strikethrough | Already bundled in @astrojs/mdx@4.3.14 -- do NOT install separately |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| rehype-katex (build-time) | rehype-mathjax | KaTeX is faster, smaller CSS; MathJax has wider LaTeX coverage but heavier. KaTeX is sufficient for MIND formula. |
| KaTeX CSS from node_modules | KaTeX CSS from CDN | Local import avoids external dependency, works offline, bundles with Astro's CSS pipeline. CDN adds extra DNS lookup. |
| IntersectionObserver script | GSAP ScrollTrigger | GSAP is overkill for simple TOC highlighting. IO is native, tiny, no dependency. |
| Static OG image | Dynamic Satori generation | Single page with fixed content -- static image is simpler, faster, no build dependency. |

**Installation:**
```bash
npm install @astrojs/mdx@4.3.14 remark-math@6.0.0 rehype-katex@7.0.1 katex@0.16.45
```

**Version verification:** All versions confirmed against npm registry on 2026-04-21.

## Architecture Patterns

### Recommended Project Structure
```
src/
  content/
    whitepaper/
      mind-framework.mdx       # Single MDX file with frontmatter + full paper content
  layouts/
    BaseLayout.astro            # Existing -- extended by WhitepaperLayout
    WhitepaperLayout.astro      # NEW -- serif typography, light bg, TOC sidebar, print CSS, OG tags
  components/
    TableOfContents.astro       # NEW -- renders heading list, receives headings prop
  pages/
    whitepaper.astro            # NEW -- fetches collection entry, renders with WhitepaperLayout
  styles/
    whitepaper.css              # NEW -- whitepaper-specific typography, print styles, TOC styles
public/
  og-whitepaper.png             # NEW -- static 1200x630 OG image
```

### Pattern 1: MDX Content Collection (Single Entry)

**What:** Define a whitepaper content collection with glob loader for MDX files, even for a single entry. This follows the existing stories/experiments pattern and enables the remark/rehype plugin chain.

**When to use:** Any content that needs markdown processing with custom plugins.

**Example:**
```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const whitepaper = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/whitepaper' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    abstract: z.string(),
    authors: z.array(z.string()),
    date: z.string(),
    version: z.string(),
  }),
});

export const collections = { stories, experiments, whitepaper };
```
Source: Existing `content.config.ts` pattern + Astro content collections docs

### Pattern 2: Rendering MDX with Headings

**What:** Use Astro v5's `render()` from `astro:content` to get both the rendered Content component and the headings array for TOC.

**Example:**
```astro
---
// src/pages/whitepaper.astro
import { getCollection, render } from 'astro:content';
import WhitepaperLayout from '../layouts/WhitepaperLayout.astro';
import TableOfContents from '../components/TableOfContents.astro';

const entries = await getCollection('whitepaper');
const entry = entries[0]; // Single whitepaper entry
const { Content, headings } = await render(entry);
---

<WhitepaperLayout
  title={entry.data.title}
  description={entry.data.abstract}
  headings={headings}
>
  <Content />
</WhitepaperLayout>
```
Source: Astro content collections API reference

### Pattern 3: Astro Config with MDX + Math Plugins

**What:** Register @astrojs/mdx integration with remark-math and rehype-katex plugins.

**Example:**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://intelligenteconomics.ai',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
      remarkRehype: { footnoteLabel: 'References' },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
```
Source: Astro MDX integration docs

**Critical note:** The `remarkPlugins` and `rehypePlugins` go inside the `mdx()` integration config, NOT at the top-level `markdown` key. MDX extends markdown config by default, but custom plugins must be passed to `mdx()` directly.

### Pattern 4: KaTeX CSS Import (Build-Time Only)

**What:** Import KaTeX stylesheet from node_modules in the whitepaper layout frontmatter. Astro processes CSS imports at build time and includes them in the page output. No client JS shipped.

**Example:**
```astro
---
// src/layouts/WhitepaperLayout.astro
import BaseLayout from './BaseLayout.astro';
import 'katex/dist/katex.min.css';
import '../styles/whitepaper.css';
---
```
Source: Astro imports reference (CSS from npm packages)

### Pattern 5: IntersectionObserver Scroll-Spy

**What:** A small inline script (not an island) observes heading elements and toggles active class on TOC links. Uses `rootMargin` to trigger before heading reaches top of viewport.

**Example:**
```html
<script>
  function initScrollSpy() {
    const setCurrent = (entries) => {
      for (const entry of entries) {
        const id = entry.target.id;
        const link = document.querySelector(`#toc a[href="#${id}"]`);
        if (!link) continue;
        if (entry.isIntersecting) {
          document.querySelectorAll('#toc a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
        }
      }
    };

    const observer = new IntersectionObserver(setCurrent, {
      rootMargin: '0px 0px -66%',
      threshold: 1,
    });

    document.querySelectorAll('article :is(h2, h3)').forEach(h => observer.observe(h));
  }

  // Run on page load
  initScrollSpy();
</script>
```
Source: Multiple Astro TOC tutorials, IntersectionObserver MDN docs

### Pattern 6: WhitepaperLayout Light-Mode Override

**What:** The whitepaper content area forces light background/dark text regardless of site dark mode. The nav/footer remain in the site's current theme. Achieved via a scoped CSS class on the content wrapper.

**Example:**
```css
/* src/styles/whitepaper.css */
.whitepaper-content {
  --wp-bg: #ffffff;
  --wp-text: #1a1a2e;
  --wp-text-muted: #555577;
  --wp-accent: oklch(0.72 0.19 163); /* bioluminescent green */
  background: var(--wp-bg);
  color: var(--wp-text);
}
```

### Anti-Patterns to Avoid
- **Do NOT use `@astrojs/mdx@5.x`:** Requires Astro 6 which this project does not use.
- **Do NOT install remark-gfm separately:** Already bundled in @astrojs/mdx@4.3.14. Installing it separately can cause version conflicts.
- **Do NOT use KaTeX auto-render JS:** rehype-katex renders at build time. Adding KaTeX JS client-side would double-render and add unnecessary weight.
- **Do NOT use a client:visible island for the TOC scroll-spy:** A simple inline `<script>` is lighter and avoids framework hydration overhead for this trivial DOM operation.
- **Do NOT float the TOC container:** Floated parents break `position: sticky`. Use CSS Grid or flexbox for the sidebar layout.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LaTeX math rendering | Custom regex-based math parser | remark-math + rehype-katex | LaTeX parsing has thousands of edge cases; KaTeX handles them all |
| Footnote formatting | Manual `<sup>` + `<footer>` markup | remark-gfm footnotes (`[^1]` syntax) | Auto-numbering, back-references, accessible markup |
| Heading ID generation | Manual `id` attributes on headings | Astro's built-in heading slug generation | Consistent, URL-safe slugs matching `getHeadings()` output |
| GFM table rendering | Custom table components | remark-gfm tables | Already bundled in @astrojs/mdx |
| Print page optimization | Puppeteer PDF generation | CSS `@media print` | Zero runtime dependency, works in any browser, explicitly in-scope |

**Key insight:** The unified/remark/rehype ecosystem provides build-time processing for every content transformation needed. The only client JS in this phase is the IntersectionObserver scroll-spy (~30 lines).

## Common Pitfalls

### Pitfall 1: Wrong @astrojs/mdx Version
**What goes wrong:** Installing `@astrojs/mdx@latest` (5.0.3) which requires Astro 6, causing peer dependency errors or build failures.
**Why it happens:** npm defaults to latest version.
**How to avoid:** Pin to `@astrojs/mdx@4.3.14` explicitly.
**Warning signs:** Error messages mentioning `astro@^6.0.0` peer dependency.

### Pitfall 2: KaTeX CSS Not Loading
**What goes wrong:** Math renders as unstyled HTML -- broken layout, missing symbols, misaligned fractions.
**Why it happens:** rehype-katex generates KaTeX HTML markup but the CSS that styles it must be loaded separately.
**How to avoid:** Import `katex/dist/katex.min.css` in WhitepaperLayout frontmatter. Verify KaTeX fonts are included in the build output.
**Warning signs:** Math formulas appear but look scrambled or have incorrect spacing.

### Pitfall 3: Sticky TOC Not Sticking
**What goes wrong:** TOC sidebar scrolls away instead of staying fixed.
**Why it happens:** `position: sticky` fails when any ancestor has `overflow: hidden` or `overflow: auto`, or when the sticky element has no constraint on its height within the scrolling container.
**How to avoid:** Use CSS Grid for the two-column layout. Ensure no parent has `overflow: hidden`. Set `top: <offset>` on the sticky element. The sticky container must be shorter than its grid row.
**Warning signs:** TOC scrolls with content instead of staying in place.

### Pitfall 4: Print CSS Inheriting Dark Mode
**What goes wrong:** Printed whitepaper has dark background or invisible text.
**Why it happens:** Site's dark theme CSS custom properties leak into print output.
**How to avoid:** In `@media print`, explicitly force `background: white`, `color: black`, override all custom properties. Use `!important` sparingly but necessarily for print overrides.
**Warning signs:** Print preview shows dark backgrounds or light-colored text.

### Pitfall 5: Math Syntax Conflicts with MDX
**What goes wrong:** Dollar signs `$` in MDX content get interpreted as JSX expressions instead of math delimiters.
**Why it happens:** MDX processes content as JSX where `{` and `$` can be special.
**How to avoid:** remark-math processes math syntax before MDX's JSX handling when configured as a remark plugin in the MDX integration. Ensure `remarkPlugins: [remarkMath]` is in the `mdx()` config, not at the markdown level.
**Warning signs:** Build errors about unexpected tokens in math expressions.

### Pitfall 6: Footnote Label Confusion
**What goes wrong:** Footnotes section labeled "Footnotes" instead of "References".
**Why it happens:** remark-gfm defaults to "Footnotes" label.
**How to avoid:** Configure `remarkRehype: { footnoteLabel: 'References' }` in the MDX integration options.
**Warning signs:** Academic paper with a "Footnotes" heading instead of "References".

## Code Examples

### MIND Formula in KaTeX (Display Mode)
```latex
$$
P = \left(\frac{M}{100} \cdot \frac{I}{100} \cdot \frac{N}{100} \cdot \frac{D}{100}\right)^{0.25} \times 100
$$
```
Source: `src/lib/mind-score.ts` calcScore function

### Print Stylesheet Pattern
```css
@media print {
  /* Hide non-content elements */
  nav, footer, #toc, .no-print {
    display: none !important;
  }

  /* Force light readable colors */
  body, .whitepaper-content {
    background: white !important;
    color: black !important;
  }

  /* Page setup */
  @page {
    size: A4;
    margin: 2cm 2.5cm;
  }

  /* Prevent orphaned headings */
  h1, h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* Keep figures and tables together */
  figure, table, .katex-display {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Section breaks */
  .wp-section {
    break-before: auto;
    break-inside: avoid;
  }

  /* Typography adjustments */
  body {
    font-size: 11pt;
    line-height: 1.5;
  }

  /* Remove link decoration, show URLs */
  a {
    color: black !important;
    text-decoration: none !important;
  }
  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}
```
Source: MDN Printing guide, CSS-Tricks print patterns

### OG Meta Tags Pattern
```astro
---
// In WhitepaperLayout.astro head
const { title, description } = Astro.props;
const ogImage = new URL('/og-whitepaper.png', Astro.site);
const canonicalURL = new URL('/whitepaper', Astro.site);
---
<meta property="og:type" content="article" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage.toString()} />
<meta property="og:url" content={canonicalURL.toString()} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage.toString()} />
```
Source: Open Graph protocol, Twitter Cards docs

### Mobile TOC Dropdown (CSS-Only with Details/Summary)
```html
<nav id="toc" class="toc">
  <!-- Desktop: always visible sidebar -->
  <!-- Mobile: collapsible via details/summary -->
  <details class="toc-mobile">
    <summary>Contents</summary>
    <ul>
      {headings.filter(h => h.depth <= 3).map(h => (
        <li class={`toc-item depth-${h.depth}`}>
          <a href={`#${h.slug}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  </details>
  <!-- Desktop list (hidden on mobile) -->
  <div class="toc-desktop">
    <h4>Contents</h4>
    <ul>
      {headings.filter(h => h.depth <= 3).map(h => (
        <li class={`toc-item depth-${h.depth}`}>
          <a href={`#${h.slug}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  </div>
</nav>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @astrojs/mdx v3 (Astro 4) | @astrojs/mdx v4.3.14 (Astro 5) | Astro 5 release | New content collections API with `render()` from `astro:content` |
| Client-side KaTeX JS rendering | Build-time rehype-katex | Already standard | Zero client JS for math -- aligns with Astro's zero-JS philosophy |
| Scroll event listener for TOC | IntersectionObserver | IE support dropped | More performant, no scroll jank, cleaner API |
| page-break-* CSS properties | break-* properties (CSS Fragmentation) | CSS Fragmentation spec | Modern browsers support both; use break-* with page-break-* fallbacks |

**Deprecated/outdated:**
- `@astrojs/mdx@5.x`: Requires Astro 6 (beta). Do NOT use with Astro 5.18.x.
- `page-break-before/after/inside`: Legacy properties. Use `break-before/after/inside` (widely supported). Include legacy as fallback for older browsers.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 |
| Config file | `vitest.config.ts` (uses `getViteConfig` from `astro/config`) |
| Quick run command | `npm test` |
| Full suite command | `npm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAPER-01 | MDX content collection loads and renders | unit | `npx vitest run tests/whitepaper-collection.test.ts -x` | No -- Wave 0 |
| PAPER-02 | getHeadings() returns expected heading structure | unit | `npx vitest run tests/whitepaper-headings.test.ts -x` | No -- Wave 0 |
| PAPER-03 | KaTeX HTML present in build output (no raw $$ in output) | integration | `npm run build && grep -q "katex" dist/whitepaper/index.html` | No -- Wave 0 |
| PAPER-04 | Footnotes render as linked references | integration | `npm run build && grep -q "footnote" dist/whitepaper/index.html` | No -- Wave 0 |
| PAPER-05 | Print CSS present in build output | integration | `npm run build && grep -q "@media print" dist/whitepaper/index.html` OR check linked CSS | No -- Wave 0 |
| PAPER-06 | OG meta tags present in build output | integration | `npm run build && grep -q 'og:title' dist/whitepaper/index.html` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test`
- **Per wave merge:** `npm run build && npm test`
- **Phase gate:** Full build + manual print preview + OG tag validator

### Wave 0 Gaps
- [ ] `tests/whitepaper-collection.test.ts` -- validates content collection schema and entry loading
- [ ] `tests/whitepaper-headings.test.ts` -- validates heading structure from MDX content
- [ ] Build-output integration tests can be shell commands in verification, not separate test files

## Open Questions

1. **KaTeX Font Bundling**
   - What we know: KaTeX CSS references font files from `katex/dist/fonts/`. When imported via Astro frontmatter, Vite should handle these as assets and bundle them.
   - What's unclear: Whether Vite correctly resolves and copies KaTeX font files from node_modules during build. May need `vite.optimizeDeps` configuration.
   - Recommendation: Test during implementation. If fonts don't load, copy `katex/dist/fonts/` to `public/fonts/katex/` and override `@font-face` paths in a local CSS override.

2. **Mobile TOC: CSS-Only vs Minimal JS**
   - What we know: `<details>/<summary>` provides CSS-only collapsible TOC. JS could auto-close on link click.
   - What's unclear: Whether CSS-only approach feels polished enough.
   - Recommendation: Start with CSS-only `<details>/<summary>`. Add minimal JS to close dropdown on anchor click if needed (Claude's discretion per CONTEXT.md).

## Project Constraints (from CLAUDE.md)

- **Tech Stack**: Astro static site generator, zero JS by default, Netlify-native
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile
- **Accessibility**: WCAG 2.1 Level AA target
- **Privacy**: No third-party tracking cookies (KaTeX CSS must be local, not CDN-hosted with tracking)
- **Budget**: Free tiers and open source tooling preferred
- **Islands Strategy**: Interactive components use `client:visible` or `client:idle` directives. TOC scroll-spy uses inline script, not an island (too trivial for hydration overhead).
- **GSD Workflow**: All work through GSD commands

## Sources

### Primary (HIGH confidence)
- npm registry: `@astrojs/mdx@4.3.14` peer dependency `astro: ^5.0.0` -- verified 2026-04-21
- npm registry: `remark-math@6.0.0`, `rehype-katex@7.0.1`, `katex@0.16.45` -- verified 2026-04-21
- [Astro MDX integration docs](https://docs.astro.build/en/guides/integrations-guide/mdx/) -- plugin config, GFM bundling, remarkRehype options
- [Astro content collections docs](https://docs.astro.build/en/guides/content-collections/) -- glob loader, render() API, headings
- [Astro imports reference](https://docs.astro.build/en/guides/imports/) -- CSS import from npm packages in frontmatter
- Existing codebase: `content.config.ts`, `BaseLayout.astro`, `mind-score.ts`, `mind-scores.json`

### Secondary (MEDIUM confidence)
- [Astro TOC scroll-spy tutorial](https://dev.to/fazzaamiarso/add-toc-with-scroll-spy-in-astro-3d25) -- IntersectionObserver pattern
- [Astro TOC heading hierarchy](https://billyle.dev/posts/creating-custom-table-of-contents-for-astro-content-collections) -- heading nesting pattern
- [MDN Printing guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing) -- @media print best practices
- [Print CSS cheatsheet](https://www.customjs.space/blog/print-css-cheatsheet/) -- page break properties
- [KaTeX in Astro guide](https://www.byteli.com/blog/2024/math_in_astro/) -- remark-math + rehype-katex config pattern

### Tertiary (LOW confidence)
- KaTeX font bundling behavior with Vite/Astro -- needs validation during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry, peer dependencies confirmed
- Architecture: HIGH -- follows existing content collection patterns in codebase, Astro docs verified
- Pitfalls: HIGH -- multiple sources confirm version compatibility issue, sticky CSS gotchas well-documented
- Print CSS: MEDIUM -- browser-dependent rendering, needs manual testing
- KaTeX font bundling: LOW -- Vite asset resolution from node_modules needs empirical validation

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (stable ecosystem, no breaking changes expected)
