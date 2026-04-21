/**
 * Dashboard country search and keyboard navigation.
 *
 * Pure functions for filtering the 217-country dataset and handling
 * keyboard navigation in the search dropdown. No DOM access.
 */

// -- Types --

/** Slim country payload for client-side search and display. */
export interface SlimCountry {
  code: string;
  name: string;
  mind: number | null;
  m: number | null;
  i: number | null;
  n: number | null;
  d: number | null;
  bc: string;
}

// -- Search filter (stub) --

/**
 * Filter countries by case-insensitive substring match on name.
 *
 * - Empty query returns all countries with non-null MIND scores, sorted desc.
 * - Non-empty query returns all matches (including null-score), sorted by MIND desc (nulls at end).
 */
export function filterCountries(_countries: SlimCountry[], _query: string): SlimCountry[] {
  throw new Error('Not implemented: filterCountries');
}

// -- Keyboard navigation (stub) --

/**
 * Handle keyboard events in search dropdown.
 *
 * ArrowDown: increment index (capped at maxIndex).
 * ArrowUp: decrement index (floored at 0).
 * Escape: return -1.
 * Enter/default: return current activeIndex.
 */
export function handleSearchKeydown(
  _key: string,
  _activeIndex: number,
  _maxIndex: number,
): number {
  throw new Error('Not implemented: handleSearchKeydown');
}
