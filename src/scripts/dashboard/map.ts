/**
 * Interactive world map module for the dashboard.
 *
 * Handles lazy GeoJSON loading, ECharts map rendering, country click-to-select,
 * dimension toggle switching, reset-view, and resize observation.
 *
 * Loaded dynamically by init.ts when the Map tab is first activated.
 * Receives echarts, store, and countries from init.ts to avoid circular imports.
 */

import type { DashboardStore } from './state';
import type { SlimCountry } from './search';
import type { MapDimension } from './charts';
import type { DimensionKey } from '../../lib/mind-score';

let mapChart: any = null;
let mapRadarChart: any = null;
let geoJsonPromise: Promise<any> | null = null;
let mapRegistered = false;
let currentDimension: MapDimension = 'mind';

/** Get the current map dimension (for URL state sync). */
export function getCurrentDimension(): MapDimension {
  return currentDimension;
}

/** Set the current map dimension (for URL state hydration). */
export function setCurrentDimension(dim: MapDimension): void {
  currentDimension = dim;
}

/**
 * Initialize the interactive world map.
 *
 * Fetches GeoJSON lazily (with deduplication), registers the map in ECharts,
 * renders the choropleth, and wires all interactive behaviors.
 */
export async function initMap(
  echarts: any,
  store: DashboardStore,
  countries: SlimCountry[],
): Promise<void> {
  // 1. Lazy GeoJSON fetch with deduplication (Pitfall 2 prevention)
  if (!geoJsonPromise) {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
    geoJsonPromise = fetch(`${base}geo/world.json`)
      .then(r => {
        if (!r.ok) throw new Error(`GeoJSON fetch failed: ${r.status}`);
        return r.json();
      });
  }

  let geoJson: any;
  try {
    geoJson = await geoJsonPromise;
  } catch (err) {
    // Show error state
    document.getElementById('map-loading')?.classList.add('hidden');
    document.getElementById('map-error')?.classList.remove('hidden');
    console.error('Map GeoJSON load failed:', err);
    return;
  }

  // 2. registerMap guard (Pitfall 3 prevention)
  if (!mapRegistered) {
    echarts.registerMap('world', geoJson);
    mapRegistered = true;
  }

  // 3. Import charts module dynamically (avoid bundling with init.ts)
  const {
    makeMapOption,
    makeRadarOption,
    getBindingConstraintCallout,
    DIM_COLORS,
    DIM_NAMES,
    siteTheme,
  } = await import('./charts');

  // 4. Initialize ECharts map instance
  const mapEl = document.getElementById('map-chart');
  if (!mapEl) return;
  mapChart = echarts.init(mapEl, siteTheme, { renderer: 'svg' });
  mapChart.setOption(makeMapOption(countries, currentDimension));

  // 5. Hide loading, show reset button
  document.getElementById('map-loading')?.classList.add('hidden');
  document.getElementById('map-reset-view')?.classList.remove('hidden');

  // 6. Click handler (per D-12, D-13, Pitfall 6 prevention)
  mapChart.on('click', (params: any) => {
    if (params.componentType !== 'series') return;
    const country = countries.find(c => c.name === params.name);
    if (!country) return; // No-op for territories without MIND data
    store.selectPrimary(country);
  });

  // 7. State subscriber for map country detail (per D-05, D-12)
  store.subscribe((state) => {
    if (state.activeScale !== 'map') return;

    if (state.primary && state.primary.m !== null) {
      // Show country detail, hide prompt
      document.getElementById('map-country-detail')?.classList.remove('hidden');
      document.getElementById('map-no-selection')?.classList.add('hidden');

      // Initialize map radar chart if not yet done
      if (!mapRadarChart) {
        const mapRadarEl = document.getElementById('map-radar-chart');
        if (mapRadarEl) {
          mapRadarChart = echarts.init(mapRadarEl, siteTheme, { renderer: 'svg' });
        }
      }

      // Render radar chart
      if (mapRadarChart) {
        mapRadarChart.setOption(makeRadarOption({
          name: state.primary.name,
          m: state.primary.m ?? 0,
          i: state.primary.i ?? 0,
          n: state.primary.n ?? 0,
          d: state.primary.d ?? 0,
        }));
        mapRadarChart.getDom().setAttribute(
          'aria-label',
          `MIND dimension radar chart for ${state.primary.name}`,
        );
        // Resize after render (may have been hidden)
        setTimeout(() => mapRadarChart?.resize(), 50);
      }

      // Binding constraint
      const bcKey = state.primary.bc as DimensionKey;
      const bcScore = state.primary[bcKey] ?? 0;
      const bc = getBindingConstraintCallout(bcKey, Math.round(bcScore));

      const bcNameEl = document.getElementById('map-bc-name');
      const bcScoreEl = document.getElementById('map-bc-score');
      const bcTextEl = document.getElementById('map-bc-text');
      const bcBorderEl = document.getElementById('map-binding-constraint');

      if (bcNameEl) bcNameEl.textContent = bc.dimension;
      if (bcScoreEl) bcScoreEl.textContent = `(${Math.round(bcScore)})`;
      if (bcTextEl) bcTextEl.textContent = bc.text;
      if (bcBorderEl) bcBorderEl.style.borderLeftColor = DIM_COLORS[bcKey];

      // Zone Zero deep link
      const zzLink = document.getElementById('map-zone-zero-link') as HTMLAnchorElement | null;
      const zzText = document.getElementById('map-zone-zero-text');
      if (zzLink && state.primary.mind !== null) {
        const m = Math.round(state.primary.m ?? 0);
        const i = Math.round(state.primary.i ?? 0);
        const n = Math.round(state.primary.n ?? 0);
        const d = Math.round(state.primary.d ?? 0);
        zzLink.href = `/?m=${m}&i=${i}&n=${n}&d=${d}#zone-zero`;
        if (zzText) zzText.textContent = `See ${state.primary.name} in Zone Zero simulator`;
        zzLink.classList.remove('hidden');
      } else if (zzLink) {
        zzLink.classList.add('hidden');
      }

      // sr-only text
      const srEl = document.getElementById('map-radar-sr');
      if (srEl) {
        const score = Math.round((
          (state.primary.m ?? 0) *
          (state.primary.i ?? 0) *
          (state.primary.n ?? 0) *
          (state.primary.d ?? 0)
        ) ** 0.25);
        const bcName = DIM_NAMES[bcKey] || bcKey;
        srEl.textContent = `${state.primary.name} MIND score: ${score}. Material: ${Math.round(state.primary.m ?? 0)}, Intelligence: ${Math.round(state.primary.i ?? 0)}, Network: ${Math.round(state.primary.n ?? 0)}, Diversity: ${Math.round(state.primary.d ?? 0)}. Binding constraint: ${bcName}.`;
      }

      // Map selection highlight (persistent cyan border per D-13)
      mapChart?.dispatchAction({
        type: 'select',
        seriesIndex: 0,
        name: state.primary.name,
      });
    } else {
      // No primary: hide detail, show prompt
      document.getElementById('map-country-detail')?.classList.add('hidden');
      document.getElementById('map-no-selection')?.classList.remove('hidden');
      document.getElementById('map-zone-zero-link')?.classList.add('hidden');
    }
  });

  // 8. Dimension toggle handler (per D-06, Pitfall 5 prevention)
  const dimToggle = document.getElementById('dim-toggle');
  if (dimToggle) {
    dimToggle.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-dim]');
      if (!btn) return;
      const dim = btn.dataset.dim as MapDimension;
      if (dim === currentDimension) return;
      currentDimension = dim;

      // Update toggle button active states
      dimToggle.querySelectorAll<HTMLButtonElement>('[data-dim]').forEach(b => {
        const isActive = b.dataset.dim === dim;
        b.setAttribute('aria-checked', String(isActive));
        b.classList.toggle('bg-white/10', isActive);
        b.classList.toggle('text-white', isActive);
        b.classList.toggle('text-[#8888aa]', !isActive);
      });

      // Re-render map with new dimension (use replaceMerge to fully replace visualMap colors)
      mapChart.setOption(makeMapOption(countries, dim), { replaceMerge: ['visualMap', 'series'] });

      // Re-select current country if any
      const state = store.get();
      if (state.primary) {
        mapChart.dispatchAction({ type: 'select', seriesIndex: 0, name: state.primary.name });
      }
    });

    // Keyboard arrow navigation for radiogroup
    dimToggle.addEventListener('keydown', (e) => {
      const btns = Array.from(dimToggle.querySelectorAll<HTMLButtonElement>('[data-dim]'));
      const idx = btns.indexOf(e.target as HTMLButtonElement);
      if (idx < 0) return;
      let next = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        next = (idx + 1) % btns.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        next = (idx - 1 + btns.length) % btns.length;
      }
      if (next !== idx) {
        btns[next].focus();
        btns[next].click();
      }
    });
  }

  // 9. Reset view button (per D-07)
  document.getElementById('map-reset-view')?.addEventListener('click', () => {
    mapChart?.dispatchAction({ type: 'restore' });
  });

  // 10. Retry button for error state
  document.getElementById('map-retry')?.addEventListener('click', () => {
    document.getElementById('map-error')?.classList.add('hidden');
    document.getElementById('map-loading')?.classList.remove('hidden');
    geoJsonPromise = null; // Force refetch
    mapRegistered = false; // Allow re-registration
    initMap(echarts, store, countries);
  });

  // 11. ResizeObserver (Pitfall 4 prevention)
  const ro = new ResizeObserver(() => {
    mapChart?.resize();
    mapRadarChart?.resize();
  });
  if (mapEl) ro.observe(mapEl);
  const mapRadarEl = document.getElementById('map-radar-chart');
  if (mapRadarEl) ro.observe(mapRadarEl);
}
