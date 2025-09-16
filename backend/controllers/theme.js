import { ThemeService } from '../services/ThemeService.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendSuccess, sendCreated, sendUpdated, sendDeleted } from '../utils/response.js';

const themeService = new ThemeService();

/**
 * Get organization theme colors
 * @route GET /api/organizations/:id/theme
 */
export const getOrganizationTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  const theme = await themeService.getOrganizationTheme(parseInt(id));
  
  sendSuccess(res, theme, 'Organization theme retrieved successfully');
});

/**
 * Create or update organization theme
 * @route PUT /api/organizations/:id/theme
 */
export const saveOrganizationTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const themeData = req.body;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Check if this is an update or create operation
  const existingTheme = await themeService.getOrganizationTheme(parseInt(id));
  const isUpdate = existingTheme && existingTheme.primary_color;
  
  const savedTheme = await themeService.saveOrganizationTheme(parseInt(id), themeData);
  
  if (isUpdate) {
    sendUpdated(res, savedTheme, 'Organization theme updated successfully');
  } else {
    sendCreated(res, savedTheme, 'Organization theme created successfully');
  }
});

/**
 * Get merged theme for a specific page
 * @route GET /api/organizations/:id/theme/merged
 */
export const getMergedTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { pageColors } = req.query;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Parse page colors from query string if provided
  let parsedPageColors = {};
  if (pageColors) {
    try {
      parsedPageColors = JSON.parse(pageColors);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid pageColors format. Must be valid JSON.',
          code: 'VALIDATION_ERROR'
        }
      });
    }
  }

  const mergedTheme = await themeService.getMergedTheme(parseInt(id), parsedPageColors);
  
  sendSuccess(res, mergedTheme, 'Merged theme retrieved successfully');
});

/**
 * Delete organization theme (revert to defaults)
 * @route DELETE /api/organizations/:id/theme
 */
export const deleteOrganizationTheme = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Organization ID is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  const deleted = await themeService.deleteOrganizationTheme(parseInt(id));
  
  if (deleted) {
    sendDeleted(res, null, 'Organization theme deleted successfully');
  } else {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Organization theme not found',
        code: 'NOT_FOUND'
      }
    });
  }
});

/**
 * Get default theme colors
 * @route GET /api/theme/defaults
 */
export const getDefaultTheme = asyncHandler(async (req, res) => {
  const defaultTheme = themeService.getDefaultTheme();
  sendSuccess(res, defaultTheme, 'Default theme retrieved successfully');
});

/**
 * Validate theme colors
 * @route POST /api/theme/validate
 */
export const validateTheme = asyncHandler(async (req, res) => {
  const { themeData } = req.body;
  
  if (!themeData) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Theme data is required',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  try {
    themeService.validateThemeData(themeData);
    sendSuccess(res, { valid: true }, 'Theme data is valid');
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR'
      }
    });
  }
});
