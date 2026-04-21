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

// -- Search filter --

/** Sort comparator: MIND score descending, nulls at end. */
function byMindDesc(a: SlimCountry, b: SlimCountry): number {
  if (a.mind === null && b.mind === null) return 0;
  if (a.mind === null) return 1;
  if (b.mind === null) return -1;
  return b.mind - a.mind;
}

/**
 * Filter countries by case-insensitive substring match on name.
 *
 * - Empty query returns all countries with non-null MIND scores, sorted desc.
 * - Non-empty query returns all matches (including null-score), sorted by MIND desc (nulls at end).
 */
export function filterCountries(countries: SlimCountry[], query: string): SlimCountry[] {
  const trimmed = query.trim().toLowerCase();

  if (trimmed === '') {
    return countries
      .filter((c) => c.mind !== null)
      .sort(byMindDesc);
  }

  return countries
    .filter((c) => c.name.toLowerCase().includes(trimmed))
    .sort(byMindDesc);
}

// -- Keyboard navigation --

/**
 * Handle keyboard events in search dropdown.
 *
 * ArrowDown: increment index (capped at maxIndex).
 * ArrowUp: decrement index (floored at 0).
 * Escape: return -1.
 * Enter/default: return current activeIndex.
 */
export function handleSearchKeydown(
  key: string,
  activeIndex: number,
  maxIndex: number,
): number {
  switch (key) {
    case 'ArrowDown':
      return Math.min(activeIndex + 1, maxIndex);
    case 'ArrowUp':
      return Math.max(activeIndex - 1, 0);
    case 'Escape':
      return -1;
    default:
      return activeIndex;
  }
}
