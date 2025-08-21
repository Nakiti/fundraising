import { db } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from "../middleware/errorHandler.js";
import { 
  sendCreated, 
  sendUpdated, 
  sendSuccess, 
  sendNotFound,
  sendDatabaseError 
} from "../utils/response.js";
import { 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} from "../utils/errors.js";
import { config } from "../config.js";

// Register a new donor
export const registerDonor = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, password, firstName, lastName, phone, address, city, state, zipCode } = req.body;

   console.log(req.body); 
  
  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw new ValidationError('Email, password, first name, and last name are required');
  }

  // Check if donor already exists for this organization
  const checkQuery = "SELECT id FROM donor_accounts WHERE organization_id = ? AND email = ?";
  
  return new Promise((resolve, reject) => {
    db.query(checkQuery, [organizationId, email], (err, existingDonors) => {
      if (err) {
        reject(new DatabaseError('Failed to check existing donor', err));
      } else if (existingDonors.length > 0) {
        reject(new ValidationError('A donor account with this email already exists for this organization'));
      } else {
        // Hash password and create donor
        bcrypt.hash(password, 10).then(passwordHash => {
          const insertQuery = `INSERT INTO donor_accounts 
            (organization_id, email, password_hash, first_name, last_name, phone, address, city, state, zip_code) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          
          const values = [organizationId, email, passwordHash, firstName, lastName, phone, address, city, state, zipCode];
          
          db.query(insertQuery, values, (err, result) => {
            if (err) {
              reject(new DatabaseError('Failed to create donor account', err));
            } else {
              sendCreated(res, { id: result.insertId, email, firstName, lastName }, 'Donor account created successfully');
              resolve();
            }
          });
        }).catch(err => {
          reject(new DatabaseError('Failed to hash password', err));
        });
      }
    });
  });
});

// Login donor
export const loginDonor = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const query = "SELECT * FROM donor_accounts WHERE organization_id = ? AND email = ? AND is_active = TRUE";
  
  return new Promise((resolve, reject) => {
    db.query(query, [organizationId, email], async (err, donors) => {
      if (err) {
        reject(new DatabaseError('Failed to authenticate donor', err));
      } else if (donors.length === 0) {
        reject(new ValidationError('Invalid email or password'));
      } else {
        const donor = donors[0];
        
        // Verify password
        try {
          const isValidPassword = await bcrypt.compare(password, donor.password_hash);
          if (!isValidPassword) {
            reject(new ValidationError('Invalid email or password'));
            return;
          }

          // Update last login
          const updateQuery = "UPDATE donor_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = ?";
          db.query(updateQuery, [donor.id], (err) => {
            if (err) {
              console.error('Failed to update last login:', err);
            }
          });

          // Create session token
          const sessionToken = jwt.sign(
            { 
              donorId: donor.id, 
              organizationId: donor.organization_id,
              email: donor.email 
            },
            config.jwt.secret,
            { expiresIn: '7d' }
          );

          // Store session in database
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

          const sessionQuery = "INSERT INTO donor_sessions (donor_id, session_token, expires_at) VALUES (?, ?, ?)";
          db.query(sessionQuery, [donor.id, sessionToken, expiresAt], (err) => {
            if (err) {
              console.error('Failed to store session:', err);
            }
          });

          // Set session token in cookie
          res.cookie('donor_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict'
          });

          sendSuccess(res, { 
            donor: {
              id: donor.id,
              email: donor.email,
              firstName: donor.first_name,
              lastName: donor.last_name,
              organizationId: donor.organization_id
            }
          }, 'Login successful');
          resolve();
        } catch (error) {
          reject(new DatabaseError('Password verification failed', error));
        }
      }
    });
  });
});

// Logout donor
export const logoutDonor = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies.donor_session;
  
  if (sessionToken) {
    const query = "DELETE FROM donor_sessions WHERE session_token = ?";
    
    return new Promise((resolve, reject) => {
      db.query(query, [sessionToken], (err) => {
        if (err) {
          console.error('Failed to delete session:', err);
        }
        
        // Clear cookie
        res.clearCookie('donor_session');
        sendSuccess(res, null, 'Logout successful');
        resolve();
      });
    });
  } else {
    sendSuccess(res, null, 'Logout successful');
  }
});

// Get donor profile
export const getDonorProfile = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  
  const query = "SELECT id, email, first_name, last_name, phone, address, city, state, zip_code, created_at, last_login FROM donor_accounts WHERE id = ? AND is_active = TRUE";
  
  return new Promise((resolve, reject) => {
    db.query(query, [donorId], (err, donors) => {
      if (err) {
        reject(new DatabaseError('Failed to get donor profile', err));
      } else if (donors.length === 0) {
        reject(new NotFoundError('Donor not found'));
      } else {
        sendSuccess(res, donors[0], 'Donor profile retrieved successfully');
        resolve();
      }
    });
  });
});

// Update donor profile
export const updateDonorProfile = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  const { firstName, lastName, phone, address, city, state, zipCode } = req.body;
  
  const query = `UPDATE donor_accounts 
                 SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, state = ?, zip_code = ?
                 WHERE id = ?`;
  
  const values = [firstName, lastName, phone, address, city, state, zipCode, donorId];
  
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        reject(new DatabaseError('Failed to update donor profile', err));
      } else if (result.affectedRows === 0) {
        reject(new NotFoundError('Donor not found'));
      } else {
        sendUpdated(res, { success: true }, 'Profile updated successfully');
        resolve();
      }
    });
  });
});

// Get donor donations
export const getDonorDonations = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  
  const query = `SELECT dd.*, c.external_name as campaign_name, d.title as designation_name
                 FROM donor_donations dd
                 LEFT JOIN campaigns c ON dd.campaign_id = c.id
                 LEFT JOIN designations d ON dd.designation_id = d.id
                 WHERE dd.donor_id = ?
                 ORDER BY dd.donation_date DESC`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [donorId], (err, donations) => {
      if (err) {
        reject(new DatabaseError('Failed to get donor donations', err));
      } else {
        sendSuccess(res, donations, 'Donations retrieved successfully');
        resolve();
      }
    });
  });
});

// Get donor summary
export const getDonorSummary = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  
  const query = `SELECT 
                   COUNT(*) as total_donations,
                   SUM(amount) as total_amount,
                   MIN(donation_date) as first_donation,
                   MAX(donation_date) as last_donation
                 FROM donor_donations 
                 WHERE donor_id = ? AND payment_status = 'completed'`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [donorId], (err, summary) => {
      if (err) {
        reject(new DatabaseError('Failed to get donor summary', err));
      } else {
        sendSuccess(res, summary[0], 'Donor summary retrieved successfully');
        resolve();
      }
    });
  });
});

// Record donation
export const recordDonation = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  const { campaignId, amount, designationId, notes } = req.body;

  if (!campaignId || !amount) {
    throw new ValidationError('Campaign ID and amount are required');
  }

  const query = "INSERT INTO donor_donations (donor_id, campaign_id, amount, designation_id, notes) VALUES (?, ?, ?, ?, ?)";
  const values = [donorId, campaignId, amount, designationId, notes];
  
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, result) => {
      if (err) {
        reject(new DatabaseError('Failed to record donation', err));
      } else {
        // Record event
        const eventQuery = "INSERT INTO donor_events (donor_id, event_type, event_data) VALUES (?, ?, ?)";
        const eventData = JSON.stringify({
          campaignId,
          amount,
          donationId: result.insertId
        });
        
        db.query(eventQuery, [donorId, 'donation', eventData], (err) => {
          if (err) {
            console.error('Failed to record event:', err);
          }
        });

        sendCreated(res, { id: result.insertId }, 'Donation recorded successfully');
        resolve();
      }
    });
  });
});

// Get donor preferences
export const getDonorPreferences = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  
  const query = "SELECT preference_key, preference_value FROM donor_preferences WHERE donor_id = ?";
  
  return new Promise((resolve, reject) => {
    db.query(query, [donorId], (err, preferences) => {
      if (err) {
        reject(new DatabaseError('Failed to get donor preferences', err));
      } else {
        const preferencesObj = {};
        preferences.forEach(pref => {
          preferencesObj[pref.preference_key] = pref.preference_value;
        });
        
        sendSuccess(res, preferencesObj, 'Preferences retrieved successfully');
        resolve();
      }
    });
  });
});

// Update donor preferences
export const updateDonorPreferences = asyncHandler(async (req, res) => {
  const { donorId } = req.donor;
  const { key, value } = req.body;

  if (!key) {
    throw new ValidationError('Preference key is required');
  }

  const query = `INSERT INTO donor_preferences (donor_id, preference_key, preference_value) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE preference_value = ?`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [donorId, key, value, value], (err) => {
      if (err) {
        reject(new DatabaseError('Failed to update preference', err));
      } else {
        sendUpdated(res, { success: true }, 'Preference updated successfully');
        resolve();
      }
    });
  });
});

// Check donor session
export const checkSession = asyncHandler(async (req, res) => {
  const sessionToken = req.cookies.donor_session;
  
  if (!sessionToken) {
    return sendSuccess(res, { authenticated: false }, 'No session found');
  }

  try {
    const decoded = jwt.verify(sessionToken, config.jwt.secret);
    
    // Check if session exists in database
    const query = "SELECT * FROM donor_sessions WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP";
    
    return new Promise((resolve, reject) => {
      db.query(query, [sessionToken], (err, sessions) => {
        if (err) {
          reject(new DatabaseError('Failed to validate session', err));
        } else if (sessions.length === 0) {
          res.clearCookie('donor_session');
          sendSuccess(res, { authenticated: false }, 'Invalid session');
          resolve();
        } else {
          // Get donor info
          const donorQuery = "SELECT id, email, first_name, last_name FROM donor_accounts WHERE id = ?";
          db.query(donorQuery, [decoded.donorId], (err, donors) => {
            if (err || donors.length === 0) {
              res.clearCookie('donor_session');
              sendSuccess(res, { authenticated: false }, 'Invalid session');
            } else {
              sendSuccess(res, { 
                authenticated: true, 
                donor: {
                  id: donors[0].id,
                  email: donors[0].email,
                  firstName: donors[0].first_name,
                  lastName: donors[0].last_name
                }
              }, 'Session valid');
            }
            resolve();
          });
        }
      });
    });
  } catch (error) {
    res.clearCookie('donor_session');
    sendSuccess(res, { authenticated: false }, 'Invalid session');
  }
});

// Admin: Get organization donors
export const getOrganizationDonors = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  const query = `SELECT id, email, first_name, last_name, created_at, last_login,
                        (SELECT COUNT(*) FROM donor_donations WHERE donor_id = da.id) as donation_count,
                        (SELECT SUM(amount) FROM donor_donations WHERE donor_id = da.id AND payment_status = 'completed') as total_amount
                 FROM donor_accounts da
                 WHERE organization_id = ? AND is_active = TRUE
                 ORDER BY created_at DESC
                 LIMIT ? OFFSET ?`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [organizationId, parseInt(limit), parseInt(offset)], (err, donors) => {
      if (err) {
        reject(new DatabaseError('Failed to get organization donors', err));
      } else {
        sendSuccess(res, donors, 'Organization donors retrieved successfully');
        resolve();
      }
    });
  });
});

// Admin: Get donor analytics
export const getDonorAnalytics = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  const query = `SELECT 
                   COUNT(*) as total_donors,
                   COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_donors_30d,
                   COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 1 END) as active_donors_90d,
                   AVG(total_amount) as avg_donor_value
                 FROM (
                     SELECT da.id, da.last_login,
                            COALESCE(SUM(dd.amount), 0) as total_amount
                     FROM donor_accounts da
                     LEFT JOIN donor_donations dd ON da.id = dd.donor_id AND dd.payment_status = 'completed'
                     WHERE da.organization_id = ? AND da.is_active = TRUE
                     GROUP BY da.id
                 ) as donor_stats`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [organizationId], (err, analytics) => {
      if (err) {
        reject(new DatabaseError('Failed to get donor analytics', err));
      } else {
        sendSuccess(res, analytics[0], 'Donor analytics retrieved successfully');
        resolve();
      }
    });
  });
});
