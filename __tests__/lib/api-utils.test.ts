import { describe, it, expect } from 'vitest';
import { handleAPIError } from '../../lib/api-utils';

describe('api-utils', () => {
  describe('handleAPIError', () => {
    it('should handle 401 Unauthorized error', () => {
      const error = { status: 401, message: 'Bad credentials' };
      const result = handleAPIError(error);
      expect(result).toContain('token');
      expect(result).toContain('invalid');
    });

    it('should handle 403 Forbidden error', () => {
      const error = { status: 403, message: 'API rate limit exceeded' };
      const result = handleAPIError(error);
      expect(result).toContain('permission');
    });

    it('should handle 404 Not Found error', () => {
      const error = { status: 404, message: 'Not Found' };
      const result = handleAPIError(error);
      expect(result).toContain('not found');
    });

    it('should handle 500 Server Error', () => {
      const error = { status: 500, message: 'Internal Server Error' };
      const result = handleAPIError(error);
      expect(result).toContain('server');
    });

    it('should handle 503 Service Unavailable', () => {
      const error = { status: 503, message: 'Service Unavailable' };
      const result = handleAPIError(error);
      expect(result).toContain('unavailable');
    });

    it('should handle error with response object', () => {
      const error = { response: { status: 401 } };
      const result = handleAPIError(error);
      expect(result).toContain('token');
    });

    it('should handle unknown error', () => {
      const error = { message: 'Something went wrong' };
      const result = handleAPIError(error);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle error object without status', () => {
      const error = new Error('Network error');
      const result = handleAPIError(error);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
