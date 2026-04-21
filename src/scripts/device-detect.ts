/**
 * Device capability detection utility.
 * Extracted from monolith index.html (lines 4109-4111).
 * Shared by hero-particles, morph-engine, and zone-zero modules.
 */

export interface DeviceCapability {
  isMobile: boolean;
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
  supportsWebGL: boolean;
  tier: 'full' | 'reduced' | 'minimal';
}

export function getDeviceCapability(): DeviceCapability {
  const isMobile = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency || 2;
  const isLowEnd = cores <= 4 && isMobile;
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

  return { isMobile, isLowEnd, prefersReducedMotion, supportsWebGL, tier };
}
