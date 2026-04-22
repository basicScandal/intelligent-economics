import { describe, it, expect } from 'vitest';
import {
  encodeDashboardURL,
  decodeDashboardURL,
} from '../src/scripts/dashboard/url-state';

describe('encodeDashboardURL', () => {
  it('returns ?country=USA&compare=DEU,JPN for primary + compare', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: ['DEU', 'JPN'] });
    expect(result).toBe('?country=USA&compare=DEU%2CJPN');
  });

  it('returns ?country=USA when compare is empty', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: [] });
    expect(result).toBe('?country=USA');
  });

  it('returns empty string when primary is null and compare is empty', () => {
    const result = encodeDashboardURL({ primary: null, compare: [] });
    expect(result).toBe('');
  });

  it('excludes primary from compare param to avoid duplication', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: ['USA'] });
    expect(result).toBe('?country=USA');
  });

  it('excludes primary from compare but keeps other countries', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: ['USA', 'DEU'] });
    expect(result).toBe('?country=USA&compare=DEU');
  });
});

describe('decodeDashboardURL', () => {
  it('parses ?country=USA&compare=DEU,JPN into correct state', () => {
    const result = decodeDashboardURL('?country=USA&compare=DEU,JPN');
    expect(result).toEqual({ primary: 'USA', compare: ['DEU', 'JPN'] });
  });

  it('parses ?country=USA with no compare param', () => {
    const result = decodeDashboardURL('?country=USA');
    expect(result).toEqual({ primary: 'USA', compare: [] });
  });

  it('returns null primary and empty compare for empty string', () => {
    const result = decodeDashboardURL('');
    expect(result).toEqual({ primary: null, compare: [] });
  });

  it('parses ?compare=DEU with no country param', () => {
    const result = decodeDashboardURL('?compare=DEU');
    expect(result).toEqual({ primary: null, compare: ['DEU'] });
  });

  it('handles URL-encoded comma in compare param', () => {
    const result = decodeDashboardURL('?country=USA&compare=DEU%2CJPN');
    expect(result).toEqual({ primary: 'USA', compare: ['DEU', 'JPN'] });
  });
});

describe('round-trip', () => {
  it('encode(decode(url)) matches original for primary + compare', () => {
    const url = '?country=USA&compare=DEU%2CJPN';
    expect(encodeDashboardURL(decodeDashboardURL(url))).toBe(url);
  });

  it('encode(decode(url)) matches original for primary only', () => {
    const url = '?country=USA';
    expect(encodeDashboardURL(decodeDashboardURL(url))).toBe(url);
  });

  it('encode(decode(url)) matches original for empty state', () => {
    const url = '';
    expect(encodeDashboardURL(decodeDashboardURL(url))).toBe(url);
  });

  it('decode(encode(state)) matches original for complex state', () => {
    const state = { primary: 'SGP', compare: ['ISL', 'NOR', 'FIN'] };
    expect(decodeDashboardURL(encodeDashboardURL(state))).toEqual(state);
  });
});
