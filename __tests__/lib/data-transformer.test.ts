import { describe, it, expect } from 'vitest';
import type { CopilotUsageData, LanguageBreakdown, EditorBreakdown } from '../../types/copilot';
import {
  transformUsageData,
  calculateMetrics,
  aggregateByLanguage,
  aggregateByEditor,
  prepareDailyStats,
} from '../../lib/data-transformer';

describe('data-transformer', () => {
  const mockUsageData: CopilotUsageData[] = [
    {
      day: '2026-02-01',
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
        {
          language: 'javascript',
          editor: 'vscode',
          suggestions_count: 300,
          acceptances_count: 240,
          lines_suggested: 900,
          lines_accepted: 720,
        },
        {
          language: 'typescript',
          editor: 'jetbrains',
          suggestions_count: 200,
          acceptances_count: 160,
          lines_suggested: 600,
          lines_accepted: 480,
        },
      ],
    },
    {
      day: '2026-02-02',
      total_suggestions_count: 1200,
      total_acceptances_count: 960,
      total_lines_suggested: 3600,
      total_lines_accepted: 2880,
      breakdown: [
        {
          language: 'typescript',
          editor: 'vscode',
          suggestions_count: 600,
          acceptances_count: 480,
          lines_suggested: 1800,
          lines_accepted: 1440,
        },
        {
          language: 'python',
          editor: 'vscode',
          suggestions_count: 400,
          acceptances_count: 320,
          lines_suggested: 1200,
          lines_accepted: 960,
        },
        {
          language: 'typescript',
          editor: 'jetbrains',
          suggestions_count: 200,
          acceptances_count: 160,
          lines_suggested: 600,
          lines_accepted: 480,
        },
      ],
    },
  ];

  describe('calculateMetrics', () => {
    it('should calculate correct metrics from usage data', () => {
      const metrics = calculateMetrics(mockUsageData);

      expect(metrics.totalSuggestions).toBe(2200);
      expect(metrics.totalAcceptances).toBe(1760);
      expect(metrics.acceptanceRate).toBe(80);
      expect(metrics.totalLinesSuggested).toBe(6600);
      expect(metrics.totalLinesAccepted).toBe(5280);
      expect(metrics.lineAcceptanceRate).toBe(80);
    });

    it('should handle empty array', () => {
      const metrics = calculateMetrics([]);

      expect(metrics.totalSuggestions).toBe(0);
      expect(metrics.totalAcceptances).toBe(0);
      expect(metrics.acceptanceRate).toBe(0);
      expect(metrics.totalLinesSuggested).toBe(0);
      expect(metrics.totalLinesAccepted).toBe(0);
      expect(metrics.lineAcceptanceRate).toBe(0);
    });

    it('should handle data with zero acceptances', () => {
      const data: CopilotUsageData[] = [
        {
          day: '2026-02-01',
          total_suggestions_count: 100,
          total_acceptances_count: 0,
          total_lines_suggested: 300,
          total_lines_accepted: 0,
          breakdown: [],
        },
      ];

      const metrics = calculateMetrics(data);

      expect(metrics.totalSuggestions).toBe(100);
      expect(metrics.totalAcceptances).toBe(0);
      expect(metrics.acceptanceRate).toBe(0);
      expect(metrics.lineAcceptanceRate).toBe(0);
    });
  });

  describe('aggregateByLanguage', () => {
    it('should aggregate data by language', () => {
      const aggregated = aggregateByLanguage(mockUsageData);

      expect(aggregated).toHaveLength(3);

      const typescript = aggregated.find((item: LanguageBreakdown) => item.language === 'typescript');
      expect(typescript).toEqual({
        language: 'typescript',
        suggestions_count: 1500,
        acceptances_count: 1200,
        lines_suggested: 4500,
        lines_accepted: 3600,
      });

      const javascript = aggregated.find((item: LanguageBreakdown) => item.language === 'javascript');
      expect(javascript).toEqual({
        language: 'javascript',
        suggestions_count: 300,
        acceptances_count: 240,
        lines_suggested: 900,
        lines_accepted: 720,
      });

      const python = aggregated.find((item: LanguageBreakdown) => item.language === 'python');
      expect(python).toEqual({
        language: 'python',
        suggestions_count: 400,
        acceptances_count: 320,
        lines_suggested: 1200,
        lines_accepted: 960,
      });
    });

    it('should handle empty breakdown', () => {
      const data: CopilotUsageData[] = [
        {
          day: '2026-02-01',
          total_suggestions_count: 100,
          total_acceptances_count: 80,
          total_lines_suggested: 300,
          total_lines_accepted: 240,
          breakdown: [],
        },
      ];

      const aggregated = aggregateByLanguage(data);

      expect(aggregated).toHaveLength(0);
    });
  });

  describe('aggregateByEditor', () => {
    it('should aggregate data by editor', () => {
      const aggregated = aggregateByEditor(mockUsageData);

      expect(aggregated).toHaveLength(2);

      const vscode = aggregated.find((item: EditorBreakdown) => item.editor === 'vscode');
      expect(vscode).toEqual({
        editor: 'vscode',
        suggestions_count: 1800,
        acceptances_count: 1440,
        lines_suggested: 5400,
        lines_accepted: 4320,
      });

      const jetbrains = aggregated.find((item: EditorBreakdown) => item.editor === 'jetbrains');
      expect(jetbrains).toEqual({
        editor: 'jetbrains',
        suggestions_count: 400,
        acceptances_count: 320,
        lines_suggested: 1200,
        lines_accepted: 960,
      });
    });

    it('should handle empty breakdown', () => {
      const data: CopilotUsageData[] = [
        {
          day: '2026-02-01',
          total_suggestions_count: 100,
          total_acceptances_count: 80,
          total_lines_suggested: 300,
          total_lines_accepted: 240,
          breakdown: [],
        },
      ];

      const aggregated = aggregateByEditor(data);

      expect(aggregated).toHaveLength(0);
    });
  });

  describe('prepareDailyStats', () => {
    it('should prepare daily stats from usage data', () => {
      const dailyStats = prepareDailyStats(mockUsageData);

      expect(dailyStats).toHaveLength(2);
      expect(dailyStats[0]).toEqual({
        date: '2026-02-01',
        suggestions: 1000,
        acceptances: 800,
        linesSuggested: 3000,
        linesAccepted: 2400,
      });

      expect(dailyStats[1]).toEqual({
        date: '2026-02-02',
        suggestions: 1200,
        acceptances: 960,
        linesSuggested: 3600,
        linesAccepted: 2880,
      });
    });

    it('should handle empty array', () => {
      const dailyStats = prepareDailyStats([]);

      expect(dailyStats).toHaveLength(0);
    });
  });

  describe('transformUsageData', () => {
    it('should transform usage data into metrics with all components', () => {
      const transformed = transformUsageData(mockUsageData);

      expect(transformed).toHaveProperty('metrics');
      expect(transformed).toHaveProperty('dailyStats');
      expect(transformed).toHaveProperty('languageBreakdown');
      expect(transformed).toHaveProperty('editorBreakdown');

      // Check metrics
      expect(transformed.metrics.totalSuggestions).toBe(2200);
      expect(transformed.metrics.totalAcceptances).toBe(1760);
      expect(transformed.metrics.acceptanceRate).toBe(80);

      // Check that we have daily stats
      expect(transformed.dailyStats).toHaveLength(2);

      // Check that we have language breakdown
      expect(transformed.languageBreakdown.length).toBeGreaterThan(0);
      expect(transformed.languageBreakdown[0]).toHaveProperty('language');
      expect(transformed.languageBreakdown[0]).toHaveProperty('suggestions_count');

      // Check that we have editor breakdown
      expect(transformed.editorBreakdown.length).toBeGreaterThan(0);
      expect(transformed.editorBreakdown[0]).toHaveProperty('editor');
      expect(transformed.editorBreakdown[0]).toHaveProperty('suggestions_count');
    });

    it('should handle empty data', () => {
      const transformed = transformUsageData([]);

      expect(transformed.metrics.totalSuggestions).toBe(0);
      expect(transformed.metrics.totalAcceptances).toBe(0);
      expect(transformed.dailyStats).toHaveLength(0);
      expect(transformed.languageBreakdown).toHaveLength(0);
      expect(transformed.editorBreakdown).toHaveLength(0);
    });
  });
});
