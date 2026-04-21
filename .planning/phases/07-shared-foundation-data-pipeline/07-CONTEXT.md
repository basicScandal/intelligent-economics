# Phase 7: Shared Foundation + Data Pipeline - Context

**Gathered:** 2026-04-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract the MIND score calculation from the Zone Zero simulator into a shared library, build a World Bank data fetch pipeline for 16 indicators across 217 countries, and produce a committed JSON baseline with normalized 0-100 dimension scores. This phase creates the data foundation for the whitepaper (Phase 8) and dashboard (Phase 9).

</domain>

<decisions>
## Implementation Decisions

### World Bank Indicator Mapping
- **Material (4):** GNI per capita PPP (NY.GNP.PCAP.PP.CD), Access to electricity % (EG.ELC.ACCS.ZS), Life expectancy at birth (SP.DYN.LE00.IN), Safely managed drinking water % (SH.H2O.SMDW.ZS)
- **Intelligence (4):** Tertiary enrollment % (SE.TER.ENRR), R&D expenditure % GDP (GB.XPD.RSDV.GD.ZS), Individuals using Internet % (IT.NET.USER.ZS), Gov't education expenditure % GDP (SE.XPD.TOTL.GD.ZS)
- **Network (4):** Trade % of GDP (NE.TRD.GNFS.ZS), Mobile subscriptions per 100 (IT.CEL.SETS.P2), FDI net inflows % GDP (BX.KLT.DINV.WD.GD.ZS), International tourism arrivals (ST.INT.ARVL)
- **Diversity (4):** Women in parliament % (SG.GEN.PARL.ZS), Female labor force participation % (SL.TLF.CACT.FE.ZS), Renewable energy consumption % (EG.FEC.RNEW.ZS), Merchandise export concentration index (trade diversification)

### Normalization & Scoring
- Empirical min-max normalization with 1st/99th percentile caps to avoid single-outlier skew
- Missing data: exclude indicator from country's dimension average, require minimum 2 of 4 indicators present per dimension
- Mark data completeness percentage per country in output
- Dimension aggregation: simple arithmetic mean of 4 normalized indicators per dimension
- Overall MIND score: keep existing geometric mean formula `(M/100 * I/100 * N/100 * D/100)^0.25 * 100` — this IS the MIND thesis (multiplicative, zero-floor)

### Data Pipeline Architecture
- Shared library at `src/lib/mind-score.ts` — Astro `lib/` convention, importable by Zone Zero and future dashboard
- Data fetch script at `scripts/fetch-world-bank.ts` run via `npm run fetch-data` using `tsx`
- World Bank API v2 JSON format for data retrieval
- Output: `src/data/mind-scores.json` committed to repo as build-time baseline
- JSON structure: nested by country ISO3 code with name, dimension scores, overall MIND score, raw indicators, and metadata (year, source, accessedDate)
- Build-time access: direct TypeScript import (`import scores from '../data/mind-scores.json'`) — Vite handles natively, tree-shakeable, type-safe

### Claude's Discretion
- World Bank API pagination and rate-limiting strategy
- Error handling for API failures during fetch
- TypeScript type definitions for the shared library and data structures
- Test approach for verifying Zone Zero parity after extraction

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/scripts/zone-zero.ts:28-32` — `calcScore()` function to extract: `Math.round(Math.pow((m/100) * (i/100) * (n/100) * (d/100), 0.25) * 100)`
- `src/scripts/zone-zero.ts:286` — binding constraint logic: `keys.reduce((a, b) => (vals[a] < vals[b] ? a : b))`
- `src/scripts/zone-zero.ts:184-227` — HEALTH state thresholds and DIM_INSIGHTS (may be useful for dashboard)
- `src/scripts/zone-zero.ts:14-25` — TypeScript interfaces (ZoneZeroState, HealthState)

### Established Patterns
- TypeScript strict mode across all source files
- Astro component architecture with script islands
- `src/scripts/` for client-side modules, `src/lib/` convention available for shared utilities
- ES module imports throughout (`"type": "module"` in package.json)
- No existing `src/data/` directory — will be new

### Integration Points
- Zone Zero simulator (`src/scripts/zone-zero.ts`) must import `calcScore()` from new shared library
- Future dashboard (Phase 9) will import both the score library and the JSON data
- Future whitepaper (Phase 8) may reference the formula from the shared library
- `package.json` needs new `fetch-data` script and `tsx` dev dependency

</code_context>

<specifics>
## Specific Ideas

- The 16 World Bank indicators were selected to cover the full MIND framework: wealth + infrastructure + health + basic needs (M), human capital pipeline (I), goods + comms + capital + people flows (N), political + economic + energy + trade diversity (D)
- Export concentration index may need sourcing from UNCTAD if not available via World Bank API — fallback to Herfindahl index of exports
- Percentile caps (1st/99th) prevent micro-states like Luxembourg from compressing the normalization range

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
