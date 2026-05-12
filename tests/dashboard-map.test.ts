import { describe, it, expect } from 'vitest';
import { makeMapOption, MapDimension } from '../src/scripts/dashboard/charts';
import { GEOJSON_NAME_MAP } from '../src/data/geo-name-map';
import type { SlimCountry } from '../src/scripts/dashboard/search';

// -- Test fixtures --

const USA: SlimCountry = { code: 'USA', name: 'United States', mind: 50, m: 86, i: 64, n: 29, d: 40, bc: 'n' };
const SGP: SlimCountry = { code: 'SGP', name: 'Singapore', mind: 58, m: 81, i: 77, n: 40, d: 42, bc: 'n' };
const NUL: SlimCountry = { code: 'NUL', name: 'Nullistan', mind: null, m: null, i: null, n: null, d: null, bc: '' };

const testCountries: SlimCountry[] = [USA, SGP, NUL];

describe('GEOJSON_NAME_MAP', () => {
  it('has exactly 40 entries', () => {
    expect(Object.keys(GEOJSON_NAME_MAP)).toHaveLength(40);
  });
});

describe('makeMapOption structure', () => {
  it('produces series[0].type === "map"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].type).toBe('map');
  });

  it('produces series[0].map === "world"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].map).toBe('world');
  });

  it('produces visualMap.type === "continuous"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.visualMap.type).toBe('continuous');
  });

  it('has aria.enabled === true', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.aria.enabled).toBe(true);
  });

  it('has series[0].roam === true', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].roam).toBe(true);
  });

  it('has series[0].selectedMode === "single"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].selectedMode).toBe('single');
  });

  it('has series[0].itemStyle.borderColor === "#1a1a2e"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].itemStyle.borderColor).toBe('#1a1a2e');
  });

  it('has series[0].emphasis.itemStyle.borderColor === "#ffffff"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].emphasis.itemStyle.borderColor).toBe('#ffffff');
  });

  it('has series[0].select.itemStyle.borderColor === "#00c8ff"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].select.itemStyle.borderColor).toBe('#00c8ff');
  });

  it('has visualMap.min === 0 and visualMap.max === 100', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.visualMap.min).toBe(0);
    expect(opt.visualMap.max).toBe(100);
  });

  it('has visualMap.orient === "vertical"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.visualMap.orient).toBe('vertical');
  });

  it('has series[0].nameMap === GEOJSON_NAME_MAP', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.series[0].nameMap).toBe(GEOJSON_NAME_MAP);
  });
});

describe('makeMapOption dimension colors', () => {
  it('dimension="mind" has visualMap.inRange.color === ["#0a0a12", "#00c8ff"]', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    expect(opt.visualMap.inRange.color).toEqual(['#0a0a12', '#00c8ff']);
  });

  it('dimension="m" has visualMap.inRange.color === ["#0a0a12", "#00ff88"]', () => {
    const opt = makeMapOption(testCountries, 'm') as any;
    expect(opt.visualMap.inRange.color).toEqual(['#0a0a12', '#00ff88']);
  });

  it('dimension="i" has visualMap.inRange.color === ["#0a0a12", "#00c8ff"]', () => {
    const opt = makeMapOption(testCountries, 'i') as any;
    expect(opt.visualMap.inRange.color).toEqual(['#0a0a12', '#00c8ff']);
  });

  it('dimension="n" has visualMap.inRange.color === ["#0a0a12", "#8b5fff"]', () => {
    const opt = makeMapOption(testCountries, 'n') as any;
    expect(opt.visualMap.inRange.color).toEqual(['#0a0a12', '#8b5fff']);
  });

  it('dimension="d" has visualMap.inRange.color === ["#0a0a12", "#ffb400"]', () => {
    const opt = makeMapOption(testCountries, 'd') as any;
    expect(opt.visualMap.inRange.color).toEqual(['#0a0a12', '#ffb400']);
  });
});

describe('makeMapOption data filtering', () => {
  it('series[0].data length matches countries with non-null values for "mind"', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    // USA and SGP have non-null mind; NUL has null
    expect(opt.series[0].data).toHaveLength(2);
  });

  it('series[0].data length matches countries with non-null values for "m"', () => {
    const opt = makeMapOption(testCountries, 'm') as any;
    expect(opt.series[0].data).toHaveLength(2);
  });

  it('excludes all-null countries from data', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    const names = opt.series[0].data.map((d: any) => d.name);
    expect(names).not.toContain('Nullistan');
  });
});

describe('makeMapOption tooltip', () => {
  it('formatter returns country name, score, and binding constraint for valid data', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    const formatter = opt.tooltip.formatter;
    const result = formatter({
      name: 'United States',
      data: { name: 'United States', value: 50, bc: 'n', mind: 50, m: 86, i: 64, n: 29, d: 40 },
    });
    expect(result).toContain('United States');
    expect(result).toContain('50');
    expect(result).toContain('Network');
  });

  it('formatter returns "No data" for null-value countries', () => {
    const opt = makeMapOption(testCountries, 'mind') as any;
    const formatter = opt.tooltip.formatter;
    const result = formatter({
      name: 'Nullistan',
      data: undefined,
    });
    expect(result).toContain('No data');
    expect(result).toContain('Nullistan');
  });
});

describe('makeMapOption name coverage', () => {
  it('every SlimCountry from mind-scores.json with non-null MIND score has a matching name in map data', async () => {
    // Import real data
    const mindScoresRaw = await import('../src/data/mind-scores.json');
    const { getSlimPayload } = await import('../src/lib/dashboard-data');
    const allCountries = getSlimPayload(mindScoresRaw.countries as any);

    const countriesWithMind = allCountries.filter(c => c.mind !== null);
    const opt = makeMapOption(countriesWithMind, 'mind') as any;
    const dataNames = new Set(opt.series[0].data.map((d: any) => d.name));

    // Every country with a non-null mind score should appear in the map data
    for (const country of countriesWithMind) {
      expect(dataNames.has(country.name), `Missing in map data: ${country.name}`).toBe(true);
    }

    // Verify we have all countries with non-null MIND scores (198 in current dataset)
    expect(opt.series[0].data.length).toBe(countriesWithMind.length);
  });
});
