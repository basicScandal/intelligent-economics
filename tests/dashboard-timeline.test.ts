import { describe, it, expect } from 'vitest';
import {
  makeTimeSeriesOption,
  snapshotToSlim,
  SPEEDS,
} from '../src/scripts/dashboard/charts';
import type { TimeSeriesCountry } from '../src/scripts/dashboard/charts';
import {
  LATEST_YEAR,
  YEAR_RANGE,
  createDashboardState,
} from '../src/scripts/dashboard/state';
import {
  encodeDashboardURL,
  decodeDashboardURL,
} from '../src/scripts/dashboard/url-state';
import type { YearScores } from '../src/lib/historical-data';

// -- Test fixtures --

const mockNorway: TimeSeriesCountry = {
  name: 'Norway',
  code: 'NOR',
  color: '#FF6B6B',
  data: [
    { year: 2014, mind: 78, m: 82, i: 72, n: 65, d: 71 },
    { year: 2015, mind: 79, m: 83, i: 73, n: 66, d: 72 },
    { year: 2016, mind: 80, m: 84, i: 74, n: 67, d: 73 },
    { year: 2017, mind: 81, m: 85, i: 75, n: 68, d: 74 },
    { year: 2018, mind: 82, m: 86, i: 76, n: 69, d: 75 },
    { year: 2019, mind: 83, m: 87, i: 77, n: 70, d: 76 },
    { year: 2020, mind: 84, m: 88, i: 78, n: 71, d: 77 },
    { year: 2021, mind: 85, m: 89, i: 79, n: 72, d: 78 },
    { year: 2022, mind: 86, m: 90, i: 80, n: 73, d: 79 },
    { year: 2023, mind: null, m: null, i: null, n: null, d: null },
    { year: 2024, mind: null, m: null, i: null, n: null, d: null },
  ],
};

const mockSingapore: TimeSeriesCountry = {
  name: 'Singapore',
  code: 'SGP',
  color: '#4ECDC4',
  data: [
    { year: 2014, mind: 75, m: 80, i: 76, n: 62, d: 68 },
    { year: 2015, mind: 76, m: 81, i: 77, n: 63, d: 69 },
    { year: 2016, mind: 77, m: 82, i: 78, n: 64, d: 70 },
    { year: 2017, mind: 78, m: 83, i: 79, n: 65, d: 71 },
    { year: 2018, mind: 79, m: 84, i: 80, n: 66, d: 72 },
    { year: 2019, mind: 80, m: 85, i: 81, n: 67, d: 73 },
    { year: 2020, mind: 81, m: 86, i: 82, n: 68, d: 74 },
    { year: 2021, mind: 82, m: 87, i: 83, n: 69, d: 75 },
    { year: 2022, mind: 83, m: 88, i: 84, n: 70, d: 76 },
    { year: 2023, mind: 84, m: 89, i: 85, n: 71, d: 77 },
    { year: 2024, mind: 85, m: 90, i: 86, n: 72, d: 78 },
  ],
};

const mockSnapshot: Record<string, YearScores> = {
  NOR: { m: 82, i: 72, n: 65, d: 71, mind: 78 },
  SGP: { m: 80, i: 76, n: 62, d: 68, mind: 75 },
  USA: { m: null, i: null, n: null, d: null, mind: null },
};

const mockNameMap: Record<string, string> = {
  NOR: 'Norway',
  SGP: 'Singapore',
  USA: 'United States',
};

// -- Tests: makeTimeSeriesOption --

describe('makeTimeSeriesOption', () => {
  it('with single country returns line chart option with xAxis years 2014-2024', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.xAxis.data).toEqual([
      '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024',
    ]);
  });

  it('with single country has yAxis with min 0 and max 100', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.yAxis.min).toBe(0);
    expect(opt.yAxis.max).toBe(100);
  });

  it('with single country produces one line series', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.series).toHaveLength(1);
    expect(opt.series[0].type).toBe('line');
  });

  it('with single country series has line width 2 and correct color', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.series[0].lineStyle.width).toBe(2);
    expect(opt.series[0].lineStyle.color).toBe('#FF6B6B');
    expect(opt.series[0].itemStyle.color).toBe('#FF6B6B');
  });

  it('with single country series has circle symbols with size 6', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.series[0].symbol).toBe('circle');
    expect(opt.series[0].symbolSize).toBe(6);
  });

  it('with single country series data uses mind values and dashes for nulls', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    const data = opt.series[0].data;
    expect(data[0]).toBe(78);
    expect(data[8]).toBe(86);
    expect(data[9]).toBe('-');
    expect(data[10]).toBe('-');
  });

  it('with currentYear=2018 adds markLine to first series', () => {
    const opt = makeTimeSeriesOption([mockNorway], 2018) as any;
    expect(opt.series[0].markLine).toBeDefined();
    expect(opt.series[0].markLine.data).toHaveLength(1);
    expect(opt.series[0].markLine.data[0].xAxis).toBe('2018');
  });

  it('markLine has white dashed line and current year label', () => {
    const opt = makeTimeSeriesOption([mockNorway], 2018) as any;
    const markLine = opt.series[0].markLine;
    expect(markLine.lineStyle.color).toBe('#ffffff');
    expect(markLine.lineStyle.type).toBe('dashed');
    expect(markLine.lineStyle.width).toBe(1);
    expect(markLine.label.show).toBe(true);
    expect(markLine.label.formatter).toBe('2018');
  });

  it('markLine is silent with no symbols', () => {
    const opt = makeTimeSeriesOption([mockNorway], 2018) as any;
    const markLine = opt.series[0].markLine;
    expect(markLine.silent).toBe(true);
    expect(markLine.symbol).toEqual(['none', 'none']);
  });

  it('with 3 countries returns 3 series with colors from each TimeSeriesCountry', () => {
    const opt = makeTimeSeriesOption([mockNorway, mockSingapore, mockNorway], null) as any;
    expect(opt.series).toHaveLength(3);
    expect(opt.series[0].lineStyle.color).toBe('#FF6B6B');
    expect(opt.series[1].lineStyle.color).toBe('#4ECDC4');
    expect(opt.series[2].lineStyle.color).toBe('#FF6B6B'); // same as mockNorway
  });

  it('includes aria.enabled=true', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.aria.enabled).toBe(true);
  });

  it('includes tooltip with axis trigger and line pointer', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.tooltip.trigger).toBe('axis');
    expect(opt.tooltip.axisPointer.type).toBe('line');
  });

  it('includes legend with country names', () => {
    const opt = makeTimeSeriesOption([mockNorway, mockSingapore], null) as any;
    expect(opt.legend.data).toEqual(['Norway', 'Singapore']);
  });

  it('includes grid with containLabel and padding', () => {
    const opt = makeTimeSeriesOption([mockNorway], null) as any;
    expect(opt.grid.containLabel).toBe(true);
    expect(opt.grid.left).toBe(10);
    expect(opt.grid.right).toBe(30);
    expect(opt.grid.bottom).toBe(10);
    expect(opt.grid.top).toBe(40);
  });
});

// -- Tests: snapshotToSlim --

describe('snapshotToSlim', () => {
  it('converts year snapshot to SlimCountry array', () => {
    const result = snapshotToSlim(mockSnapshot, mockNameMap);
    expect(result).toHaveLength(3);
  });

  it('includes code, name, and all scores from snapshot', () => {
    const result = snapshotToSlim(mockSnapshot, mockNameMap);
    const nor = result.find((c) => c.code === 'NOR');
    expect(nor).toBeDefined();
    expect(nor!.name).toBe('Norway');
    expect(nor!.mind).toBe(78);
    expect(nor!.m).toBe(82);
    expect(nor!.i).toBe(72);
    expect(nor!.n).toBe(65);
    expect(nor!.d).toBe(71);
  });

  it('derives bc field using getBindingConstraint for non-null dimensions', () => {
    const result = snapshotToSlim(mockSnapshot, mockNameMap);
    const nor = result.find((c) => c.code === 'NOR');
    expect(nor!.bc).toBe('n'); // Network is the binding constraint (65 is lowest)
  });

  it('sets bc to empty string when any dimension is null', () => {
    const result = snapshotToSlim(mockSnapshot, mockNameMap);
    const usa = result.find((c) => c.code === 'USA');
    expect(usa!.bc).toBe('');
  });

  it('uses nameMap for country names, falls back to ISO3 code', () => {
    const result = snapshotToSlim(mockSnapshot, mockNameMap);
    const sgp = result.find((c) => c.code === 'SGP');
    expect(sgp!.name).toBe('Singapore');

    const unmapped = snapshotToSlim({ XYZ: { m: 50, i: 50, n: 50, d: 50, mind: 50 } }, {});
    expect(unmapped[0].name).toBe('XYZ');
  });
});

// -- Tests: URL state year param --

describe('URL state year param', () => {
  it('encodeDashboardURL with year=2018 includes year param', () => {
    const encoded = encodeDashboardURL({
      primary: null,
      compare: [],
      year: 2018,
    });
    expect(encoded).toContain('year=2018');
  });

  it('encodeDashboardURL with no year omits year param', () => {
    const encoded = encodeDashboardURL({
      primary: null,
      compare: [],
      year: null,
    });
    expect(encoded).not.toContain('year');
  });

  it('decodeDashboardURL with year=2018 returns year: 2018', () => {
    const decoded = decodeDashboardURL('?year=2018');
    expect(decoded.year).toBe(2018);
  });

  it('decodeDashboardURL with no year param returns year: null', () => {
    const decoded = decodeDashboardURL('?country=NOR');
    expect(decoded.year).toBeNull();
  });

  it('encode/decode year round-trip: encode({year: 2020}) -> decode -> year === 2020', () => {
    const original = { primary: 'NOR', compare: ['SGP'], year: 2020 };
    const encoded = encodeDashboardURL(original);
    const decoded = decodeDashboardURL(encoded);
    expect(decoded.year).toBe(2020);
  });
});

// -- Tests: DashboardState year field --

describe('DashboardState year field', () => {
  it('createDashboardState().get().year is null initially', () => {
    const store = createDashboardState();
    expect(store.get().year).toBeNull();
  });

  it('store.setYear(2018) updates state.year to 2018', () => {
    const store = createDashboardState();
    store.setYear(2018);
    expect(store.get().year).toBe(2018);
  });

  it('store.setYear(null) resets year to null', () => {
    const store = createDashboardState();
    store.setYear(2018);
    store.setYear(null);
    expect(store.get().year).toBeNull();
  });

  it('store.setYear notifies subscribers', () => {
    const store = createDashboardState();
    const notified: any[] = [];
    store.subscribe((state) => {
      notified.push(state.year);
    });

    store.setYear(2018);
    expect(notified).toContain(2018);
  });
});

// -- Tests: Constants --

describe('Constants', () => {
  it('LATEST_YEAR equals 2024', () => {
    expect(LATEST_YEAR).toBe(2024);
  });

  it('YEAR_RANGE equals [2014, 2024]', () => {
    expect(YEAR_RANGE).toEqual([2014, 2024]);
  });

  it('SPEEDS has correct values', () => {
    expect(SPEEDS['0.5x']).toBe(2000);
    expect(SPEEDS['1x']).toBe(1000);
    expect(SPEEDS['2x']).toBe(500);
  });
});
