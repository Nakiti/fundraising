-- Anonymous Donation Migration Script
-- This script adds support for anonymous donations to the transactions table

-- Add is_anonymous field to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT FALSE;

-- Add index for anonymous transactions
ALTER TABLE transactions 
ADD INDEX idx_anonymous_transactions (organization_id, is_anonymous),
ADD INDEX idx_campaign_anonymous (campaign_id, is_anonymous);

-- Update existing transactions to be non-anonymous
UPDATE transactions 
SET is_anonymous = FALSE 
WHERE is_anonymous IS NULL;

-- Add comment for documentation
ALTER TABLE transactions 
MODIFY COLUMN is_anonymous BOOLEAN DEFAULT FALSE COMMENT 'Whether this donation should be displayed anonymously to donors';

-- Add constraint to ensure data integrity
ALTER TABLE transactions 
ADD CONSTRAINT chk_anonymous_donation CHECK (is_anonymous IN (TRUE, FALSE));




