/**
 * Historical World Bank Data Fetch Pipeline
 *
 * Extends the single-year pipeline to retrieve 10 years of historical data
 * (2014-2024) for all 16 MIND indicators across ~217 countries.
 *
 * Produces src/data/mind-scores-historical.json with year-indexed MIND scores.
 * The existing mind-scores.json is NOT modified.
 *
 * Run via: npm run fetch-data-historical
 *
 * Rate limiting: Serial requests with 2.5s delay between each indicator.
 * Pagination: per_page=1500, follows pagination if more pages exist.
 * BOM handling: Strips UTF-8 BOM from API responses before JSON parsing.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  calcScore,
  normalize,
  type DimensionKey,
  type DimensionScores,
} from '../src/lib/mind-score.js';

// -- Constants --

const WB_BASE = 'https://api.worldbank.org/v2';
const DELAY_MS = 2500;
const RETRY_DELAY_MS = 10000;
const PER_PAGE = 1500;
const YEAR_START = 2014;
const YEAR_END = 2024;
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../src/data/mind-scores-historical.json',
);

// -- Indicator mapping (same 16 indicators as single-year pipeline) --

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

// -- Fetch all pages for a paginated endpoint --

async function fetchAllPages(baseUrl: string): Promise<WBRecord[]> {
  const firstPage = (await fetchWithRetry(baseUrl)) as unknown[];

  if (!Array.isArray(firstPage) || firstPage.length < 2 || !Array.isArray(firstPage[1])) {
    return [];
  }

  const meta = firstPage[0] as { pages?: number; total?: number };
  let allRecords: WBRecord[] = firstPage[1] as WBRecord[];
  const totalPages = meta.pages ?? 1;

  for (let page = 2; page <= totalPages; page++) {
    console.log(`    Fetching page ${page}/${totalPages}...`);
    await delay(DELAY_MS);
    const separator = baseUrl.includes('?') ? '&' : '?';
    const pageData = (await fetchWithRetry(`${baseUrl}${separator}page=${page}`)) as unknown[];
    if (Array.isArray(pageData) && pageData.length >= 2 && Array.isArray(pageData[1])) {
      allRecords = allRecords.concat(pageData[1] as WBRecord[]);
    }
  }

  return allRecords;
}

// -- Main pipeline --

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('=== MIND Historical World Bank Data Pipeline ===');
  console.log(`Year range: ${YEAR_START}-${YEAR_END}\n`);

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
  const countryMeta = countryData[0] as { pages?: number };
  let allCountryRecords = countryData[1] as Array<Record<string, unknown>>;

  if (countryMeta.pages && countryMeta.pages > 1) {
    for (let page = 2; page <= countryMeta.pages; page++) {
      console.log(`  Fetching country list page ${page}/${countryMeta.pages}...`);
      await delay(DELAY_MS);
      const pageData = (await fetchWithRetry(`${countryUrl}&page=${page}`)) as unknown[];
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

  // Step 2: Fetch each indicator for the full date range, serially
  const indicatorCodes = Object.keys(INDICATORS);
  // Map: indicatorCode -> iso3 -> year -> value
  const rawData = new Map<string, Map<string, Map<string, number | null>>>();

  for (let idx = 0; idx < indicatorCodes.length; idx++) {
    const code = indicatorCodes[idx];
    console.log(`Fetching [${idx + 1}/${indicatorCodes.length}] ${code}...`);

    const url = `${WB_BASE}/country/all/indicator/${code}?format=json&date=${YEAR_START}:${YEAR_END}&per_page=${PER_PAGE}`;

    try {
      const records = await fetchAllPages(url);

      // Filter to valid countries and group by country + year
      const indicatorMap = new Map<string, Map<string, number | null>>();
      let dataPoints = 0;

      for (const record of records) {
        if (!validISO3.has(record.countryiso3code)) continue;

        const iso3 = record.countryiso3code;
        const year = record.date;

        if (!indicatorMap.has(iso3)) {
          indicatorMap.set(iso3, new Map());
        }
        indicatorMap.get(iso3)!.set(year, record.value);

        if (record.value !== null) {
          dataPoints++;
        }
      }

      rawData.set(code, indicatorMap);
      console.log(
        `  Got ${records.length} records from ${indicatorMap.size} countries (${dataPoints} with data)`,
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

  // Step 3: For each year, compute normalization bounds from that year's data
  // then compute dimension scores and MIND scores
  console.log('Computing year-by-year MIND scores...');

  const years: Record<string, { countries: Record<string, { m: number | null; i: number | null; n: number | null; d: number | null; mind: number | null }> }> = {};
  let totalCountriesWithData = 0;

  for (let year = YEAR_START; year <= YEAR_END; year++) {
    const yearStr = String(year);
    console.log(`\n  Processing ${yearStr}...`);

    // Collect all values per indicator for this year (for normalization)
    const yearNormBounds = new Map<string, { normFn: (v: number) => number }>();

    for (const [code] of rawData) {
      const values: number[] = [];

      for (const [iso3] of rawData.get(code)!) {
        const val = rawData.get(code)!.get(iso3)?.get(yearStr);
        if (val !== null && val !== undefined && typeof val === 'number' && !isNaN(val)) {
          values.push(val);
        }
      }

      if (values.length > 0) {
        const bounds = normalize(values);
        yearNormBounds.set(code, { normFn: bounds.normalize });
      }
    }

    console.log(`    ${yearNormBounds.size} indicators have data for ${yearStr}`);

    // Compute dimension scores per country for this year
    const yearCountries: Record<string, { m: number | null; i: number | null; n: number | null; d: number | null; mind: number | null }> = {};
    let countriesThisYear = 0;

    for (const country of countries) {
      const dimScores: Record<DimensionKey, number[]> = { m: [], i: [], n: [], d: [] };

      for (const [code, def] of Object.entries(INDICATORS)) {
        const countryData = rawData.get(code)?.get(country.iso3);
        const raw = countryData?.get(yearStr);
        const bounds = yearNormBounds.get(code);

        if (raw !== null && raw !== undefined && typeof raw === 'number' && !isNaN(raw) && bounds) {
          let normalized = bounds.normFn(raw);
          normalized = Math.round(normalized * 100) / 100;
          if (!isNaN(normalized)) {
            dimScores[def.dimension].push(normalized);
          }
        }
      }

      // Compute dimension averages (require >= 2 indicators per dimension)
      const dims: Record<DimensionKey, number | null> = { m: null, i: null, n: null, d: null };
      const dimKeys: DimensionKey[] = ['m', 'i', 'n', 'd'];

      for (const dim of dimKeys) {
        if (dimScores[dim].length >= 2) {
          const mean = dimScores[dim].reduce((s, v) => s + v, 0) / dimScores[dim].length;
          const score = Math.round(mean * 100) / 100;
          dims[dim] = isNaN(score) ? null : score;
        }
      }

      // Compute MIND score
      let mind: number | null = null;
      const allPresent = dimKeys.every((d) => dims[d] !== null);
      if (allPresent) {
        const dScores: DimensionScores = {
          m: dims.m!,
          i: dims.i!,
          n: dims.n!,
          d: dims.d!,
        };
        mind = calcScore(dScores);
        if (isNaN(mind)) mind = null;
      }

      // Only include if at least one dimension has data
      const hasAnyData = dimKeys.some((d) => dims[d] !== null);
      if (hasAnyData) {
        yearCountries[country.iso3] = {
          m: dims.m,
          i: dims.i,
          n: dims.n,
          d: dims.d,
          mind,
        };
        countriesThisYear++;
      }
    }

    years[yearStr] = { countries: yearCountries };
    totalCountriesWithData = Math.max(totalCountriesWithData, countriesThisYear);
    console.log(`    ${countriesThisYear} countries with dimension data`);
  }

  // Step 4: Build output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      yearRange: [YEAR_START, YEAR_END] as [number, number],
      indicatorCount: rawData.size,
      countryCount: totalCountriesWithData,
      version: '1.0.0',
    },
    years,
  };

  // Step 5: Write output, replacing NaN/Infinity with null
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

  // Step 6: Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSizeKB = (Buffer.byteLength(jsonString, 'utf-8') / 1024).toFixed(1);

  console.log('\n=== Historical Pipeline Complete ===');
  console.log(`Years: ${YEAR_START}-${YEAR_END} (${YEAR_END - YEAR_START + 1} years)`);
  console.log(`Indicators fetched: ${rawData.size}/${indicatorCodes.length}`);
  console.log(`Max countries per year: ${totalCountriesWithData}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`File size: ${fileSizeKB} KB`);
  console.log(`Runtime: ${elapsed}s`);
}

main().catch((err) => {
  console.error('FATAL:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
