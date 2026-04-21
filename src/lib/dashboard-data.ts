/**
 * Dashboard data transformation functions.
 *
 * Converts the full mind-scores.json structure into slim payloads
 * for ranking tables, methodology panels, and client-side search.
 *
 * All functions are pure — data is passed as parameters, no runtime imports.
 */

import type { DimensionKey } from './mind-score';
import type { SlimCountry } from '../scripts/dashboard/search';

// -- Types matching mind-scores.json structure --

export interface IndicatorData {
  code: string;
  raw: number | null;
  normalized: number | null;
  year: string;
  source: string;
}

export interface DimensionData {
  score: number;
  indicators: IndicatorData[];
  count?: number;
}

export interface CountryData {
  name: string;
  region: string;
  incomeLevel: string;
  dimensions: Record<DimensionKey, DimensionData>;
  mind: number | null;
  bindingConstraint: string;
  completeness?: number;
}

export interface IndicatorMeta {
  name: string;
  dimension: string;
  normBounds: {
    min: number;
    max: number;
    p1: number;
    p99: number;
  };
}

export interface RankingEntry extends SlimCountry {
  rank: number;
}

export interface MethodologyIndicator {
  code: string;
  name: string;
}

// -- Data transformation functions --

/**
 * Convert full country data into slim payload for client-side use.
 * Maps each country to {code, name, mind, m, i, n, d, bc}.
 * Handles null dimensions gracefully.
 */
export function getSlimPayload(
  countries: Record<string, CountryData>,
): SlimCountry[] {
  return Object.entries(countries).map(([code, c]) => ({
    code,
    name: c.name,
    mind: c.mind,
    m: c.dimensions?.m?.score ?? null,
    i: c.dimensions?.i?.score ?? null,
    n: c.dimensions?.n?.score ?? null,
    d: c.dimensions?.d?.score ?? null,
    bc: c.bindingConstraint,
  }));
}

/**
 * Get top N countries by MIND score for ranking table.
 * Excludes null MIND scores. Adds 1-indexed rank field.
 */
export function getRankingData(
  countries: SlimCountry[],
  count: number = 20,
): RankingEntry[] {
  return countries
    .filter((c) => c.mind !== null)
    .sort((a, b) => b.mind! - a.mind!)
    .slice(0, count)
    .map((c, idx) => ({ ...c, rank: idx + 1 }));
}

/**
 * Group indicators by dimension for methodology transparency panel.
 * Returns 4 groups (m, i, n, d) with 4 indicators each.
 */
export function getMethodologyData(
  indicators: Record<string, IndicatorMeta>,
): Record<DimensionKey, MethodologyIndicator[]> {
  const groups: Record<DimensionKey, MethodologyIndicator[]> = {
    m: [],
    i: [],
    n: [],
    d: [],
  };

  for (const [code, meta] of Object.entries(indicators)) {
    const dim = meta.dimension as DimensionKey;
    if (dim in groups) {
      groups[dim].push({ code, name: meta.name });
    }
  }

  return groups;
}
