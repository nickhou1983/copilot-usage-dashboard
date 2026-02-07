import { Octokit } from '@octokit/rest';
import type { CopilotUsageData } from '../types/copilot';
import { handleAPIError } from './api-utils';

/**
 * GitHub Copilot API Client
 * Supports both organization and enterprise accounts
 */
export class GitHubCopilotClient {
  private octokit: InstanceType<typeof Octokit>;

  /**
   * Initialize the GitHub Copilot Client with a Personal Access Token
   * @param token - GitHub Personal Access Token
   */
  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Fetch Copilot usage data for an organization
   * @param orgName - Organization name
   * @param startDate - Optional start date in YYYY-MM-DD format
   * @param endDate - Optional end date in YYYY-MM-DD format
   * @returns Array of daily usage data
   * @throws Error with user-friendly message on API failure
   */
  async fetchOrgUsage(
    orgName: string,
    startDate?: string,
    endDate?: string
  ): Promise<CopilotUsageData[]> {
    try {
      const requestParams: {
        org: string;
        since?: string;
        until?: string;
        per_page: number;
      } = {
        org: orgName,
        per_page: 100,
      };

      if (startDate) {
        requestParams.since = startDate;
      }

      if (endDate) {
        requestParams.until = endDate;
      }

      const response = await this.octokit.request(
        'GET /orgs/{org}/copilot/usage',
        requestParams
      );

      // Octokit returns { data, status, headers, url } format
      return Array.isArray(response.data) ? response.data as CopilotUsageData[] : [];
    } catch (error) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch Copilot usage data for an enterprise
   * @param enterpriseName - Enterprise name
   * @param startDate - Optional start date in YYYY-MM-DD format
   * @param endDate - Optional end date in YYYY-MM-DD format
   * @returns Array of daily usage data
   * @throws Error with user-friendly message on API failure
   */
  async fetchEnterpriseUsage(
    enterpriseName: string,
    startDate?: string,
    endDate?: string
  ): Promise<CopilotUsageData[]> {
    try {
      const requestParams: {
        enterprise: string;
        since?: string;
        until?: string;
        per_page: number;
      } = {
        enterprise: enterpriseName,
        per_page: 100,
      };

      if (startDate) {
        requestParams.since = startDate;
      }

      if (endDate) {
        requestParams.until = endDate;
      }

      const response = await this.octokit.request(
        'GET /enterprises/{enterprise}/copilot/usage',
        requestParams
      );

      // Octokit returns { data, status, headers, url } format
      return Array.isArray(response.data) ? response.data as CopilotUsageData[] : [];
    } catch (error) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  }
}
