import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define mock before importing the module that uses it
const mockRequest = vi.fn();

vi.mock('@octokit/rest', () => {
  return {
    Octokit: vi.fn(function initOctokit(this: any) {
      this.request = mockRequest;
    }),
  };
});

// Now import the module after mocking
import type { CopilotUsageData } from '../../types/copilot';
import { GitHubCopilotClient } from '../../lib/github-api';

describe('GitHubCopilotClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a client with valid token', () => {
      const client = new GitHubCopilotClient('test-token');
      expect(client).toBeDefined();
    });
  });

  describe('fetchOrgUsage', () => {
    it('should fetch organization usage data', async () => {
      const mockData: CopilotUsageData[] = [
        {
          day: '2026-02-07',
          total_suggestions_count: 1000,
          total_acceptances_count: 800,
          total_lines_suggested: 3000,
          total_lines_accepted: 2400,
          breakdown: [
            {
              language: 'typescript',
              editor: 'vscode',
              suggestions_count: 500,
              acceptances_count: 400,
              lines_suggested: 1500,
              lines_accepted: 1200,
            },
          ],
        },
      ];

      mockRequest.mockResolvedValueOnce({ data: mockData, status: 200, headers: {} });
      const client = new GitHubCopilotClient('test-token');

      const result = await client.fetchOrgUsage('my-org');

      expect(result).toEqual(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        'GET /orgs/{org}/copilot/usage',
        expect.objectContaining({
          org: 'my-org',
          per_page: 100,
        })
      );
    });

    it('should fetch organization usage data with date range', async () => {
      const mockData: CopilotUsageData[] = [];

      mockRequest.mockResolvedValueOnce({ data: mockData, status: 200, headers: {} });
      const client = new GitHubCopilotClient('test-token');

      await client.fetchOrgUsage('my-org', '2026-01-01', '2026-02-07');

      expect(mockRequest).toHaveBeenCalledWith(
        'GET /orgs/{org}/copilot/usage',
        expect.objectContaining({
          org: 'my-org',
          since: '2026-01-01',
          until: '2026-02-07',
          per_page: 100,
        })
      );
    });

    it('should handle API errors when fetching org usage', async () => {
      mockRequest.mockRejectedValueOnce({ status: 401, message: 'Unauthorized' });
      const client = new GitHubCopilotClient('test-token');

      await expect(client.fetchOrgUsage('my-org')).rejects.toThrow('token');
    });
  });

  describe('fetchEnterpriseUsage', () => {
    it('should fetch enterprise usage data', async () => {
      const mockData: CopilotUsageData[] = [
        {
          day: '2026-02-07',
          total_suggestions_count: 5000,
          total_acceptances_count: 4000,
          total_lines_suggested: 15000,
          total_lines_accepted: 12000,
          breakdown: [
            {
              language: 'typescript',
              editor: 'vscode',
              suggestions_count: 2500,
              acceptances_count: 2000,
              lines_suggested: 7500,
              lines_accepted: 6000,
            },
          ],
        },
      ];

      mockRequest.mockResolvedValueOnce({ data: mockData, status: 200, headers: {} });
      const client = new GitHubCopilotClient('test-token');

      const result = await client.fetchEnterpriseUsage('my-enterprise');

      expect(result).toEqual(mockData);
      expect(mockRequest).toHaveBeenCalledWith(
        'GET /enterprises/{enterprise}/copilot/usage',
        expect.objectContaining({
          enterprise: 'my-enterprise',
          per_page: 100,
        })
      );
    });

    it('should fetch enterprise usage data with date range', async () => {
      const mockData: CopilotUsageData[] = [];

      mockRequest.mockResolvedValueOnce({ data: mockData, status: 200, headers: {} });
      const client = new GitHubCopilotClient('test-token');

      await client.fetchEnterpriseUsage('my-enterprise', '2026-01-01', '2026-02-07');

      expect(mockRequest).toHaveBeenCalledWith(
        'GET /enterprises/{enterprise}/copilot/usage',
        expect.objectContaining({
          enterprise: 'my-enterprise',
          since: '2026-01-01',
          until: '2026-02-07',
          per_page: 100,
        })
      );
    });

    it('should handle API errors when fetching enterprise usage', async () => {
      mockRequest.mockRejectedValueOnce({ status: 404, message: 'Not Found' });
      const client = new GitHubCopilotClient('test-token');

      await expect(client.fetchEnterpriseUsage('my-enterprise')).rejects.toThrow(
        'not found'
      );
    });
  });
});
