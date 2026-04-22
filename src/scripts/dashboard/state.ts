/**
 * Dashboard selection state management.
 *
 * Simple pub/sub state store for the dashboard island.
 * Tracks primary country selection, comparison list (up to 4),
 * and mobile viewport flag.
 *
 * No DOM access, no side effects — fully testable.
 */

import type { SlimCountry } from './search';

/** Dashboard scale level for multi-scale MIND analysis. */
export type Scale = 'country' | 'city' | 'firm';

export interface DashboardState {
  /** Selected country for radar chart + detail view. */
  primary: SlimCountry | null;
  /** Up to 4 countries for bar chart comparison (includes primary). */
  comparison: SlimCountry[];
  /** Tracks viewport < 768px for mobile layout. */
  isMobile: boolean;
  /** Active scale tab: country, city, or firm. */
  activeScale: Scale;
}

type Listener = (state: DashboardState) => void;

export interface DashboardStore {
  get: () => DashboardState;
  selectPrimary: (country: SlimCountry) => void;
  addToComparison: (country: SlimCountry) => void;
  removeFromComparison: (code: string) => void;
  setMobile: (isMobile: boolean) => void;
  setScale: (scale: Scale) => void;
  subscribe: (fn: Listener) => void;
  notify: () => void;
}

const MAX_COMPARISON = 4;

/**
 * Create a new dashboard state store with pub/sub notifications.
 */
export function createDashboardState(): DashboardStore {
  let state: DashboardState = {
    primary: null,
    comparison: [],
    isMobile: false,
    activeScale: 'country',
  };

  const listeners: Listener[] = [];

  function notify() {
    listeners.forEach((fn) => fn(state));
  }

  return {
    get: () => state,

    /**
     * Sets primary country, auto-adds to comparison if not present (max 4).
     * If comparison already has 4 and country isn't in it, replaces the last
     * non-primary entry.
     */
    selectPrimary(country: SlimCountry) {
      state.primary = country;

      const alreadyInComparison = state.comparison.some((c) => c.code === country.code);

      if (!alreadyInComparison) {
        if (state.comparison.length < MAX_COMPARISON) {
          state.comparison = [...state.comparison, country];
        } else {
          // Replace last non-primary entry
          const idx = state.comparison.length - 1;
          state.comparison = [
            ...state.comparison.slice(0, idx),
            country,
          ];
        }
      }

      notify();
    },

    /**
     * Appends country to comparison (max 4). No-op if already present.
     */
    addToComparison(country: SlimCountry) {
      if (state.comparison.length >= MAX_COMPARISON) return;
      if (state.comparison.some((c) => c.code === country.code)) return;

      state.comparison = [...state.comparison, country];
      notify();
    },

    /**
     * Removes country from comparison by code.
     * If removed country was primary, sets primary to null.
     */
    removeFromComparison(code: string) {
      state.comparison = state.comparison.filter((c) => c.code !== code);

      if (state.primary?.code === code) {
        state.primary = null;
      }

      notify();
    },

    /**
     * Updates mobile flag. Only notifies if value actually changed.
     */
    setMobile(isMobile: boolean) {
      if (state.isMobile === isMobile) return;
      state.isMobile = isMobile;
      notify();
    },

    /**
     * Sets the active scale tab (country, city, or firm).
     */
    setScale(scale: Scale) {
      if (state.activeScale === scale) return;
      state.activeScale = scale;
      notify();
    },

    subscribe(fn: Listener) {
      listeners.push(fn);
    },

    notify,
  };
}
