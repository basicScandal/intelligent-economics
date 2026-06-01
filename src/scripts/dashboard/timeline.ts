/**
 * Timeline module for time-series visualization.
 * Loaded dynamically by init.ts when year controls are first activated.
 * Handles: line chart rendering, playback controls, year slider sync.
 */

import type { DashboardStore } from './state';
import { LATEST_YEAR, YEAR_RANGE } from './state';
import type { SlimCountry } from './search';
import type { HistoricalData } from '../../lib/historical-data';
import { getCountryTimeSeries } from '../../lib/historical-data';
import { makeTimeSeriesOption, SPEEDS, COMPARISON_COLORS, siteTheme } from './charts';
import type { TimeSeriesCountry } from './charts';

// Module-level state
let intervalId: number | null = null;
let currentSpeed: string = '1x';
const SPEED_CYCLE: string[] = ['1x', '2x', '0.5x'];
let timeseriesChart: any = null;
let mapTimeseriesChart: any = null;

/**
 * Initialize timeline controls and chart rendering.
 * Wires play/pause, speed toggle, year slider, and store subscriptions.
 */
export function initTimeline(
  echarts: any,
  store: DashboardStore,
  countries: SlimCountry[],
  historicalData: HistoricalData,
): void {
  const years = Array.from({ length: 11 }, (_, i) => YEAR_RANGE[0] + i);

  // -- Initialize ECharts instances --

  const tsEl = document.getElementById('timeseries-chart');
  if (tsEl) {
    timeseriesChart = echarts.init(tsEl, siteTheme, { renderer: 'svg' });

    // ResizeObserver for responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      timeseriesChart?.resize();
    });
    resizeObserver.observe(tsEl);
  }

  const mapTsEl = document.getElementById('map-timeseries-chart');
  if (mapTsEl) {
    mapTimeseriesChart = echarts.init(mapTsEl, siteTheme, { renderer: 'svg' });

    const resizeObserver = new ResizeObserver(() => {
      mapTimeseriesChart?.resize();
    });
    resizeObserver.observe(mapTsEl);
  }

  // -- Wire play/pause button --

  const playButton = document.getElementById('year-play');
  const playIcon = document.getElementById('year-play-icon');

  function startPlayback() {
    stopPlayback(); // prevent stacking (Pitfall 3)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return; // do not auto-start with reduced motion

    // Update UI to show pause icon
    if (playIcon) {
      playIcon.innerHTML = '<rect x="3" y="2" width="4" height="12"/><rect x="9" y="2" width="4" height="12"/>';
    }
    if (playButton) {
      playButton.setAttribute('aria-label', 'Pause year animation');
    }

    intervalId = window.setInterval(() => {
      const currentYear = store.get().year ?? YEAR_RANGE[1];
      const currentIdx = years.indexOf(currentYear);

      if (currentIdx >= years.length - 1) {
        // At end, stop playback
        stopPlayback();
        return;
      }

      store.setYear(years[currentIdx + 1]);
    }, SPEEDS[currentSpeed]);
  }

  function stopPlayback() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    // Update UI to show play icon
    if (playIcon) {
      playIcon.innerHTML = '<polygon points="4,2 14,8 4,14" />';
    }
    if (playButton) {
      playButton.setAttribute('aria-label', 'Play year animation');
    }
  }

  if (playButton) {
    playButton.addEventListener('click', () => {
      if (intervalId === null) {
        startPlayback();
      } else {
        stopPlayback();
      }
    });
  }

  // -- Wire speed badge --

  const speedButton = document.getElementById('year-speed');
  const speedLabel = document.getElementById('year-speed-label');

  if (speedButton) {
    speedButton.addEventListener('click', () => {
      const currentIdx = SPEED_CYCLE.indexOf(currentSpeed);
      const nextIdx = (currentIdx + 1) % SPEED_CYCLE.length;
      currentSpeed = SPEED_CYCLE[nextIdx];

      if (speedLabel) {
        speedLabel.textContent = currentSpeed;
      }

      speedButton.setAttribute('aria-label', `Animation speed: ${currentSpeed}. Click to change`);

      // If currently playing, restart interval with new speed
      if (intervalId !== null) {
        clearInterval(intervalId);
        const newInterval = setInterval(() => {
          const currentYear = store.get().year ?? YEAR_RANGE[1];
          const currentIdx = years.indexOf(currentYear);

          if (currentIdx >= years.length - 1) {
            stopPlayback();
            return;
          }

          store.setYear(years[currentIdx + 1]);
        }, SPEEDS[currentSpeed]);
        intervalId = newInterval;
      }
    });
  }

  // -- Wire year slider --

  const slider = document.getElementById('year-slider') as HTMLInputElement;

  if (slider) {
    slider.addEventListener('input', () => {
      const year = parseInt(slider.value, 10);
      store.setYear(year);
    });
  }

  // -- Wire year-bar reset button --

  const yearBarReset = document.getElementById('year-bar-reset');
  if (yearBarReset) {
    yearBarReset.addEventListener('click', () => {
      stopPlayback();
      store.setYear(null);
    });
  }

  // -- Subscribe to store for chart updates --

  store.subscribe((state) => {
    const yearCurrent = document.getElementById('year-current');

    // Build time-series countries
    if (state.primary) {
      const tsCountries: TimeSeriesCountry[] = [];

      // Primary country in cyan
      const primaryTimeSeries = getCountryTimeSeries(historicalData, state.primary.code);
      if (primaryTimeSeries.length > 0) {
        tsCountries.push({
          name: state.primary.name,
          code: state.primary.code,
          color: '#00c8ff',
          data: primaryTimeSeries.map((entry) => ({
            year: entry.year,
            mind: entry.scores.mind,
            m: entry.scores.m,
            i: entry.scores.i,
            n: entry.scores.n,
            d: entry.scores.d,
          })),
        });
      }

      // Comparison countries in COMPARISON_COLORS
      for (let i = 0; i < state.comparison.length; i++) {
        const comp = state.comparison[i];
        if (comp.code === state.primary.code) continue; // skip primary

        const compTimeSeries = getCountryTimeSeries(historicalData, comp.code);
        if (compTimeSeries.length > 0) {
          tsCountries.push({
            name: comp.name,
            code: comp.code,
            color: COMPARISON_COLORS[i % COMPARISON_COLORS.length],
            data: compTimeSeries.map((entry) => ({
              year: entry.year,
              mind: entry.scores.mind,
              m: entry.scores.m,
              i: entry.scores.i,
              n: entry.scores.n,
              d: entry.scores.d,
            })),
          });
        }
      }

      // Render line charts
      if (tsCountries.length > 0) {
        const option = makeTimeSeriesOption(tsCountries, state.year);
        if (timeseriesChart) {
          timeseriesChart.setOption(option);
        }
        if (mapTimeseriesChart) {
          mapTimeseriesChart.setOption(option);
        }

        // Show time-series sections
        const tsSec = document.getElementById('timeseries-section');
        if (tsSec) tsSec.classList.remove('hidden');

        const mapTsSec = document.getElementById('map-timeseries-section');
        if (mapTsSec) mapTsSec.classList.remove('hidden');

        // Update screen reader text
        const tsChartSr = document.getElementById('timeseries-chart-sr');
        if (tsChartSr) {
          const countriesText = tsCountries.map((c) => c.name).join(', ');
          tsChartSr.textContent = `${countriesText} MIND scores from 2014 to 2024.`;
        }
      } else {
        // Hide if no data
        const tsSec = document.getElementById('timeseries-section');
        if (tsSec) tsSec.classList.add('hidden');

        const mapTsSec = document.getElementById('map-timeseries-section');
        if (mapTsSec) mapTsSec.classList.add('hidden');
      }
    } else {
      // No primary: hide time-series sections
      const tsSec = document.getElementById('timeseries-section');
      if (tsSec) tsSec.classList.add('hidden');

      const mapTsSec = document.getElementById('map-timeseries-section');
      if (mapTsSec) mapTsSec.classList.add('hidden');
    }

    // Update year control UI
    if (slider && state.year !== null) {
      slider.value = String(state.year);
      slider.setAttribute('aria-valuenow', String(state.year));
    }

    if (yearCurrent && state.year !== null) {
      yearCurrent.textContent = String(state.year);
    }

    // Show/hide year controls bar
    const yearBar = document.getElementById('year-bar');
    const yearBarLabel = document.getElementById('year-bar-label');
    const yearControls = document.getElementById('year-controls');

    if (state.year !== null) {
      if (yearBar) yearBar.classList.remove('hidden');
      if (yearBarLabel) yearBarLabel.textContent = `Viewing: ${state.year}`;
      if (yearControls) yearControls.classList.remove('hidden');
    } else {
      if (yearBar) yearBar.classList.add('hidden');
      if (yearControls) yearControls.classList.add('hidden');
    }
  });
}

/**
 * Stop any active playback animation.
 * Called externally when switching tabs away from time-series.
 */
export function stopPlayback(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  const playIcon = document.getElementById('year-play-icon');
  if (playIcon) {
    playIcon.innerHTML = '<polygon points="4,2 14,8 4,14" />';
  }

  const playButton = document.getElementById('year-play');
  if (playButton) {
    playButton.setAttribute('aria-label', 'Play year animation');
  }
}
