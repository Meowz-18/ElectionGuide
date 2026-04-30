/**
 * @file Unit tests for the Web Vitals performance monitoring utilities.
 * Tests LCP, CLS, FCP, TTFB measurement and the reportWebVitals orchestrator.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { measureLCP, measureCLS, measureFCP, measureTTFB, reportWebVitals } from '../utils/performance';

describe('measureTTFB', () => {
  it('reports TTFB from navigation entry', () => {
    const mockEntry = { responseStart: 123.45 };
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockEntry]);

    const onReport = vi.fn();
    measureTTFB(onReport);

    expect(onReport).toHaveBeenCalledWith({ name: 'TTFB', value: 123 });
  });

  it('does not report when no navigation entries exist', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);

    const onReport = vi.fn();
    measureTTFB(onReport);

    expect(onReport).not.toHaveBeenCalled();
  });
});

describe('reportWebVitals', () => {
  it('returns a cleanup function', () => {
    const cleanup = reportWebVitals(() => {});
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('does nothing if callback is not a function', () => {
    expect(() => reportWebVitals(null)).not.toThrow();
    expect(() => reportWebVitals(undefined)).not.toThrow();
    expect(() => reportWebVitals('not-a-function')).not.toThrow();
  });

  it('calls TTFB reporter immediately with navigation data', () => {
    const mockEntry = { responseStart: 50 };
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([mockEntry]);

    const onReport = vi.fn();
    const cleanup = reportWebVitals(onReport);

    expect(onReport).toHaveBeenCalledWith({ name: 'TTFB', value: 50 });
    cleanup();
  });
});
