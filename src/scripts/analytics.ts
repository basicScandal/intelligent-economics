/**
 * Plausible Analytics custom event helper.
 * Wraps the global plausible() function with TypeScript safety.
 * Events are silently dropped if Plausible script hasn't loaded (dev, ad blockers).
 */

/** Plausible custom event names used across the site. */
type PlausibleEvent =
  | 'Form Viewed'
  | 'Form Started'
  | 'Form Submitted'
  | 'Simulator Opened'
  | 'Simulator Interacted'
  | 'Simulator Shared';

/** Optional properties to attach to an event. */
type EventProps = Record<string, string | number | boolean>;

/**
 * Track a custom event in Plausible Analytics.
 * Safe to call even if Plausible script is blocked -- silently no-ops.
 */
export function trackEvent(name: PlausibleEvent, props?: EventProps): void {
  try {
    if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
      window.plausible(name, props ? { props } : undefined);
    }
  } catch {
    // Silently ignore -- analytics must never break the site
  }
}

// Extend Window interface for plausible
declare global {
  interface Window {
    plausible: ((event: string, options?: { props?: EventProps }) => void) & {
      q?: unknown[][];
    };
  }
}
