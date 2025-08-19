-- Add checkbox question fields to campaign_details table
USE fundraising;

ALTER TABLE campaign_details 
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_title BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_suffix BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_company_name BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_website_url BOOLEAN DEFAULT FALSE;

-- Set default values for existing records
UPDATE campaign_details SET 
show_phone = FALSE,
show_title = FALSE,
show_suffix = FALSE,
show_company_name = FALSE,
show_website_url = FALSE
WHERE show_phone IS NULL;
