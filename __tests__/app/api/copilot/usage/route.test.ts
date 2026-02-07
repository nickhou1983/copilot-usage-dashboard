import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define mock functions outside vi.mock
const mockFetchOrgUsage = vi.fn();
const mockFetchEnterpriseUsage = vi.fn();

// Mock the GitHubCopilotClient
vi.mock('../../../../../lib/github-api', () => {
  return {
    GitHubCopilotClient: vi.fn(function init(this: any) {
      this.fetchOrgUsage = mockFetchOrgUsage;
      this.fetchEnterpriseUsage = mockFetchEnterpriseUsage;
    }),
  };
});

// Mock the data transformer
vi.mock('../../../../../lib/data-transformer', () => {
  const mockTransform = vi.fn((data: any) => ({
    metrics: {
      date: '2026-02-07',
      acceptanceRate: 80,
      lineAcceptanceRate: 80,
      totalSuggestions: 2200,
      totalAcceptances: 1760,
      totalLinesSuggested: 6600,
      totalLinesAccepted: 5280,
    },
    dailyStats: data.map((item: any) => ({
      date: item.day,
      suggestions: item.total_suggestions_count,
      acceptances: item.total_acceptances_count,
      linesSuggested: item.total_lines_suggested,
      linesAccepted: item.total_lines_accepted,
    })),
    languageBreakdown: [],
    editorBreakdown: [],
  }));

  return {
    transformUsageData: mockTransform,
  };
});

import type { CopilotUsageData } from '../../../../../types/copilot';
import { POST } from '../../../../../app/api/copilot/usage/route';

describe('POST /api/copilot/usage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('request validation', () => {
    it('should return 400 if token is missing', async () => {
      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          orgName: 'my-org',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 if orgName is missing', async () => {
      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 if orgType is missing', async () => {
      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 400 if orgType is invalid', async () => {
      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
          orgType: 'invalid',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('API calls', () => {
    it('should call fetchOrgUsage for organization type', async () => {
      const mockData: CopilotUsageData[] = [
        {
          day: '2026-02-07',
          total_suggestions_count: 1000,
          total_acceptances_count: 800,
          total_lines_suggested: 3000,
          total_lines_accepted: 2400,
          breakdown: [],
        },
      ];

      mockFetchOrgUsage.mockResolvedValueOnce(mockData);

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockFetchOrgUsage).toHaveBeenCalledWith('my-org', undefined, undefined);
    });

    it('should call fetchOrgUsage with date range', async () => {
      const mockData: CopilotUsageData[] = [];

      mockFetchOrgUsage.mockResolvedValueOnce(mockData);

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
          orgType: 'organization',
          startDate: '2026-01-01',
          endDate: '2026-02-07',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockFetchOrgUsage).toHaveBeenCalledWith(
        'my-org',
        '2026-01-01',
        '2026-02-07'
      );
    });

    it('should call fetchEnterpriseUsage for enterprise type', async () => {
      const mockData: CopilotUsageData[] = [
        {
          day: '2026-02-07',
          total_suggestions_count: 1000,
          total_acceptances_count: 800,
          total_lines_suggested: 3000,
          total_lines_accepted: 2400,
          breakdown: [],
        },
      ];

      mockFetchEnterpriseUsage.mockResolvedValueOnce(mockData);

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-enterprise',
          orgType: 'enterprise',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockFetchEnterpriseUsage).toHaveBeenCalledWith(
        'my-enterprise',
        undefined,
        undefined
      );
    });
  });

  describe('response format', () => {
    it('should return correct response structure for organization', async () => {
      const mockData: CopilotUsageData[] = [
        {
          day: '2026-02-07',
          total_suggestions_count: 1000,
          total_acceptances_count: 800,
          total_lines_suggested: 3000,
          total_lines_accepted: 2400,
          breakdown: [],
        },
      ];

      mockFetchOrgUsage.mockResolvedValueOnce(mockData);

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data).toHaveProperty('metrics');
      expect(data).toHaveProperty('dailyStats');
      expect(data).toHaveProperty('languageBreakdown');
      expect(data).toHaveProperty('editorBreakdown');

      expect(data.metrics).toHaveProperty('totalSuggestions');
      expect(data.metrics).toHaveProperty('totalAcceptances');
      expect(data.metrics).toHaveProperty('acceptanceRate');
      expect(data.metrics).toHaveProperty('totalLinesSuggested');
      expect(data.metrics).toHaveProperty('totalLinesAccepted');

      expect(Array.isArray(data.dailyStats)).toBe(true);
      expect(Array.isArray(data.languageBreakdown)).toBe(true);
      expect(Array.isArray(data.editorBreakdown)).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should return 401 on authentication error', async () => {
      mockFetchOrgUsage.mockRejectedValueOnce(
        new Error('Bad credentials')
      );

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_invalid',
          orgName: 'my-org',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should return 500 on internal server error', async () => {
      mockFetchOrgUsage.mockRejectedValueOnce(
        new Error('Unexpected error')
      );

      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: JSON.stringify({
          token: 'ghp_test',
          orgName: 'my-org',
          orgType: 'organization',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should handle JSON parse errors', async () => {
      const request = new Request('http://localhost/api/copilot/usage', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });
});
