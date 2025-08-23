-- Guest Donor Migration Script
-- This script adds support for guest donors to the donors table

-- Add is_guest field to donors table
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add index for guest donors
ALTER TABLE donors 
ADD INDEX idx_guest_donors (organization_id, is_guest),
ADD INDEX idx_email_org (organization_id, email);

-- Update existing donors to be non-guest (registered donors)
UPDATE donors 
SET is_guest = FALSE 
WHERE is_guest IS NULL;

-- Add comment for documentation
ALTER TABLE donors 
MODIFY COLUMN is_guest BOOLEAN DEFAULT FALSE COMMENT 'Whether this is a guest donor (no account) or registered donor';

-- Ensure email uniqueness per organization for non-guest donors
-- Note: Guest donors can have duplicate emails since they don't have accounts
ALTER TABLE donors 
ADD CONSTRAINT unique_registered_email UNIQUE (organization_id, email, is_guest);
