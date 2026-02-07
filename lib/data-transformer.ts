import type {
  CopilotUsageData,
  UsageMetrics,
  DailyStat,
  LanguageBreakdown,
  EditorBreakdown,
} from "../types/copilot";

/**
 * Calculate aggregated metrics from usage data
 */
export interface AggregatedMetrics {
  totalSuggestions: number;
  totalAcceptances: number;
  acceptanceRate: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  lineAcceptanceRate: number;
}

/**
 * Calculate metrics from Copilot usage data
 */
export function calculateMetrics(data: CopilotUsageData[]): AggregatedMetrics {
  if (data.length === 0) {
    return {
      totalSuggestions: 0,
      totalAcceptances: 0,
      acceptanceRate: 0,
      totalLinesSuggested: 0,
      totalLinesAccepted: 0,
      lineAcceptanceRate: 0,
    };
  }

  const totalSuggestions = data.reduce(
    (sum, item) => sum + item.total_suggestions_count,
    0,
  );
  const totalAcceptances = data.reduce(
    (sum, item) => sum + item.total_acceptances_count,
    0,
  );
  const totalLinesSuggested = data.reduce(
    (sum, item) => sum + item.total_lines_suggested,
    0,
  );
  const totalLinesAccepted = data.reduce(
    (sum, item) => sum + item.total_lines_accepted,
    0,
  );

  const acceptanceRate =
    totalSuggestions > 0 ? (totalAcceptances / totalSuggestions) * 100 : 0;
  const lineAcceptanceRate =
    totalLinesSuggested > 0
      ? (totalLinesAccepted / totalLinesSuggested) * 100
      : 0;

  return {
    totalSuggestions,
    totalAcceptances,
    acceptanceRate: Math.round(acceptanceRate * 100) / 100,
    totalLinesSuggested,
    totalLinesAccepted,
    lineAcceptanceRate: Math.round(lineAcceptanceRate * 100) / 100,
  };
}

/**
 * Aggregate usage data by language
 */
export function aggregateByLanguage(
  data: CopilotUsageData[],
): LanguageBreakdown[] {
  const languageMap: Map<string, LanguageBreakdown> = new Map();

  for (const day of data) {
    for (const item of day.breakdown) {
      const key = item.language;
      const existing = languageMap.get(key) || {
        language: item.language,
        suggestions_count: 0,
        acceptances_count: 0,
        lines_suggested: 0,
        lines_accepted: 0,
      };

      existing.suggestions_count += item.suggestions_count;
      existing.acceptances_count += item.acceptances_count;
      existing.lines_suggested += item.lines_suggested;
      existing.lines_accepted += item.lines_accepted;

      languageMap.set(key, existing);
    }
  }

  return Array.from(languageMap.values());
}

/**
 * Aggregate usage data by editor
 */
export function aggregateByEditor(data: CopilotUsageData[]): EditorBreakdown[] {
  const editorMap: Map<string, EditorBreakdown> = new Map();

  for (const day of data) {
    for (const item of day.breakdown) {
      const key = item.editor;
      const existing = editorMap.get(key) || {
        editor: item.editor,
        suggestions_count: 0,
        acceptances_count: 0,
        lines_suggested: 0,
        lines_accepted: 0,
      };

      existing.suggestions_count += item.suggestions_count;
      existing.acceptances_count += item.acceptances_count;
      existing.lines_suggested += item.lines_suggested;
      existing.lines_accepted += item.lines_accepted;

      editorMap.set(key, existing);
    }
  }

  return Array.from(editorMap.values());
}

/**
 * Prepare daily statistics from usage data
 */
export function prepareDailyStats(data: CopilotUsageData[]): DailyStat[] {
  return data.map((item) => ({
    date: item.day,
    suggestions: item.total_suggestions_count,
    acceptances: item.total_acceptances_count,
    linesSuggested: item.total_lines_suggested,
    linesAccepted: item.total_lines_accepted,
  }));
}

/**
 * Transformed response structure
 */
export interface TransformedData {
  metrics: UsageMetrics;
  dailyStats: DailyStat[];
  languageBreakdown: LanguageBreakdown[];
  editorBreakdown: EditorBreakdown[];
}

/**
 * Transform raw GitHub API response into frontend-friendly format
 */
export function transformUsageData(data: CopilotUsageData[]): TransformedData {
  const metrics = calculateMetrics(data);
  const dailyStats = prepareDailyStats(data);
  const languageBreakdown = aggregateByLanguage(data);
  const editorBreakdown = aggregateByEditor(data);

  // Convert metrics to UsageMetrics format
  const usageMetrics: UsageMetrics = {
    date: new Date().toISOString().split("T")[0],
    acceptanceRate: metrics.acceptanceRate,
    lineAcceptanceRate: metrics.lineAcceptanceRate,
    totalSuggestions: metrics.totalSuggestions,
    totalAcceptances: metrics.totalAcceptances,
    totalLinesSuggested: metrics.totalLinesSuggested,
    totalLinesAccepted: metrics.totalLinesAccepted,
  };

  return {
    metrics: usageMetrics,
    dailyStats,
    languageBreakdown,
    editorBreakdown,
  };
}
