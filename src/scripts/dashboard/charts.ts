/**
 * Dashboard chart configuration generators.
 *
 * Pure functions that produce ECharts option objects for radar and bar charts.
 * No DOM access, no side effects — fully testable in vitest.
 */

import type { DimensionKey } from '../../lib/mind-score';
import type { SlimCountry } from './search';
import { GEOJSON_NAME_MAP } from '../../data/geo-name-map';

// -- Constants --

/** Dimension colors matching Zone Zero palette. */
export const DIM_COLORS: Record<DimensionKey, string> = {
  m: '#00ff88',
  i: '#00c8ff',
  n: '#8b5fff',
  d: '#ffb400',
};

/** Full dimension names for labels. */
export const DIM_NAMES: Record<DimensionKey, string> = {
  m: 'Material',
  i: 'Intelligence',
  n: 'Network',
  d: 'Diversity',
};

/** ECharts theme object for dark site background. */
export const siteTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
  },
};

// -- Country data shape for chart functions --
export interface ChartCountry {
  name: string;
  m: number;
  i: number;
  n: number;
  d: number;
}

// -- Dimension keys in canonical order --
const DIM_KEYS: DimensionKey[] = ['m', 'i', 'n', 'd'];
const DIM_LABELS = DIM_KEYS.map((k) => DIM_NAMES[k]);

/** Fixed palette for multi-country comparison overlays. */
export const COMPARISON_COLORS: string[] = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'];

// -- Chart option generators --

/** Generate ECharts radar chart option for a single country. */
export function makeRadarOption(country: ChartCountry): Record<string, unknown> {
  return {
    aria: { enabled: true },
    ...siteTheme,
    radar: {
      shape: 'polygon',
      splitNumber: 5,
      indicator: DIM_KEYS.map((k) => ({
        name: DIM_NAMES[k],
        max: 100,
        color: DIM_COLORS[k],
      })),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      splitArea: { show: false },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [country.m, country.i, country.n, country.d],
            name: country.name,
            areaStyle: { opacity: 0.25 },
            lineStyle: { width: 2 },
          },
        ],
      },
    ],
  };
}

/** Generate ECharts comparison radar chart option for N overlapping countries. */
export function makeComparisonRadarOption(countries: ChartCountry[]): Record<string, unknown> {
  return {
    aria: { enabled: true },
    ...siteTheme,
    legend: {
      data: countries.map((c) => c.name),
      textStyle: { color: 'rgba(255,255,255,0.85)' },
    },
    radar: {
      shape: 'polygon',
      splitNumber: 5,
      indicator: DIM_KEYS.map((k) => ({
        name: DIM_NAMES[k],
        max: 100,
        color: DIM_COLORS[k],
      })),
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      splitArea: { show: false },
    },
    series: [
      {
        type: 'radar',
        data: countries.map((c, idx) => ({
          value: [c.m, c.i, c.n, c.d],
          name: c.name,
          areaStyle: { opacity: 0.25, color: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] },
          lineStyle: { width: 2, color: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] },
          itemStyle: { color: COMPARISON_COLORS[idx % COMPARISON_COLORS.length] },
        })),
      },
    ],
  };
}

/** Generate ECharts grouped bar chart option for 1-4 countries. */
export function makeBarOption(countries: ChartCountry[]): Record<string, unknown> {
  return {
    aria: { enabled: true },
    ...siteTheme,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { containLabel: true },
    xAxis: {
      type: 'category',
      data: DIM_LABELS,
    },
    yAxis: {
      type: 'value',
      max: 100,
    },
    series: countries.map((c) => ({
      name: c.name,
      type: 'bar',
      data: [c.m, c.i, c.n, c.d],
    })),
  };
}

/** Generate horizontal bar chart option for mobile layout. */
export function getMobileBarOption(countries: ChartCountry[]): Record<string, unknown> {
  return {
    aria: { enabled: true },
    ...siteTheme,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { containLabel: true },
    yAxis: {
      type: 'category',
      data: DIM_LABELS,
    },
    xAxis: {
      type: 'value',
      max: 100,
    },
    series: countries.map((c) => ({
      name: c.name,
      type: 'bar',
      data: [c.m, c.i, c.n, c.d],
    })),
  };
}

// -- Binding constraint callout --

/** Insight text templates matching zone-zero.ts DIM_INSIGHTS pattern. */
const DIM_INSIGHTS: Record<DimensionKey, (v: number) => string> = {
  m: (v) =>
    `Material (${v}) is the binding constraint. Physical infrastructure is the substrate everything else runs on — raise it first.`,
  i: (v) =>
    `Intelligence (${v}) is the binding constraint. Without open knowledge infrastructure, the other capitals cannot compound.`,
  n: (v) =>
    `Network (${v}) is the binding constraint. Isolated nodes cannot multiply. Cooperative density is the transmission mechanism.`,
  d: (v) =>
    `Diversity (${v}) is the binding constraint. Monocultures are fragile. Variety is the system's immune response to shocks.`,
};

export interface BindingConstraintCallout {
  dimension: string;
  text: string;
}

/** Get binding constraint callout with dimension name and insight text. */
export function getBindingConstraintCallout(
  dimKey: DimensionKey,
  score: number,
): BindingConstraintCallout {
  return {
    dimension: DIM_NAMES[dimKey],
    text: DIM_INSIGHTS[dimKey](score),
  };
}

// -- Attribution --

export interface MetadataInput {
  generatedAt: string;
  worldBankLastUpdated: string;
}

/** Format data attribution string from metadata. */
export function getAttribution(metadata: MetadataInput): string {
  const accessedDate = new Date(metadata.generatedAt);
  const formatted = accessedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
  return `Source: World Bank World Development Indicators, ${metadata.worldBankLastUpdated}. Accessed ${formatted}.`;
}

// -- Map chart option generator --

/** Dimension type for map visualization: composite MIND or individual dimension. */
export type MapDimension = 'mind' | DimensionKey;

/**
 * Generate ECharts choropleth map option for world MIND scores.
 *
 * Pure function that produces a complete ECharts option object for a world map
 * colored by MIND composite or individual dimension scores. Uses GEOJSON_NAME_MAP
 * to bridge ECharts GeoJSON feature names to World Bank country names.
 *
 * @param countries - Array of SlimCountry objects (from mind-scores.json via getSlimPayload)
 * @param dimension - Which score to visualize: 'mind' for composite, or 'm'|'i'|'n'|'d' for individual
 * @returns ECharts option object ready for chart.setOption()
 */
export function makeMapOption(
  countries: SlimCountry[],
  dimension: MapDimension = 'mind',
): Record<string, unknown> {
  const dimColor = dimension === 'mind' ? '#00c8ff' : DIM_COLORS[dimension as DimensionKey];
  const dimLabel = dimension === 'mind' ? 'MIND Composite' : DIM_NAMES[dimension as DimensionKey];

  const data = countries
    .filter((c) => c[dimension] !== null)
    .map((c) => ({
      name: c.name,
      value: c[dimension],
      bc: c.bc,
      mind: c.mind,
      m: c.m,
      i: c.i,
      n: c.n,
      d: c.d,
    }));

  return {
    aria: { enabled: true },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const d = params.data;
        if (!d || d.value == null) return `${params.name}<br/>No data available`;
        const bcName = DIM_NAMES[d.bc as DimensionKey] || d.bc;
        return `<strong>${params.name}</strong><br/>`
          + `${dimLabel}: ${Math.round(d.value)}<br/>`
          + `Binding constraint: ${bcName}`;
      },
    },
    visualMap: {
      type: 'continuous',
      min: 0,
      max: 100,
      text: ['High', 'Low'],
      inRange: {
        color: ['#0a0a12', dimColor],
      },
      textStyle: { color: 'rgba(255,255,255,0.85)' },
      orient: 'vertical',
      right: 10,
      bottom: 20,
    },
    series: [{
      type: 'map',
      map: 'world',
      roam: true,
      nameMap: GEOJSON_NAME_MAP,
      data,
      emphasis: {
        itemStyle: {
          areaColor: undefined,
          borderColor: '#ffffff',
          borderWidth: 1.5,
        },
        label: { show: false },
      },
      select: {
        itemStyle: {
          borderColor: '#00c8ff',
          borderWidth: 2,
        },
      },
      selectedMode: 'single',
      itemStyle: {
        borderColor: '#1a1a2e',
        borderWidth: 0.5,
        areaColor: '#1a1a2e',
      },
      label: { show: false },
    }],
  };
}
