import { describe, it, expect } from 'vitest';
import {
  DATE_PRESETS,
  CHART_COLORS,
  API_ENDPOINTS,
  STORAGE_KEYS,
} from '../../lib/constants';

describe('Constants', () => {
  describe('DATE_PRESETS', () => {
    it('should have 7, 30, and 90 day presets', () => {
      expect(DATE_PRESETS).toHaveProperty('LAST_7_DAYS');
      expect(DATE_PRESETS).toHaveProperty('LAST_30_DAYS');
      expect(DATE_PRESETS).toHaveProperty('LAST_90_DAYS');
    });

    it('should have correct day values', () => {
      expect(DATE_PRESETS.LAST_7_DAYS).toBe(7);
      expect(DATE_PRESETS.LAST_30_DAYS).toBe(30);
      expect(DATE_PRESETS.LAST_90_DAYS).toBe(90);
    });

    it('should be frozen at runtime', () => {
      expect(Object.isFrozen(DATE_PRESETS)).toBe(true);
    });
  });

  describe('CHART_COLORS', () => {
    it('should have color properties', () => {
      expect(CHART_COLORS).toHaveProperty('primary');
      expect(CHART_COLORS).toHaveProperty('secondary');
      expect(CHART_COLORS).toHaveProperty('success');
      expect(CHART_COLORS).toHaveProperty('warning');
    });

    it('should have valid hex color values', () => {
      const hexRegex = /^#[0-9A-F]{6}$/i;
      expect(CHART_COLORS.primary).toMatch(hexRegex);
      expect(CHART_COLORS.secondary).toMatch(hexRegex);
      expect(CHART_COLORS.success).toMatch(hexRegex);
      expect(CHART_COLORS.warning).toMatch(hexRegex);
    });

    it('should be frozen at runtime', () => {
      expect(Object.isFrozen(CHART_COLORS)).toBe(true);
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have GitHub API endpoints', () => {
      expect(API_ENDPOINTS).toHaveProperty('COPILOT_USAGE_ORG');
      expect(API_ENDPOINTS).toHaveProperty('COPILOT_USAGE_ENTERPRISE');
    });

    it('should have correct endpoint paths', () => {
      expect(API_ENDPOINTS.COPILOT_USAGE_ORG).toContain('organizations');
      expect(API_ENDPOINTS.COPILOT_USAGE_ENTERPRISE).toContain('enterprises');
    });

    it('should be frozen at runtime', () => {
      expect(Object.isFrozen(API_ENDPOINTS)).toBe(true);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('should have storage key properties', () => {
      expect(STORAGE_KEYS).toHaveProperty('GITHUB_CONFIG');
      expect(STORAGE_KEYS).toHaveProperty('USER_SETTINGS');
      expect(STORAGE_KEYS).toHaveProperty('CACHE_DATA');
    });

    it('should have string values for storage keys', () => {
      expect(typeof STORAGE_KEYS.GITHUB_CONFIG).toBe('string');
      expect(typeof STORAGE_KEYS.USER_SETTINGS).toBe('string');
      expect(typeof STORAGE_KEYS.CACHE_DATA).toBe('string');
    });

    it('should have unique key values', () => {
      const keys = Object.values(STORAGE_KEYS);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it('should be frozen at runtime', () => {
      expect(Object.isFrozen(STORAGE_KEYS)).toBe(true);
    });
  });
});
