import jwt from "jsonwebtoken"
import { serialize } from "cookie"
import { config } from "../config.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendDeleted,
  sendUnauthorized,
  sendNotFound
} from "../utils/response.js"
import { ValidationError, AuthenticationError } from "../utils/errors.js"
import { getUserService } from "../services/ServiceRegistry.js"

// Initialize service
const userService = getUserService()

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  try {
    // Delegate to UserService
    const authResult = await userService.authenticateUser(email, password);
    
    // Set cookie
    const cookie = serialize("session", authResult.token, {
      httpOnly: config.cookie.httpOnly,
      secure: config.cookie.secure,
      sameSite: config.cookie.sameSite,
      maxAge: config.cookie.maxAge,
      path: config.cookie.path,
      domain: config.cookie.domain
    });

    res.setHeader("Set-Cookie", cookie);
    sendSuccess(res, { user: authResult.user }, 'Login successful');
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      sendUnauthorized(res, error.message);
    } else {
      throw error;
    }
  }
})

export const getCurrentUser = asyncHandler(async (req, res) => {
  const token = req.cookies.session;

  if (!token) {
    throw new AuthenticationError('Not authenticated');
  }

  try {
    // Delegate to UserService
    const userData = await userService.getCurrentUser(token);
    
    sendSuccess(res, userData, 'User data retrieved successfully');
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      sendUnauthorized(res, error.message);
    } else if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

export const updatePassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  try {
    // Delegate to UserService
    await userService.updatePassword(email, password);
    
    sendUpdated(res, null, 'Password updated successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("session", {
    httpOnly: config.cookie.httpOnly,
    secure: config.cookie.secure,
    sameSite: config.cookie.sameSite,
    path: config.cookie.path,
    domain: config.cookie.domain
  });
  
  return sendSuccess(res, null, 'User has been logged out');
})

export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    throw new ValidationError('Missing required fields: firstName, lastName, email, password');
  }

  try {
    // Delegate to UserService
    const user = await userService.createUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password
    });
    
    sendCreated(res, { userId: user.id }, 'User created successfully');
  } catch (error) {
    if (error.name === 'ConflictError') {
      sendUnauthorized(res, error.message);
    } else {
      throw error;
    }
  }
})

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  try {
    // Delegate to UserService
    const userData = await userService.getUser(id);
    
    sendSuccess(res, userData, 'User retrieved successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

export const getUsersbyOrg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Organization ID is required');
  }

  // Delegate to UserService
  const usersData = await userService.getUsersByOrganization(id);
  
  sendSuccess(res, usersData, 'Organization users retrieved successfully');
})

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }
  
  if (!role) {
    throw new ValidationError('Role is required');
  }

  try {
    // Delegate to UserService
    const userData = await userService.updateUserRole(id, role);
    
    sendUpdated(res, userData, 'User updated successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('User ID is required');
  }

  try {
    // Delegate to UserService
    await userService.deleteUser(id);
    
    sendDeleted(res, 'User deleted successfully');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

/**
 * Additional endpoint for searching users
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { q, organizationId } = req.query;
  
  if (!q) {
    throw new ValidationError('Search query is required');
  }

  // Delegate to UserService
  const users = await userService.searchUsers(q, organizationId);
  
  sendSuccess(res, { users }, 'User search completed');
})

/**
 * Additional endpoint for user statistics
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const { organizationId } = req.query;

  // Delegate to UserService
  const stats = await userService.getUserStats(organizationId);
  
  sendSuccess(res, stats, 'User statistics retrieved successfully');
})

/**
 * Additional endpoint for bulk creating users
 */
export const bulkCreateUsers = asyncHandler(async (req, res) => {
  const { users } = req.body;
  
  if (!users || !Array.isArray(users)) {
    throw new ValidationError('Users array is required');
  }

  // Delegate to UserService
  const results = await userService.bulkCreateUsers(users);
  
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;
  
  sendSuccess(res, {
    results,
    summary: {
      total: results.length,
      successful: successCount,
      failed: failureCount
    }
  }, `Bulk user creation completed: ${successCount} successful, ${failureCount} failed`);
})

/**
 * Additional endpoint for password reset request
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new ValidationError('Email is required');
  }

  try {
    // Delegate to UserService
    const resetToken = await userService.resetPassword(email);
    
    // In a real application, you would send this token via email
    // For now, we'll return it in the response
    sendSuccess(res, { 
      message: 'Password reset token generated',
      resetToken // Remove this in production and send via email
    }, 'Password reset request processed');
  } catch (error) {
    if (error.name === 'NotFoundError') {
      sendNotFound(res, 'User not found');
    } else {
      throw error;
    }
  }
})

/**
 * Additional endpoint for password reset completion
 */
export const completePasswordReset = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body;
  
  if (!resetToken || !newPassword) {
    throw new ValidationError('Reset token and new password are required');
  }

  try {
    // Delegate to UserService
    await userService.verifyResetTokenAndUpdatePassword(resetToken, newPassword);
    
    sendSuccess(res, null, 'Password reset completed successfully');
  } catch (error) {
    if (error.name === 'AuthenticationError') {
      sendUnauthorized(res, error.message);
    } else {
      throw error;
    }
  }
})