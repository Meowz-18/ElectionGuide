/**
 * @file Unit tests for the constants module.
 * Verifies the structure and integrity of all application-wide static data.
 */

import { describe, it, expect } from 'vitest';
import {
  API_BASE_URL,
  API_ENDPOINTS,
  NAV_ITEMS,
  QUICK_QUESTIONS,
  GUIDE_STEPS,
  TIMELINE_EVENTS,
  QUIZ_QUESTIONS,
  MAX_QUERY_LENGTH,
} from '../constants';

describe('Application Constants', () => {
  describe('API Configuration', () => {
    it('has a valid API base URL', () => {
      expect(API_BASE_URL).toBeDefined();
      expect(typeof API_BASE_URL).toBe('string');
    });

    it('has properly formed API endpoints', () => {
      expect(API_ENDPOINTS.ASSISTANT).toContain('/api/assistant');
      expect(API_ENDPOINTS.HEALTH).toContain('/api/health');
    });

    it('has a reasonable max query length', () => {
      expect(MAX_QUERY_LENGTH).toBeGreaterThan(0);
      expect(MAX_QUERY_LENGTH).toBeLessThanOrEqual(1000);
    });
  });

  describe('Navigation Items', () => {
    it('has at least 4 navigation items', () => {
      expect(NAV_ITEMS.length).toBeGreaterThanOrEqual(4);
    });

    it('each nav item has required properties', () => {
      NAV_ITEMS.forEach((item) => {
        expect(item).toHaveProperty('path');
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('iconName');
        expect(item.path).toMatch(/^\//);
      });
    });

    it('home path is the root route', () => {
      const home = NAV_ITEMS.find((item) => item.label === 'Home');
      expect(home.path).toBe('/');
    });
  });

  describe('Guide Steps', () => {
    it('has exactly 4 steps', () => {
      expect(GUIDE_STEPS).toHaveLength(4);
    });

    it('steps have sequential IDs starting from 1', () => {
      GUIDE_STEPS.forEach((step, idx) => {
        expect(step.id).toBe(idx + 1);
      });
    });

    it('each step has title, desc, details array, gradient, and image', () => {
      GUIDE_STEPS.forEach((step) => {
        expect(step.title).toBeTruthy();
        expect(step.desc).toBeTruthy();
        expect(Array.isArray(step.details)).toBe(true);
        expect(step.details.length).toBeGreaterThan(0);
        expect(step.gradient).toBeTruthy();
        expect(step.image).toMatch(/^https?:\/\//);
      });
    });
  });

  describe('Timeline Events', () => {
    it('has at least 5 events', () => {
      expect(TIMELINE_EVENTS.length).toBeGreaterThanOrEqual(5);
    });

    it('each event has required fields', () => {
      TIMELINE_EVENTS.forEach((event) => {
        expect(event).toHaveProperty('date');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('status');
        expect(['Completed', 'Ongoing', 'Upcoming']).toContain(event.status);
      });
    });

    it('includes Election Day', () => {
      const electionDay = TIMELINE_EVENTS.find((e) => e.title === 'Election Day');
      expect(electionDay).toBeDefined();
      expect(electionDay.type).toBe('Critical');
    });
  });

  describe('Quiz Questions', () => {
    it('has at least 4 questions', () => {
      expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(4);
    });

    it('each question has exactly 4 options', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.options).toHaveLength(4);
      });
    });

    it('answer index is within options range', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
      });
    });

    it('each question has an explanation', () => {
      QUIZ_QUESTIONS.forEach((q) => {
        expect(q.explanation).toBeTruthy();
        expect(q.explanation.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Quick Questions', () => {
    it('has at least 3 quick questions', () => {
      expect(QUICK_QUESTIONS.length).toBeGreaterThanOrEqual(3);
    });

    it('each question is a non-empty string', () => {
      QUICK_QUESTIONS.forEach((q) => {
        expect(typeof q).toBe('string');
        expect(q.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
