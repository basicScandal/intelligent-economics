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

// -- Data transformation functions (stubs) --

/**
 * Convert full country data into slim payload for client-side use.
 * Maps each country to {code, name, mind, m, i, n, d, bc}.
 */
export function getSlimPayload(
  _countries: Record<string, CountryData>,
): SlimCountry[] {
  throw new Error('Not implemented: getSlimPayload');
}

/**
 * Get top N countries by MIND score for ranking table.
 * Excludes null MIND scores. Adds 1-indexed rank field.
 */
export function getRankingData(
  _countries: SlimCountry[],
  _count?: number,
): RankingEntry[] {
  throw new Error('Not implemented: getRankingData');
}

/**
 * Group indicators by dimension for methodology transparency panel.
 * Returns 4 groups (m, i, n, d) with 4 indicators each.
 */
export function getMethodologyData(
  _indicators: Record<string, IndicatorMeta>,
): Record<DimensionKey, MethodologyIndicator[]> {
  throw new Error('Not implemented: getMethodologyData');
}
