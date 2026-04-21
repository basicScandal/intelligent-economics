/**
 * Device capability detection utility.
 * Extracted from monolith index.html (lines 4109-4111).
 * Shared by hero-particles, morph-engine, and zone-zero modules.
 *
 * Tier classification:
 *   - full:    Desktop with >2 cores — full particle counts, high pixel ratio
 *   - reduced: Any mobile device OR desktop with <=2 cores — lower counts, clamped ratio
 *   - minimal: prefers-reduced-motion OR no WebGL — particles skipped entirely
 */

export interface DeviceCapability {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  supportsWebGL: boolean;
  tier: 'full' | 'reduced' | 'minimal';
  pixelRatioLimit: number;
}

let _cached: DeviceCapability | null = null;

export function getDeviceCapability(): DeviceCapability {
  if (_cached) return _cached;

  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const isLowEnd = isMobile || cores <= 2;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let supportsWebGL = false;
  try {
    const c = document.createElement('canvas');
    supportsWebGL = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    // WebGL not available
  }

  let tier: 'full' | 'reduced' | 'minimal' = 'full';
  if (prefersReducedMotion || !supportsWebGL) tier = 'minimal';
  else if (isLowEnd) tier = 'reduced';

  const pixelRatioLimit =
    tier === 'full'
      ? Math.min(window.devicePixelRatio, 2)
      : tier === 'reduced'
        ? Math.min(window.devicePixelRatio, 1.5)
        : 1;

  _cached = { isMobile, isLowEnd, prefersReducedMotion, supportsWebGL, tier, pixelRatioLimit };
  return _cached;
}
