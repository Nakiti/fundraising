import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { db } from "../db.js";

export const donorAuthMiddleware = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.donor_session;
    
    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const decoded = jwt.verify(sessionToken, config.jwt.secret);
    
    // Check if session exists in database
    const query = "SELECT * FROM donor_sessions WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP";
    
    db.query(query, [sessionToken], (err, sessions) => {
      if (err) {
        console.error('Donor auth middleware error:', err);
        return res.status(500).json({
          success: false,
          message: 'Authentication error'
        });
      }

      if (sessions.length === 0) {
        res.clearCookie('donor_session');
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired session'
        });
      }

      // Add donor info to request
      req.donor = {
        donorId: decoded.donorId,
        organizationId: decoded.organizationId,
        email: decoded.email
      };

      next();
    });
  } catch (error) {
    console.error('Donor auth middleware error:', error);
    res.clearCookie('donor_session');
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session'
    });
  }
};

export const optionalDonorAuthMiddleware = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.donor_session;
    
    if (sessionToken) {
      try {
        const decoded = jwt.verify(sessionToken, config.jwt.secret);
        
        // Check if session exists in database
        const query = "SELECT * FROM donor_sessions WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP";
        
        db.query(query, [sessionToken], (err, sessions) => {
          if (err) {
            console.error('Optional donor auth middleware error:', err);
          } else if (sessions.length > 0) {
            req.donor = {
              donorId: decoded.donorId,
              organizationId: decoded.organizationId,
              email: decoded.email
            };
          } else {
            res.clearCookie('donor_session');
          }
          next();
        });
      } catch (error) {
        res.clearCookie('donor_session');
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Optional donor auth middleware error:', error);
    next();
  }
};
