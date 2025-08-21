-- Create footer_pages table
CREATE TABLE IF NOT EXISTS footer_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Content fields
    logo VARCHAR(500),
    organization_name VARCHAR(255),
    tagline VARCHAR(500),
    show_tagline BOOLEAN DEFAULT TRUE,
    description TEXT,
    show_description BOOLEAN DEFAULT TRUE,
    contact_info TEXT,
    show_contact_info BOOLEAN DEFAULT TRUE,
    links TEXT,
    show_links BOOLEAN DEFAULT TRUE,
    social_links TEXT,
    show_social_links BOOLEAN DEFAULT TRUE,
    
    -- Styling fields
    bg_color VARCHAR(20) DEFAULT '#1F2937',
    text_color VARCHAR(20) DEFAULT '#FFFFFF',
    link_color VARCHAR(20) DEFAULT '#60A5FA',
    footer_height VARCHAR(20) DEFAULT 'auto',
    font_size VARCHAR(20) DEFAULT '14px',
    border_top BOOLEAN DEFAULT TRUE,
    border_color VARCHAR(20) DEFAULT '#374151',
    shadow BOOLEAN DEFAULT FALSE,
    
    -- Layout options
    footer_layout ENUM('simple', 'two-column', 'three-column', 'four-column') DEFAULT 'three-column',
    content_alignment ENUM('left', 'center', 'right') DEFAULT 'left',
    social_position ENUM('top', 'bottom', 'sidebar') DEFAULT 'bottom',
    
    -- Social media options
    social_icon_size ENUM('small', 'medium', 'large') DEFAULT 'medium',
    social_icon_color VARCHAR(20) DEFAULT '#FFFFFF',
    social_layout ENUM('horizontal', 'vertical', 'grid') DEFAULT 'horizontal',
    social_spacing ENUM('tight', 'normal', 'loose') DEFAULT 'normal',
    
    -- Status
    active BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_organization_id (organization_id),
    INDEX idx_user_id (user_id),
    INDEX idx_active (active)
);

-- Insert default footer page for existing organizations (optional)
-- This can be run after creating the table to add footer pages for existing organizations
-- INSERT INTO footer_pages (organization_id, user_id, organization_name, active)
-- SELECT id, created_by, name, FALSE FROM organizations WHERE id NOT IN (SELECT organization_id FROM footer_pages);
