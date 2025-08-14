import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Custom error class for API errors
export class APIError extends Error {
   constructor(message, status, code, details = null) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.code = code;
      this.details = details;
   }
}

// Validation error class
export class ValidationError extends Error {
   constructor(message, field, value) {
      super(message);
      this.name = 'ValidationError';
      this.field = field;
      this.value = value;
   }
}

// Create axios instance with default config
const apiClient = axios.create({
   baseURL: API_BASE_URL,
   withCredentials: true,
   timeout: 15000, // 15 seconds
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor
apiClient.interceptors.request.use(
   (config) => {
      // Add request timestamp for debugging
      config.metadata = { startTime: new Date() };
      
      // Log request in development
      // if (process.env.NODE_ENV === 'development') {
      //    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      //       data: config.data,
      //       params: config.params,
      //    });
      // }
      
      return config;
   },
   (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(new APIError('Request failed', 0, 'REQUEST_ERROR', error));
   }
);

// Response interceptor
apiClient.interceptors.response.use(
   (response) => {
      // Calculate request duration
      const duration = new Date() - response.config.metadata.startTime;
      
      // Log response in development
      // if (process.env.NODE_ENV === 'development') {
      //    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
      //       status: response.status,
      //       data: response.data,
      //    });
      // }
      
      return response;
   },
   (error) => {
      const duration = error.config?.metadata?.startTime 
         ? new Date() - error.config.metadata.startTime 
         : 0;
      
      // Only log in development, not in production
      if (process.env.NODE_ENV === 'development') {
         console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
         });
      }
      
      // Handle different types of errors
      if (error.response) {
         // Server responded with error status
         const { status, data } = error.response;
         const message = data?.message || `HTTP ${status} Error`;
         const code = data?.code || `HTTP_${status}`;
         
         // Handle specific status codes
         switch (status) {
            case 401:
               // Unauthorized - could trigger logout
               window.dispatchEvent(new CustomEvent('unauthorized'));
               break;
            case 403:
               // Forbidden
               break;
            case 404:
               // Not found
               break;
            case 422:
               // Validation error
               return Promise.reject(new ValidationError(message, data?.field, data?.value));
            case 429:
               // Rate limited
               return Promise.reject(new APIError('Too many requests. Please try again later.', status, 'RATE_LIMITED'));
            case 500:
               // Server error
               return Promise.reject(new APIError('Server error. Please try again later.', status, 'SERVER_ERROR'));
            default:
               return Promise.reject(new APIError(message, status, code, data));
         }
         
         return Promise.reject(new APIError(message, status, code, data));
      } else if (error.request) {
         // Network error
         return Promise.reject(new APIError('Network error. Please check your connection.', 0, 'NETWORK_ERROR'));
      } else {
         // Other error
         return Promise.reject(new APIError(error.message || 'Unknown error occurred.', 0, 'UNKNOWN_ERROR'));
      }
   }
);

// Utility functions for common operations
export const api = {
   // GET request with error handling
   get: async (url, config = {}) => {
      try {
         const response = await apiClient.get(url, config);
         return response.data;
      } catch (error) {
         throw error;
      }
   },
   
   // POST request with error handling
   post: async (url, data = {}, config = {}) => {
      try {
         const response = await apiClient.post(url, data, config);
         return response.data;
      } catch (error) {
         throw error;
      }
   }, 
   
   // PUT request with error handling
   put: async (url, data = {}, config = {}) => {
      try {
         const response = await apiClient.put(url, data, config);
         return response.data;
      } catch (error) {
         throw error;
      }
   },
   
   // DELETE request with error handling
   delete: async (url, config = {}) => {
      try {
         const response = await apiClient.delete(url, config);
         return response.data;
      } catch (error) {
         throw error;
      }
   },
   
   // PATCH request with error handling
   patch: async (url, data = {}, config = {}) => {
      try {
         const response = await apiClient.patch(url, data, config);
         return response.data;
      } catch (error) {
         throw error;
      }
   },
};

// Validation utilities
export const validators = {
   // Email validation
   email: (email) => {
      // Allow empty values during typing
      if (!email || email.trim() === '') {
         return true;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new ValidationError('Please provide a valid email address', 'email', email);
      }
      return true;
   },
   
   // Password validation
   password: (password, minLength = 2) => {
      // Allow empty values during typing
      if (!password || password.trim() === '') {
         return true;
      }
      
      if (password.length < minLength) {
         throw new ValidationError(`Password must be at least ${minLength} characters long`, 'password', password);
      }
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(password)) {
         throw new ValidationError('Password must contain at least one uppercase letter, one lowercase letter, and one number', 'password', password);
      }
      
      return true;
   },
   
   // Required field validation
   required: (value, fieldName) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
         throw new ValidationError(`${fieldName} is required`, fieldName, value);
      }
      return true;
   },
   
   // String length validation
   minLength: (value, minLength, fieldName) => {
      if (!value || value.length < minLength) {
         throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`, fieldName, value);
      }
      return true;
   },
   
   // Number validation
   number: (value, fieldName) => {
      if (isNaN(value) || value === null || value === undefined) {
         throw new ValidationError(`${fieldName} must be a valid number`, fieldName, value);
      }
      return true;
   },
   
   // Positive number validation
   positiveNumber: (value, fieldName) => {
      validators.number(value, fieldName);
      if (value <= 0) {
         throw new ValidationError(`${fieldName} must be a positive number`, fieldName, value);
      }
      return true;
   },
   
   // Date validation
   date: (value, fieldName) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
         throw new ValidationError(`${fieldName} must be a valid date`, fieldName, value);
      }
      return true;
   },
   
   // URL validation
   url: (value, fieldName) => {
      try {
         new URL(value);
         return true;
      } catch {
         throw new ValidationError(`${fieldName} must be a valid URL`, fieldName, value);
      }
   },
   
   // ID validation
   id: (value, fieldName) => {
      if (!value || (typeof value === 'string' && value.trim() === '') || value <= 0) {
         throw new ValidationError(`${fieldName} must be a valid ID`, fieldName, value);
      }
      return true;
   },
};

// Error handling utilities
export const errorHandler = {
   // Handle API errors and return user-friendly messages
   handle: (error) => {
      if (error instanceof ValidationError) {
         return {
            type: 'validation',
            message: error.message,
            field: error.field,
            value: error.value,
         };
      }
      
      if (error instanceof APIError) {
         return {
            type: 'api',
            message: error.message,
            status: error.status,
            code: error.code,
         };
      }
      
      // Generic error
      return {
         type: 'unknown',
         message: error.message || 'An unexpected error occurred',
      };
   },
   
   // Check if error is retryable
   isRetryable: (error) => {
      if (error instanceof APIError) {
         return [408, 429, 500, 502, 503, 504].includes(error.status);
      }
      return false;
   },
   
   // Get user-friendly error message
   getMessage: (error) => {
      const handled = errorHandler.handle(error);
      return handled.message;
   },
};

export default apiClient;
