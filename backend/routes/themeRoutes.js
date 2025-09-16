import express from 'express';
import {
  getOrganizationTheme,
  saveOrganizationTheme,
  getMergedTheme,
  deleteOrganizationTheme,
  getDefaultTheme,
  validateTheme
} from '../controllers/theme.js';
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

// Apply authentication middleware to all theme routes
router.use(verifyToken);

/**
 * @route GET /api/organizations/:id/theme
 * @desc Get organization theme colors
 * @access Private
 */
router.get('/organizations/:id/theme', getOrganizationTheme);

/**
 * @route PUT /api/organizations/:id/theme
 * @desc Create or update organization theme colors
 * @access Private
 */
router.put('/organizations/:id/theme', saveOrganizationTheme);

/**
 * @route GET /api/organizations/:id/theme/merged
 * @desc Get merged theme (organization theme + page overrides)
 * @access Private
 * @query pageColors - JSON string of page-specific color overrides
 */
router.get('/organizations/:id/theme/merged', getMergedTheme);

/**
 * @route DELETE /api/organizations/:id/theme
 * @desc Delete organization theme (revert to defaults)
 * @access Private
 */
router.delete('/organizations/:id/theme', deleteOrganizationTheme);

/**
 * @route GET /api/theme/defaults
 * @desc Get default theme colors
 * @access Private
 */
router.get('/theme/defaults', getDefaultTheme);

/**
 * @route POST /api/theme/validate
 * @desc Validate theme color data
 * @access Private
 */
router.post('/theme/validate', validateTheme);

export default router;
