/**
 * @file Shared utility functions for the VoteWise application.
 * Provides reusable helpers for formatting, sanitization, and performance.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string to prevent XSS attacks.
 * @param {string} dirty - The untrusted input string.
 * @returns {string} The sanitized string.
 */
export const sanitizeInput = (dirty) => DOMPurify.sanitize(dirty);

/**
 * Creates a debounced version of a function.
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

/**
 * Formats a date string into a Google Calendar-compatible date range string.
 * @param {string} dateStr - A parseable date string (e.g. "Nov 05, 2024").
 * @returns {string} The formatted date string for gcal URL (e.g. "20241105T130000Z/20241105T235900Z").
 */
export const formatGoogleCalendarDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T130000Z/${yyyy}${mm}${dd}T235900Z`;
};

/**
 * Opens a Google Calendar event creation page in a new tab.
 * @param {string} title - The event title.
 * @param {string} dates - The gcal-formatted date range string.
 * @param {string} [details=''] - Optional event details/description.
 */
export const openGoogleCalendarEvent = (title, dates, details = '') => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${title} - VoteWise`,
    dates,
    details,
  });
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank', 'noopener,noreferrer');
};

/**
 * Generates a human-readable timestamp string.
 * @returns {string} The formatted time (e.g. "10:30 AM").
 */
export const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/**
 * Clamps a number between a min and max value.
 * @param {number} value - The number to clamp.
 * @param {number} min - Minimum bound.
 * @param {number} max - Maximum bound.
 * @returns {number} The clamped value.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
