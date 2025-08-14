import jwt from "jsonwebtoken";
import { config } from "../config.js";

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
   const token = req.cookies.session;

   if (!token) {
      return res.status(401).json({ 
         success: false, 
         message: "Access denied. No token provided." 
      });
   }

   try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(403).json({ 
         success: false, 
         message: "Invalid token." 
      });
   }
};

// Optional token verification (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
   const token = req.cookies.session;

   if (token) {
      try {
         const decoded = jwt.verify(token, config.jwt.secret);
         req.user = decoded;
      } catch (error) {
         // Token is invalid, but we don't fail the request
         req.user = null;
      }
   } else {
      req.user = null;
   }
   next();
};

// Check if user belongs to organization
export const checkOrganizationAccess = (req, res, next) => {
   const { organizationId } = req.params;
   
   if (!req.user) {
      return res.status(401).json({ 
         success: false, 
         message: "Authentication required." 
      });
   }

   // Check if user belongs to the organization
   if (req.user.organization_id && req.user.organization_id.toString() !== organizationId) {
      return res.status(403).json({ 
         success: false, 
         message: "Access denied. You don't have permission to access this organization." 
      });
   }

   next();
};

// Role-based authorization middleware
export const requireRole = (roles) => {
   return (req, res, next) => {
      if (!req.user) {
         return res.status(401).json({ 
            success: false, 
            message: "Authentication required." 
         });
      }

      if (!roles.includes(req.user.role)) {
         return res.status(403).json({ 
            success: false, 
            message: "Access denied. Insufficient permissions." 
         });
      }

      next();
   };
};

// Admin only middleware
export const requireAdmin = (req, res, next) => {
   return requireRole(['admin'])(req, res, next);
};

// Owner or admin middleware
export const requireOwnerOrAdmin = (req, res, next) => {
   return requireRole(['owner', 'admin'])(req, res, next);
};
