---
phase: 7
slug: shared-foundation-data-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | DATA-01 | unit | `npx vitest run src/lib/__tests__/mind-score.test.ts` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 2 | DATA-02 | integration | `npx tsx scripts/fetch-world-bank.ts --dry-run` | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 2 | DATA-03 | unit | `npx vitest run src/lib/__tests__/normalize.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest` and `@vitest/coverage-v8` — install test framework
- [ ] `vitest.config.ts` — configuration
- [ ] `src/lib/__tests__/mind-score.test.ts` — stubs for DATA-01
- [ ] `src/lib/__tests__/normalize.test.ts` — stubs for DATA-03

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Zone Zero simulator visual parity | DATA-01 | Visual comparison of particle behavior before/after extraction | Open site, interact with sliders, verify identical behavior |
| Site builds offline | DATA-02 | Requires network isolation | Disconnect network, run `npm run build`, verify success |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
