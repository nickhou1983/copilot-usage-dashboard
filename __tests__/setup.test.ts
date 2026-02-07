import { describe, it, expect } from 'vitest';

describe('Test Environment Setup', () => {
  it('should verify Vitest is properly configured', () => {
    expect(true).toBe(true);
  });

  it('should have Node environment available', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should support ES modules', () => {
    const obj = { a: 1, b: 2 };
    const { a, ...rest } = obj;
    expect(a).toBe(1);
    expect(rest).toEqual({ b: 2 });
  });
});
