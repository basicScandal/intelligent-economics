import { describe, it, expect, beforeAll } from 'vitest';
import { filterCountries, handleSearchKeydown, type SlimCountry } from '../src/scripts/dashboard/search';
import { getSlimPayload } from '../src/lib/dashboard-data';
import mindScores from '../src/data/mind-scores.json';

let allCountries: SlimCountry[];

beforeAll(() => {
  allCountries = getSlimPayload(mindScores.countries as any);
});

describe('filterCountries', () => {
  it('returns all 198 valid countries when query is empty string', () => {
    const result = filterCountries(allCountries, '');
    expect(result.length).toBe(198);
    // All returned should have non-null mind
    for (const c of result) {
      expect(c.mind).not.toBeNull();
    }
  });

  it("filterCountries('united') matches United States, United Kingdom, United Arab Emirates, United Republic of Tanzania", () => {
    const result = filterCountries(allCountries, 'united');
    const names = result.map((c) => c.name);
    expect(names).toContain('United States');
    expect(names).toContain('United Kingdom');
    expect(names).toContain('United Arab Emirates');
    expect(names).toContain('United Republic of Tanzania');
  });

  it("filterCountries is case-insensitive: 'JAPAN' matches Japan", () => {
    const result = filterCountries(allCountries, 'JAPAN');
    expect(result.some((c) => c.name === 'Japan')).toBe(true);
  });

  it('filterCountries results sorted by MIND score descending', () => {
    const result = filterCountries(allCountries, 'a');
    const nonNull = result.filter((c) => c.mind !== null);
    for (let j = 1; j < nonNull.length; j++) {
      expect(nonNull[j - 1].mind!).toBeGreaterThanOrEqual(nonNull[j].mind!);
    }
  });

  it("filterCountries returns empty array for nonsense query 'zzzzz'", () => {
    const result = filterCountries(allCountries, 'zzzzz');
    expect(result).toEqual([]);
  });

  it('filterCountries includes null-score countries in query results but marks them with mind: null', () => {
    // "Samoa" should match "American Samoa" (mind: null) and "Samoa" (mind: non-null)
    const result = filterCountries(allCountries, 'samoa');
    const nullEntries = result.filter((c) => c.mind === null);
    // American Samoa has mind: null
    expect(nullEntries.length).toBeGreaterThanOrEqual(1);
    expect(nullEntries.some((c) => c.name === 'American Samoa')).toBe(true);
  });
});

describe('handleSearchKeydown', () => {
  it('ArrowDown increments index (0->1)', () => {
    expect(handleSearchKeydown('ArrowDown', 0, 10)).toBe(1);
  });

  it('ArrowUp decrements index (2->1)', () => {
    expect(handleSearchKeydown('ArrowUp', 2, 10)).toBe(1);
  });

  it('ArrowUp at 0 stays at 0', () => {
    expect(handleSearchKeydown('ArrowUp', 0, 10)).toBe(0);
  });

  it('Escape returns -1', () => {
    expect(handleSearchKeydown('Escape', 5, 10)).toBe(-1);
  });
});
