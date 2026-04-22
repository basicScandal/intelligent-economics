/**
 * Dashboard island initialization script.
 *
 * Uses TWO separate loading paths (not a single island wrapper):
 * - ECharts: IntersectionObserver on #dashboard-data (client:visible semantics)
 * - Search: requestIdleCallback (client:idle semantics)
 *
 * Both paths share the same state store for coordinated updates.
 * No top-level static imports of heavy modules (echarts, charts, search).
 */

// Eagerly import state (tiny, no heavy deps)
import { createDashboardState, type Scale } from './state';
import { decodeDashboardURL, pushDashboardURL } from './url-state';
import type { SlimCountry } from './search';
import type { DimensionKey } from '../../lib/mind-score';

// ── 1. Read data eagerly (just JSON parse, no heavy modules) ──

const dataEl = document.getElementById('dashboard-data');
const countries: SlimCountry[] = dataEl ? JSON.parse(dataEl.dataset.scores!) : [];
const store = createDashboardState();

// ── 2. Mobile detection (eager, lightweight) ──

const mobileQuery = window.matchMedia('(max-width: 767px)');
store.setMobile(mobileQuery.matches);
mobileQuery.addEventListener('change', (e) => store.setMobile(e.matches));

// ── 3. ECharts loading path — IntersectionObserver (client:visible semantics) ──

let radarChart: any = null;
let barChart: any = null;

const chartObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      chartObserver.disconnect();

      // Dynamic import — only loads ECharts when dashboard is visible
      Promise.all([
        import('./echarts-setup'),
        import('./charts'),
      ]).then(
        ([
          { echarts },
          {
            makeRadarOption,
            makeBarOption,
            getMobileBarOption,
            getBindingConstraintCallout,
            makeComparisonRadarOption,
            siteTheme,
            DIM_COLORS,
          },
        ]) => {
          const radarEl = document.getElementById('radar-chart');
          const barEl = document.getElementById('bar-chart');

          if (radarEl) {
            radarChart = echarts.init(radarEl, siteTheme, { renderer: 'svg' });
          }
          if (barEl) {
            barChart = echarts.init(barEl, siteTheme, { renderer: 'svg' });
          }

          // Comparison radar chart
          let comparisonRadarChart: any = null;
          const compRadarEl = document.getElementById('comparison-radar');
          if (compRadarEl) {
            comparisonRadarChart = echarts.init(compRadarEl, siteTheme, { renderer: 'svg' });
          }

          // ResizeObserver for chart containers
          const ro = new ResizeObserver(() => {
            radarChart?.resize();
            barChart?.resize();
            comparisonRadarChart?.resize();
            cityRadarChart?.resize();
          });
          if (radarEl) ro.observe(radarEl);
          if (barEl) ro.observe(barEl);
          if (compRadarEl) ro.observe(compRadarEl);

          // ── City detail radar ──
          let cityRadarChart: any = null;
          const cityRadarEl = document.getElementById('city-radar-chart');
          if (cityRadarEl) {
            cityRadarChart = echarts.init(cityRadarEl, siteTheme, { renderer: 'svg' });
            ro.observe(cityRadarEl);
          }

          // City card click handlers
          const cityGrid = document.getElementById('city-grid');
          const cityDetail = document.getElementById('city-detail');
          const cityDetailName = document.getElementById('city-detail-name');
          const cityDetailClose = document.getElementById('city-detail-close');
          const cityBcName = document.getElementById('city-bc-name');
          const cityBcScore = document.getElementById('city-bc-score');
          const cityBcText = document.getElementById('city-bc-text');
          const cityBcBorder = document.getElementById('city-binding-constraint');

          if (cityGrid && cityDetail) {
            cityGrid.addEventListener('click', (e) => {
              const card = (e.target as HTMLElement).closest<HTMLElement>('[data-city-id]');
              if (!card) return;

              const m = Number(card.dataset.m);
              const i = Number(card.dataset.i);
              const n = Number(card.dataset.n);
              const d = Number(card.dataset.d);
              const name = card.dataset.cityName || '';

              if (cityRadarChart) {
                cityRadarChart.setOption(makeRadarOption({ name, m, i, n, d }));
                cityRadarChart.getDom().setAttribute('aria-label', `MIND radar chart for ${name}`);
              }

              // Binding constraint callout
              const bcKey = (['m', 'i', 'n', 'd'] as const).reduce((a, b) =>
                ({ m, i, n, d }[a] <= { m, i, n, d }[b] ? a : b,
              ));
              const bcScoreVal = { m, i, n, d }[bcKey];
              const bc = getBindingConstraintCallout(bcKey, Math.round(bcScoreVal));
              if (cityBcName) cityBcName.textContent = bc.dimension;
              if (cityBcScore) cityBcScore.textContent = `(${Math.round(bcScoreVal)})`;
              if (cityBcText) cityBcText.textContent = bc.text;
              if (cityBcBorder) cityBcBorder.style.borderLeftColor = DIM_COLORS[bcKey];
              if (cityDetailName) cityDetailName.textContent = `${name} MIND Profile`;

              cityDetail.classList.remove('hidden');
              cityDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

              // Resize chart after showing (was hidden, needs resize)
              setTimeout(() => cityRadarChart?.resize(), 100);
            });

            // Close button
            cityDetailClose?.addEventListener('click', () => {
              cityDetail.classList.add('hidden');
            });

            // Keyboard support for city cards
            cityGrid.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const card = (e.target as HTMLElement).closest<HTMLElement>('[data-city-id]');
                if (card) {
                  e.preventDefault();
                  card.click();
                }
              }
            });
          }

          // Subscribe to state changes for chart rendering
          store.subscribe((state) => {
            // ── Radar chart ──
            if (state.primary && state.primary.m !== null) {
              document.getElementById('country-detail')?.classList.remove('hidden');
              if (radarChart) {
                radarChart.setOption(
                  makeRadarOption({
                    name: state.primary.name,
                    m: state.primary.m ?? 0,
                    i: state.primary.i ?? 0,
                    n: state.primary.n ?? 0,
                    d: state.primary.d ?? 0,
                  }),
                );
                radarChart
                  .getDom()
                  .setAttribute(
                    'aria-label',
                    `MIND dimension radar chart for ${state.primary.name}`,
                  );
              }

              // Update binding constraint via DOM IDs
              const bcDimKey = state.primary.bc as DimensionKey;
              const bcScore = state.primary[bcDimKey] ?? 0;
              const bc = getBindingConstraintCallout(bcDimKey, Math.round(bcScore));

              const bcEl = document.getElementById('binding-constraint');
              const bcNameEl = document.getElementById('bc-dimension-name');
              const bcScoreEl = document.getElementById('bc-score');
              const bcTextEl = document.getElementById('bc-text');
              const bcBorderEl = document.getElementById('bc-border');

              if (bcEl) bcEl.classList.remove('hidden');
              if (bcNameEl) bcNameEl.textContent = bc.dimension;
              if (bcScoreEl) bcScoreEl.textContent = `(${Math.round(bcScore)})`;
              if (bcTextEl) bcTextEl.textContent = bc.text;
              if (bcBorderEl) bcBorderEl.style.borderLeftColor = DIM_COLORS[bcDimKey];

              // Zone Zero deep link (per DASH-09)
              const zzLink = document.getElementById('zone-zero-link') as HTMLAnchorElement | null;
              const zzText = document.getElementById('zone-zero-link-text');
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
            } else {
              document.getElementById('country-detail')?.classList.add('hidden');
              // Hide Zone Zero link when no primary selected
              document.getElementById('zone-zero-link')?.classList.add('hidden');
            }

            // ── Bar chart + Comparison radar ──
            if (state.comparison.length > 0) {
              document.getElementById('comparison-section')?.classList.remove('hidden');
              const validCountries = state.comparison.filter((c) => c.mind !== null);

              // Comparison radar — overlaid polygons (per DASH-08)
              if (validCountries.length >= 2 && comparisonRadarChart) {
                const radarCountries = validCountries.map((c) => ({
                  name: c.name,
                  m: c.m ?? 0,
                  i: c.i ?? 0,
                  n: c.n ?? 0,
                  d: c.d ?? 0,
                }));
                comparisonRadarChart.setOption(makeComparisonRadarOption(radarCountries), true);
                comparisonRadarChart
                  .getDom()
                  .setAttribute(
                    'aria-label',
                    `MIND comparison radar for ${validCountries.map((c) => c.name).join(', ')}`,
                  );
                document.getElementById('comparison-radar')?.classList.remove('hidden');
              } else {
                document.getElementById('comparison-radar')?.classList.add('hidden');
              }

              if (validCountries.length > 0 && barChart) {
                const chartCountries = validCountries.map((c) => ({
                  name: c.name,
                  m: c.m ?? 0,
                  i: c.i ?? 0,
                  n: c.n ?? 0,
                  d: c.d ?? 0,
                }));
                const option = state.isMobile
                  ? getMobileBarOption(chartCountries)
                  : makeBarOption(chartCountries);
                barChart.setOption(option, true);
                barChart.resize();
                barChart
                  .getDom()
                  .setAttribute(
                    'aria-label',
                    `MIND dimension comparison for ${validCountries.map((c) => c.name).join(', ')}`,
                  );
              }

              // Render comparison chips
              renderComparisonChips(state.comparison);
            } else {
              document.getElementById('comparison-section')?.classList.add('hidden');
            }
          });

          // URL state sync — update browser URL on state changes (per DASH-10)
          store.subscribe((state) => {
            const urlState = {
              primary: state.primary?.code ?? null,
              compare: state.comparison.map((c) => c.code),
            };
            pushDashboardURL(urlState);
          });

          // If state already has a primary (search loaded first), render now
          store.notify();

          // URL hydration — restore state from query params on page load (per DASH-10)
          const urlState = decodeDashboardURL(window.location.search);
          if (urlState.primary) {
            const primaryCountry = countries.find((c) => c.code === urlState.primary);
            if (primaryCountry) {
              store.selectPrimary(primaryCountry);
              // Update search input to show selected country name
              const searchInput = document.getElementById('country-search-input') as HTMLInputElement | null;
              if (searchInput) searchInput.value = primaryCountry.name;
            }
          }
          if (urlState.compare.length > 0) {
            for (const code of urlState.compare) {
              const country = countries.find((c) => c.code === code);
              if (country) store.addToComparison(country);
            }
          }
        },
      );
    }
  },
  { rootMargin: '200px' },
);

if (dataEl) chartObserver.observe(dataEl);

// ── Comparison chips container ──

let chipsContainer: HTMLDivElement | null = null;

function ensureChipsContainer(): HTMLDivElement {
  if (chipsContainer) return chipsContainer;

  chipsContainer = document.createElement('div');
  chipsContainer.id = 'comparison-chips';
  chipsContainer.className = 'flex flex-wrap gap-2 mb-4';
  chipsContainer.setAttribute('aria-label', 'Selected countries for comparison');

  const compSection = document.getElementById('comparison-section');
  const barChart = document.getElementById('bar-chart');
  if (compSection && barChart) {
    compSection.insertBefore(chipsContainer, barChart);
  }

  return chipsContainer;
}

function renderComparisonChips(comparison: SlimCountry[]) {
  const container = ensureChipsContainer();
  container.innerHTML = '';

  comparison.forEach((country) => {
    const chip = document.createElement('span');
    chip.className =
      'inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-sm text-white';

    const nameSpan = document.createElement('span');
    nameSpan.textContent = country.name;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'text-[#8888aa] hover:text-white ml-1';
    removeBtn.setAttribute('aria-label', `Remove ${country.name}`);
    removeBtn.textContent = '\u00d7';
    removeBtn.addEventListener('click', () => {
      store.removeFromComparison(country.code);
    });

    chip.appendChild(nameSpan);
    chip.appendChild(removeBtn);
    container.appendChild(chip);
  });
}

// ── 4. Search loading path — requestIdleCallback (client:idle semantics) ──

const loadSearch = () => {
  import('./search').then(({ filterCountries, handleSearchKeydown }) => {
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) return;

    // Create search input
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = `Search ${countries.length} countries...`;
    input.className =
      'w-full px-5 py-3.5 bg-[#0a0a12] border border-white/15 rounded-xl text-white placeholder-[#6b6b88] focus:border-white/30 focus:outline-none text-lg transition-colors';
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-owns', 'search-dropdown');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-label', 'Search countries by name');
    input.id = 'country-search-input';

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'search-dropdown';
    dropdown.className =
      'hidden absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[#0a0a12] border border-white/10 rounded-lg shadow-lg';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Country search results');

    // Wrap in relative container
    const wrapper = document.createElement('div');
    wrapper.className = 'relative';
    wrapper.appendChild(input);
    wrapper.appendChild(dropdown);

    // Replace existing content in search-container
    searchContainer.innerHTML = '';
    searchContainer.appendChild(wrapper);

    let activeIndex = -1;
    let currentResults: SlimCountry[] = [];

    function renderDropdown(results: SlimCountry[]) {
      currentResults = results.slice(0, 20); // Limit visible results
      dropdown.innerHTML = '';

      if (currentResults.length === 0 && input.value.trim() !== '') {
        const noResults = document.createElement('div');
        noResults.className = 'px-4 py-3 text-[#8888aa] text-sm';
        noResults.textContent = 'No countries found';
        dropdown.appendChild(noResults);
        dropdown.classList.remove('hidden');
        input.setAttribute('aria-expanded', 'true');
        return;
      }

      if (currentResults.length === 0) {
        dropdown.classList.add('hidden');
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      currentResults.forEach((country, idx) => {
        const item = document.createElement('div');
        item.className =
          'flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors';
        item.setAttribute('role', 'option');
        item.id = `search-option-${idx}`;

        const leftSide = document.createElement('div');
        leftSide.className = 'flex items-center gap-3';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'text-white';
        nameSpan.textContent = country.name;
        leftSide.appendChild(nameSpan);

        const scoreSpan = document.createElement('span');
        if (country.mind !== null) {
          scoreSpan.className = 'text-[#00ff88] text-sm';
          scoreSpan.textContent = String(Math.round(country.mind));
        } else {
          scoreSpan.className = 'text-[#8888aa] text-sm italic';
          scoreSpan.textContent = 'Incomplete data';
        }
        leftSide.appendChild(scoreSpan);

        item.appendChild(leftSide);

        // "Add to comparison" button for countries with valid MIND scores
        if (country.mind !== null) {
          const addBtn = document.createElement('button');
          addBtn.className =
            'text-xs text-[#8888aa] hover:text-[#00ff88] border border-white/10 rounded px-2 py-0.5 transition-colors';
          addBtn.textContent = '+ Compare';
          addBtn.setAttribute('aria-label', `Add ${country.name} to comparison`);
          addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            store.addToComparison(country);
          });
          item.appendChild(addBtn);
        }

        // Click to select as primary
        item.addEventListener('click', () => {
          store.selectPrimary(country);
          input.value = country.name;
          dropdown.classList.add('hidden');
          input.setAttribute('aria-expanded', 'false');
          activeIndex = -1;
        });

        if (idx === activeIndex) {
          item.classList.add('bg-white/10');
          item.setAttribute('aria-selected', 'true');
        }

        dropdown.appendChild(item);
      });

      dropdown.classList.remove('hidden');
      input.setAttribute('aria-expanded', 'true');
    }

    function updateActiveDescendant() {
      if (activeIndex >= 0) {
        input.setAttribute('aria-activedescendant', `search-option-${activeIndex}`);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    // Input event: filter countries
    input.addEventListener('input', () => {
      activeIndex = -1;
      const results = filterCountries(countries, input.value);
      renderDropdown(results);
      updateActiveDescendant();
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }

      const maxIndex = currentResults.length - 1;

      if (e.key === 'Enter' && activeIndex >= 0 && activeIndex <= maxIndex) {
        e.preventDefault();
        const selected = currentResults[activeIndex];
        if (selected) {
          store.selectPrimary(selected);
          input.value = selected.name;
          dropdown.classList.add('hidden');
          input.setAttribute('aria-expanded', 'false');
          activeIndex = -1;
          updateActiveDescendant();
        }
        return;
      }

      if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        input.setAttribute('aria-expanded', 'false');
        activeIndex = -1;
        updateActiveDescendant();
        return;
      }

      const newIndex = handleSearchKeydown(e.key, activeIndex, maxIndex);
      if (newIndex !== activeIndex) {
        activeIndex = newIndex;
        renderDropdown(currentResults);
        updateActiveDescendant();

        // Scroll active item into view
        const activeEl = document.getElementById(`search-option-${activeIndex}`);
        activeEl?.scrollIntoView({ block: 'nearest' });
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target as Node)) {
        dropdown.classList.add('hidden');
        input.setAttribute('aria-expanded', 'false');
        activeIndex = -1;
      }
    });

    // Focus input to indicate readiness
    input.focus();
  });
};

if ('requestIdleCallback' in window) {
  requestIdleCallback(loadSearch);
} else {
  setTimeout(loadSearch, 200); // fallback for Safari
}

// ── 5. Scale tab switching (eager — DOM only, no heavy deps) ──

const scaleTabs = document.getElementById('scale-tabs');
if (scaleTabs) {
  const tabs = scaleTabs.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  const panels = document.querySelectorAll<HTMLElement>('[data-scale-panel]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const scale = tab.dataset.scale as Scale;
      if (!scale) return;

      // Update tab active states
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('bg-white/10', 'text-white');
        t.classList.add('text-[#8888aa]');
      });
      tab.setAttribute('aria-selected', 'true');
      tab.classList.add('bg-white/10', 'text-white');
      tab.classList.remove('text-[#8888aa]');

      // Show/hide panels
      panels.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.scalePanel !== scale);
      });

      store.setScale(scale);
    });
  });
}

// ── 6. Firm self-assessment slider wiring (eager — lightweight imports only) ──

const firmSliders = {
  m: document.getElementById('firm-m') as HTMLInputElement | null,
  i: document.getElementById('firm-i') as HTMLInputElement | null,
  n: document.getElementById('firm-n') as HTMLInputElement | null,
  d: document.getElementById('firm-d') as HTMLInputElement | null,
};
const firmScoreEl = document.getElementById('firm-score');
const firmValEls = {
  m: document.getElementById('firm-m-val'),
  i: document.getElementById('firm-i-val'),
  n: document.getElementById('firm-n-val'),
  d: document.getElementById('firm-d-val'),
};
const firmBcName = document.getElementById('firm-bc-name');
const firmBcScore = document.getElementById('firm-bc-score');
const firmBcText = document.getElementById('firm-bc-text');
const firmBcEl = document.getElementById('firm-bc');

// Only wire if firm sliders exist (they're in a hidden panel, so check)
if (firmSliders.m && firmSliders.i && firmSliders.n && firmSliders.d) {
  // Import calcScore eagerly — it's tiny (no heavy deps)
  Promise.all([
    import('../../lib/mind-score'),
    import('./charts'),
  ]).then(([{ calcScore, getBindingConstraint }, { getBindingConstraintCallout, DIM_COLORS }]) => {
    function updateFirmScore() {
      const vals = {
        m: Number(firmSliders.m!.value),
        i: Number(firmSliders.i!.value),
        n: Number(firmSliders.n!.value),
        d: Number(firmSliders.d!.value),
      };

      // Update value displays
      if (firmValEls.m) firmValEls.m.textContent = String(vals.m);
      if (firmValEls.i) firmValEls.i.textContent = String(vals.i);
      if (firmValEls.n) firmValEls.n.textContent = String(vals.n);
      if (firmValEls.d) firmValEls.d.textContent = String(vals.d);

      // Compute MIND score
      const score = calcScore(vals);
      if (firmScoreEl) firmScoreEl.textContent = String(score);

      // Binding constraint
      const bcKey = getBindingConstraint(vals);
      const bcScore = vals[bcKey];
      const bc = getBindingConstraintCallout(bcKey, bcScore);
      if (firmBcName) firmBcName.textContent = bc.dimension;
      if (firmBcScore) firmBcScore.textContent = `(${bcScore})`;
      if (firmBcText) firmBcText.textContent = bc.text;
      if (firmBcEl) firmBcEl.style.borderLeftColor = DIM_COLORS[bcKey];
    }

    // Attach input listeners
    (['m', 'i', 'n', 'd'] as const).forEach((dim) => {
      firmSliders[dim]!.addEventListener('input', updateFirmScore);
    });

    // Initial calculation (sliders start at 50)
    updateFirmScore();
  });
}
