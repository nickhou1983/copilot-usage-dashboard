import { describe, it, expect } from 'vitest';
import type {
  OrgType,
  LanguageBreakdown,
  EditorBreakdown,
  CopilotUsageData,
  UsageMetrics,
  DailyStat,
} from '../../types/copilot';

describe('Copilot Types', () => {
  describe('OrgType enum', () => {
    it('should have valid organization types', () => {
      // Type check - if this compiles, types are correct
      const org1: OrgType = 'organization';
      const org2: OrgType = 'enterprise';
      expect(org1).toBe('organization');
      expect(org2).toBe('enterprise');
    });
  });

  describe('LanguageBreakdown interface', () => {
    it('should have correct structure for language breakdown', () => {
      const breakdown: LanguageBreakdown = {
        language: 'TypeScript',
        suggestions_count: 100,
        acceptances_count: 75,
        lines_suggested: 500,
        lines_accepted: 375,
      };
      expect(breakdown.language).toBe('TypeScript');
      expect(breakdown.suggestions_count).toBe(100);
      expect(breakdown.acceptances_count).toBe(75);
      expect(breakdown.lines_suggested).toBe(500);
      expect(breakdown.lines_accepted).toBe(375);
    });
  });

  describe('EditorBreakdown interface', () => {
    it('should have correct structure for editor breakdown', () => {
      const breakdown: EditorBreakdown = {
        editor: 'vscode',
        suggestions_count: 200,
        acceptances_count: 150,
        lines_suggested: 1000,
        lines_accepted: 750,
      };
      expect(breakdown.editor).toBe('vscode');
      expect(breakdown.suggestions_count).toBe(200);
      expect(breakdown.acceptances_count).toBe(150);
      expect(breakdown.lines_suggested).toBe(1000);
      expect(breakdown.lines_accepted).toBe(750);
    });
  });

  describe('CopilotUsageData interface', () => {
    it('should have correct structure matching GitHub API response', () => {
      const usage: CopilotUsageData = {
        day: '2026-02-07',
        total_suggestions_count: 300,
        total_acceptances_count: 225,
        total_lines_suggested: 1500,
        total_lines_accepted: 1125,
        breakdown: [
          {
            language: 'TypeScript',
            editor: 'vscode',
            suggestions_count: 100,
            acceptances_count: 75,
            lines_suggested: 500,
            lines_accepted: 375,
          },
          {
            language: 'Python',
            editor: 'neovim',
            suggestions_count: 200,
            acceptances_count: 150,
            lines_suggested: 1000,
            lines_accepted: 750,
          },
        ],
      };
      expect(usage.day).toBe('2026-02-07');
      expect(usage.total_suggestions_count).toBe(300);
      expect(usage.total_acceptances_count).toBe(225);
      expect(usage.total_lines_suggested).toBe(1500);
      expect(usage.total_lines_accepted).toBe(1125);
      expect(usage.breakdown).toHaveLength(2);
      expect(usage.breakdown[0].language).toBe('TypeScript');
    });
  });

  describe('UsageMetrics interface', () => {
    it('should have correct structure for transformed metrics', () => {
      const metrics: UsageMetrics = {
        date: '2026-02-07',
        acceptanceRate: 0.75,
        lineAcceptanceRate: 0.75,
        totalSuggestions: 300,
        totalAcceptances: 225,
        totalLinesSuggested: 1500,
        totalLinesAccepted: 1125,
      };
      expect(metrics.date).toBe('2026-02-07');
      expect(metrics.acceptanceRate).toBe(0.75);
      expect(metrics.lineAcceptanceRate).toBe(0.75);
      expect(metrics.totalSuggestions).toBe(300);
      expect(metrics.totalAcceptances).toBe(225);
      expect(metrics.totalLinesSuggested).toBe(1500);
      expect(metrics.totalLinesAccepted).toBe(1125);
    });
  });

  describe('DailyStat interface', () => {
    it('should have correct structure for daily statistics', () => {
      const stat: DailyStat = {
        date: '2026-02-07',
        suggestions: 300,
        acceptances: 225,
        linesSuggested: 1500,
        linesAccepted: 1125,
      };
      expect(stat.date).toBe('2026-02-07');
      expect(stat.suggestions).toBe(300);
      expect(stat.acceptances).toBe(225);
      expect(stat.linesSuggested).toBe(1500);
      expect(stat.linesAccepted).toBe(1125);
    });
  });
});
