/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Astro bundles its own copy of Vite, so getViteConfig() expects *that* Vite's
// UserConfig — which has no `test` key, and is structurally incompatible with
// the one vitest/config exports. Cast to the parameter type Astro actually
// wants; Vitest still reads `test` at runtime.
type AstroViteConfig = Parameters<typeof getViteConfig>[0];

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
} as AstroViteConfig);
