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

-- Migration script for page_sections table
-- This script migrates existing sections data to the new page_sections table structure

-- First, create the new page_sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS page_sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    page_type VARCHAR(50) NOT NULL,
    page_reference_id INT NOT NULL,
    name VARCHAR(45) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    -- Composite unique constraint to prevent duplicate sections per page
    UNIQUE KEY unique_page_section (organization_id, page_type, page_reference_id, name),
    
    -- Indexes for performance
    INDEX idx_org_page (organization_id, page_type, page_reference_id),
    INDEX idx_page_active (organization_id, page_type, page_reference_id, active),
    INDEX idx_display_order (organization_id, page_type, page_reference_id, display_order),
    INDEX idx_organization (organization_id),
    INDEX idx_page_type (page_type)
);

-- Migrate existing sections data to page_sections table
-- Note: This assumes organization_id = 1 for existing data
-- You may need to adjust the organization_id based on your actual data

-- Migrate landing page sections
INSERT INTO page_sections (organization_id, page_type, page_reference_id, name, active, display_order, created_at, updated_at, updated_by)
SELECT 
    1 as organization_id,
    'landing' as page_type,
    page_id as page_reference_id,
    name,
    CASE WHEN active = 'true' OR active = '1' THEN TRUE ELSE FALSE END as active,
    0 as display_order,
    COALESCE(updated_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at,
    updated_by
FROM sections 
WHERE EXISTS (SELECT 1 FROM landing_pages WHERE id = sections.page_id);

-- Migrate about page sections
INSERT INTO page_sections (organization_id, page_type, page_reference_id, name, active, display_order, created_at, updated_at, updated_by)
SELECT 
    1 as organization_id,
    'about' as page_type,
    page_id as page_reference_id,
    name,
    CASE WHEN active = 'true' OR active = '1' THEN TRUE ELSE FALSE END as active,
    0 as display_order,
    COALESCE(updated_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at,
    updated_by
FROM sections 
WHERE EXISTS (SELECT 1 FROM about_pages WHERE id = sections.page_id);

-- Migrate donation page sections
INSERT INTO page_sections (organization_id, page_type, page_reference_id, name, active, display_order, created_at, updated_at, updated_by)
SELECT 
    1 as organization_id,
    'campaign_donation' as page_type,
    page_id as page_reference_id,
    name,
    CASE WHEN active = 'true' OR active = '1' THEN TRUE ELSE FALSE END as active,
    0 as display_order,
    COALESCE(updated_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at,
    updated_by
FROM sections 
WHERE EXISTS (SELECT 1 FROM donation_pages WHERE id = sections.page_id);

-- Migrate donation form sections
INSERT INTO page_sections (organization_id, page_type, page_reference_id, name, active, display_order, created_at, updated_at, updated_by)
SELECT 
    1 as organization_id,
    'campaign_form' as page_type,
    page_id as page_reference_id,
    name,
    CASE WHEN active = 'true' OR active = '1' THEN TRUE ELSE FALSE END as active,
    0 as display_order,
    COALESCE(updated_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at,
    updated_by
FROM sections 
WHERE EXISTS (SELECT 1 FROM donation_forms WHERE id = sections.page_id);

-- After successful migration, you can optionally drop the old sections table
-- DROP TABLE IF EXISTS sections;
