/**
 * Date presets for data range selection
 */
export const DATE_PRESETS = Object.freeze({
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
} as const);

/**
 * Color palette for charts
 */
export const CHART_COLORS = Object.freeze({
  primary: '#0969da',
  secondary: '#6e40aa',
  success: '#26a641',
  warning: '#fb8500',
} as const);

/**
 * GitHub API endpoints
 */
export const API_ENDPOINTS = Object.freeze({
  COPILOT_USAGE_ORG: '/organizations/{org}/copilot/usage',
  COPILOT_USAGE_ENTERPRISE: '/enterprises/{enterprise}/copilot/usage',
} as const);

/**
 * localStorage key names
 */
export const STORAGE_KEYS = Object.freeze({
  GITHUB_CONFIG: 'copilot-github-config',
  USER_SETTINGS: 'copilot-user-settings',
  CACHE_DATA: 'copilot-cache-data',
} as const);
