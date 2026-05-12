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
    expect(result).toEqual({ primary: 'USA', compare: ['DEU', 'JPN'], view: null, dim: null });
  });

  it('parses ?country=USA with no compare param', () => {
    const result = decodeDashboardURL('?country=USA');
    expect(result).toEqual({ primary: 'USA', compare: [], view: null, dim: null });
  });

  it('returns null primary and empty compare for empty string', () => {
    const result = decodeDashboardURL('');
    expect(result).toEqual({ primary: null, compare: [], view: null, dim: null });
  });

  it('parses ?compare=DEU with no country param', () => {
    const result = decodeDashboardURL('?compare=DEU');
    expect(result).toEqual({ primary: null, compare: ['DEU'], view: null, dim: null });
  });

  it('handles URL-encoded comma in compare param', () => {
    const result = decodeDashboardURL('?country=USA&compare=DEU%2CJPN');
    expect(result).toEqual({ primary: 'USA', compare: ['DEU', 'JPN'], view: null, dim: null });
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
    expect(decodeDashboardURL(encodeDashboardURL(state))).toEqual({
      ...state,
      view: null,
      dim: null,
    });
  });
});

// -- New tests for view= and dim= URL params --

describe('encodeDashboardURL with view/dim', () => {
  it('encodes view=map param', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: [], view: 'map', dim: null });
    expect(result).toBe('?country=USA&view=map');
  });

  it('encodes view=map and dim=i params together', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: [], view: 'map', dim: 'i' });
    expect(result).toBe('?country=USA&view=map&dim=i');
  });

  it('encodes view=map and dim=m without primary', () => {
    const result = encodeDashboardURL({ primary: null, compare: [], view: 'map', dim: 'm' });
    expect(result).toBe('?view=map&dim=m');
  });

  it('omits view and dim when null', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: [], view: null, dim: null });
    expect(result).toBe('?country=USA');
  });

  it('backward compatible: omitting view/dim fields works', () => {
    const result = encodeDashboardURL({ primary: 'USA', compare: [] });
    expect(result).toBe('?country=USA');
  });
});

describe('decodeDashboardURL with view/dim', () => {
  it('parses view=map and dim=n with country', () => {
    const result = decodeDashboardURL('?view=map&dim=n&country=DEU');
    expect(result).toEqual({ primary: 'DEU', compare: [], view: 'map', dim: 'n' });
  });

  it('returns null view/dim when not present', () => {
    const result = decodeDashboardURL('?country=USA');
    expect(result).toEqual({ primary: 'USA', compare: [], view: null, dim: null });
  });

  it('parses view without dim', () => {
    const result = decodeDashboardURL('?view=map');
    expect(result).toEqual({ primary: null, compare: [], view: 'map', dim: null });
  });

  it('parses dim without view', () => {
    const result = decodeDashboardURL('?dim=d');
    expect(result).toEqual({ primary: null, compare: [], view: null, dim: 'd' });
  });
});

describe('round-trip with view/dim', () => {
  it('round-trips view=map and dim=d with primary and compare', () => {
    const state = { primary: 'SGP', compare: ['ISL'], view: 'map', dim: 'd' };
    const encoded = encodeDashboardURL(state);
    const decoded = decodeDashboardURL(encoded);
    expect(decoded).toEqual({ primary: 'SGP', compare: ['ISL'], view: 'map', dim: 'd' });
  });

  it('round-trips view=map without dim', () => {
    const state = { primary: 'USA', compare: [], view: 'map', dim: null };
    const encoded = encodeDashboardURL(state);
    const decoded = decodeDashboardURL(encoded);
    expect(decoded).toEqual({ primary: 'USA', compare: [], view: 'map', dim: null });
  });
});
