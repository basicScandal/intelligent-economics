/**
 * Dashboard chart configuration generators.
 *
 * Pure functions that produce ECharts option objects for radar and bar charts.
 * No DOM access, no side effects — fully testable in vitest.
 */

import type { DimensionKey } from '../../lib/mind-score';

// -- Constants --

/** Dimension colors matching Zone Zero palette. */
export const DIM_COLORS: Record<DimensionKey, string> = {
  m: '#00ff88',
  i: '#00c8ff',
  n: '#7b4bff',
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
