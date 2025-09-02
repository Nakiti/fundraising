import { api, validators } from '../apiClient.js';

/**
 * Base service class providing common API operations
 * All domain services should extend this class
 */
export class BaseService {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  /**
   * Execute a GET request with error handling
   */
  async get(endpoint, params = {}) {
    try {
      const response = await api.get(endpoint, { params });
      return response.success ? response : null;
    } catch (error) {
      this.handleError('GET', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a POST request with error handling
   */
  async post(endpoint, data = {}) {
    try {
      const response = await api.post(endpoint, data);
      console.log('POST response:', response);
      return response.success ? response : null;
    } catch (error) {
      this.handleError('POST', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a PUT request with error handling
   */
  async put(endpoint, data = {}) {
    try {
      const response = await api.put(endpoint, data);
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      this.handleError('PUT', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a DELETE request with error handling
   */
  async delete(endpoint) {
    try {
      const response = await api.delete(endpoint);
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      this.handleError('DELETE', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a PATCH request with error handling
   */
  async patch(endpoint, data = {}) {
    try {
      const response = await api.patch(endpoint, data);
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      this.handleError('PATCH', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a GET request with query parameters
   */
  async getWithQuery(endpoint, queryParams = {}) {
    try {
      const response = await api.get(endpoint, { params: queryParams });
      return response.success ? response : null;
    } catch (error) {
      this.handleError('GET', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a POST request with FormData (for file uploads)
   */
  async postFormData(endpoint, formData) {
    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      this.handleError('POST', endpoint, error);
      throw error;
    }
  }

  /**
   * Execute a PUT request with FormData (for file uploads)
   */
  async putFormData(endpoint, formData) {
    try {
      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      this.handleError('PUT', endpoint, error);
      throw error;
    }
  }

  /**
   * Centralized error handling with service context
   */
  handleError(method, endpoint, error) {
    console.error(`[${this.serviceName}] ${method} ${endpoint} failed:`, {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      service: this.serviceName,
      endpoint,
      method,
    });
  }

  /**
   * Validate required fields
   */
  validateRequired(data, fieldName) {
    validators.required(data, fieldName);
  }

  /**
   * Validate ID fields
   */
  validateId(id, fieldName) {
    validators.id(id, fieldName);
  }

  /**
   * Validate email fields
   */
  validateEmail(email, fieldName) {
    validators.email(email, fieldName);
  }

  /**
   * Validate minimum length
   */
  validateMinLength(value, minLength, fieldName) {
    validators.minLength(value, minLength, fieldName);
  }

  /**
   * Validate maximum length
   */
  validateMaxLength(value, maxLength, fieldName) {
    validators.maxLength(value, maxLength, fieldName);
  }

  /**
   * Validate date fields
   */
  validateDate(date, fieldName) {
    validators.date(date, fieldName);
  }

  /**
   * Validate number fields
   */
  validateNumber(value, fieldName) {
    validators.number(value, fieldName);
  }

  /**
   * Validate minimum value for numbers
   */
  validateMin(value, minValue, fieldName) {
    validators.number(value, fieldName);
    if (value < minValue) {
      throw new Error(`${fieldName} must be at least ${minValue}`);
    }
  }

  /**
   * Validate maximum value for numbers
   */
  validateMax(value, maxValue, fieldName) {
    validators.number(value, fieldName);
    if (value > maxValue) {
      throw new Error(`${fieldName} must be no more than ${maxValue}`);
    }
  }

  /**
   * Validate array fields
   */
  validateArray(value, fieldName) {
    if (!Array.isArray(value)) {
      throw new Error(`${fieldName} must be an array`);
    }
  }

  /**
   * Validate array length
   */
  validateArrayLength(value, minLength, maxLength, fieldName) {
    this.validateArray(value, fieldName);
    if (value.length < minLength || value.length > maxLength) {
      throw new Error(`${fieldName} must have between ${minLength} and ${maxLength} items`);
    }
  }

  /**
   * Validate enum values
   */
  validateEnum(value, allowedValues, fieldName) {
    if (!allowedValues.includes(value)) {
      throw new Error(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
  }

  /**
   * Validate date range (start date must be before end date)
   */
  validateDateRange(startDate, endDate, fieldName = 'Date range') {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new Error(`${fieldName}: Start date must be before end date`);
    }
  }

  /**
   * Validate string fields
   */
  validateString(value, fieldName) {
    if (!value || typeof value !== 'string') {
      throw new Error(`${fieldName} must be a string`);
    }
  }

  /**
   * Validate object fields
   */
  validateObject(value, fieldName) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${fieldName} must be an object`);
    }
  }

  /**
   * Create FormData from object
   */
  createFormData(data) {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });
    
    return formData;
  }

  /**
   * Format date for API
   */
  formatDate(date) {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Build query string from object
   */
  buildQueryString(params) {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return searchParams.toString();
  }
}
