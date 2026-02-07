/**
 * Organization type for Copilot API
 */
export type OrgType = 'organization' | 'enterprise';

/**
 * Language breakdown from Copilot usage data
 */
export interface LanguageBreakdown {
  language: string;
  suggestions_count: number;
  acceptances_count: number;
  lines_suggested: number;
  lines_accepted: number;
}

/**
 * Editor breakdown from Copilot usage data
 */
export interface EditorBreakdown {
  editor: string;
  suggestions_count: number;
  acceptances_count: number;
  lines_suggested: number;
  lines_accepted: number;
}

/**
 * Single breakdown entry with both language and editor info
 */
export interface BreakdownEntry extends LanguageBreakdown, EditorBreakdown {
  // Combines both language and editor breakdown
}

/**
 * Copilot usage data matching GitHub API response format
 */
export interface CopilotUsageData {
  day: string; // YYYY-MM-DD format
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  breakdown: Array<{
    language: string;
    editor: string;
    suggestions_count: number;
    acceptances_count: number;
    lines_suggested: number;
    lines_accepted: number;
  }>;
}

/**
 * Transformed metrics for frontend display
 */
export interface UsageMetrics {
  date: string;
  acceptanceRate: number;
  lineAcceptanceRate: number;
  totalSuggestions: number;
  totalAcceptances: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
}

/**
 * Daily statistics for charts and displays
 */
export interface DailyStat {
  date: string;
  suggestions: number;
  acceptances: number;
  linesSuggested: number;
  linesAccepted: number;
}
