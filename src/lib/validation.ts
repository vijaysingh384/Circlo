import type { ValidationResult, ValidationRules } from '../types';
import { containsMaliciousCode } from '../utils/string';

export const VALIDATION_RULES: ValidationRules = {
  MAX_EVENT_NAME_LENGTH: 100,
};

export function validateEventName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Event name is required',
    };
  }

  if (name.trim().length > VALIDATION_RULES.MAX_EVENT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Event name is too long (max ${VALIDATION_RULES.MAX_EVENT_NAME_LENGTH} characters)`,
    };
  }

  if (containsMaliciousCode(name)) {
    return {
      valid: false,
      error: 'Event name contains invalid characters',
    };
  }

  return { valid: true, sanitized: name.trim() };
}
