import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageManager } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/constants';
import type { UserSettings } from '../../types/settings';

describe('StorageManager', () => {
  let storageManager: StorageManager;
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    const mockLocalStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
      key: vi.fn((index: number) => Object.keys(localStorageMock)[index] || null),
      length: 0,
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    storageManager = new StorageManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('saveSettings', () => {
    it('should save settings to localStorage', () => {
      const settings: UserSettings = {
        token: 'ghu_test_token_123',
        orgName: 'test-org',
        orgType: 'organization',
      };

      storageManager.saveSettings(settings);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_SETTINGS,
        expect.any(String)
      );
    });

    it('should encode token in Base64', () => {
      const settings: UserSettings = {
        token: 'ghu_test_token_123',
        orgName: 'test-org',
        orgType: 'organization',
      };

      storageManager.saveSettings(settings);

      const savedData = localStorageMock[STORAGE_KEYS.USER_SETTINGS];
      const parsed = JSON.parse(savedData);
      
      // Token should be Base64 encoded
      expect(parsed.token).not.toBe('ghu_test_token_123');
      // Decode should match original
      expect(atob(parsed.token)).toBe('ghu_test_token_123');
    });

    it('should preserve orgName and orgType in plain text', () => {
      const settings: UserSettings = {
        token: 'ghu_token',
        orgName: 'my-org',
        orgType: 'enterprise',
      };

      storageManager.saveSettings(settings);

      const savedData = localStorageMock[STORAGE_KEYS.USER_SETTINGS];
      const parsed = JSON.parse(savedData);

      expect(parsed.orgName).toBe('my-org');
      expect(parsed.orgType).toBe('enterprise');
    });
  });

  describe('loadSettings', () => {
    it('should return null when no settings are saved', () => {
      const settings = storageManager.loadSettings();
      expect(settings).toBeNull();
    });

    it('should load and decode settings from localStorage', () => {
      const originalSettings: UserSettings = {
        token: 'ghu_test_token_123',
        orgName: 'test-org',
        orgType: 'organization',
      };

      storageManager.saveSettings(originalSettings);
      const loadedSettings = storageManager.loadSettings();

      expect(loadedSettings).not.toBeNull();
      expect(loadedSettings?.token).toBe(originalSettings.token);
      expect(loadedSettings?.orgName).toBe(originalSettings.orgName);
      expect(loadedSettings?.orgType).toBe(originalSettings.orgType);
    });

    it('should handle corrupted data gracefully', () => {
      localStorageMock[STORAGE_KEYS.USER_SETTINGS] = 'invalid json';
      const settings = storageManager.loadSettings();
      expect(settings).toBeNull();
    });

    it('should handle missing token field in stored data', () => {
      const incompleteData = {
        orgName: 'test-org',
        orgType: 'organization',
      };
      localStorageMock[STORAGE_KEYS.USER_SETTINGS] = JSON.stringify(incompleteData);
      const settings = storageManager.loadSettings();
      expect(settings).toBeNull();
    });
  });

  describe('clearSettings', () => {
    it('should remove settings from localStorage', () => {
      const settings: UserSettings = {
        token: 'ghu_token',
        orgName: 'test-org',
        orgType: 'organization',
      };

      storageManager.saveSettings(settings);
      expect(localStorageMock[STORAGE_KEYS.USER_SETTINGS]).toBeDefined();

      storageManager.clearSettings();

      expect(window.localStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_SETTINGS
      );
      expect(localStorageMock[STORAGE_KEYS.USER_SETTINGS]).toBeUndefined();
    });

    it('should handle clearing when nothing is saved', () => {
      expect(() => {
        storageManager.clearSettings();
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle localStorage unavailable on save', () => {
      const mockLocalStorageError = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => {
          throw new Error('localStorage is not available');
        }),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(() => null),
        length: 0,
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorageError,
        writable: true,
      });

      const newStorageManager = new StorageManager();
      const settings: UserSettings = {
        token: 'ghu_token',
        orgName: 'test-org',
        orgType: 'organization',
      };

      expect(() => {
        newStorageManager.saveSettings(settings);
      }).not.toThrow();
    });

    it('should handle localStorage unavailable on load', () => {
      const mockLocalStorageError = {
        getItem: vi.fn(() => {
          throw new Error('localStorage is not available');
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(() => null),
        length: 0,
      };

      Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorageError,
        writable: true,
      });

      const newStorageManager = new StorageManager();
      expect(() => {
        const settings = newStorageManager.loadSettings();
        expect(settings).toBeNull();
      }).not.toThrow();
    });
  });
});
