# Phase 14: World Map - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-11
**Phase:** 14-world-map
**Areas discussed:** Color scheme & scale, Map layout & controls, Tooltip & hover style, Click-to-dashboard flow

---

## Color Scheme & Scale

### Score-to-color mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Continuous gradient | Smooth color transition from low to high. ECharts visualMap handles natively. Best for fine-grained differences. | ✓ |
| Discrete buckets | 5-6 fixed color bands (0-20, 20-40, etc.). Simpler to read but loses nuance. | |
| You decide | Claude picks best approach for ECharts map and dark theme. | |

**User's choice:** Continuous gradient (Recommended)

### Composite MIND palette

| Option | Description | Selected |
|--------|-------------|----------|
| Dark-to-cyan gradient | Low = dark/muted, High = bright cyan (#00c8ff). Fits bioluminescent theme. | ✓ |
| Red-to-green diverging | Classic choropleth. Familiar but clashes with dark theme, accessibility concerns. | |
| Purple-to-gold | Low = #7b4bff, High = #ffb400. Uses dimension colors as endpoints. | |

**User's choice:** Dark-to-cyan gradient (Recommended)

### Individual dimension colors

| Option | Description | Selected |
|--------|-------------|----------|
| Each dimension's own color | M=dark-to-green, I=dark-to-blue, N=dark-to-purple, D=dark-to-gold. Matches radar chart convention. | ✓ |
| Same cyan gradient for all | Keep composite gradient regardless of dimension. Simpler but loses dimension identity. | |

**User's choice:** Each dimension's own color (Recommended)

### Missing/null data treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Neutral gray with striped pattern | Clearly distinguishable from scored countries. Pattern = "no data". | |
| Neutral gray solid | Simple solid gray. Clean but harder to distinguish from very low scores. | |
| You decide | Claude picks best treatment for dark background. | ✓ |

**User's choice:** You decide (Claude's discretion)

---

## Map Layout & Controls

### Map-to-dashboard content relationship

| Option | Description | Selected |
|--------|-------------|----------|
| Map fills main area, detail below | Map takes full width. Radar + binding constraint appear below on country click. | ✓ |
| Map replaces all charts | Map fills entire dashboard. Charts hidden until click, then overlay/replace. | |
| Side-by-side | Map left, detail right. Works wide but cramped on medium viewports. | |

**User's choice:** Map fills main area, detail below (Recommended)

### Dimension toggle placement

| Option | Description | Selected |
|--------|-------------|----------|
| Above map, right-aligned | Segmented button row in map section header. Always visible, matches ScaleTabs. | ✓ |
| Floating overlay on map | Semi-transparent control in corner. Saves space but can obscure countries. | |
| Below map with legend | Grouped with color scale. Logically connected but less discoverable. | |

**User's choice:** Above map, right-aligned (Recommended)

### Zoom/pan interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Zoom + pan enabled | Scroll wheel zooms, drag pans. roam: true. Reset button. Essential for small countries. | ✓ |
| Fixed view only | No zoom/pan. Whole world at fixed scale. Simpler but small countries unclickable. | |

**User's choice:** Zoom + pan enabled (Recommended)

### Mobile rendering

| Option | Description | Selected |
|--------|-------------|----------|
| Full-width stacked, touch zoom | Full width, shorter ratio. Pinch-to-zoom, drag-to-pan. Legend/toggle/detail stack below. | ✓ |
| Simplified list fallback | Replace map with colored list/grid on mobile. Avoids small-target problem but loses visualization. | |

**User's choice:** Full-width stacked, touch zoom (Recommended)

---

## Tooltip & Hover Style

### Tooltip content

| Option | Description | Selected |
|--------|-------------|----------|
| Name + score + binding constraint | Country name, MIND score (or active dimension), binding constraint. Matches dashboard pattern. | ✓ |
| Name + all dimensions | All M/I/N/D scores plus composite. More data but busy. | |
| Name + score only | Just name and current score. Minimal. | |

**User's choice:** Name + score + binding constraint (Recommended)

### Hover highlight

| Option | Description | Selected |
|--------|-------------|----------|
| Brighten fill + emphasize border | Fill brightens, border turns white/bright. ECharts emphasis state. Clear feedback. | ✓ |
| Outline glow effect | Neon glow border matching bioluminescent theme. Dramatic but potentially distracting. | |
| You decide | Claude picks best hover treatment for dark theme. | |

**User's choice:** Brighten fill + emphasize border (Recommended)

### Default border style

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle dark borders | Thin #1a1a2e lines. Countries defined by color fill differences. Clean, modern. | ✓ |
| Light thin borders | Thin white/gray lines. More visible but noisy with 217 countries. | |
| No borders | Pure color fill. Cleanest but adjacent similar scores blend. | |

**User's choice:** Subtle dark borders (Recommended)

---

## Click-to-Dashboard Flow

### Click behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Stay on Map tab, show detail below | Calls selectPrimary(). Radar + binding constraint below map. Stay in map context. | ✓ |
| Switch to Country tab | Auto-switch to Country tab. Full detail but loses map context. | |
| Slide-out panel | Detail slides in from right. Map stays visible but partially covered. More complex. | |

**User's choice:** Stay on Map tab, show detail below (Recommended)

### Selection marker

| Option | Description | Selected |
|--------|-------------|----------|
| Highlighted border on selected | Bright border (white/cyan) persists until another click. Matches "primary" concept. | ✓ |
| No persistent selection | Click triggers detail but no visual marker on map. Simpler but confusing. | |

**User's choice:** Highlighted border on selected country (Recommended)

### URL state for map view

| Option | Description | Selected |
|--------|-------------|----------|
| Add view=map param | URL = ?view=map&country=USA. Extends url-state.ts. Map view is shareable. | ✓ |
| No URL for map view | Map tab is local UI state only. Simpler but not shareable. | |

**User's choice:** Add view=map param (Recommended)

### Dimension toggle in URL

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, add dim param | URL = ?view=map&dim=i&country=USA. Full map view shareable including dimension. | ✓ |
| No, dimension is ephemeral | Toggle resets to composite on page load. Simpler URLs. | |

**User's choice:** Yes, add dim param (Recommended)

---

## Claude's Discretion

- Missing/null data country visual treatment
- GeoJSON data source and bundling strategy
- Map projection choice
- ECharts component registration details
- Legend placement and styling
- Reset-to-full-view button placement
- Tooltip formatting and positioning
- Animation transitions when switching dimensions
- Map container aspect ratio

## Deferred Ideas

- Map multi-select for comparison (shift-click) — Phase 17 (COMP-04)
- Map recoloring by year when time-series slider changes — Phase 15 (TIME-05)
- Screen reader text alternatives for map — Phase 17 (INT-02)
- Map performance optimization — Phase 17 (INT-04)
