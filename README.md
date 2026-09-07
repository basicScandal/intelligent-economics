# Intelligent Economics

**Build the Next World.**

A volunteer platform for the transition from failing 20th-century economic systems to the
Intelligent Economics framework — built through the physics of nucleation.

## Framework

- **MIND Dashboard** — Material × Intelligence × Network × Diversity (replaces GDP)
- **Geometry Engineering** — Policy as physics, not mandates
- **Dual-Currency System** — Foundation Coins + Culture Credits
- **Guardian Lattice** — AI Oracles + Human Juries
- **Dual Engine of Change** — Fast markets + slow institutions
- **Nucleation Strategy** — Symbiotic Zones as Florences of the 21st century

## Develop

```bash
npm ci
npm run dev          # local dev server
npm run build        # static build into dist/
npm run preview      # serve the built site
```

Quality gates (all three run in CI on every push and pull request):

```bash
npm run check        # astro check — types and Astro diagnostics
npm test             # vitest unit tests
npm run check:links  # broken internal links + missing anchors in dist/
```

`npm run check:links` needs a build first. Add `--external` to also fetch every
outbound URL (`npm run check:links:external`); it is off by default because CI
runners are frequently egress-restricted.

## Deploy

**The live site is GitHub Pages.** `.github/workflows/deploy.yml` builds and publishes
`dist/` on every push to `main`, and `public/CNAME` pins the custom domain
`intelligenteconomics.ai`.

`netlify.toml` and `netlify/functions/` are retained for a possible move back to Netlify
but **are not active**. Two things follow from being on Pages:

- Netlify Forms cannot receive submissions — see *Forms* below.
- GitHub Pages serves no custom response headers, so the cache-control and security
  headers in `netlify.toml` do not apply in production.

## Forms

GitHub Pages answers `POST` with 405, so the signup forms post to an external endpoint
supplied at build time:

```bash
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx npm run build
```

In CI, set it as a repository variable named `PUBLIC_FORM_ENDPOINT`
(*Settings → Secrets and variables → Actions → Variables*). Any provider that accepts a
JSON `POST` works — Formspree, Basin, Getform, a Cloudflare Worker. An endpoint starting
with `/` is treated as same-origin and sent URL-encoded, which is what Netlify Forms
expects if the site ever moves back.

**Without the variable set, the forms do not silently fail.** They render an email
fallback instead — a `mailto:` link to the team with the signup fields pre-filled — so a
would-be volunteer always has a way through. Submission failures show the same fallback
alongside the retry button. Configuration lives in `src/lib/forms.ts`.

## SEO

`src/layouts/BaseLayout.astro` emits canonical URLs, Open Graph, Twitter cards, robots
directives and `schema.org` JSON-LD for every page; per-page overrides go through its
props (`description`, `image`, `ogType`, `noindex`, `structuredData`). Site-wide
constants live in `src/lib/seo.ts`.

`@astrojs/sitemap` generates `/sitemap-index.xml` at build time — it needs no manual
maintenance when routes are added. `public/robots.txt` points at it.

The default social card is `public/og-default.png` (1200×630). To regenerate it, open
`scripts/og-default.html` at a 1200×630 viewport and screenshot it.

## License

Open framework. Not a product. Not a company. A movement.
