import { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeService } from '../services/domain/ThemeService.js';
import { errorHandler } from '../services/apiClient.js';

/**
 * Custom hook for managing organization theme colors
 * Provides theme data, loading states, and utility functions
 */
export const useTheme = (organizationId, options = {}) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const themeService = useMemo(() => new ThemeService(), []);
  const cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes
  const autoApply = options.autoApply !== false; // Default to true

  /**
   * Fetch theme data from API
   */
  const fetchTheme = useCallback(async (forceRefresh = false) => {
    if (!organizationId) {
      setError(new Error('Organization ID is required'));
      return;
    }

    // Check cache first
    if (!forceRefresh && lastFetched) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < cacheTimeout) {
        return; // Use cached data
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await themeService.getOrganizationTheme(organizationId);
      setTheme(response.data);
      setLastFetched(Date.now());

      // Auto-apply theme to document if enabled
      if (autoApply) {
        themeService.applyThemeToDocument(response.data);
      }
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      
      // Fallback to default theme on error
      if (options.fallbackOnError !== false) {
        const defaultTheme = themeService.getHardcodedDefaults();
        setTheme(defaultTheme);
        if (autoApply) {
          themeService.applyThemeToDocument(defaultTheme);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [organizationId, themeService, cacheTimeout, autoApply, lastFetched, options.fallbackOnError]);

  /**
   * Save theme data to API
   */
  const saveTheme = useCallback(async (themeData) => {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await themeService.saveOrganizationTheme(organizationId, themeData);
      setTheme(response.data);
      setLastFetched(Date.now());

      // Auto-apply updated theme to document if enabled
      if (autoApply) {
        themeService.applyThemeToDocument(response.data);
      }

      return response.data;
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [organizationId, themeService, autoApply]);

  /**
   * Delete organization theme (revert to defaults)
   */
  const deleteTheme = useCallback(async () => {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    setLoading(true);
    setError(null);

    try {
      await themeService.deleteOrganizationTheme(organizationId);
      const defaultTheme = themeService.getHardcodedDefaults();
      setTheme(defaultTheme);
      setLastFetched(Date.now());

      // Auto-apply default theme to document if enabled
      if (autoApply) {
        themeService.applyThemeToDocument(defaultTheme);
      }

      return defaultTheme;
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [organizationId, themeService, autoApply]);

  /**
   * Get merged theme with page-specific overrides
   */
  const getMergedTheme = useCallback(async (pageColors = {}) => {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    try {
      const response = await themeService.getMergedTheme(organizationId, pageColors);
      return response.data;
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      throw err;
    }
  }, [organizationId, themeService]);

  /**
   * Apply theme to document manually
   */
  const applyTheme = useCallback((themeData = theme) => {
    if (themeData) {
      themeService.applyThemeToDocument(themeData);
    }
  }, [theme, themeService]);

  /**
   * Get theme color with fallback
   */
  const getColor = useCallback((colorKey, fallback = '#000000') => {
    return themeService.getThemeColor(theme, colorKey, fallback);
  }, [theme, themeService]);

  /**
   * Get CSS custom properties for theme
   */
  const getCssProperties = useCallback(() => {
    return theme ? themeService.themeToCssProperties(theme) : {};
  }, [theme, themeService]);

  /**
   * Validate theme data
   */
  const validateTheme = useCallback(async (themeData) => {
    try {
      const response = await themeService.validateTheme(themeData);
      return response.data;
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      throw err;
    }
  }, [themeService]);

  /**
   * Reset theme state
   */
  const reset = useCallback(() => {
    setTheme(null);
    setLoading(false);
    setError(null);
    setLastFetched(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch theme on mount and when organizationId changes
  useEffect(() => {
    if (organizationId) {
      fetchTheme();
    } else {
      reset();
    }
  }, [organizationId, fetchTheme, reset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optionally reset document theme on unmount
      if (options.resetOnUnmount) {
        const defaultTheme = themeService.getHardcodedDefaults();
        themeService.applyThemeToDocument(defaultTheme);
      }
    };
  }, [options.resetOnUnmount, themeService]);

  return {
    // State
    theme,
    loading,
    error,
    lastFetched,
    
    // Actions
    fetchTheme,
    saveTheme,
    deleteTheme,
    getMergedTheme,
    applyTheme,
    reset,
    clearError,
    
    // Utilities
    getColor,
    getCssProperties,
    validateTheme,
    
    // Computed values
    hasTheme: !!theme,
    isDefaultTheme: theme && theme.primary_color === '#1F2937',
    themeService
  };
};

/**
 * Hook for getting theme colors with automatic fallbacks
 * Useful for components that need theme colors but don't need full theme management
 */
export const useThemeColors = (organizationId, pageColors = {}) => {
  const [colors, setColors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const themeService = useMemo(() => new ThemeService(), []);

  const fetchColors = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const themeColors = await themeService.getThemeWithFallbacks(organizationId, pageColors);
      setColors(themeColors);
    } catch (err) {
      const handledError = errorHandler.handle(err);
      setError(handledError);
      // Fallback to hardcoded defaults
      setColors(themeService.getHardcodedDefaults());
    } finally {
      setLoading(false);
    }
  }, [organizationId, pageColors, themeService]);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const getColor = useCallback((colorKey, fallback = '#000000') => {
    return themeService.getThemeColor(colors, colorKey, fallback);
  }, [colors, themeService]);

  return {
    colors,
    loading,
    error,
    getColor,
    refetch: fetchColors
  };
};

/**
 * Hook for theme color utilities
 * Provides color manipulation functions
 */
export const useThemeUtils = () => {
  const themeService = useMemo(() => new ThemeService(), []);

  const adjustBrightness = useCallback((hexColor, amount) => {
    return themeService.adjustColorBrightness(hexColor, amount);
  }, [themeService]);

  const getContrastingText = useCallback((backgroundColor) => {
    return themeService.getContrastingTextColor(backgroundColor);
  }, [themeService]);

  const isValidHex = useCallback((color) => {
    return themeService.isValidHexColor(color);
  }, [themeService]);

  return {
    adjustBrightness,
    getContrastingText,
    isValidHex
  };
};
