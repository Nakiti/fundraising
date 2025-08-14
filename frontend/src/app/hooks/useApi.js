import { useState, useCallback, useRef } from 'react';
import { errorHandler } from '../services/apiClient.js';

export const useApi = (apiFunction, options = {}) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);
   
   const retryCountRef = useRef(0);
   const maxRetries = options.maxRetries || 3;
   const retryDelay = options.retryDelay || 1000;

   const execute = useCallback(async (...args) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      try {
         const result = await apiFunction(...args);
         setData(result);
         setSuccess(true);
         retryCountRef.current = 0; // Reset retry count on success
         return result;
      } catch (err) {
         const handledError = errorHandler.handle(err);
         setError(handledError);
         
         // Retry logic for retryable errors
         if (errorHandler.isRetryable(err) && retryCountRef.current < maxRetries) {
            retryCountRef.current++;
            console.log(`Retrying... Attempt ${retryCountRef.current}/${maxRetries}`);
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * retryCountRef.current));
            
            // Recursive retry
            return execute(...args);
         }
         
         throw err;
      } finally {
         setLoading(false);
      }
   }, [apiFunction, maxRetries, retryDelay]);

   const reset = useCallback(() => {
      setData(null);
      setLoading(false);
      setError(null);
      setSuccess(false);
      retryCountRef.current = 0;
   }, []);

   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      data,
      loading,
      error,
      success,
      execute,
      reset,
      clearError,
   };
};

// Hook for handling form submissions
export const useFormSubmit = (submitFunction, options = {}) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const submit = useCallback(async (formData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
         const result = await submitFunction(formData);
         setSuccess(true);
         
         // Auto-reset success state after delay
         if (options.autoReset !== false) {
            setTimeout(() => setSuccess(false), options.autoResetDelay || 3000);
         }
         
         return result;
      } catch (err) {
         const handledError = errorHandler.handle(err);
         setError(handledError);
         throw err;
      } finally {
         setLoading(false);
      }
   }, [submitFunction, options.autoReset, options.autoResetDelay]);

   const reset = useCallback(() => {
      setLoading(false);
      setError(null);
      setSuccess(false);
   }, []);

   const clearError = useCallback(() => {
      setError(null);
   }, []);

   return {
      loading,
      error,
      success,
      submit,
      reset,
      clearError,
   };
};

// Hook for handling data fetching with caching
export const useDataFetch = (fetchFunction, dependencies = [], options = {}) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [lastFetched, setLastFetched] = useState(null);
   
   const cacheKey = options.cacheKey || JSON.stringify(dependencies);
   const cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes

   const fetchData = useCallback(async () => {
      // Check cache first
      if (options.enableCache !== false && lastFetched) {
         const timeSinceLastFetch = Date.now() - lastFetched;
         if (timeSinceLastFetch < cacheTimeout) {
            return; // Use cached data
         }
      }

      setLoading(true);
      setError(null);

      try {
         const result = await fetchFunction(...dependencies);
         setData(result);
         setLastFetched(Date.now());
      } catch (err) {
         const handledError = errorHandler.handle(err);
         setError(handledError);
      } finally {
         setLoading(false);
      }
   }, [fetchFunction, dependencies, cacheTimeout, options.enableCache, lastFetched]);

   const refetch = useCallback(() => {
      setLastFetched(null); // Clear cache
      return fetchData();
   }, [fetchData]);

   const reset = useCallback(() => {
      setData(null);
      setLoading(true);
      setError(null);
      setLastFetched(null);
   }, []);

   return {
      data,
      loading,
      error,
      fetchData,
      refetch,
      reset,
      lastFetched,
   };
};
