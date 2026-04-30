/**
 * @file Unit tests for shared utility functions.
 * Tests sanitization, debounce, calendar formatting, timestamps, and clamping.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sanitizeInput, debounce, formatGoogleCalendarDate, getTimestamp, clamp } from '../utils/helpers';

describe('sanitizeInput', () => {
  it('removes script tags from input', () => {
    const dirty = '<script>alert("xss")</script>Hello';
    expect(sanitizeInput(dirty)).toBe('Hello');
  });

  it('preserves safe text content', () => {
    expect(sanitizeInput('How do I register to vote?')).toBe('How do I register to vote?');
  });

  it('handles empty strings', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('arg1');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith('arg1');
  });

  it('resets the timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('first');
    vi.advanceTimersByTime(200);
    debounced('second');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('second');
  });

  it('supports cancel method', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    debounced.cancel();
    vi.advanceTimersByTime(300);

    expect(fn).not.toHaveBeenCalled();
  });
});

describe('formatGoogleCalendarDate', () => {
  it('formats a date string into gcal format', () => {
    const result = formatGoogleCalendarDate('Nov 05, 2024');
    expect(result).toBe('20241105T130000Z/20241105T235900Z');
  });

  it('handles single-digit months correctly', () => {
    const result = formatGoogleCalendarDate('Jan 15, 2024');
    expect(result).toBe('20240115T130000Z/20240115T235900Z');
  });
});

describe('getTimestamp', () => {
  it('returns a string in HH:MM format', () => {
    const ts = getTimestamp();
    expect(ts).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
  });
});

describe('clamp', () => {
  it('clamps values below minimum', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
  });

  it('clamps values above maximum', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('returns value when within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('handles edge case where value equals min', () => {
    expect(clamp(0, 0, 100)).toBe(0);
  });

  it('handles edge case where value equals max', () => {
    expect(clamp(100, 0, 100)).toBe(100);
  });
});
