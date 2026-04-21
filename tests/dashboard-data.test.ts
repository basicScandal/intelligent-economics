import { describe, it, expect, beforeAll } from 'vitest';
import { getSlimPayload, getRankingData, getMethodologyData } from '../src/lib/dashboard-data';
import type { SlimCountry } from '../src/scripts/dashboard/search';
import mindScores from '../src/data/mind-scores.json';

let slim: SlimCountry[];

beforeAll(() => {
  slim = getSlimPayload(mindScores.countries as any);
});

describe('getSlimPayload', () => {
  it('returns array of 217 entries with code, name, mind, m, i, n, d, bc fields', () => {
    expect(slim).toHaveLength(217);
    for (const c of slim) {
      expect(c).toHaveProperty('code');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('mind');
      expect(c).toHaveProperty('m');
      expect(c).toHaveProperty('i');
      expect(c).toHaveProperty('n');
      expect(c).toHaveProperty('d');
      expect(c).toHaveProperty('bc');
    }
  });

  it('entries with null dimensions have null for those fields', () => {
    // mind-scores.json has 19 countries with mind: null
    const nullMind = slim.filter((c) => c.mind === null);
    expect(nullMind.length).toBe(19);
  });
});

describe('getRankingData', () => {
  it('returns top 20 by default sorted by MIND score desc', () => {
    const ranking = getRankingData(slim);
    expect(ranking).toHaveLength(20);
    for (let j = 1; j < ranking.length; j++) {
      expect(ranking[j - 1].mind!).toBeGreaterThanOrEqual(ranking[j].mind!);
    }
  });

  it('excludes null MIND score countries', () => {
    const ranking = getRankingData(slim);
    for (const entry of ranking) {
      expect(entry.mind).not.toBeNull();
    }
  });

  it('first entry has highest MIND score', () => {
    const ranking = getRankingData(slim);
    const allNonNull = slim.filter((c) => c.mind !== null);
    const maxScore = Math.max(...allNonNull.map((c) => c.mind!));
    expect(ranking[0].mind).toBe(maxScore);
  });

  it('each entry has code, name, mind, m, i, n, d, bindingConstraint, rank', () => {
    const ranking = getRankingData(slim);
    for (const entry of ranking) {
      expect(entry).toHaveProperty('code');
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('mind');
      expect(entry).toHaveProperty('m');
      expect(entry).toHaveProperty('i');
      expect(entry).toHaveProperty('n');
      expect(entry).toHaveProperty('d');
      expect(entry).toHaveProperty('bc');
      expect(entry).toHaveProperty('rank');
    }
  });

  it('getRankingData(10) returns exactly 10 entries', () => {
    const ranking = getRankingData(slim, 10);
    expect(ranking).toHaveLength(10);
  });
});

describe('getMethodologyData', () => {
  it('returns 4 dimensions with 4 indicators each', () => {
    const methodology = getMethodologyData(mindScores.indicators as any);
    const keys = Object.keys(methodology);
    expect(keys).toHaveLength(4);
    expect(keys).toContain('m');
    expect(keys).toContain('i');
    expect(keys).toContain('n');
    expect(keys).toContain('d');
    for (const key of keys) {
      expect(methodology[key as 'm' | 'i' | 'n' | 'd']).toHaveLength(4);
    }
  });

  it('Material dimension has NY.GNP.PCAP.PP.CD, EG.ELC.ACCS.ZS, SP.DYN.LE00.IN, SH.H2O.SMDW.ZS', () => {
    const methodology = getMethodologyData(mindScores.indicators as any);
    const mCodes = methodology.m.map((ind) => ind.code);
    expect(mCodes).toContain('NY.GNP.PCAP.PP.CD');
    expect(mCodes).toContain('EG.ELC.ACCS.ZS');
    expect(mCodes).toContain('SP.DYN.LE00.IN');
    expect(mCodes).toContain('SH.H2O.SMDW.ZS');
  });

  it('each indicator has code and name', () => {
    const methodology = getMethodologyData(mindScores.indicators as any);
    for (const dim of Object.values(methodology)) {
      for (const ind of dim) {
        expect(ind).toHaveProperty('code');
        expect(ind).toHaveProperty('name');
        expect(typeof ind.code).toBe('string');
        expect(typeof ind.name).toBe('string');
      }
    }
  });
});
