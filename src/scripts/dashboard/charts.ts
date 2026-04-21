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

// -- Chart option generators (stubs) --

/** Generate ECharts radar chart option for a single country. */
export function makeRadarOption(_country: ChartCountry): Record<string, unknown> {
  throw new Error('Not implemented: makeRadarOption');
}

/** Generate ECharts grouped bar chart option for 1-4 countries. */
export function makeBarOption(_countries: ChartCountry[]): Record<string, unknown> {
  throw new Error('Not implemented: makeBarOption');
}

/** Generate horizontal bar chart option for mobile layout. */
export function getMobileBarOption(_countries: ChartCountry[]): Record<string, unknown> {
  throw new Error('Not implemented: getMobileBarOption');
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
  _dimKey: DimensionKey,
  _score: number,
): BindingConstraintCallout {
  throw new Error('Not implemented: getBindingConstraintCallout');
}

// -- Attribution --

export interface MetadataInput {
  generatedAt: string;
  worldBankLastUpdated: string;
}

/** Format data attribution string from metadata. */
export function getAttribution(_metadata: MetadataInput): string {
  throw new Error('Not implemented: getAttribution');
}
