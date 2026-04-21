---
phase: 9
slug: country-dashboard-core
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-22
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (existing) + astro build + browser manual |
| **Config file** | vitest.config.ts (existing) |
| **Quick run command** | `npx astro check && npx astro build` |
| **Full suite command** | `npx vitest run && npx astro check && npx astro build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx astro check && npx astro build`
- **After every plan wave:** Run `npx vitest run && npx astro check && npx astro build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | DASH-07 | build | `npx astro build && grep 'ranking-table' dist/dashboard/index.html` | ❌ W0 | ⬜ pending |
| 09-01-02 | 01 | 1 | DASH-03 | build | `npx astro build` | ❌ W0 | ⬜ pending |
| 09-02-01 | 02 | 2 | DASH-01 | manual | Browser: select country, verify radar chart | ❌ W0 | ⬜ pending |
| 09-02-02 | 02 | 2 | DASH-02 | manual | Browser: add 2+ countries, verify bar chart | ❌ W0 | ⬜ pending |
| 09-02-03 | 02 | 2 | DASH-04 | manual | Browser: verify binding constraint callout | ❌ W0 | ⬜ pending |
| 09-02-04 | 02 | 2 | DASH-05 | build | `grep 'World Bank' dist/dashboard/index.html` | ❌ W0 | ⬜ pending |
| 09-02-05 | 02 | 2 | DATA-04 | build | `grep 'details' dist/dashboard/index.html` | ❌ W0 | ⬜ pending |
| 09-02-06 | 02 | 2 | DASH-06 | manual | Browser: resize to mobile, verify layout | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers test framework. New dependency (echarts) installed in Wave 1.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Radar chart renders with correct dimensions | DASH-01 | Visual verification of chart | Open /dashboard, select a country, verify 4-axis radar |
| Bar chart comparison with 2-4 countries | DASH-02 | Visual multi-select interaction | Open /dashboard, add multiple countries, verify grouped bars |
| Binding constraint callout updates | DASH-04 | Dynamic UI behavior | Select different countries, verify callout text changes |
| Mobile single-column reflow | DASH-06 | Responsive layout test | Resize to <768px, verify stack layout with horizontal bars |
| Search dropdown keyboard navigation | DASH-03 | Interactive UX testing | Type country name, use arrow keys + Enter |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
