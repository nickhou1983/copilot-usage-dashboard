import type { OrgType } from './copilot';

/**
 * GitHub configuration for API access
 */
export interface GitHubConfig {
  token: string;
  orgName: string;
  orgType: OrgType;
}

/**
 * User settings extending GitHub configuration
 */
export type UserSettings = GitHubConfig;
