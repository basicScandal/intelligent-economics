---
phase: 1
slug: foundation-and-deploy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (bundled with Astro) |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npm run build && npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npm run build && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | ARCH-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-02 | 01 | 1 | ARCH-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-01-03 | 01 | 1 | ARCH-03 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | ARCH-04 | integration | `netlify deploy --build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — Astro project with build script
- [ ] `astro.config.mjs` — Astro configuration
- [ ] `vitest.config.ts` — test runner configuration
- [ ] `netlify.toml` — Netlify build configuration

*Existing infrastructure covers all phase requirements after Wave 0.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Netlify auto-deploy on push | ARCH-04 | Requires Netlify dashboard + git push | Push to main, verify deploy in Netlify dashboard |
| PR preview deploys | ARCH-04 | Requires PR creation + Netlify webhook | Create PR, check for preview URL comment |
| SPF/DKIM/DMARC DNS records | Email infra | Requires DNS provider access | Run MXToolbox check on domain |
| OKLCH palette visual accuracy | ARCH-02 | Requires visual comparison | Compare rendered site colors to original palette |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
