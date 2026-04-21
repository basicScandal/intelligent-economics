import { describe, it, expect } from 'vitest';
import { normalize } from '../src/lib/mind-score';

describe('normalize', () => {
  it('maps values linearly within the [min,max] range to [0,100]', () => {
    const data = [0, 25, 50, 75, 100];
    const bounds = normalize(data, 0, 100);
    expect(bounds.normalize(0)).toBeCloseTo(0, 5);
    expect(bounds.normalize(50)).toBeCloseTo(50, 5);
    expect(bounds.normalize(100)).toBeCloseTo(100, 5);
  });

  it('clamps values below the percentile low bound to 0', () => {
    const data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const bounds = normalize(data);
    // Value well below the p1 bound should clamp to 0
    expect(bounds.normalize(bounds.min - 50)).toBe(0);
  });

  it('clamps values above the percentile high bound to 100', () => {
    const data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const bounds = normalize(data);
    // Value well above the p99 bound should clamp to 100
    expect(bounds.normalize(bounds.max + 50)).toBe(100);
  });

  it('returns min and max bounds from percentile computation', () => {
    const data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const bounds = normalize(data);
    expect(bounds.min).toBeDefined();
    expect(bounds.max).toBeDefined();
    expect(bounds.min).toBeLessThanOrEqual(bounds.max);
  });

  it('handles equal min and max (all same values) without dividing by zero', () => {
    const data = [42, 42, 42, 42, 42];
    const bounds = normalize(data);
    // When hi === lo, normalize should return 50 (midpoint)
    expect(bounds.normalize(42)).toBe(50);
  });

  it('handles empty array gracefully', () => {
    const bounds = normalize([]);
    expect(bounds.min).toBe(0);
    expect(bounds.max).toBe(0);
    expect(bounds.normalize(5)).toBe(0);
  });

  it('computes correct p1/p99 bounds for a known dataset', () => {
    // [0,10,20,30,40,50,60,70,80,90,100] — 11 elements
    // p1: sorted[floor(11 * 1 / 100)] = sorted[floor(0.11)] = sorted[0] = 0
    // p99: sorted[ceil(11 * 99 / 100) - 1] = sorted[ceil(10.89) - 1] = sorted[11-1] = sorted[10] = 100
    const data = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const bounds = normalize(data);
    expect(bounds.min).toBe(0);
    expect(bounds.max).toBe(100);
  });

  it('normalizes a single-element array to 50', () => {
    const data = [75];
    const bounds = normalize(data);
    // Single element: lo === hi, so normalize returns 50
    expect(bounds.normalize(75)).toBe(50);
  });

  it('supports custom percentile bounds', () => {
    // With p5/p95 on a 20-element dataset
    const data = Array.from({ length: 21 }, (_, i) => i * 5); // [0,5,10,...,100]
    const bounds = normalize(data, 5, 95);
    // p5: sorted[floor(21*5/100)] = sorted[floor(1.05)] = sorted[1] = 5
    // p95: sorted[ceil(21*95/100)-1] = sorted[ceil(19.95)-1] = sorted[20-1] = sorted[19] = 95
    expect(bounds.min).toBe(5);
    expect(bounds.max).toBe(95);
    // Value at min bound should normalize to 0
    expect(bounds.normalize(5)).toBeCloseTo(0, 5);
    // Value at max bound should normalize to 100
    expect(bounds.normalize(95)).toBeCloseTo(100, 5);
  });
});
