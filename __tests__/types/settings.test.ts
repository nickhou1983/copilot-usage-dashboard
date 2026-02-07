import { describe, it, expect } from 'vitest';
import type { GitHubConfig, UserSettings } from '../../types/settings';

describe('Settings Types', () => {
  describe('GitHubConfig interface', () => {
    it('should have correct structure for GitHub configuration', () => {
      const config: GitHubConfig = {
        token: 'ghu_1234567890abc',
        orgName: 'my-organization',
        orgType: 'organization',
      };
      expect(config.token).toBe('ghu_1234567890abc');
      expect(config.orgName).toBe('my-organization');
      expect(config.orgType).toBe('organization');
    });

    it('should support enterprise organization type', () => {
      const config: GitHubConfig = {
        token: 'ghu_enterprise_token',
        orgName: 'enterprise-org',
        orgType: 'enterprise',
      };
      expect(config.orgType).toBe('enterprise');
    });
  });

  describe('UserSettings interface', () => {
    it('should extend GitHubConfig with additional settings', () => {
      const settings: UserSettings = {
        token: 'ghu_token',
        orgName: 'test-org',
        orgType: 'organization',
      };
      expect(settings.token).toBe('ghu_token');
      expect(settings.orgName).toBe('test-org');
      expect(settings.orgType).toBe('organization');
    });

    it('should be assignable from GitHubConfig', () => {
      const config: GitHubConfig = {
        token: 'ghu_config',
        orgName: 'config-org',
        orgType: 'enterprise',
      };
      const settings: UserSettings = config;
      expect(settings.token).toBe('ghu_config');
      expect(settings.orgName).toBe('config-org');
      expect(settings.orgType).toBe('enterprise');
    });
  });
});
