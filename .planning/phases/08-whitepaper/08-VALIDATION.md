---
phase: 8
slug: whitepaper
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (existing from Phase 7) + astro build + astro check |
| **Config file** | vitest.config.ts (existing) |
| **Quick run command** | `npx astro check && npx astro build` |
| **Full suite command** | `npx vitest run && npx astro check && npx astro build` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check && npx astro build`
- **After every plan wave:** Run `npx vitest run && npx astro check && npx astro build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | PAPER-01 | build | `npx astro build && curl -s http://localhost:4321/whitepaper` | ❌ W0 | ⬜ pending |
| 08-01-02 | 01 | 1 | PAPER-03 | build | `npx astro build` (KaTeX renders at build time) | ❌ W0 | ⬜ pending |
| 08-01-03 | 01 | 1 | PAPER-04 | build | `npx astro build` (remark-gfm footnotes at build time) | ❌ W0 | ⬜ pending |
| 08-02-01 | 02 | 2 | PAPER-02 | manual | Browser scroll test — IntersectionObserver TOC | ❌ W0 | ⬜ pending |
| 08-02-02 | 02 | 2 | PAPER-05 | manual | Print preview in browser | ❌ W0 | ⬜ pending |
| 08-02-03 | 02 | 2 | PAPER-06 | build | `grep 'og:title' dist/whitepaper/index.html` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers test framework (vitest from Phase 7). New dependencies installed in Wave 1.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| TOC scroll-spy highlights current section | PAPER-02 | Requires browser scroll interaction | Open /whitepaper, scroll through sections, verify TOC highlights update |
| Print produces clean PDF-quality output | PAPER-05 | Requires browser print preview | Open /whitepaper, Cmd+P, verify no nav/footer/TOC, clean layout |
| Social sharing rich preview | PAPER-06 | Requires social media preview tool | Use ogp.me or Twitter card validator to check /whitepaper URL |
| KaTeX math equations render visually | PAPER-03 | Build-time render but visual quality check | Open /whitepaper, verify formula displays as typeset math not plaintext |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
