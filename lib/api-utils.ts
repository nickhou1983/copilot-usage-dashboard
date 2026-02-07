/**
 * Unified API error handler for GitHub API calls
 * Converts API errors into user-friendly error messages
 */
export function handleAPIError(error: any): string {
  // Extract status code from error
  const status = error?.status || error?.response?.status;

  switch (status) {
    case 401:
      return 'Authentication failed: Your GitHub token is invalid or expired. Please provide a valid Personal Access Token.';
    case 403:
      return 'Permission denied: You do not have permission to access this resource or API rate limit has been exceeded.';
    case 404:
      return 'Resource not found: The organization or enterprise does not exist or is not accessible.';
    case 500:
      return 'GitHub server error: The GitHub API encountered an internal server error. Please try again later.';
    case 503:
      return 'GitHub service unavailable: The GitHub API is temporarily unavailable. Please try again later.';
    default:
      // Handle other HTTP errors
      if (status && status >= 400 && status < 500) {
        return `Client error (${status}): ${error?.message || 'An error occurred while processing your request.'}`;
      }
      if (status && status >= 500) {
        return `Server error (${status}): ${error?.message || 'GitHub API server encountered an error.'}`;
      }
      // Handle non-HTTP errors
      if (error?.message) {
        return `API error: ${error.message}`;
      }
      return 'An unknown error occurred while communicating with the GitHub API.';
  }
}
