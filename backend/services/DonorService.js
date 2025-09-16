import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { BaseService } from './BaseService.js';
import { 
  ValidationError, 
  NotFoundError, 
  ConflictError 
} from '../utils/errors.js';
import { config } from '../config.js';

/**
 * Donor Service - Handles all donor-related business logic
 */
export class DonorService extends BaseService {
  constructor() {
    super('donors');
  }

  /**
   * Register a new donor
   * @param {Object} donorData - Donor registration data
   * @param {number} organizationId - Organization ID
   * @returns {Promise<Object>} Created donor without password hash
   */
  async registerDonor(organizationId, donorData) {
    const { email, password, firstName, lastName, phone, address, city, state, zipCode } = donorData;
    
    // Validate required fields
    this.validateRequiredFields(donorData, ['email', 'password', 'firstName', 'lastName']);
    this.validateEmail(email);
    
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    // Check if donor already exists for this organization (registered donors only)
    await this.validateUniqueEmail(organizationId, email);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const donorToCreate = {
      organization_id: organizationId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null,
      is_guest: false,
      is_active: true
    };

    const createdDonor = await this.create(donorToCreate);
    
    // Remove password hash from response
    const { password_hash, ...donorResponse } = createdDonor;
    return donorResponse;
  }

  /**
   * Login a donor
   * @param {number} organizationId - Organization ID
   * @param {string} email - Donor email
   * @param {string} password - Donor password
   * @returns {Promise<Object>} Login result with donor data and session token
   */
  async loginDonor(organizationId, email, password) {
    if (!organizationId || !email || !password) {
      throw new ValidationError('Organization ID, email, and password are required');
    }

    this.validateEmail(email);

    // Find donor
    const donor = await this.findDonorByEmail(organizationId, email);
    if (!donor) {
      throw new ValidationError('Invalid email or password');
    }

    if (!donor.is_active) {
      throw new ValidationError('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, donor.password_hash);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    // Update last login
    await this.update(donor.id, { last_login: new Date() });

    // Create session token
    const sessionToken = this.createSessionToken(donor);
    
    // Store session in database
    await this.createDonorSession(donor.id, sessionToken);

    return {
      donor: {
        id: donor.id,
        email: donor.email,
        firstName: donor.first_name,
        lastName: donor.last_name,
        organizationId: donor.organization_id
      },
      sessionToken
    };
  }

  /**
   * Logout a donor by removing their session
   * @param {string} sessionToken - Session token to invalidate
   * @returns {Promise<boolean>} True if logout successful
   */
  async logoutDonor(sessionToken) {
    if (!sessionToken) {
      return true; // Already logged out
    }

    const query = "DELETE FROM donor_sessions WHERE session_token = ?";
    await this.executeQuery(query, [sessionToken]);
    return true;
  }

  /**
   * Get donor profile by ID
   * @param {number} donorId - Donor ID
   * @returns {Promise<Object>} Donor profile data
   */
  async getDonorProfile(donorId) {
    if (!donorId) {
      throw new ValidationError('Donor ID is required');
    }

    const query = `
      SELECT id, email, first_name, last_name, phone, address, city, state, zip_code, created_at, last_login 
      FROM donors 
      WHERE id = ? AND is_guest = FALSE AND is_active = TRUE
    `;

    const results = await this.executeQuery(query, [donorId]);
    
    if (!results || results.length === 0) {
      throw new NotFoundError('Donor profile');
    }

    return results[0];
  }

  /**
   * Update donor profile
   * @param {number} donorId - Donor ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated donor profile
   */
  async updateDonorProfile(donorId, profileData) {
    const { firstName, lastName, phone, address, city, state, zipCode } = profileData;
    
    // Validate required fields
    this.validateRequiredFields(profileData, ['firstName', 'lastName']);

    const updateData = {
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zipCode || null
    };

    await this.update(donorId, updateData);
    return await this.getDonorProfile(donorId);
  }

  /**
   * Get donor donations
   * @param {number} donorId - Donor ID
   * @param {Object} options - Query options (limit, offset, status)
   * @returns {Promise<Array>} Array of donor donations
   */
  async getDonorDonations(donorId, options = {}) {
    if (!donorId) {
      throw new ValidationError('Donor ID is required');
    }

    const { limit = 50, offset = 0, status = 'completed' } = options;

    const query = `
      SELECT 
        t.*,
        c.external_name as campaign_name,
        o.name as organization_name
      FROM transactions t
      LEFT JOIN campaigns c ON t.campaign_id = c.id
      LEFT JOIN organizations o ON c.organization_id = o.id
      WHERE t.donor_id = ? AND t.status = ?
      ORDER BY t.date DESC
      LIMIT ? OFFSET ?
    `;

    return await this.executeQuery(query, [donorId, status, limit, offset]);
  }

  /**
   * Get donor summary statistics
   * @param {number} donorId - Donor ID
   * @returns {Promise<Object>} Donor summary data
   */
  async getDonorSummary(donorId) {
    if (!donorId) {
      throw new ValidationError('Donor ID is required');
    }

    const query = `
      SELECT 
        COUNT(*) as total_donations, 
        COALESCE(SUM(amount), 0) as total_donated,
        MIN(date) as first_donation_date,
        MAX(date) as last_donation_date,
        COUNT(DISTINCT campaign_id) as campaigns_supported
      FROM transactions 
      WHERE donor_id = ? AND status = 'completed' 
    `;

    const results = await this.executeQuery(query, [donorId]);
    return results[0] || {
      total_donations: 0,
      total_donated: 0,
      first_donation_date: null,
      last_donation_date: null,
      campaigns_supported: 0
    };
  }

  /**
   * Check for guest donations by email
   * @param {number} organizationId - Organization ID
   * @param {string} email - Email to check
   * @returns {Promise<Object>} Guest donations data
   */
  async checkGuestDonations(organizationId, email) {
    if (!organizationId || !email) {
      throw new ValidationError('Organization ID and email are required');
    }

    this.validateEmail(email);

    const query = `
      SELECT d.id, d.first_name, d.last_name, COUNT(t.id) as donation_count, SUM(t.amount) as total_amount
      FROM donors d
      LEFT JOIN transactions t ON d.id = t.donor_id AND t.status = 'completed'
      WHERE d.organization_id = ? AND d.email = ? AND d.is_guest = TRUE
      GROUP BY d.id
    `;

    const results = await this.executeQuery(query, [organizationId, email]);
    
    return {
      hasGuestDonations: results.length > 0,
      guestDonors: results
    };
  }

  /**
   * Convert guest donor to registered donor
   * @param {number} organizationId - Organization ID
   * @param {Object} conversionData - Conversion data including password
   * @returns {Promise<Object>} Converted donor data
   */
  async convertGuestToRegistered(organizationId, conversionData) {
    const { email, password, firstName, lastName } = conversionData;
    
    // Validate input
    this.validateRequiredFields(conversionData, ['email', 'password', 'firstName', 'lastName']);
    this.validateEmail(email);
    
    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    // Check if registered donor already exists
    const existingRegistered = await this.findBy({
      organization_id: organizationId,
      email,
      is_guest: false
    });

    if (existingRegistered.length > 0) {
      throw new ConflictError('A registered donor account with this email already exists');
    }

    // Find guest donors with this email
    const guestDonors = await this.findBy({
      organization_id: organizationId,
      email,
      is_guest: true
    });

    if (guestDonors.length === 0) {
      throw new NotFoundError('No guest donations found for this email');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Convert the first guest donor to registered
    const primaryGuest = guestDonors[0];
    const convertedDonor = await this.update(primaryGuest.id, {
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      is_guest: false,
      is_active: true
    });

    // If there are multiple guest records, consolidate them
    if (guestDonors.length > 1) {
      await this.consolidateGuestDonors(primaryGuest.id, guestDonors.slice(1));
    }

    return {
      id: convertedDonor.id,
      email: convertedDonor.email,
      firstName: convertedDonor.first_name,
      lastName: convertedDonor.last_name,
      organizationId: convertedDonor.organization_id
    };
  }

  /**
   * Validate that email is unique for organization (registered donors only)
   * @param {number} organizationId - Organization ID
   * @param {string} email - Email to check
   * @throws {ConflictError} If email already exists
   */
  async validateUniqueEmail(organizationId, email) {
    const existing = await this.findBy({
      organization_id: organizationId,
      email,
      is_guest: false
    });

    if (existing.length > 0) {
      throw new ConflictError('A donor account with this email already exists for this organization');
    }
  }

  /**
   * Find donor by email
   * @param {number} organizationId - Organization ID
   * @param {string} email - Donor email
   * @returns {Promise<Object|null>} Donor record or null
   */
  async findDonorByEmail(organizationId, email) {
    const results = await this.findBy({
      organization_id: organizationId,
      email,
      is_guest: false,
      is_active: true
    });

    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create session token for donor
   * @param {Object} donor - Donor object
   * @returns {string} JWT session token
   */
  createSessionToken(donor) {
    return jwt.sign(
      { 
        donorId: donor.id, 
        organizationId: donor.organization_id,
        email: donor.email 
      },
      config.jwt.secret,
      { expiresIn: '7d' }
    );
  }

  /**
   * Create donor session record
   * @param {number} donorId - Donor ID
   * @param {string} sessionToken - Session token
   * @returns {Promise<Object>} Created session
   */
  async createDonorSession(donorId, sessionToken) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const query = "INSERT INTO donor_sessions (donor_id, session_token, expires_at) VALUES (?, ?, ?)";
    return await this.executeQuery(query, [donorId, sessionToken, expiresAt]);
  }

  /**
   * Consolidate multiple guest donor records into one
   * @param {number} primaryDonorId - Primary donor ID to keep
   * @param {Array} guestDonorsToMerge - Guest donor records to merge
   */
  async consolidateGuestDonors(primaryDonorId, guestDonorsToMerge) {
    await this.beginTransaction();
    
    try {
      // Update transactions to point to primary donor
      for (const guest of guestDonorsToMerge) {
        await this.executeQuery(
          "UPDATE transactions SET donor_id = ? WHERE donor_id = ?",
          [primaryDonorId, guest.id]
        );
        
        // Delete the duplicate guest record
        await this.delete(guest.id);
      }
      
      await this.commitTransaction();
    } catch (error) {
      await this.rollbackTransaction();
      throw error;
    }
  }

  /**
   * Validate donor session token
   * @param {string} sessionToken - Session token to validate
   * @returns {Promise<Object|null>} Donor data if valid, null if invalid
   */
  async validateSession(sessionToken) {
    if (!sessionToken) {
      return null;
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(sessionToken, config.jwt.secret);
      
      // Check if session exists in database and is not expired
      const query = `
        SELECT ds.*, d.id, d.email, d.first_name, d.last_name, d.organization_id, d.is_active
        FROM donor_sessions ds
        INNER JOIN donors d ON ds.donor_id = d.id
        WHERE ds.session_token = ? AND ds.expires_at > NOW() AND d.is_active = TRUE
      `;
      
      const results = await this.executeQuery(query, [sessionToken]);
      
      if (results.length === 0) {
        return null;
      }
      
      const session = results[0];
      return {
        donorId: session.id,
        email: session.email,
        firstName: session.first_name,
        lastName: session.last_name,
        organizationId: session.organization_id
      };
      
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }
}
