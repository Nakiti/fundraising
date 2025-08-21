"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { DonorFetchService, DonorCreateService, DonorUpdateService, DonorAuthService } from "../services/donorServices";

const DonorContext = createContext();

export const DonorProvider = ({ children, organizationId }) => {
    const [donor, setDonor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            setLoading(true);
            const sessionData = await DonorFetchService.checkSession();
            
            if (sessionData.authenticated && sessionData.donor) {
                setDonor(sessionData.donor);
            } else {
                setDonor(null);
            }
        } catch (error) {
            console.error('Session check error:', error);
            setDonor(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await DonorCreateService.loginDonor(organizationId, email, password);

            if (result && result.donor) {
                setDonor(result.donor);
                return { success: true };
            } else {
                setError('Login failed');
                return { success: false, error: 'Login failed' };
            }
        } catch (error) {
            const errorMessage = error.message || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (donorData) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await DonorCreateService.registerDonor(organizationId, donorData);

            if (result) {
                // After registration, log them in
                return await login(donorData.email, donorData.password);
            } else {
                setError('Registration failed');
                return { success: false, error: 'Registration failed' };
            }
        } catch (error) {
            const errorMessage = error.message || 'Registration failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await DonorAuthService.logoutDonor();
            setDonor(null);
            setError(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await DonorUpdateService.updateDonorProfile(profileData);

            if (result) {
                // Update local donor state
                setDonor(prev => ({ ...prev, ...profileData }));
                return { success: true };
            } else {
                setError('Profile update failed');
                return { success: false, error: 'Profile update failed' };
            }
        } catch (error) {
            const errorMessage = error.message || 'Profile update failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const getDonations = async () => {
        try {
            return await DonorFetchService.getDonorDonations();
        } catch (error) {
            console.error('Get donations error:', error);
            return [];
        }
    };

    const getSummary = async () => {
        try {
            return await DonorFetchService.getDonorSummary();
        } catch (error) {
            console.error('Get summary error:', error);
            return null;
        }
    };

    const recordDonation = async (donationData) => {
        try {
            return await DonorCreateService.recordDonation(donationData);
        } catch (error) {
            console.error('Record donation error:', error);
            return null;
        }
    };

    const updatePreference = async (key, value) => {
        try {
            const result = await DonorUpdateService.updateDonorPreferences(key, value);
            return result !== null;
        } catch (error) {
            console.error('Update preference error:', error);
            return false;
        }
    };

    const getPreferences = async () => {
        try {
            return await DonorFetchService.getDonorPreferences();
        } catch (error) {
            console.error('Get preferences error:', error);
            return {};
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        donor,
        loading,
        error,
        isAuthenticated: !!donor,
        login,
        register,
        logout,
        updateProfile,
        getDonations,
        getSummary,
        recordDonation,
        updatePreference,
        getPreferences,
        clearError,
        checkSession
    };

    return (
        <DonorContext.Provider value={value}>
            {children}
        </DonorContext.Provider>
    );
};

export const useDonor = () => {
    const context = useContext(DonorContext);
    if (!context) {
        throw new Error('useDonor must be used within a DonorProvider');
    }
    return context;
};
