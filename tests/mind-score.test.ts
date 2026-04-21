import { describe, it, expect } from 'vitest';
import { calcScore, getBindingConstraint } from '../src/lib/mind-score';

describe('calcScore', () => {
  it('returns 54 for Zone Zero default values {m:70,i:60,n:50,d:40}', () => {
    // Verified: Math.round(Math.pow((70/100)*(60/100)*(50/100)*(40/100), 0.25) * 100) = 54
    expect(calcScore({ m: 70, i: 60, n: 50, d: 40 })).toBe(54);
  });

  it('returns 100 for perfect scores {m:100,i:100,n:100,d:100}', () => {
    expect(calcScore({ m: 100, i: 100, n: 100, d: 100 })).toBe(100);
  });

  it('returns 0 when any dimension is zero (zero-floor property)', () => {
    expect(calcScore({ m: 0, i: 60, n: 50, d: 40 })).toBe(0);
    expect(calcScore({ m: 70, i: 0, n: 50, d: 40 })).toBe(0);
    expect(calcScore({ m: 70, i: 60, n: 0, d: 40 })).toBe(0);
    expect(calcScore({ m: 70, i: 60, n: 50, d: 0 })).toBe(0);
  });

  it('returns 0 when any dimension is negative', () => {
    expect(calcScore({ m: -5, i: 60, n: 50, d: 40 })).toBe(0);
    expect(calcScore({ m: 70, i: -10, n: 50, d: 40 })).toBe(0);
  });

  it('returns 1 for minimum nonzero values {m:1,i:1,n:1,d:1}', () => {
    expect(calcScore({ m: 1, i: 1, n: 1, d: 1 })).toBe(1);
  });

  it('computes geometric mean correctly for asymmetric values', () => {
    // Math.round(Math.pow((50/100)*(50/100)*(50/100)*(50/100), 0.25) * 100) = 50
    expect(calcScore({ m: 50, i: 50, n: 50, d: 50 })).toBe(50);
  });

  it('returns 0 when all dimensions are zero', () => {
    expect(calcScore({ m: 0, i: 0, n: 0, d: 0 })).toBe(0);
  });
});

describe('getBindingConstraint', () => {
  it('returns "d" when d is the lowest dimension', () => {
    expect(getBindingConstraint({ m: 70, i: 60, n: 50, d: 40 })).toBe('d');
  });

  it('returns "m" when m is the lowest dimension', () => {
    expect(getBindingConstraint({ m: 10, i: 60, n: 50, d: 40 })).toBe('m');
  });

  it('returns "i" when i is the lowest dimension', () => {
    expect(getBindingConstraint({ m: 70, i: 5, n: 50, d: 40 })).toBe('i');
  });

  it('returns "n" when n is the lowest dimension', () => {
    expect(getBindingConstraint({ m: 70, i: 60, n: 10, d: 40 })).toBe('n');
  });

  it('returns first-encountered minimum on tie (left-to-right: m,i,n,d)', () => {
    // All equal: reduce left-to-right, first key 'm' wins since vals[a] < vals[b] is false,
    // so reduce keeps 'a' (the accumulator) — 'm' stays as accumulator throughout
    expect(getBindingConstraint({ m: 50, i: 50, n: 50, d: 50 })).toBe('m');
  });

  it('returns first-encountered minimum when two dimensions tie at lowest', () => {
    // m and n both at 20, i and d higher. Reduce: m vs i -> m(20<60) -> m; m vs n -> m(20<20 false) -> m; m vs d -> m(20<40) -> m
    expect(getBindingConstraint({ m: 20, i: 60, n: 20, d: 40 })).toBe('m');
  });
});
