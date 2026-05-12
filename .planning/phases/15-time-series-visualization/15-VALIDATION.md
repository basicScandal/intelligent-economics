---
phase: 15
slug: time-series-visualization
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-12
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run tests/dashboard-timeline.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run tests/dashboard-timeline.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | TIME-02 | unit | `npx vitest run tests/dashboard-timeline.test.ts` | ❌ W0 | ⬜ pending |
| 15-01-02 | 01 | 1 | TIME-04 | unit | `npx vitest run tests/dashboard-timeline.test.ts` | ❌ W0 | ⬜ pending |
| 15-02-01 | 02 | 2 | TIME-03 | unit | `npx vitest run tests/dashboard-timeline.test.ts` | ❌ W0 | ⬜ pending |
| 15-02-02 | 02 | 2 | TIME-05 | integration | `npm run build` | ✅ | ⬜ pending |
| 15-03-01 | 03 | 3 | TIME-06 | unit | `npx vitest run tests/dashboard-timeline.test.ts` | ❌ W0 | ⬜ pending |
| 15-03-02 | 03 | 3 | ALL | visual | checkpoint:human-verify | n/a | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/dashboard-timeline.test.ts` — stubs for TIME-02, TIME-03, TIME-04, TIME-06
- [ ] Test fixtures for historical data (mock SlimCountry[] with multi-year data)

*Existing test infrastructure (vitest, test config) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Play/pause animation visual smoothness | TIME-03 | Animation timing requires visual check | Start playback, verify smooth year transitions at all 3 speeds |
| Map recoloring on year change | TIME-05 | Requires ECharts rendering + visual check | Select year 2018, verify map shows 2018 data colors |
| Multi-country overlay readability | TIME-06 | Line overlap visual clarity | Add 4 countries, verify all lines distinguishable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
