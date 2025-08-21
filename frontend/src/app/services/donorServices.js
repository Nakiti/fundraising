import { api, validators, errorHandler } from './apiClient.js';

// Donor Fetch Services
export class DonorFetchService {
   // Check donor session
   static async checkSession() {
      try {
         const response = await api.get('/donor/session');
         return response.success ? response.data : { authenticated: false };
      } catch (error) {
         console.error('Error checking donor session:', error);
         return { authenticated: false };
      }
   }

   // Get donor profile
   static async getDonorProfile() {
      try {
         const response = await api.get('/donor/profile');
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching donor profile:', error);
         throw error;
      }
   }

   // Get donor donations
   static async getDonorDonations() {
      try {
         const response = await api.get('/donor/donations');
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching donor donations:', error);
         throw error;
      }
   }

   // Get donor summary
   static async getDonorSummary() {
      try {
         const response = await api.get('/donor/summary');
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching donor summary:', error);
         throw error;
      }
   }

   // Get donor preferences
   static async getDonorPreferences() {
      try {
         const response = await api.get('/donor/preferences');
         return response.success ? response.data : {};
      } catch (error) {
         console.error('Error fetching donor preferences:', error);
         throw error;
      }
   }

   // Admin: Get organization donors
   static async getOrganizationDonors(organizationId, limit = 50, offset = 0) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/donor/${organizationId}/admin/donors`, {
            params: { limit, offset }
         });
         return response.success ? response.data : [];
      } catch (error) {
         console.error('Error fetching organization donors:', error);
         throw error;
      }
   }

   // Admin: Get donor analytics
   static async getDonorAnalytics(organizationId) {
      try {
         validators.id(organizationId, 'Organization ID');
         const response = await api.get(`/donor/${organizationId}/admin/analytics`);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error fetching donor analytics:', error);
         throw error;
      }
   }
}

// Donor Create Services
export class DonorCreateService {
   // Register new donor
   static async registerDonor(organizationId, donorData) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(donorData.email, 'Email');
         validators.required(donorData.password, 'Password');
         validators.required(donorData.firstName, 'First Name');
         validators.required(donorData.lastName, 'Last Name');
         validators.email(donorData.email, 'Email');
         validators.minLength(donorData.password, 6, 'Password');

         const response = await api.post(`/donor/${organizationId}/register`, donorData);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error registering donor:', error);
         throw error;
      }
   }

   // Login donor
   static async loginDonor(organizationId, email, password) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(email, 'Email');
         validators.required(password, 'Password');
         validators.email(email, 'Email');

         const response = await api.post(`/donor/${organizationId}/login`, {
            email,
            password
         });
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error logging in donor:', error);
         throw error;
      }
   }

   // Record donation
   static async recordDonation(donationData) {
      try {
         validators.required(donationData.campaignId, 'Campaign ID');
         validators.required(donationData.amount, 'Amount');
         validators.number(donationData.amount, 'Amount');

         const response = await api.post('/donor/donations', donationData);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error recording donation:', error);
         throw error;
      }
   }
}

// Donor Update Services
export class DonorUpdateService {
   // Update donor profile
   static async updateDonorProfile(profileData) {
      try {
         validators.required(profileData.firstName, 'First Name');
         validators.required(profileData.lastName, 'Last Name');

         const response = await api.put('/donor/profile', profileData);
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donor profile:', error);
         throw error;
      }
   }

   // Update donor preferences
   static async updateDonorPreferences(key, value) {
      try {
         validators.required(key, 'Preference Key');
         validators.required(value, 'Preference Value');

         const response = await api.put('/donor/preferences', { key, value });
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donor preferences:', error);
         throw error;
      }
   }
}

// Donor Auth Services
export class DonorAuthService {
   // Logout donor
   static async logoutDonor() {
      try {
         const response = await api.post('/donor/logout');
         return response.success;
      } catch (error) {
         console.error('Error logging out donor:', error);
         throw error;
      }
   }

   // Validate donor session
   static async validateSession(sessionToken) {
      try {
         if (!sessionToken) {
            return false;
         }

         const response = await api.get('/donor/session');
         return response.success && response.data.authenticated;
      } catch (error) {
         console.error('Error validating donor session:', error);
         return false;
      }
   }
}
