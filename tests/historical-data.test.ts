import { describe, it, expect } from 'vitest';
import {
  getAvailableYears,
  getCountryTimeSeries,
  getYearSnapshot,
  type HistoricalData,
  type YearScores,
} from '../src/lib/historical-data';

// -- Test fixture --

const MOCK_SCORES_USA_2020: YearScores = {
  m: 85.2,
  i: 91.3,
  n: 72.1,
  d: 68.4,
  mind: 78,
};

const MOCK_SCORES_USA_2021: YearScores = {
  m: 86.0,
  i: 92.0,
  n: 73.5,
  d: 69.1,
  mind: 79,
};

const MOCK_SCORES_DEU_2020: YearScores = {
  m: 88.1,
  i: 89.5,
  n: 75.3,
  d: 71.2,
  mind: 80,
};

const MOCK_SCORES_DEU_2021: YearScores = {
  m: 88.5,
  i: 90.0,
  n: 76.0,
  d: 72.0,
  mind: 81,
};

const MOCK_PARTIAL_SCORES: YearScores = {
  m: 45.0,
  i: null,
  n: null,
  d: null,
  mind: null,
};

function createMockData(): HistoricalData {
  return {
    metadata: {
      generatedAt: '2026-01-01T00:00:00Z',
      yearRange: [2020, 2021],
      indicatorCount: 16,
      countryCount: 2,
      version: '1.0.0',
    },
    years: {
      '2020': {
        countries: {
          USA: MOCK_SCORES_USA_2020,
          DEU: MOCK_SCORES_DEU_2020,
        },
      },
      '2021': {
        countries: {
          USA: MOCK_SCORES_USA_2021,
          DEU: MOCK_SCORES_DEU_2021,
        },
      },
    },
  };
}

// -- Tests --

describe('getAvailableYears', () => {
  it('returns sorted array of years from data', () => {
    const data = createMockData();
    const years = getAvailableYears(data);
    expect(years).toEqual([2020, 2021]);
  });

  it('returns ascending order even if keys are unordered', () => {
    const data = createMockData();
    // Add years in non-sequential order
    data.years['2019'] = { countries: {} };
    data.years['2023'] = { countries: {} };
    const years = getAvailableYears(data);
    expect(years).toEqual([2019, 2020, 2021, 2023]);
  });

  it('returns empty array when no years exist', () => {
    const data = createMockData();
    data.years = {};
    const years = getAvailableYears(data);
    expect(years).toEqual([]);
  });
});

describe('getCountryTimeSeries', () => {
  it('returns correct year-score pairs for a known country', () => {
    const data = createMockData();
    const series = getCountryTimeSeries(data, 'USA');

    expect(series).toHaveLength(2);
    expect(series[0]).toEqual({ year: 2020, scores: MOCK_SCORES_USA_2020 });
    expect(series[1]).toEqual({ year: 2021, scores: MOCK_SCORES_USA_2021 });
  });

  it('returns results sorted by year ascending', () => {
    const data = createMockData();
    const series = getCountryTimeSeries(data, 'DEU');

    expect(series[0].year).toBeLessThan(series[1].year);
    expect(series[0].year).toBe(2020);
    expect(series[1].year).toBe(2021);
  });

  it('returns empty array for unknown country', () => {
    const data = createMockData();
    const series = getCountryTimeSeries(data, 'XYZ');
    expect(series).toEqual([]);
  });

  it('handles country present in some years but not others', () => {
    const data = createMockData();
    data.years['2022'] = {
      countries: {
        USA: { m: 87.0, i: 93.0, n: 74.0, d: 70.0, mind: 80 },
        // DEU not present in 2022
      },
    };

    const deuSeries = getCountryTimeSeries(data, 'DEU');
    expect(deuSeries).toHaveLength(2); // Only 2020 and 2021

    const usaSeries = getCountryTimeSeries(data, 'USA');
    expect(usaSeries).toHaveLength(3); // 2020, 2021, 2022
  });
});

describe('getYearSnapshot', () => {
  it('returns all countries for a given year', () => {
    const data = createMockData();
    const snapshot = getYearSnapshot(data, 2020);

    expect(Object.keys(snapshot)).toHaveLength(2);
    expect(snapshot['USA']).toEqual(MOCK_SCORES_USA_2020);
    expect(snapshot['DEU']).toEqual(MOCK_SCORES_DEU_2020);
  });

  it('returns empty object for invalid year', () => {
    const data = createMockData();
    const snapshot = getYearSnapshot(data, 1999);
    expect(snapshot).toEqual({});
  });

  it('returns empty object for year not in data', () => {
    const data = createMockData();
    const snapshot = getYearSnapshot(data, 2025);
    expect(snapshot).toEqual({});
  });

  it('preserves null scores in partial data', () => {
    const data = createMockData();
    data.years['2022'] = {
      countries: {
        BRA: MOCK_PARTIAL_SCORES,
      },
    };

    const snapshot = getYearSnapshot(data, 2022);
    expect(snapshot['BRA'].mind).toBeNull();
    expect(snapshot['BRA'].i).toBeNull();
    expect(snapshot['BRA'].m).toBe(45.0);
  });
});

describe('type enforcement', () => {
  it('YearScores fields accept null values', () => {
    const scores: YearScores = {
      m: null,
      i: null,
      n: null,
      d: null,
      mind: null,
    };
    // Type compiles and all nulls are valid
    expect(scores.m).toBeNull();
    expect(scores.mind).toBeNull();
  });

  it('HistoricalData metadata has correct structure', () => {
    const data = createMockData();
    expect(data.metadata.yearRange).toEqual([2020, 2021]);
    expect(typeof data.metadata.generatedAt).toBe('string');
    expect(typeof data.metadata.indicatorCount).toBe('number');
    expect(typeof data.metadata.countryCount).toBe('number');
    expect(typeof data.metadata.version).toBe('string');
  });
});
