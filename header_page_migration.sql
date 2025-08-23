-- Migration script to update header_pages table to simplified structure
-- Run this script to update existing header_pages table

-- Add new columns if they don't exist
ALTER TABLE header_pages 
ADD COLUMN IF NOT EXISTS description TEXT AFTER tagline,
ADD COLUMN IF NOT EXISTS link_color VARCHAR(20) DEFAULT '#3B82F6' AFTER text_color;

-- Drop columns that are no longer needed
ALTER TABLE header_pages 
DROP COLUMN IF EXISTS show_tagline,
DROP COLUMN IF EXISTS show_navigation,
DROP COLUMN IF EXISTS navigation_items,
DROP COLUMN IF EXISTS show_search,
DROP COLUMN IF EXISTS show_login_button,
DROP COLUMN IF EXISTS show_donate_button,
DROP COLUMN IF EXISTS accent_color,
DROP COLUMN IF EXISTS header_height,
DROP COLUMN IF EXISTS logo_size,
DROP COLUMN IF EXISTS font_weight,
DROP COLUMN IF EXISTS logo_position,
DROP COLUMN IF EXISTS navigation_position,
DROP COLUMN IF EXISTS button_position;

-- Update existing records to set default values for new columns
UPDATE header_pages 
SET description = '' WHERE description IS NULL,
    link_color = '#3B82F6' WHERE link_color IS NULL;
