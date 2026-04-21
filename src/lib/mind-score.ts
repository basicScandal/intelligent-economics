/**
 * Shared MIND score calculation library.
 *
 * Single source of truth for the MIND framework scoring formula,
 * binding constraint detection, and data normalization.
 *
 * Consumed by: Zone Zero simulator, future dashboard (Phase 9),
 * whitepaper interactive components (Phase 8).
 */

// -- Type exports --

/** The four MIND framework dimension keys. */
export type DimensionKey = 'm' | 'i' | 'n' | 'd';

/** A record mapping each dimension to its numeric score (0-100). */
export type DimensionScores = Record<DimensionKey, number>;

/** Result of percentile-capped normalization. */
export interface NormBounds {
  /** Lower bound (percentile low value). */
  min: number;
  /** Upper bound (percentile high value). */
  max: number;
  /** Maps a raw value to the normalized 0-100 range. */
  normalize: (v: number) => number;
}

// -- Score calculation --

/**
 * Compute the MIND score as a geometric mean of the four dimensions.
 *
 * Formula: round( (M/100 * I/100 * N/100 * D/100)^0.25 * 100 )
 *
 * Zero-floor property: if ANY dimension is <= 0, the entire score is 0.
 * This captures the multiplicative collapse that GDP (additive) masks.
 */
export function calcScore(vals: DimensionScores): number {
  const { m, i, n, d } = vals;
  if (m <= 0 || i <= 0 || n <= 0 || d <= 0) return 0;
  return Math.round(Math.pow((m / 100) * (i / 100) * (n / 100) * (d / 100), 0.25) * 100);
}

/**
 * Return the dimension key with the lowest score (the binding constraint).
 *
 * On ties, the first key in ['m','i','n','d'] order wins (reduce left-to-right).
 */
export function getBindingConstraint(vals: DimensionScores): DimensionKey {
  const keys: DimensionKey[] = ['m', 'i', 'n', 'd'];
  return keys.reduce((a, b) => (vals[a] <= vals[b] ? a : b));
}

/**
 * Percentile-capped min-max normalization.
 *
 * Computes percentile bounds from the input array, then returns a
 * `normalize` function that maps any raw value to the [0, 100] range,
 * clamping values outside the percentile bounds.
 *
 * @param values - Array of raw numeric values to compute bounds from.
 * @param percentileLow - Lower percentile (default 1 = p1).
 * @param percentileHigh - Upper percentile (default 99 = p99).
 * @returns NormBounds with min, max, and a normalize function.
 */
export function normalize(
  values: number[],
  percentileLow: number = 1,
  percentileHigh: number = 99,
): NormBounds {
  if (values.length === 0) {
    return { min: 0, max: 0, normalize: () => 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const lo = sorted[Math.floor((sorted.length * percentileLow) / 100)];
  const hi = sorted[Math.ceil((sorted.length * percentileHigh) / 100) - 1];

  return {
    min: lo,
    max: hi,
    normalize: (v: number): number => {
      if (hi === lo) return 50;
      return Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
    },
  };
}
