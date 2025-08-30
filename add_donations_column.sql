-- Add donations column to campaign_details table
-- This column tracks the total number of donations for each campaign

ALTER TABLE campaign_details 
ADD COLUMN IF NOT EXISTS donations INT DEFAULT 0;

-- Update existing records to have 0 donations if the column was just added
UPDATE campaign_details 
SET donations = 0 
WHERE donations IS NULL;

-- Add index for better performance when querying by donations
CREATE INDEX IF NOT EXISTS idx_campaign_details_donations 
ON campaign_details(donations);

-- Add index for better performance when querying campaigns by organization and donations
CREATE INDEX IF NOT EXISTS idx_campaign_details_org_donations 
ON campaign_details(campaign_id, donations);
