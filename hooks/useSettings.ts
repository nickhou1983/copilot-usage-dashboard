'use client';

import { useState, useEffect } from 'react';
import { StorageManager } from '../lib/storage';
import type { UserSettings } from '../types/settings';

interface UseSettingsReturn {
  settings: UserSettings | null;
  saveSettings: (settings: UserSettings) => void;
  clearSettings: () => void;
  isLoaded: boolean;
}

/**
 * React Hook for managing user settings with localStorage persistence
 * Handles loading settings on mount and provides methods to save and clear settings
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [storageManager] = useState(() => new StorageManager());

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = storageManager.loadSettings();
    setSettings(loadedSettings);
    setIsLoaded(true);
  }, [storageManager]);

  /**
   * Save settings to both state and localStorage
   */
  const saveSettings = (newSettings: UserSettings): void => {
    storageManager.saveSettings(newSettings);
    setSettings(newSettings);
  };

  /**
   * Clear settings from both state and localStorage
   */
  const clearSettings = (): void => {
    storageManager.clearSettings();
    setSettings(null);
  };

  return {
    settings,
    saveSettings,
    clearSettings,
    isLoaded,
  };
}
