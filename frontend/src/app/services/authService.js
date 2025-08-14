import { api, validators, errorHandler } from './apiClient.js';

// Authentication service with comprehensive error handling and validation
export class AuthService {
   // Login user with validation
   static async loginUser(inputs) {
      try {
         // Validate inputs
         validators.required(inputs.email, 'Email');
         validators.email(inputs.email);
         validators.required(inputs.password, 'Password');
         // validators.minLength(inputs.password, 6, 'Password');

         const response = await api.post('/user/login', inputs);
         
         if (!response.success) {
            throw new Error(response.message || 'Login failed');
         }
         
         return response;
      } catch (error) {
         throw error;
      }
   }

   // Logout user
   static async logoutUser() {
      try {
         const response = await api.post('/user/logout');
         return response;
      } catch (error) {
         // Don't throw error for logout - always clear local state
         return { success: true };
      }
   }

   // Register user with validation
   static async registerUser(userData) {
      try {
         // Validate all required fields
         validators.required(userData.firstName, 'First Name');
         validators.minLength(userData.firstName, 2, 'First Name');
         validators.required(userData.lastName, 'Last Name');
         validators.minLength(userData.lastName, 2, 'Last Name');
         validators.required(userData.email, 'Email');
         validators.email(userData.email);
         validators.required(userData.password, 'Password');
         validators.password(userData.password, 8);

         const response = await api.post('/user/create', userData);
         
         if (!response.success) {
            throw new Error(response.message || 'Registration failed');
         }
         
         return response;
      } catch (error) {
         throw error;
      }
   }

   // Update password with validation
   static async updatePassword(passwordData) {
      try {
         validators.required(passwordData.email, 'Email');
         validators.email(passwordData.email);
         validators.required(passwordData.password, 'Password');
         validators.password(passwordData.password, 8);

         const response = await api.put('/user/updatePassword', passwordData);
         
         if (!response.success) {
            throw new Error(response.message || 'Password update failed');
         }
         
         return response;
      } catch (error) {
         throw error;
      }
   }

   // Get current user
   static async getCurrentUser() {
      try {
         const response = await api.get('/user/getCurrentUser');
         
         if (!response.success) {
            throw new Error(response.message || 'Failed to get current user');
         }
         
         return response;
      } catch (error) {
         throw error;
      }
   }

   // Check if user is authenticated
   static async checkAuthStatus() {
      try {
         const response = await this.getCurrentUser();
         return response.success && response.user;
      } catch (error) {
         return false;
      }
   }

   // Refresh token (if implemented)
   static async refreshToken() {
      try {
         const response = await api.post('/user/refresh');
         return response;
      } catch (error) {
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const loginUser = AuthService.loginUser;
export const logoutUser = AuthService.logoutUser;
export const registerUser = AuthService.registerUser;
export const updatePassword = AuthService.updatePassword;
export const getCurrentUser = AuthService.getCurrentUser;
export const checkAuthStatus = AuthService.checkAuthStatus;
export const refreshToken = AuthService.refreshToken;