/**
 * ValidationService - Centralized validation logic
 * Wraps the existing validation utilities from apiClient.js
 */
import { validators } from '../apiClient.js';

export class ValidationService {
  /**
   * Validate email format
   */
  static email(email) {
    return validators.email(email);
  }

  /**
   * Validate password strength
   */
  static password(password, minLength = 8) {
    return validators.password(password, minLength);
  }

  /**
   * Validate required field
   */
  static required(value, fieldName) {
    return validators.required(value, fieldName);
  }

  /**
   * Validate minimum string length
   */
  static minLength(value, minLength, fieldName) {
    return validators.minLength(value, minLength, fieldName);
  }

  /**
   * Validate number
   */
  static number(value, fieldName) {
    return validators.number(value, fieldName);
  }

  /**
   * Validate positive number
   */
  static positiveNumber(value, fieldName) {
    return validators.positiveNumber(value, fieldName);
  }

  /**
   * Validate date
   */
  static date(value, fieldName) {
    return validators.date(value, fieldName);
  }

  /**
   * Validate URL format
   */
  static url(value, fieldName) {
    return validators.url(value, fieldName);
  }

  /**
   * Validate ID field
   */
  static id(value, fieldName) {
    return validators.id(value, fieldName);
  }

  /**
   * Get all validators for direct access
   */
  static getValidators() {
    return validators;
  }
}
