-- Create header_pages table
CREATE TABLE IF NOT EXISTS header_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    user_id INT NOT NULL,
    
    -- Content fields
    logo VARCHAR(500),
    organization_name VARCHAR(255),
    tagline VARCHAR(500),
    show_tagline BOOLEAN DEFAULT TRUE,
    
    -- Navigation settings
    show_navigation BOOLEAN DEFAULT TRUE,
    navigation_items JSON,
    show_search BOOLEAN DEFAULT TRUE,
    show_login_button BOOLEAN DEFAULT TRUE,
    show_donate_button BOOLEAN DEFAULT TRUE,
    
    -- Styling fields
    bg_color VARCHAR(20) DEFAULT '#FFFFFF',
    text_color VARCHAR(20) DEFAULT '#000000',
    accent_color VARCHAR(20) DEFAULT '#3B82F6',
    header_height VARCHAR(20) DEFAULT '80px',
    logo_size VARCHAR(20) DEFAULT '40px',
    font_size VARCHAR(20) DEFAULT '16px',
    font_weight VARCHAR(10) DEFAULT '500',
    border_bottom BOOLEAN DEFAULT TRUE,
    border_color VARCHAR(20) DEFAULT '#E5E7EB',
    shadow BOOLEAN DEFAULT FALSE,
    
    -- Layout options
    logo_position ENUM('left', 'center') DEFAULT 'left',
    navigation_position ENUM('left', 'center', 'right') DEFAULT 'center',
    button_position ENUM('left', 'center', 'right') DEFAULT 'right',
    
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

-- Insert default header page for existing organizations (optional)
-- This can be run after creating the table to add header pages for existing organizations
-- INSERT INTO header_page (organization_id, user_id, organization_name, active)
-- SELECT id, created_by, name, FALSE FROM organizations WHERE id NOT IN (SELECT organization_id FROM header_page);
