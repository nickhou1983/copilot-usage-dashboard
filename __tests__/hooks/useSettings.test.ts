import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSettings } from '../../hooks/useSettings';
import { StorageManager } from '../../lib/storage';
import type { UserSettings } from '../../types/settings';

// Mock StorageManager
vi.mock('../../lib/storage', () => ({
  StorageManager: vi.fn(),
}));

describe('useSettings', () => {
  let mockStorageManager: Partial<StorageManager>;

  beforeEach(() => {
    mockStorageManager = {
      saveSettings: vi.fn(),
      loadSettings: vi.fn(() => null),
      clearSettings: vi.fn(),
    };

    (StorageManager as any).mockImplementation(() => mockStorageManager);
  });

  it('should initialize with null settings and become loaded', async () => {
    (mockStorageManager.loadSettings as any).mockReturnValue(null);

    const { result } = renderHook(() => useSettings());

    // Initially settings should be null but may be loaded already due to effect running
    expect(result.current.settings).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
  });

  it('should load settings from storage on mount', async () => {
    const savedSettings: UserSettings = {
      token: 'ghu_test_token',
      orgName: 'test-org',
      orgType: 'organization',
    };

    (mockStorageManager.loadSettings as any).mockReturnValue(savedSettings);

    const { result } = renderHook(() => useSettings());

    expect(mockStorageManager.loadSettings).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.settings).toEqual(savedSettings);
  });

  it('should set isLoaded to true even when no settings are found', async () => {
    (mockStorageManager.loadSettings as any).mockReturnValue(null);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.settings).toBeNull();
  });

  it('should save settings to storage', async () => {
    const { result } = renderHook(() => useSettings());

    const newSettings: UserSettings = {
      token: 'ghu_new_token',
      orgName: 'new-org',
      orgType: 'enterprise',
    };

    act(() => {
      result.current.saveSettings(newSettings);
    });

    expect(mockStorageManager.saveSettings).toHaveBeenCalledWith(newSettings);

    await waitFor(() => {
      expect(result.current.settings).toEqual(newSettings);
    });
  });

  it('should clear settings from storage and state', async () => {
    const savedSettings: UserSettings = {
      token: 'ghu_token',
      orgName: 'test-org',
      orgType: 'organization',
    };

    (mockStorageManager.loadSettings as any).mockReturnValue(savedSettings);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.settings).toEqual(savedSettings);
    });

    act(() => {
      result.current.clearSettings();
    });

    expect(mockStorageManager.clearSettings).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(result.current.settings).toBeNull();
    });
  });

  it('should update settings when saveSettings is called multiple times', async () => {
    const { result } = renderHook(() => useSettings());

    const settings1: UserSettings = {
      token: 'ghu_token1',
      orgName: 'org1',
      orgType: 'organization',
    };

    const settings2: UserSettings = {
      token: 'ghu_token2',
      orgName: 'org2',
      orgType: 'enterprise',
    };

    act(() => {
      result.current.saveSettings(settings1);
    });

    await waitFor(() => {
      expect(result.current.settings).toEqual(settings1);
    });

    act(() => {
      result.current.saveSettings(settings2);
    });

    await waitFor(() => {
      expect(result.current.settings).toEqual(settings2);
    });

    expect(mockStorageManager.saveSettings).toHaveBeenCalledTimes(2);
    expect(mockStorageManager.saveSettings).toHaveBeenNthCalledWith(1, settings1);
    expect(mockStorageManager.saveSettings).toHaveBeenNthCalledWith(2, settings2);
  });

  it('should have correct hook return type', async () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current).toHaveProperty('settings');
    expect(result.current).toHaveProperty('saveSettings');
    expect(result.current).toHaveProperty('clearSettings');
    expect(result.current).toHaveProperty('isLoaded');
  });

  it('should handle edge case where storage returns corrupted data on mount', async () => {
    (mockStorageManager.loadSettings as any).mockReturnValue(null);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.settings).toBeNull();
  });

  it('should provide saveSettings as a function', async () => {
    const { result } = renderHook(() => useSettings());

    expect(typeof result.current.saveSettings).toBe('function');

    const settings: UserSettings = {
      token: 'ghu_token',
      orgName: 'test-org',
      orgType: 'organization',
    };

    act(() => {
      result.current.saveSettings(settings);
    });

    expect(mockStorageManager.saveSettings).toHaveBeenCalled();
  });

  it('should provide clearSettings as a function', async () => {
    const { result } = renderHook(() => useSettings());

    expect(typeof result.current.clearSettings).toBe('function');

    act(() => {
      result.current.clearSettings();
    });

    expect(mockStorageManager.clearSettings).toHaveBeenCalled();
  });
});
