# Milestones

## v1.1 MIND Intelligence Layer (Shipped: 2026-04-22)

**Phases completed:** 6 phases, 14 plans, 27 tasks

**Key accomplishments:**

- Extracted MIND score calculation into shared library with calcScore, getBindingConstraint, and percentile-capped normalize, backed by 22 vitest tests (TDD)
- World Bank fetch pipeline retrieving 16 indicators for 217 countries with mrnev/mrv fallback, producing committed JSON baseline with normalized 0-100 MIND dimension scores
- MDX pipeline with KaTeX math rendering, content collection schema, WhitepaperLayout with sticky TOC sidebar, and /whitepaper route serving stub academic paper
- Full 3800-word MIND framework whitepaper with real country profiles, scroll-spy TOC, print-friendly CSS, and social sharing meta tags
- ECharts 6.0 with tree-shaken radar/bar charts, country search filter, and data transforms — 58 tests passing via TDD
- Static /dashboard page with top-20 ranking table, 4-dimension methodology accordion, and binding constraint callout — all server-rendered HTML with zero JavaScript
- Dashboard island with pub/sub state store, two-path lazy loading (IntersectionObserver for ECharts, requestIdleCallback for search), interactive country search with combobox a11y, radar/bar chart rendering, and comparison chips
- TDD-built comparison radar chart function with 4-color overlay palette and round-trip URL state encode/decode utilities for bookmarkable dashboards
- Comparison radar with overlaid polygons, Zone Zero deep link with real MIND scores, and bookmarkable URL state sync wired into the live dashboard
- Build-time SVG radar charts embedded in whitepaper Country Analysis with bidirectional dashboard cross-links
- Interactive firm-level MIND self-assessment with 4 dimension sliders, live geometric-mean scoring via shared calcScore(), and binding constraint identification
- SVG pyramid visualization showing MIND scores across Firm/City/Country scales with clickable dashboard navigation, plus Whitepaper and Dashboard links in site-wide Nav
- Screen reader text alternatives for all dashboard charts, WAI-ARIA tab keyboard navigation, and WCAG AA color contrast fix

---

## v1.0 Global Growth Foundation (Shipped: 2026-04-21)

**Phases completed:** 6 phases, 14 plans, 27 tasks

**Key accomplishments:**

- Astro 5.18.x project with Tailwind v4 CSS-first theme, 20+ bioluminescent OKLCH design tokens, and TypeScript strict mode producing zero-error builds
- Netlify static deploy pipeline with security headers, GitHub Pages cleanup, and email domain warming documentation
- 1. [Rule 3 - Blocking] CSS file too large for single global.css
- Astro content collections with typed Zod schemas for 6 case studies and 4 experiments, plus Zone Zero simulator, Stories morph scene, and tabbed experiments components
- Three.js hero particles, scroll-driven morph engine (6 shapes), and Zone Zero 4-slider simulator extracted as typed ES modules with npm imports and Astro script wiring
- 5 TypeScript modules for theme toggle (FOUC-safe), countdown timer, GSAP ScrollTrigger clip-path wipes, MIND bar counters, and experiment tabs -- all bundled via npm with zero CDN dependencies
- Fetch-based Netlify Forms submission for volunteer signup and email capture with inline success/error states and role card selection sync
- Rewrote 9 org card descriptions to remove implied endorsements, added prominent disclaimer, and renamed section to 'Organizations Working in This Space'
- Netlify serverless function auto-syncing form submissions to MailerLite with graceful degradation for email welcome sequence automation
- Plausible analytics with 6 custom events tracking form funnel (viewed/started/submitted) and Zone Zero simulator engagement (opened/interacted/shared)
- Three-tier device classification (full/reduced/minimal) with cached detection, adaptive particle counts (4000/1500/0, 3200/1200/0, 1800/800/0), and per-tier pixel ratio clamping across all three WebGL systems
- IntersectionObserver-based off-screen render loop pausing for all Three.js scenes, gradient CSS fallbacks for prefers-reduced-motion users, and immutable cache headers for Astro/Vite content-hashed assets
- Team/About section with founder card (Rob Ragan), nonprofit status badge, contact email, and Discord invite CTA on volunteer form success
- 4-email welcome sequence (Day 0/3/7/14) with role-based micro-tasks driving Discord community engagement, plus full Discord server setup guide with 11 channels and 6 color-coded roles

---
