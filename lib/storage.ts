import { STORAGE_KEYS } from './constants';
import type { UserSettings } from '../types/settings';

/**
 * StorageManager handles savings and loading of user settings to browser localStorage
 * Token is encoded in Base64 for simple obfuscation (not true encryption)
 */
export class StorageManager {
  /**
   * Save user settings to localStorage with Base64 encoding for the token
   */
  saveSettings(settings: UserSettings): void {
    try {
      const encodedSettings = {
        ...settings,
        token: btoa(settings.token), // Base64 encode the token
      };
      window.localStorage.setItem(
        STORAGE_KEYS.USER_SETTINGS,
        JSON.stringify(encodedSettings)
      );
    } catch (error) {
      // Silently handle localStorage errors (e.g., in private browsing mode)
      console.warn('Failed to save settings to storage:', error);
    }
  }

  /**
   * Load user settings from localStorage and decode the token from Base64
   * Returns null if settings don't exist or are invalid
   */
  loadSettings(): UserSettings | null {
    try {
      const data = window.localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);

      // Validate that all required fields exist
      if (!parsed.token || !parsed.orgName || !parsed.orgType) {
        return null;
      }

      // Decode token from Base64
      const decodedToken = atob(parsed.token);

      return {
        token: decodedToken,
        orgName: parsed.orgName,
        orgType: parsed.orgType,
      };
    } catch (error) {
      // Handle JSON parse errors, invalid Base64, or localStorage errors
      console.warn('Failed to load settings from storage:', error);
      return null;
    }
  }

  /**
   * Clear user settings from localStorage
   */
  clearSettings(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.USER_SETTINGS);
    } catch (error) {
      // Silently handle localStorage errors
      console.warn('Failed to clear settings from storage:', error);
    }
  }
}
