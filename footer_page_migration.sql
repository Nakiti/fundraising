-- Migration script to update footer_pages table to simplified structure
-- Run this script to update existing footer_pages table

-- Add new columns if they don't exist
ALTER TABLE footer_pages 
ADD COLUMN IF NOT EXISTS description TEXT AFTER tagline,
ADD COLUMN IF NOT EXISTS address TEXT AFTER description,
ADD COLUMN IF NOT EXISTS phone VARCHAR(50) AFTER address,
ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone,
ADD COLUMN IF NOT EXISTS business_hours TEXT AFTER email,
ADD COLUMN IF NOT EXISTS contact_form_url VARCHAR(500) AFTER business_hours,
ADD COLUMN IF NOT EXISTS social_links JSON AFTER contact_form_url;

-- Drop columns that are no longer needed (complex styling and layout)
ALTER TABLE footer_pages 
DROP COLUMN IF EXISTS show_tagline,
DROP COLUMN IF EXISTS show_description,
DROP COLUMN IF EXISTS contact_info,
DROP COLUMN IF EXISTS show_contact_info,
DROP COLUMN IF EXISTS links,
DROP COLUMN IF EXISTS show_links,
DROP COLUMN IF EXISTS show_social_links,
DROP COLUMN IF EXISTS link_color,
DROP COLUMN IF EXISTS footer_height,
DROP COLUMN IF EXISTS footer_layout,
DROP COLUMN IF EXISTS content_alignment,
DROP COLUMN IF EXISTS social_position,
DROP COLUMN IF EXISTS social_icon_size,
DROP COLUMN IF EXISTS social_icon_color,
DROP COLUMN IF EXISTS social_layout,
DROP COLUMN IF EXISTS social_spacing;

-- Update existing records to set default values for new columns
UPDATE footer_pages 
SET description = '' WHERE description IS NULL,
    address = '' WHERE address IS NULL,
    phone = '' WHERE phone IS NULL,
    email = '' WHERE email IS NULL,
    business_hours = '' WHERE business_hours IS NULL,
    contact_form_url = '' WHERE contact_form_url IS NULL,
    social_links = '[]' WHERE social_links IS NULL;
