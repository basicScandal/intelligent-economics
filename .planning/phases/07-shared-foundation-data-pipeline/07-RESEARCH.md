# Phase 7: Shared Foundation + Data Pipeline - Research

**Researched:** 2026-04-21
**Domain:** World Bank API data pipeline, TypeScript shared library extraction, normalization math
**Confidence:** HIGH

## Summary

This phase extracts the MIND score calculation from Zone Zero into a shared library (`src/lib/mind-score.ts`), builds a World Bank API v2 fetch script that retrieves 16 indicators for 217 countries, normalizes raw values to 0-100 dimension scores, and commits a JSON baseline to `src/data/mind-scores.json`. The existing `calcScore()` function at `src/scripts/zone-zero.ts:28-32` is a pure function with no DOM dependencies, making extraction straightforward. The World Bank API v2 returns JSON with `format=json`, supports `mrnev=1` for most-recent-non-empty values, and paginates with `per_page` up to at least 300. However, the API aggressively rate-limits concurrent requests -- empirical testing showed errors after 5-6 rapid sequential calls. The fetch script must use serial requests with delays between indicators. One of the 16 indicators (merchandise export concentration index) is NOT available via the World Bank API v2 -- it requires a fallback strategy.

**Primary recommendation:** Build the fetch script with serial indicator fetching (2-3 second delays between requests), BOM-safe JSON parsing, and a fallback indicator for trade diversification since the UNCTAD concentration index lacks a REST API.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **World Bank Indicator Mapping**: 16 specific indicators across 4 MIND dimensions (4 per dimension) with exact indicator codes specified
- **Material (4):** NY.GNP.PCAP.PP.CD, EG.ELC.ACCS.ZS, SP.DYN.LE00.IN, SH.H2O.SMDW.ZS
- **Intelligence (4):** SE.TER.ENRR, GB.XPD.RSDV.GD.ZS, IT.NET.USER.ZS, SE.XPD.TOTL.GD.ZS
- **Network (4):** NE.TRD.GNFS.ZS, IT.CEL.SETS.P2, BX.KLT.DINV.WD.GD.ZS, ST.INT.ARVL
- **Diversity (4):** SG.GEN.PARL.ZS, SL.TLF.CACT.FE.ZS, EG.FEC.RNEW.ZS, merchandise export concentration index (needs fallback)
- **Normalization**: Empirical min-max with 1st/99th percentile caps, missing data excluded from dimension average, minimum 2 of 4 indicators required per dimension
- **Dimension aggregation**: Simple arithmetic mean of 4 normalized indicators per dimension
- **Overall MIND score**: Geometric mean formula `(M/100 * I/100 * N/100 * D/100)^0.25 * 100`
- **Shared library location**: `src/lib/mind-score.ts`
- **Fetch script location**: `scripts/fetch-world-bank.ts` run via `npm run fetch-data` using `tsx`
- **World Bank API v2 JSON format**
- **Output**: `src/data/mind-scores.json` committed to repo
- **JSON structure**: Nested by country ISO3 code with name, dimension scores, overall MIND score, raw indicators, metadata (year, source, accessedDate)
- **Build-time access**: Direct TypeScript import from JSON file

### Claude's Discretion
- World Bank API pagination and rate-limiting strategy
- Error handling for API failures during fetch
- TypeScript type definitions for the shared library and data structures
- Test approach for verifying Zone Zero parity after extraction

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | Shared MIND score library extracted from Zone Zero with calcScore(), getBindingConstraint(), normalize() functions | Existing `calcScore()` at zone-zero.ts:28-32 is a pure function, binding constraint at line 286. Extraction is mechanical. `src/lib/` directory does not exist yet -- create it. |
| DATA-02 | Build-time World Bank API fetch for 16 indicators across 217 countries with committed JSON baseline | WB API v2 confirmed working. `mrnev=1` returns most recent non-empty value. 217 countries confirmed (filter: `region.id !== 'NA'`). Rate limiting requires serial fetching with delays. One indicator (export concentration) needs fallback. |
| DATA-03 | Data normalization pipeline transforming raw indicators to 0-100 MIND dimension scores | Min-max normalization with percentile caps is standard. TypeScript Math functions sufficient. No external library needed. |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsx | 4.21.0 | Run TypeScript fetch script directly | Zero-config TS execution via esbuild. No compilation step. Already standard for npm script runners. |
| vitest | 4.1.5 | Unit testing for shared library parity | Astro-native via `getViteConfig()`. Fastest Vite-compatible test runner. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Node.js built-in fetch | (native) | HTTP requests to World Bank API | Node 22.x has stable global fetch. No axios/node-fetch needed. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tsx | ts-node | tsx is faster (esbuild vs tsc), zero-config, better ESM support |
| Native fetch | axios | Adds dependency for no benefit -- WB API is simple GET requests |
| vitest | jest | vitest integrates with Astro's Vite config natively via getViteConfig() |

**Installation:**
```bash
npm install -D tsx vitest
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   └── mind-score.ts        # Shared library: calcScore, getBindingConstraint, normalize, types
├── data/
│   └── mind-scores.json     # Committed build-time baseline (generated)
├── scripts/
│   └── zone-zero.ts         # Imports calcScore from ../lib/mind-score
scripts/
└── fetch-world-bank.ts      # Data pipeline script (run via tsx)
tests/
├── mind-score.test.ts        # Parity tests for shared library
└── normalization.test.ts     # Normalization edge cases
```

### Pattern 1: Pure Function Extraction
**What:** Extract `calcScore()` and related pure functions from zone-zero.ts into src/lib/mind-score.ts. Zone Zero then imports from the shared library.
**When to use:** When a function has no DOM dependencies and is needed by multiple consumers.
**Example:**
```typescript
// src/lib/mind-score.ts
export type DimensionKey = 'm' | 'i' | 'n' | 'd';
export type DimensionScores = Record<DimensionKey, number>;

export function calcScore(vals: DimensionScores): number {
  const { m, i, n, d } = vals;
  if (m <= 0 || i <= 0 || n <= 0 || d <= 0) return 0;
  return Math.round(Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100);
}

export function getBindingConstraint(vals: DimensionScores): DimensionKey {
  const keys: DimensionKey[] = ['m', 'i', 'n', 'd'];
  return keys.reduce((a, b) => (vals[a] < vals[b] ? a : b));
}
```

### Pattern 2: Serial API Fetching with Backoff
**What:** Fetch indicators one at a time with delays between requests to avoid World Bank API rate limits.
**When to use:** Always for World Bank API -- empirically confirmed rate limiting after 5-6 rapid requests.
**Example:**
```typescript
// scripts/fetch-world-bank.ts
const WB_BASE = 'https://api.worldbank.org/v2';

async function fetchIndicator(code: string): Promise<WBRecord[]> {
  const url = `${WB_BASE}/country/all/indicator/${code}?format=json&mrnev=1&per_page=300`;
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  // World Bank API sometimes returns UTF-8 BOM -- strip it
  const text = new TextDecoder('utf-8').decode(buf).replace(/^\uFEFF/, '');
  const data = JSON.parse(text);
  if (!Array.isArray(data) || data.length < 2 || !data[1]) {
    throw new Error(`No data returned for ${code}`);
  }
  return data[1];
}

async function fetchAllIndicators(codes: string[]): Promise<Map<string, WBRecord[]>> {
  const results = new Map<string, WBRecord[]>();
  for (const code of codes) {
    console.log(`Fetching ${code}...`);
    const records = await fetchIndicator(code);
    results.set(code, records);
    // Rate limit: wait between requests
    await new Promise(r => setTimeout(r, 2500));
  }
  return results;
}
```

### Pattern 3: Percentile-Capped Min-Max Normalization
**What:** Normalize raw indicator values to 0-100 using empirical min/max from the dataset, capped at 1st/99th percentile.
**When to use:** When normalizing heterogeneous indicators to a common scale.
**Example:**
```typescript
export function normalize(values: number[], percentileLow = 1, percentileHigh = 99): { min: number; max: number; normalize: (v: number) => number } {
  const sorted = [...values].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * percentileLow / 100)];
  const hi = sorted[Math.ceil(sorted.length * percentileHigh / 100) - 1];
  return {
    min: lo,
    max: hi,
    normalize: (v: number) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100)),
  };
}
```

### Anti-Patterns to Avoid
- **Parallel API blasting:** Do NOT use `Promise.all()` for multiple WB API calls. Rate limiting causes cascading failures. Use serial with delays.
- **Assuming UTF-8 clean responses:** World Bank API returns BOM (`\uFEFF`) on some endpoints. Always strip BOM before JSON.parse.
- **Hardcoding 217 countries:** Filter by `region.id !== 'NA'` at runtime, not by maintaining a country list.
- **Including aggregates in normalization:** World Bank returns regional aggregates (AFE, ARB, etc.) mixed with countries. Filter before normalization or micro-states and regions will skew percentiles.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript script execution | Custom build step | tsx | Esbuild-powered, zero-config, ESM-native |
| Unit test framework | Manual assertions | Vitest + Astro's getViteConfig() | Astro-integrated, watch mode, coverage built-in |
| HTTP client | Custom fetch wrapper | Native `fetch()` | Node 22 has stable global fetch. WB API is simple GET. |
| JSON import typing | Manual type casting | TypeScript `resolveJsonModule` + type assertion | Already enabled in Astro's tsconfig base |

## Common Pitfalls

### Pitfall 1: World Bank API Rate Limiting
**What goes wrong:** Fetch script makes 15-16 requests in rapid succession; after ~5 requests, API returns HTML error pages instead of JSON.
**Why it happens:** World Bank API has undocumented rate limits. No official rate limit documentation exists, but empirical testing shows throttling after 5-6 rapid requests.
**How to avoid:** Serial fetching with 2-3 second delay between requests. Add retry logic (1 retry after 10s wait) for transient failures.
**Warning signs:** Response contains `<html>` instead of JSON array, or empty response body.

### Pitfall 2: UTF-8 BOM in API Responses
**What goes wrong:** `JSON.parse()` throws "Unexpected token" error on World Bank API responses.
**Why it happens:** Some World Bank API endpoints prepend a UTF-8 BOM character (`\uFEFF`, bytes `EF BB BF`) to JSON responses. This is inconsistent -- some indicators return clean JSON, others have BOM.
**How to avoid:** Always strip BOM: `text.replace(/^\uFEFF/, '')` before parsing. Or use `TextDecoder('utf-8')` which handles it, but still strip the Unicode character.
**Warning signs:** First character of response is invisible but `charCodeAt(0) === 65279`.

### Pitfall 3: Aggregates Mixed with Countries
**What goes wrong:** Normalization produces compressed ranges because aggregate values (e.g., "World", "East Asia & Pacific") are included.
**Why it happens:** World Bank API `country/all/indicator/X` returns 250 records: 217 countries + 33 aggregates. Aggregates have `countryiso3code` values like "AFE", "ARB", "CSS" but ARE 3-letter codes, so you can't filter by code length.
**How to avoid:** Fetch the country list first from `/v2/country?format=json&per_page=300`, identify the 217 entries where `region.id !== 'NA'`, build a Set of valid ISO3 codes, and filter indicator data against it.
**Warning signs:** Total records per indicator > 217, or normalization ranges seem off (e.g., GNI per capita min being too high).

### Pitfall 4: Merchandise Export Concentration Index Unavailable
**What goes wrong:** The 16th indicator (trade diversification for Diversity dimension) is not available via World Bank API v2.
**Why it happens:** The Herfindahl-Hirschman Index exists in WB as indicator `B1` but in Source 30 (Exporter Dynamics Database), not WDI Source 2. Source 30 uses a different API path structure that returns errors with the standard v2 endpoint. UNCTAD has the data but only via web UI download, not a REST API.
**How to avoid:** Use a WDI-available proxy for trade diversification. Best candidate: **high-technology exports (% of manufactured exports)** `TX.VAL.TECH.MF.ZS` -- measures export sophistication/diversification away from primary commodities. Alternative: compute diversity from available trade composition indicators. Document the proxy choice in the output metadata.
**Warning signs:** Any indicator returning HTML redirect or "Object moved" error.

### Pitfall 5: Missing Data Threshold
**What goes wrong:** Countries with only 1 indicator per dimension get scored, producing unreliable dimension scores.
**Why it happens:** Some small nations or conflict zones have very sparse data coverage.
**How to avoid:** Enforce minimum 2 of 4 indicators per dimension (per CONTEXT.md decision). Mark countries below threshold as having insufficient data for that dimension. Track `completeness` percentage in output.
**Warning signs:** Countries with MIND scores that seem implausibly high or low compared to known development levels.

### Pitfall 6: Zone Zero Import Path After Extraction
**What goes wrong:** Zone Zero simulator breaks because the extracted function has a different import path.
**Why it happens:** `zone-zero.ts` is in `src/scripts/`, the shared library is in `src/lib/`. The relative import path is `../lib/mind-score`.
**How to avoid:** After extraction, update `src/scripts/zone-zero.ts` to import from `../lib/mind-score`. Verify with `astro check` and a build. Run the parity test comparing old hardcoded results with new imported function.
**Warning signs:** `astro check` type errors, build failure, or Zone Zero showing different scores.

## Code Examples

### World Bank API v2 Response Structure (Verified)
```typescript
// Actual response from: /v2/country/USA/indicator/NY.GNP.PCAP.PP.CD?format=json&mrnev=1
// Source: Empirical API testing 2026-04-21
[
  {
    "page": 1,
    "pages": 1,
    "per_page": 300,
    "total": 250,       // includes 33 aggregates + 217 countries
    "sourceid": null,
    "lastupdated": "2026-04-08"
  },
  [
    {
      "indicator": {
        "id": "NY.GNP.PCAP.PP.CD",
        "value": "GNI per capita, PPP (current international $)"
      },
      "country": {
        "id": "US",      // ISO2
        "value": "United States"
      },
      "countryiso3code": "USA",
      "date": "2024",
      "value": 85980,    // numeric (not string) in v2
      "obs_status": "",
      "decimal": 0
    }
  ]
]
```

### Country List Filter (Verified)
```typescript
// Fetch country list and filter to 217 actual countries
// Aggregates have region.id === 'NA'
// Source: Empirical API testing -- confirmed 217 countries, 79 aggregates, 296 total
const countryRes = await fetch(`${WB_BASE}/country?format=json&per_page=300`);
const countryData = JSON.parse(stripBOM(await countryRes.text()));
const countries: CountryMeta[] = countryData[1]
  .filter((c: any) => c.region?.id !== 'NA')  // exactly 217 entries
  .map((c: any) => ({
    iso3: c.id,           // "USA", "BRA", etc.
    iso2: c.iso2Code,     // "US", "BR", etc.
    name: c.name,         // "United States", "Brazil"
    region: c.region.value,
    incomeLevel: c.incomeLevel.value,
  }));
```

### JSON Output Structure
```typescript
// src/data/mind-scores.json structure
interface MINDScoresFile {
  metadata: {
    generatedAt: string;        // ISO date
    worldBankLastUpdated: string;
    indicatorCount: number;
    countryCount: number;
    version: string;
  };
  indicators: Record<string, {  // keyed by WB indicator code
    name: string;
    dimension: 'm' | 'i' | 'n' | 'd';
    normBounds: { min: number; max: number; p1: number; p99: number };
  }>;
  countries: Record<string, {   // keyed by ISO3 code
    name: string;
    region: string;
    incomeLevel: string;
    dimensions: {
      m: { score: number; indicators: IndicatorValue[]; count: number };
      i: { score: number; indicators: IndicatorValue[]; count: number };
      n: { score: number; indicators: IndicatorValue[]; count: number };
      d: { score: number; indicators: IndicatorValue[]; count: number };
    };
    mind: number;               // overall MIND score
    bindingConstraint: 'm' | 'i' | 'n' | 'd';
    completeness: number;       // 0-1, fraction of 16 indicators with data
  }>;
}

interface IndicatorValue {
  code: string;
  raw: number | null;
  normalized: number | null;
  year: string;
  source: string;
}
```

### Vitest Configuration for Astro
```typescript
// vitest.config.ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',  // pure logic, no DOM needed
  },
});
```

### Parity Test Pattern
```typescript
// tests/mind-score.test.ts
import { describe, it, expect } from 'vitest';
import { calcScore, getBindingConstraint } from '../src/lib/mind-score';

describe('calcScore', () => {
  it('matches Zone Zero defaults', () => {
    expect(calcScore({ m: 70, i: 60, n: 50, d: 40 })).toBe(52);
  });
  it('returns 0 when any dimension is 0', () => {
    expect(calcScore({ m: 0, i: 60, n: 50, d: 40 })).toBe(0);
  });
  it('returns 100 when all dimensions are 100', () => {
    expect(calcScore({ m: 100, i: 100, n: 100, d: 100 })).toBe(100);
  });
  it('handles negative values as zero', () => {
    expect(calcScore({ m: -5, i: 60, n: 50, d: 40 })).toBe(0);
  });
});

describe('getBindingConstraint', () => {
  it('identifies lowest dimension', () => {
    expect(getBindingConstraint({ m: 70, i: 60, n: 50, d: 40 })).toBe('d');
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| World Bank API v1 (XML default) | v2 (JSON native, numeric values) | 2019 | Values are numbers not strings; pagination metadata improved |
| ts-node for scripts | tsx (esbuild-based) | 2023+ | 10-50x faster startup, zero-config ESM support |
| Custom fetch libraries | Node.js native fetch | Node 18+ (stable 22+) | No dependency needed for HTTP |
| Separate test configs | Vitest + Astro getViteConfig() | Astro 4.8+ | Test config inherits Astro's Vite config automatically |

## Open Questions

1. **16th Indicator Fallback (Merchandise Export Concentration)**
   - What we know: The Herfindahl-Hirschman Index (B1) is in WB Source 30 (Exporter Dynamics Database), NOT accessible via standard v2 indicator endpoint. UNCTAD has it but only via web UI, no REST API.
   - What's unclear: Whether TX.VAL.TECH.MF.ZS (high-tech exports %) is a good proxy for trade diversification. It was rate-limited during research so coverage couldn't be verified.
   - Recommendation: Use TX.VAL.TECH.MF.ZS as the 4th Diversity indicator. It measures export sophistication (higher = more diversified away from primary commodities). If unavailable at fetch time, gracefully degrade to 3 indicators for Diversity (still meets the 2-of-4 minimum). Document the proxy clearly in output metadata. Alternatively, a static UNCTAD CSV could be committed to the repo as a secondary data source.

2. **Exact Rate Limit Threshold**
   - What we know: Empirical testing hit rate limits after ~5-6 rapid requests. No official documentation on limits.
   - What's unclear: Exact requests/minute allowed, whether limits are per-IP or per-session.
   - Recommendation: Use 2.5-second delay between requests (conservative). Add single retry with 10-second backoff on failure. Total fetch time: ~45 seconds for 16 indicators + country list.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime, fetch script | Yes | v25.4.0 | -- |
| npm | Package management | Yes | 11.7.0 | -- |
| tsx | Fetch script runner | No (not installed) | 4.21.0 (registry) | Install as devDependency |
| vitest | Unit testing | No (not installed) | 4.1.5 (registry) | Install as devDependency |
| World Bank API | Data source | Yes (remote) | v2 | Committed JSON baseline serves as offline fallback |
| Astro | Build system | Yes | 5.18.1 | -- |

**Missing dependencies with no fallback:**
- None (tsx and vitest are install-only gaps, not blockers)

**Missing dependencies with fallback:**
- tsx: `npm install -D tsx` -- required before `npm run fetch-data` works
- vitest: `npm install -D vitest` -- required before tests run

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.5 |
| Config file | `vitest.config.ts` (Wave 0 -- does not exist yet) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | calcScore() produces identical results to zone-zero.ts original | unit | `npx vitest run tests/mind-score.test.ts -t "calcScore"` | No -- Wave 0 |
| DATA-01 | getBindingConstraint() identifies lowest dimension | unit | `npx vitest run tests/mind-score.test.ts -t "getBindingConstraint"` | No -- Wave 0 |
| DATA-01 | Zone Zero imports from shared library without errors | smoke | `npx astro check && npx astro build` | Existing build system |
| DATA-02 | fetch-data script produces valid JSON file | integration | `npx tsx scripts/fetch-world-bank.ts && node -e "JSON.parse(require('fs').readFileSync('src/data/mind-scores.json','utf8'))"` | No -- Wave 0 |
| DATA-02 | Output JSON contains 217 country entries | integration | `npx vitest run tests/data-pipeline.test.ts -t "country count"` | No -- Wave 0 |
| DATA-03 | Normalized scores are in 0-100 range | unit | `npx vitest run tests/normalization.test.ts` | No -- Wave 0 |
| DATA-03 | Percentile caps work correctly | unit | `npx vitest run tests/normalization.test.ts -t "percentile"` | No -- Wave 0 |
| DATA-03 | Missing data exclusion follows 2-of-4 rule | unit | `npx vitest run tests/normalization.test.ts -t "missing"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npx astro check && npx astro build`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- Vitest config using Astro's getViteConfig()
- [ ] `tests/mind-score.test.ts` -- parity tests for calcScore, getBindingConstraint
- [ ] `tests/normalization.test.ts` -- normalize(), percentile caps, missing data rules
- [ ] Framework install: `npm install -D vitest tsx`

## Project Constraints (from CLAUDE.md)

- **Tech Stack**: Astro static site generator -- all code must work within Astro's build system
- **Zero JS by default**: Shared library is server-side/build-time importable; no client bundle impact
- **Performance**: Lighthouse >= 90 desktop, >= 75 mobile -- committed JSON adds no runtime cost
- **Budget**: Free tiers only -- World Bank API is free, no API key required
- **TypeScript strict mode**: Already configured via `astro/tsconfigs/strict`
- **ES modules**: `"type": "module"` in package.json -- all imports must use ESM syntax
- **resolveJsonModule**: Already enabled in Astro's base tsconfig -- JSON imports work natively
- **No existing test framework**: Vitest must be added as a new devDependency
- **No existing `src/lib/` or `src/data/` directories**: Must be created

## Sources

### Primary (HIGH confidence)
- World Bank API v2 -- empirical testing of endpoints (2026-04-21), confirmed response structure, pagination, BOM behavior, rate limiting
- World Bank API v2 documentation -- https://datahelpdesk.worldbank.org/knowledgebase/articles/898599-indicator-api-queries
- World Bank API v2 enhancements -- https://datahelpdesk.worldbank.org/knowledgebase/articles/1886674-new-features-and-enhancements-in-the-v2-api
- World Bank country API -- https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries
- Existing zone-zero.ts source code -- `src/scripts/zone-zero.ts` lines 28-32, 286
- tsx official docs -- https://tsx.is/
- tsx npm registry -- version 4.21.0 confirmed via `npm view tsx version`
- Vitest npm registry -- version 4.1.5 confirmed via `npm view vitest version`
- Astro testing docs -- https://docs.astro.build/en/guides/testing/
- Astro tsconfig base -- verified `resolveJsonModule: true` in installed package

### Secondary (MEDIUM confidence)
- World Bank API rate limiting -- empirical observation (no official documentation exists), errors after 5-6 rapid requests
- UNCTAD concentration index availability -- web search confirmed no REST API, only web UI download

### Tertiary (LOW confidence)
- TX.VAL.TECH.MF.ZS as proxy for trade diversification -- data availability could not be verified due to rate limiting during research session

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- tsx and vitest are verified current versions, native fetch confirmed in Node 22+
- Architecture: HIGH -- based on existing codebase analysis, Astro conventions, and WB API empirical testing
- Pitfalls: HIGH -- rate limiting, BOM, aggregates all confirmed through direct API testing
- Data availability: MEDIUM -- 15 of 16 indicators confirmed in WDI; 16th needs fallback strategy

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (stable domain, World Bank API changes infrequently)
