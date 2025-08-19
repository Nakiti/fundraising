-- Complete PostgreSQL Database Migration Script
-- Add design fields to donation form, donation page, and thank you page tables

-- Update donation_forms table
ALTER TABLE donation_forms 
ADD COLUMN IF NOT EXISTS b1_color VARCHAR(7) DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS heroTitleSize VARCHAR(10) DEFAULT '36',
ADD COLUMN IF NOT EXISTS sectionTitleSize VARCHAR(10) DEFAULT '20',
ADD COLUMN IF NOT EXISTS bodyTextSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS buttonTextSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS cardRadius VARCHAR(10) DEFAULT '4',
ADD COLUMN IF NOT EXISTS buttonRadius VARCHAR(10) DEFAULT '4';

-- Update donation_pages table
ALTER TABLE donation_pages 
ADD COLUMN IF NOT EXISTS bt_color VARCHAR(7) DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS mainHeadline TEXT,
ADD COLUMN IF NOT EXISTS mainText TEXT,
ADD COLUMN IF NOT EXISTS heroTitleSize VARCHAR(10) DEFAULT '36',
ADD COLUMN IF NOT EXISTS heroSubtitleSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS sectionTitleSize VARCHAR(10) DEFAULT '28',
ADD COLUMN IF NOT EXISTS bodyTextSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS buttonTextSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS cardTitleSize VARCHAR(10) DEFAULT '18',
ADD COLUMN IF NOT EXISTS heroHeight VARCHAR(10) DEFAULT '500',
ADD COLUMN IF NOT EXISTS sectionPadding VARCHAR(10) DEFAULT '80',
ADD COLUMN IF NOT EXISTS cardRadius VARCHAR(10) DEFAULT '4',
ADD COLUMN IF NOT EXISTS buttonRadius VARCHAR(10) DEFAULT '4',
ADD COLUMN IF NOT EXISTS overlayOpacity NUMERIC(3,2) DEFAULT 0.30;

-- Update thankyou_pages table
ALTER TABLE thankyou_pages 
ADD COLUMN IF NOT EXISTS heroTitleSize VARCHAR(10) DEFAULT '36',
ADD COLUMN IF NOT EXISTS bodyTextSize VARCHAR(10) DEFAULT '16',
ADD COLUMN IF NOT EXISTS buttonTextSize VARCHAR(10) DEFAULT '14',
ADD COLUMN IF NOT EXISTS cardRadius VARCHAR(10) DEFAULT '4',
ADD COLUMN IF NOT EXISTS buttonRadius VARCHAR(10) DEFAULT '4';

-- Add checkbox question fields to campaign_details table
ALTER TABLE campaign_details 
ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_title BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_suffix BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_company_name BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS show_website_url BOOLEAN DEFAULT FALSE;

-- Set default values for existing records
UPDATE donation_forms SET 
b1_color = '#3b82f6',
heroTitleSize = '36',
sectionTitleSize = '20',
bodyTextSize = '16',
buttonTextSize = '16',
cardRadius = '4',
buttonRadius = '4'
WHERE b1_color IS NULL;

UPDATE donation_pages SET 
bt_color = '#ffffff',
heroTitleSize = '36',
heroSubtitleSize = '16',
sectionTitleSize = '28',
bodyTextSize = '16',
buttonTextSize = '16',
cardTitleSize = '18',
heroHeight = '500',
sectionPadding = '80',
cardRadius = '4',
buttonRadius = '4',
overlayOpacity = 0.30
WHERE bt_color IS NULL;

UPDATE thankyou_pages SET 
heroTitleSize = '36',
bodyTextSize = '16',
buttonTextSize = '14',
cardRadius = '4',
buttonRadius = '4'
WHERE heroTitleSize IS NULL;

-- Set default values for new campaign_details fields
UPDATE campaign_details SET 
show_phone = FALSE,
show_title = FALSE,
show_suffix = FALSE,
show_company_name = FALSE,
show_website_url = FALSE
WHERE show_phone IS NULL;
