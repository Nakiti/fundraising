import { db } from "../db.js"
import { asyncHandler } from "../middleware/errorHandler.js"
import {
  sendSuccess,
  sendCreated,
  sendUpdated,
  sendNotFound,
  sendDatabaseError
} from "../utils/response.js"
import {
  ValidationError,
  NotFoundError,
  DatabaseError
} from "../utils/errors.js"

// Create or find guest donor
export const createOrFindGuestDonor = asyncHandler(async (req, res) => {
  const { 
    organization_id, 
    email, 
    first_name, 
    last_name, 
    phone, 
    address, 
    city, 
    zip_code 
  } = req.body;
  
  if (!organization_id || !email || !first_name || !last_name) {
    throw new ValidationError('Missing required fields: organization_id, email, first_name, last_name');
  }

  // First, check if a donor with this email already exists for this organization
  const checkQuery = `
    SELECT id, is_guest, first_name, last_name, phone, address, city, zip_code
    FROM donors 
    WHERE organization_id = ? AND email = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(checkQuery, [organization_id, email], (err, existingDonors) => {
      if (err) {
        reject(new DatabaseError('Failed to check existing donor', err));
        return;
      }

      if (existingDonors.length > 0) {
        // Donor exists - return existing donor
        const donor = existingDonors[0];
        sendSuccess(res, donor, 'Existing donor found');
        resolve();
      } else {
        // Create new guest donor
        const insertQuery = `
          INSERT INTO donors (
            organization_id, 
            email, 
            first_name, 
            last_name, 
            phone, 
            address, 
            city, 
            zip_code, 
            is_guest,
            created_at,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW(), NOW())
        `;

        const values = [
          organization_id,
          email,
          first_name,
          last_name,
          phone || null,
          address || null,
          city || null,
          zip_code || null
        ];

        db.query(insertQuery, values, (err, result) => {
          if (err) {
            reject(new DatabaseError('Failed to create guest donor', err));
            return;
          }

          // Get the created donor
          const getDonorQuery = "SELECT * FROM donors WHERE id = ?";
          db.query(getDonorQuery, [result.insertId], (err, donors) => {
            if (err) {
              reject(new DatabaseError('Failed to fetch created donor', err));
              return;
            }

            sendCreated(res, donors[0], 'Guest donor created successfully');
            resolve();
          });
        });
      }
    });
  });
});

// Get guest donor by ID
export const getGuestDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    throw new ValidationError('Donor ID is required');
  }

  const query = "SELECT * FROM donors WHERE id = ? AND is_guest = TRUE";

  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch guest donor', err));
      if (!data || data.length === 0) reject(new NotFoundError('Guest donor'));
      sendSuccess(res, data[0], 'Guest donor retrieved successfully');
      resolve();
    })
  })
});

// Update guest donor
export const updateGuestDonor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { 
    first_name, 
    last_name, 
    phone, 
    address, 
    city, 
    zip_code 
  } = req.body;
  
  if (!id) {
    throw new ValidationError('Donor ID is required');
  }

  let query = "UPDATE donors SET ";
  const updates = [];
  const values = [];

  if (first_name) {
    updates.push("`first_name` = ?");
    values.push(first_name);
  }
  if (last_name) {
    updates.push("`last_name` = ?");
    values.push(last_name);
  }
  if (phone !== undefined) {
    updates.push("`phone` = ?");
    values.push(phone);
  }
  if (address !== undefined) {
    updates.push("`address` = ?");
    values.push(address);
  }
  if (city !== undefined) {
    updates.push("`city` = ?");
    values.push(city);
  }
  if (zip_code !== undefined) {
    updates.push("`zip_code` = ?");
    values.push(zip_code);
  }

  if (updates.length === 0) {
    throw new ValidationError('At least one field to update is required');
  }

  updates.push("`updated_at` = NOW()");
  query += updates.join(", ") + " WHERE `id` = ? AND `is_guest` = TRUE";
  values.push(id);

  return new Promise((resolve, reject) => {
    db.query(query, values, (err, data) => {
      if (err) reject(new DatabaseError('Failed to update guest donor', err));
      if (data.affectedRows === 0) reject(new NotFoundError('Guest donor'));
      sendUpdated(res, data, 'Guest donor updated successfully');
      resolve();
    })
  })
});

// Get all guest donors for an organization
export const getGuestDonorsByOrganization = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  
  if (!organizationId) {
    throw new ValidationError('Organization ID is required');
  }

  const query = `
    SELECT * FROM donors 
    WHERE organization_id = ? AND is_guest = TRUE 
    ORDER BY created_at DESC
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [organizationId], (err, data) => {
      if (err) reject(new DatabaseError('Failed to fetch guest donors', err));
      sendSuccess(res, data, 'Guest donors retrieved successfully');
      resolve();
    })
  })
});
