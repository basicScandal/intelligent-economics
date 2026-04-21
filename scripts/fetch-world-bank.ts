/**
 * World Bank Data Fetch Pipeline
 *
 * Retrieves 16 indicators for ~217 countries from the World Bank API v2,
 * normalizes raw values to 0-100 MIND dimension scores using the shared
 * library, and writes the result to src/data/mind-scores.json.
 *
 * Run via: npm run fetch-data
 *
 * Rate limiting: Serial requests with 2.5s delay between each indicator.
 * BOM handling: Strips UTF-8 BOM from API responses before JSON parsing.
 * Aggregates: Filtered out using country list (region.id !== 'NA').
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calcScore,
  getBindingConstraint,
  normalize,
  type DimensionKey,
  type DimensionScores,
} from '../src/lib/mind-score.js';

// -- Constants --

const WB_BASE = 'https://api.worldbank.org/v2';
const DELAY_MS = 2500;
const RETRY_DELAY_MS = 10000;
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/data/mind-scores.json',
);

// -- Indicator mapping (16 indicators, 4 per MIND dimension) --

interface IndicatorDef {
  code: string;
  name: string;
  dimension: DimensionKey;
}

const INDICATORS: Record<string, IndicatorDef> = {
  'NY.GNP.PCAP.PP.CD': {
    code: 'NY.GNP.PCAP.PP.CD',
    name: 'GNI per capita, PPP',
    dimension: 'm',
  },
  'EG.ELC.ACCS.ZS': {
    code: 'EG.ELC.ACCS.ZS',
    name: 'Access to electricity %',
    dimension: 'm',
  },
  'SP.DYN.LE00.IN': {
    code: 'SP.DYN.LE00.IN',
    name: 'Life expectancy at birth',
    dimension: 'm',
  },
  'SH.H2O.SMDW.ZS': {
    code: 'SH.H2O.SMDW.ZS',
    name: 'Safely managed drinking water %',
    dimension: 'm',
  },
  'SE.TER.ENRR': {
    code: 'SE.TER.ENRR',
    name: 'Tertiary enrollment %',
    dimension: 'i',
  },
  'GB.XPD.RSDV.GD.ZS': {
    code: 'GB.XPD.RSDV.GD.ZS',
    name: 'R&D expenditure % GDP',
    dimension: 'i',
  },
  'IT.NET.USER.ZS': {
    code: 'IT.NET.USER.ZS',
    name: 'Individuals using Internet %',
    dimension: 'i',
  },
  'SE.XPD.TOTL.GD.ZS': {
    code: 'SE.XPD.TOTL.GD.ZS',
    name: 'Govt education expenditure % GDP',
    dimension: 'i',
  },
  'NE.TRD.GNFS.ZS': {
    code: 'NE.TRD.GNFS.ZS',
    name: 'Trade % of GDP',
    dimension: 'n',
  },
  'IT.CEL.SETS.P2': {
    code: 'IT.CEL.SETS.P2',
    name: 'Mobile subscriptions per 100',
    dimension: 'n',
  },
  'BX.KLT.DINV.WD.GD.ZS': {
    code: 'BX.KLT.DINV.WD.GD.ZS',
    name: 'FDI net inflows % GDP',
    dimension: 'n',
  },
  'ST.INT.ARVL': {
    code: 'ST.INT.ARVL',
    name: 'International tourism arrivals',
    dimension: 'n',
  },
  'SG.GEN.PARL.ZS': {
    code: 'SG.GEN.PARL.ZS',
    name: 'Women in parliament %',
    dimension: 'd',
  },
  'SL.TLF.CACT.FE.ZS': {
    code: 'SL.TLF.CACT.FE.ZS',
    name: 'Female labor force participation %',
    dimension: 'd',
  },
  'EG.FEC.RNEW.ZS': {
    code: 'EG.FEC.RNEW.ZS',
    name: 'Renewable energy consumption %',
    dimension: 'd',
  },
  'TX.VAL.TECH.MF.ZS': {
    code: 'TX.VAL.TECH.MF.ZS',
    name: 'High-technology exports % manufactured',
    dimension: 'd',
  },
};

// -- Types for World Bank API responses --

interface WBRecord {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  obs_status: string;
  decimal: number;
}

interface CountryMeta {
  iso3: string;
  iso2: string;
  name: string;
  region: string;
  incomeLevel: string;
}

interface IndicatorValue {
  code: string;
  raw: number | null;
  normalized: number | null;
  year: string;
  source: string;
}

interface DimensionData {
  score: number | null;
  indicators: IndicatorValue[];
  count: number;
}

interface CountryEntry {
  name: string;
  region: string;
  incomeLevel: string;
  dimensions: Record<DimensionKey, DimensionData>;
  mind: number | null;
  bindingConstraint: DimensionKey | null;
  completeness: number;
}

interface MINDScoresFile {
  metadata: {
    generatedAt: string;
    worldBankLastUpdated: string;
    indicatorCount: number;
    countryCount: number;
    version: string;
  };
  indicators: Record<
    string,
    {
      name: string;
      dimension: DimensionKey;
      normBounds: { min: number; max: number; p1: number; p99: number };
    }
  >;
  countries: Record<string, CountryEntry>;
}

// -- BOM-safe fetch helper --

async function fetchJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buf = await res.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(buf).replace(/^\uFEFF/, '');

  // Detect HTML error pages (rate limiting or server errors)
  if (text.trimStart().startsWith('<')) {
    throw new Error(`Received HTML instead of JSON for ${url}`);
  }

  return JSON.parse(text);
}

// -- Delay helper --

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// -- Fetch with single retry --

async function fetchWithRetry(url: string): Promise<unknown> {
  try {
    return await fetchJSON(url);
  } catch (err) {
    console.warn(
      `  Retry in ${RETRY_DELAY_MS / 1000}s: ${err instanceof Error ? err.message : String(err)}`,
    );
    await delay(RETRY_DELAY_MS);
    return await fetchJSON(url);
  }
}

// -- Main pipeline --

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('=== MIND World Bank Data Pipeline ===\n');

  // Step 1: Fetch country list
  console.log('Fetching country list...');
  const countryUrl = `${WB_BASE}/country?format=json&per_page=300`;

  let countryData: unknown;
  try {
    countryData = await fetchWithRetry(countryUrl);
  } catch (err) {
    console.error(
      `FATAL: Could not fetch country list: ${err instanceof Error ? err.message : String(err)}`,
    );
    process.exit(1);
  }

  if (
    !Array.isArray(countryData) ||
    countryData.length < 2 ||
    !Array.isArray(countryData[1])
  ) {
    console.error('FATAL: Unexpected country list response format');
    process.exit(1);
  }

  // Check if we need to fetch more pages
  const countryMeta = countryData[0] as { pages?: number; per_page?: number; total?: number };
  let allCountryRecords = countryData[1] as Array<Record<string, unknown>>;

  if (countryMeta.pages && countryMeta.pages > 1) {
    for (let page = 2; page <= countryMeta.pages; page++) {
      console.log(`  Fetching country list page ${page}/${countryMeta.pages}...`);
      await delay(DELAY_MS);
      const pageData = await fetchWithRetry(`${countryUrl}&page=${page}`) as unknown[];
      if (Array.isArray(pageData) && pageData.length >= 2 && Array.isArray(pageData[1])) {
        allCountryRecords = allCountryRecords.concat(pageData[1] as Array<Record<string, unknown>>);
      }
    }
  }

  // Filter to actual countries (not aggregates): region.id !== 'NA'
  const countries: CountryMeta[] = allCountryRecords
    .filter(
      (c: Record<string, unknown>) =>
        (c.region as Record<string, unknown>)?.id !== 'NA',
    )
    .map((c: Record<string, unknown>) => ({
      iso3: c.id as string,
      iso2: c.iso2Code as string,
      name: c.name as string,
      region: (c.region as Record<string, string>)?.value ?? 'Unknown',
      incomeLevel: (c.incomeLevel as Record<string, string>)?.value ?? 'Unknown',
    }));

  const validISO3 = new Set(countries.map((c) => c.iso3));
  console.log(`Found ${countries.length} countries (filtered from ${allCountryRecords.length} total)\n`);

  // Step 2: Fetch each indicator serially
  // Strategy: try mrnev=1 (most recent non-empty value) first.
  // If mrnev returns HTTP 400 (unsupported for some indicators), fall back
  // to mrv=5 (last 5 years) and pick the most recent non-null per country.
  const indicatorCodes = Object.keys(INDICATORS);
  const rawData = new Map<string, WBRecord[]>();
  let worldBankLastUpdated = '';

  for (let idx = 0; idx < indicatorCodes.length; idx++) {
    const code = indicatorCodes[idx];
    console.log(`Fetching [${idx + 1}/${indicatorCodes.length}] ${code}...`);

    const mrnev_url = `${WB_BASE}/country/all/indicator/${code}?format=json&mrnev=1&per_page=300`;
    const fallback_url = `${WB_BASE}/country/all/indicator/${code}?format=json&mrv=5&per_page=1500`;

    try {
      let data: unknown[];
      let usedFallback = false;

      // Try mrnev=1 first
      try {
        data = (await fetchJSON(mrnev_url)) as unknown[];
        if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
          throw new Error('Invalid response structure');
        }
      } catch {
        // mrnev not supported for this indicator -- fall back to mrv=5
        console.log(`  mrnev unsupported, falling back to mrv=5...`);
        await delay(DELAY_MS);
        data = (await fetchWithRetry(fallback_url)) as unknown[];
        usedFallback = true;
      }

      if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
        console.warn(`  WARNING: No data returned for ${code}, skipping`);
        continue;
      }

      // Extract lastUpdated from metadata
      const meta = data[0] as Record<string, unknown>;
      if (meta.lastupdated && typeof meta.lastupdated === 'string') {
        worldBankLastUpdated = meta.lastupdated;
      }

      // Filter to valid countries only
      let records = (data[1] as WBRecord[]).filter(
        (r) => validISO3.has(r.countryiso3code),
      );

      // If using fallback (mrv=5), pick the most recent non-null value per country
      if (usedFallback) {
        const byCountry = new Map<string, WBRecord>();
        // Records come sorted by date descending, so first non-null wins
        for (const r of records) {
          if (!byCountry.has(r.countryiso3code) && r.value !== null) {
            byCountry.set(r.countryiso3code, r);
          }
        }
        // Also include countries with no data (null) if not already seen
        for (const r of records) {
          if (!byCountry.has(r.countryiso3code)) {
            byCountry.set(r.countryiso3code, r);
          }
        }
        records = Array.from(byCountry.values());
      }

      rawData.set(code, records);
      const nonNull = records.filter((r) => r.value !== null).length;
      console.log(
        `  Got ${records.length} records (${nonNull} with data)${usedFallback ? ' [mrv=5 fallback]' : ''}`,
      );
    } catch (err) {
      console.warn(
        `  WARNING: Failed to fetch ${code} after retry: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Rate limit delay (skip after last indicator)
    if (idx < indicatorCodes.length - 1) {
      await delay(DELAY_MS);
    }
  }

  console.log(`\nFetched ${rawData.size}/${indicatorCodes.length} indicators\n`);

  // Step 3: Normalize each indicator
  console.log('Normalizing indicator values...');

  const indicatorBounds = new Map<
    string,
    { min: number; max: number; p1: number; p99: number; normFn: (v: number) => number }
  >();

  for (const [code, records] of rawData) {
    const values = records
      .filter((r) => r.value !== null && typeof r.value === 'number' && !isNaN(r.value))
      .map((r) => r.value as number);

    if (values.length === 0) {
      console.warn(`  WARNING: No valid values for ${code}`);
      continue;
    }

    const bounds = normalize(values);
    indicatorBounds.set(code, {
      min: bounds.min,
      max: bounds.max,
      p1: bounds.min,
      p99: bounds.max,
      normFn: bounds.normalize,
    });

    console.log(
      `  ${code}: ${values.length} values, bounds [${bounds.min.toFixed(2)}, ${bounds.max.toFixed(2)}]`,
    );
  }

  // Step 4: Build country entries
  console.log('\nBuilding country dimension scores...');

  // Create a lookup: iso3 -> indicatorCode -> WBRecord
  const countryIndicators = new Map<string, Map<string, WBRecord>>();
  for (const [code, records] of rawData) {
    for (const record of records) {
      if (!countryIndicators.has(record.countryiso3code)) {
        countryIndicators.set(record.countryiso3code, new Map());
      }
      countryIndicators.get(record.countryiso3code)!.set(code, record);
    }
  }

  const countryEntries: Record<string, CountryEntry> = {};
  let completeCount = 0;
  let incompleteCount = 0;

  for (const country of countries) {
    const indicators = countryIndicators.get(country.iso3) ?? new Map<string, WBRecord>();

    // Build indicator values per dimension
    const dimIndicators: Record<DimensionKey, IndicatorValue[]> = {
      m: [],
      i: [],
      n: [],
      d: [],
    };

    let totalWithData = 0;

    for (const [code, def] of Object.entries(INDICATORS)) {
      const record = indicators.get(code);
      const bounds = indicatorBounds.get(code);

      let raw: number | null = null;
      let normalized: number | null = null;
      let year = '';

      if (record && record.value !== null && typeof record.value === 'number' && !isNaN(record.value)) {
        raw = record.value;
        year = record.date ?? '';
        if (bounds) {
          normalized = Math.round(bounds.normFn(raw) * 100) / 100;
          // Ensure NaN doesn't sneak through
          if (isNaN(normalized)) normalized = null;
        }
        totalWithData++;
      } else if (record) {
        year = record.date ?? '';
      }

      dimIndicators[def.dimension].push({
        code,
        raw,
        normalized,
        year,
        source: 'World Bank WDI',
      });
    }

    // Compute dimension scores: arithmetic mean of available normalized values
    // Minimum 2 of 4 indicators required per dimension
    const dimensions: Record<DimensionKey, DimensionData> = {} as Record<
      DimensionKey,
      DimensionData
    >;
    const dimKeys: DimensionKey[] = ['m', 'i', 'n', 'd'];

    for (const dim of dimKeys) {
      const validScores = dimIndicators[dim]
        .filter((iv) => iv.normalized !== null)
        .map((iv) => iv.normalized as number);

      let score: number | null = null;
      if (validScores.length >= 2) {
        const mean =
          validScores.reduce((sum, v) => sum + v, 0) / validScores.length;
        score = Math.round(mean * 100) / 100;
        // Guard against NaN
        if (isNaN(score)) score = null;
      }

      dimensions[dim] = {
        score,
        indicators: dimIndicators[dim],
        count: validScores.length,
      };
    }

    // Compute overall MIND score
    let mind: number | null = null;
    let bindingConstraint: DimensionKey | null = null;

    const allDimsPresent = dimKeys.every(
      (dim) => dimensions[dim].score !== null,
    );

    if (allDimsPresent) {
      const dimScores: DimensionScores = {
        m: dimensions.m.score!,
        i: dimensions.i.score!,
        n: dimensions.n.score!,
        d: dimensions.d.score!,
      };
      mind = calcScore(dimScores);
      bindingConstraint = getBindingConstraint(dimScores);
      // Guard against NaN
      if (isNaN(mind)) mind = null;
    } else {
      // Find binding constraint from available dimensions
      const available = dimKeys.filter((dim) => dimensions[dim].score !== null);
      if (available.length > 0) {
        bindingConstraint = available.reduce((a, b) =>
          dimensions[a].score! <= dimensions[b].score! ? a : b,
        );
      }
    }

    const completeness =
      Math.round((totalWithData / Object.keys(INDICATORS).length) * 100) / 100;

    countryEntries[country.iso3] = {
      name: country.name,
      region: country.region,
      incomeLevel: country.incomeLevel,
      dimensions,
      mind,
      bindingConstraint,
      completeness,
    };

    if (allDimsPresent) {
      completeCount++;
    } else {
      incompleteCount++;
    }
  }

  // Step 5: Build output structure
  const indicatorsMeta: MINDScoresFile['indicators'] = {};
  for (const [code, def] of Object.entries(INDICATORS)) {
    const bounds = indicatorBounds.get(code);
    indicatorsMeta[code] = {
      name: def.name,
      dimension: def.dimension,
      normBounds: bounds
        ? { min: bounds.min, max: bounds.max, p1: bounds.p1, p99: bounds.p99 }
        : { min: 0, max: 0, p1: 0, p99: 0 },
    };
  }

  const output: MINDScoresFile = {
    metadata: {
      generatedAt: new Date().toISOString(),
      worldBankLastUpdated: worldBankLastUpdated || 'unknown',
      indicatorCount: rawData.size,
      countryCount: Object.keys(countryEntries).length,
      version: '1.0.0',
    },
    indicators: indicatorsMeta,
    countries: countryEntries,
  };

  // Step 6: Write output, replacing NaN/Infinity with null
  const jsonString = JSON.stringify(
    output,
    (_key, value) => {
      if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
        return null;
      }
      return value;
    },
    2,
  );

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, jsonString, 'utf-8');

  // Step 7: Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n=== Pipeline Complete ===');
  console.log(`Total countries: ${Object.keys(countryEntries).length}`);
  console.log(`Indicators fetched: ${rawData.size}/${indicatorCodes.length}`);
  console.log(`Countries with complete data: ${completeCount}`);
  console.log(`Countries with incomplete data: ${incompleteCount}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Runtime: ${elapsed}s`);
}

main().catch((err) => {
  console.error('FATAL:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
