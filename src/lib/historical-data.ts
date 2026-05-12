/**
 * Shared types and helper functions for historical (year-indexed) MIND data.
 *
 * Consumed by: time-series dashboard components (Phase 15),
 * historical comparison views, data export utilities.
 *
 * Data source: src/data/mind-scores-historical.json
 * (produced by scripts/fetch-world-bank-historical.ts)
 */

// -- Type exports --

/** Dimension + composite scores for a single country-year. */
export interface YearScores {
  m: number | null;
  i: number | null;
  n: number | null;
  d: number | null;
  mind: number | null;
}

/** Full structure of mind-scores-historical.json. */
export interface HistoricalData {
  metadata: {
    generatedAt: string;
    yearRange: [number, number];
    indicatorCount: number;
    countryCount: number;
    version: string;
  };
  years: Record<string, { countries: Record<string, YearScores> }>;
}

/** A single data point in a country time series. */
export interface TimeSeriesEntry {
  year: number;
  scores: YearScores;
}

// -- Query functions --

/**
 * Get sorted array of available years from historical data.
 *
 * @param data - The historical data object
 * @returns Sorted ascending array of year numbers
 */
export function getAvailableYears(data: HistoricalData): number[] {
  return Object.keys(data.years)
    .map((y) => parseInt(y, 10))
    .filter((y) => !isNaN(y))
    .sort((a, b) => a - b);
}

/**
 * Get scores for a country across all available years.
 *
 * Returns an array of { year, scores } entries sorted ascending by year.
 * Returns an empty array if the country is not found in any year.
 *
 * @param data - The historical data object
 * @param iso3 - Country ISO3 code (e.g., "USA")
 * @returns Time series entries sorted by year
 */
export function getCountryTimeSeries(
  data: HistoricalData,
  iso3: string,
): TimeSeriesEntry[] {
  const entries: TimeSeriesEntry[] = [];

  for (const [yearStr, yearData] of Object.entries(data.years)) {
    const year = parseInt(yearStr, 10);
    if (isNaN(year)) continue;

    const countryScores = yearData.countries[iso3];
    if (countryScores) {
      entries.push({ year, scores: countryScores });
    }
  }

  return entries.sort((a, b) => a.year - b.year);
}

/**
 * Get all countries and their scores for a given year.
 *
 * Returns an empty object if the year is not present in the data.
 *
 * @param data - The historical data object
 * @param year - The year to look up (e.g., 2020)
 * @returns Record of ISO3 code to YearScores
 */
export function getYearSnapshot(
  data: HistoricalData,
  year: number,
): Record<string, YearScores> {
  const yearData = data.years[String(year)];
  if (!yearData) return {};
  return yearData.countries;
}
