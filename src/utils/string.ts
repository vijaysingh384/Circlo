/**
 * Generate a random alphanumeric code
 */
export function generateCode(length: number = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
}

/**
 * Check if string contains malicious patterns
 */
export function containsMaliciousCode(str: string): boolean {
  return /<script|javascript:|onerror=/i.test(str);
}
