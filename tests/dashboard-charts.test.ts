import { describe, it, expect } from 'vitest';
import {
  makeRadarOption,
  makeBarOption,
  getMobileBarOption,
  makeComparisonRadarOption,
  COMPARISON_COLORS,
  getBindingConstraintCallout,
  getAttribution,
  DIM_COLORS,
  DIM_NAMES,
  siteTheme,
} from '../src/scripts/dashboard/charts';

const USA = { name: 'United States', m: 86.04, i: 64.43, n: 29.13, d: 40.43 };
const SGP = { name: 'Singapore', m: 81.49, i: 76.97, n: 39.95, d: 42.42 };
const ISL = { name: 'Iceland', m: 89.5, i: 66.91, n: 33.94, d: 48.92 };

describe('makeRadarOption', () => {
  it('produces config with radar.indicator having 4 items with max=100', () => {
    const opt = makeRadarOption(USA) as any;
    expect(opt.radar.indicator).toHaveLength(4);
    for (const ind of opt.radar.indicator) {
      expect(ind.max).toBe(100);
    }
  });

  it('series data array matches [m, i, n, d] order', () => {
    const opt = makeRadarOption(USA) as any;
    expect(opt.series[0].data[0].value).toEqual([86.04, 64.43, 29.13, 40.43]);
  });

  it('aria.enabled is true', () => {
    const opt = makeRadarOption(USA) as any;
    expect(opt.aria.enabled).toBe(true);
  });

  it('radar indicators have correct dimension names', () => {
    const opt = makeRadarOption(USA) as any;
    const names = opt.radar.indicator.map((ind: any) => ind.name);
    expect(names).toEqual(['Material', 'Intelligence', 'Network', 'Diversity']);
  });
});

describe('makeBarOption', () => {
  it('for 1 country produces 1 series with 4 data points', () => {
    const opt = makeBarOption([USA]) as any;
    expect(opt.series).toHaveLength(1);
    expect(opt.series[0].data).toHaveLength(4);
  });

  it('for 3 countries produces 3 series', () => {
    const opt = makeBarOption([USA, SGP, ISL]) as any;
    expect(opt.series).toHaveLength(3);
  });

  it('xAxis categories are Material, Intelligence, Network, Diversity', () => {
    const opt = makeBarOption([USA]) as any;
    expect(opt.xAxis.data).toEqual(['Material', 'Intelligence', 'Network', 'Diversity']);
  });

  it('aria.enabled is true', () => {
    const opt = makeBarOption([USA]) as any;
    expect(opt.aria.enabled).toBe(true);
  });
});

describe('getBindingConstraintCallout', () => {
  it('returns dimension name and insight for USA (n) with score 29.13', () => {
    const result = getBindingConstraintCallout('n', 29.13);
    expect(result.dimension).toBe('Network');
    expect(result.text).toContain('29.13');
    expect(result.text).toContain('binding constraint');
  });

  it('returns correct text for each dimension key', () => {
    const keys = ['m', 'i', 'n', 'd'] as const;
    const expectedDims = ['Material', 'Intelligence', 'Network', 'Diversity'];
    for (let idx = 0; idx < keys.length; idx++) {
      const result = getBindingConstraintCallout(keys[idx], 50);
      expect(result.dimension).toBe(expectedDims[idx]);
      expect(result.text).toContain('50');
      expect(result.text).toContain('binding constraint');
    }
  });
});

describe('getAttribution', () => {
  it('returns formatted string with year and date from metadata', () => {
    const result = getAttribution({
      generatedAt: '2026-04-21T17:48:09.493Z',
      worldBankLastUpdated: '2026-04-08',
    });
    expect(result).toContain('World Bank World Development Indicators');
    expect(result).toContain('2026-04-08');
    expect(result).toContain('Accessed');
    expect(result).toContain('2026');
  });
});

describe('getMobileBarOption', () => {
  it('has yAxis type=category and xAxis type=value (flipped)', () => {
    const opt = getMobileBarOption([USA]) as any;
    expect(opt.yAxis.type).toBe('category');
    expect(opt.xAxis.type).toBe('value');
  });

  it('yAxis data is dimension names', () => {
    const opt = getMobileBarOption([USA]) as any;
    expect(opt.yAxis.data).toEqual(['Material', 'Intelligence', 'Network', 'Diversity']);
  });
});

const NOR = { name: 'Norway', m: 91.22, i: 72.34, n: 36.81, d: 52.18 };

describe('makeComparisonRadarOption', () => {
  it('returns config with 1 series entry for 1 country, using COMPARISON_COLORS[0]', () => {
    const opt = makeComparisonRadarOption([USA]) as any;
    expect(opt.series[0].data).toHaveLength(1);
    expect(opt.series[0].data[0].lineStyle.color).toBe(COMPARISON_COLORS[0]);
    expect(opt.series[0].data[0].areaStyle.color).toBe(COMPARISON_COLORS[0]);
    expect(opt.series[0].data[0].itemStyle.color).toBe(COMPARISON_COLORS[0]);
  });

  it('returns config with 2 series entries for 2 countries, each with distinct colors', () => {
    const opt = makeComparisonRadarOption([USA, SGP]) as any;
    expect(opt.series[0].data).toHaveLength(2);
    expect(opt.series[0].data[0].lineStyle.color).toBe(COMPARISON_COLORS[0]);
    expect(opt.series[0].data[1].lineStyle.color).toBe(COMPARISON_COLORS[1]);
  });

  it('returns config with 4 series entries for 4 countries, all 4 COMPARISON_COLORS used', () => {
    const opt = makeComparisonRadarOption([USA, SGP, ISL, NOR]) as any;
    expect(opt.series[0].data).toHaveLength(4);
    for (let idx = 0; idx < 4; idx++) {
      expect(opt.series[0].data[idx].lineStyle.color).toBe(COMPARISON_COLORS[idx]);
    }
  });

  it('each series entry has areaStyle.opacity = 0.25', () => {
    const opt = makeComparisonRadarOption([USA, SGP]) as any;
    for (const entry of opt.series[0].data) {
      expect(entry.areaStyle.opacity).toBe(0.25);
    }
  });

  it('each series entry has lineStyle.width = 2', () => {
    const opt = makeComparisonRadarOption([USA, SGP]) as any;
    for (const entry of opt.series[0].data) {
      expect(entry.lineStyle.width).toBe(2);
    }
  });

  it('legend is present with country names', () => {
    const opt = makeComparisonRadarOption([USA, SGP]) as any;
    expect(opt.legend.data).toEqual(['United States', 'Singapore']);
    expect(opt.legend.textStyle.color).toBe('rgba(255,255,255,0.85)');
  });

  it('radar.indicator has 4 items with max=100, same as makeRadarOption', () => {
    const opt = makeComparisonRadarOption([USA]) as any;
    expect(opt.radar.indicator).toHaveLength(4);
    for (const ind of opt.radar.indicator) {
      expect(ind.max).toBe(100);
    }
  });

  it('aria.enabled is true', () => {
    const opt = makeComparisonRadarOption([USA]) as any;
    expect(opt.aria.enabled).toBe(true);
  });

  it('series data values match [m, i, n, d] for each country', () => {
    const opt = makeComparisonRadarOption([USA, SGP]) as any;
    expect(opt.series[0].data[0].value).toEqual([86.04, 64.43, 29.13, 40.43]);
    expect(opt.series[0].data[0].name).toBe('United States');
    expect(opt.series[0].data[1].value).toEqual([81.49, 76.97, 39.95, 42.42]);
    expect(opt.series[0].data[1].name).toBe('Singapore');
  });
});

describe('COMPARISON_COLORS', () => {
  it('has 4 hex color strings', () => {
    expect(COMPARISON_COLORS).toHaveLength(4);
    expect(COMPARISON_COLORS[0]).toBe('#FF6B6B');
    expect(COMPARISON_COLORS[1]).toBe('#4ECDC4');
    expect(COMPARISON_COLORS[2]).toBe('#FFE66D');
    expect(COMPARISON_COLORS[3]).toBe('#A8E6CF');
  });
});

describe('constants', () => {
  it('DIM_COLORS has 4 hex values', () => {
    expect(DIM_COLORS.m).toBe('#00ff88');
    expect(DIM_COLORS.i).toBe('#00c8ff');
    expect(DIM_COLORS.n).toBe('#8b5fff');
    expect(DIM_COLORS.d).toBe('#ffb400');
  });

  it('DIM_NAMES has 4 dimension labels', () => {
    expect(DIM_NAMES.m).toBe('Material');
    expect(DIM_NAMES.i).toBe('Intelligence');
    expect(DIM_NAMES.n).toBe('Network');
    expect(DIM_NAMES.d).toBe('Diversity');
  });

  it('siteTheme has transparent background', () => {
    expect(siteTheme.backgroundColor).toBe('transparent');
  });
});
