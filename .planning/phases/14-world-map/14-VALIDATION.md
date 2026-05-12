---
phase: 14
slug: world-map
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-11
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.5 |
| **Config file** | vitest.config.ts (uses Astro's getViteConfig) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | MAP-01 | unit | `npx vitest run tests/dashboard-map.test.ts -t "makeMapOption"` | ❌ W0 | ⬜ pending |
| 14-01-02 | 01 | 1 | MAP-04 | unit | `npx vitest run tests/dashboard-map.test.ts -t "visualMap"` | ❌ W0 | ⬜ pending |
| 14-01-03 | 01 | 1 | MAP-05 | unit | `npx vitest run tests/dashboard-map.test.ts -t "tooltip"` | ❌ W0 | ⬜ pending |
| 14-01-04 | 01 | 1 | MAP-06 | unit | `npx vitest run tests/dashboard-map.test.ts -t "dimension toggle"` | ❌ W0 | ⬜ pending |
| 14-01-05 | 01 | 1 | INT-01 | unit | `npx vitest run tests/dashboard-map.test.ts -t "SVG renderer"` | ❌ W0 | ⬜ pending |
| 14-02-01 | 02 | 1 | MAP-02 | unit | `npx vitest run tests/dashboard-map.test.ts -t "Scale type"` | ❌ W0 | ⬜ pending |
| 14-02-02 | 02 | 1 | MAP-03 | unit | `npx vitest run tests/dashboard-map.test.ts -t "click handler"` | ❌ W0 | ⬜ pending |
| 14-02-03 | 02 | 1 | URL | unit | `npx vitest run tests/dashboard-url-state.test.ts` | ✅ extend | ⬜ pending |
| 14-XX-XX | XX | 0 | NAMEMAP | unit | `npx vitest run tests/dashboard-map.test.ts -t "name coverage"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/dashboard-map.test.ts` — stubs for MAP-01 through MAP-06, INT-01, nameMap coverage
- [ ] Extend `tests/dashboard-url-state.test.ts` — add view= and dim= param tests

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Map renders 201+ colored countries visually | MAP-01 | Visual rendering requires browser | Open dashboard, click Map tab, verify countries colored by gradient |
| Hover tooltip appears with correct formatting | MAP-05 | DOM tooltip rendering | Hover over known country (e.g., USA), verify tooltip shows name/score/BC |
| Click selects country and updates radar/BC | MAP-03 | Cross-component visual update | Click a country, verify radar chart and binding constraint update |
| Dimension toggle recolors map immediately | MAP-06 | Visual color transition | Click M/I/N/D buttons, verify gradient color changes |
| Mobile pinch-to-zoom and responsive layout | D-08 | Touch interaction | Test on mobile viewport, verify pinch/zoom and stacked layout |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
