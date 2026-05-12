/**
 * Dashboard URL state encode/decode utilities.
 *
 * Pure functions for serializing/deserializing dashboard state
 * to/from URL query parameters. Enables bookmarkable and shareable
 * dashboard URLs.
 *
 * No DOM access in encode/decode — fully testable in vitest.
 * pushDashboardURL is a thin DOM wrapper (not unit tested).
 */

// -- Types --

export interface DashboardURLState {
  /** ISO3 country code for the primary selection, or null if none. */
  primary: string | null;
  /** ISO3 country codes for comparison countries. */
  compare: string[];
  /** Active view mode: 'map' for choropleth, null for default country view. */
  view?: string | null;
  /** Active dimension for map coloring: 'm'|'i'|'n'|'d' or null for MIND composite. */
  dim?: string | null;
}

// -- Encode --

/**
 * Encode dashboard state into a URL query string.
 *
 * - If primary is set, adds `country=CODE`.
 * - If compare has entries (excluding primary), adds `compare=CODE1,CODE2`.
 * - Returns empty string if no state to encode.
 */
export function encodeDashboardURL(state: DashboardURLState): string {
  const params = new URLSearchParams();

  if (state.primary) {
    params.set('country', state.primary);
  }

  // Filter out primary from compare to avoid duplication
  const compareFiltered = state.compare.filter((c) => c !== state.primary);
  if (compareFiltered.length > 0) {
    params.set('compare', compareFiltered.join(','));
  }

  if (state.view) {
    params.set('view', state.view);
  }
  if (state.dim) {
    params.set('dim', state.dim);
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

// -- Decode --

/**
 * Decode a URL query string into dashboard state.
 *
 * - Reads `country` param as primary.
 * - Splits `compare` param by comma for compare array.
 * - Returns null primary and empty compare for missing/empty params.
 */
export function decodeDashboardURL(search: string): DashboardURLState {
  const params = new URLSearchParams(search);

  const primary = params.get('country') || null;

  const compareRaw = params.get('compare') || '';
  const compare = compareRaw
    ? compareRaw.split(',').filter((c) => c.length > 0)
    : [];

  const view = params.get('view') || null;
  const dim = params.get('dim') || null;

  return { primary, compare, view, dim };
}

// -- DOM wrapper (not unit tested) --

/**
 * Update browser URL with encoded dashboard state via history.replaceState.
 * Falls back to pathname-only URL when state is empty.
 */
export function pushDashboardURL(state: DashboardURLState): void {
  const encoded = encodeDashboardURL(state);
  history.replaceState(null, '', encoded || window.location.pathname);
}
