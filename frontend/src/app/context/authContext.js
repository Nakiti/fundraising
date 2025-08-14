"use client";
import { createContext, useEffect, useState, useCallback } from "react";
import { Services, useApi, useToast } from "../services";

export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
   const [currentUser, setCurrentUser] = useState(null);
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
   const { showError, showSuccess } = useToast();

   // API hooks for authentication
   const { execute: loginUser, loading: loginLoading } = useApi(Services.Auth.loginUser);
   const { execute: logoutUser, loading: logoutLoading } = useApi(Services.Auth.logoutUser);
   const { execute: getCurrentUser, loading: authCheckLoading } = useApi(Services.Auth.getCurrentUser);
 
   const login = async (inputs) => {
      try {
         setError(null);
         const response = await loginUser(inputs);
         
         if (response && response.success) {
            // Use consistent response structure - check if user is in response.data or response
            const userData = response.data?.user || response.user;
            setCurrentUser(userData);
            setIsLoggedIn(true);
            showSuccess('Login Successful', 'Welcome back!');
            return { success: true };
         } else {
            const errorMessage = response?.message || "Login failed";
            setError(errorMessage);
            showError('Login Failed', errorMessage);
            return { success: false, message: errorMessage };
         }
      } catch (err) {
         const errorMessage = err.message || "Login failed";
         setError(errorMessage);
         showError('Login Error', errorMessage);
         return { success: false, message: errorMessage };
      }
   };

   const logout = async () => {
      try {
         await logoutUser();
         setCurrentUser(null);
         setIsLoggedIn(false);
         setError(null);
         showSuccess('Logout Successful', 'You have been logged out successfully.');
      } catch (err) {
         // Even if logout fails, clear local state
         setCurrentUser(null);
         setIsLoggedIn(false);
         showError('Logout Error', 'An error occurred during logout, but you have been logged out locally.');
      }
   };

   // Clear invalid token from cookies
   const clearInvalidToken = useCallback(() => {
      try {
         // Remove the session cookie
         document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } catch (err) {
         // Silent error handling
      }
   }, []);

   const checkAuthStatus = useCallback(async () => {
      try {
         setLoading(true);
         const response = await getCurrentUser();
         
         if (response && response.success) {
            // Use consistent response structure - check if user is in response.data or response
            const userData = response.data?.user || response.user;
            setCurrentUser(userData);
            setIsLoggedIn(true);
         } else {
            setCurrentUser(null);
            setIsLoggedIn(false);
            // Clear invalid token if authentication failed
            clearInvalidToken();
         }
      } catch (err) {
         setCurrentUser(null);
         setIsLoggedIn(false);
         // Clear invalid token on error
         clearInvalidToken();
      } finally {
         setLoading(false);
      }
   }, [getCurrentUser, clearInvalidToken]);

   // Refetch auth status manually
   const refetchAuth = useCallback(async () => {
      await checkAuthStatus();
   }, [checkAuthStatus]);

   useEffect(() => {
      checkAuthStatus();
   }, []); // Remove getCurrentUser dependency to prevent infinite loops

   const clearError = () => {
      setError(null);
   };

   // Always render children, but provide loading state for components that need it
   return (
      <AuthContext.Provider value={{
         currentUser, 
         login, 
         logout, 
         isLoggedIn, 
         loading: loading || loginLoading || logoutLoading || authCheckLoading, 
         error, 
         clearError,
         checkAuthStatus,
         refetchAuth
      }}>
         {children}
      </AuthContext.Provider>
   );
}
