-- About Pages Table Schema
-- This table stores all about page content and customization settings

CREATE TABLE IF NOT EXISTS about_pages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    headline VARCHAR(255),
    aboutText TEXT,
    whatText TEXT,
    whyText TEXT,
    teamText TEXT,
    missionText TEXT,
    visionText TEXT,
    valuesText TEXT,
    
    -- Images (stored as paths/URLs, not BLOBs)
    bgImage VARCHAR(500),
    aboutImage VARCHAR(500),
    teamImage VARCHAR(500),
    missionImage VARCHAR(500),
    visionImage VARCHAR(500),
    valuesImage VARCHAR(500),
    
    -- Color customization
    bg_color VARCHAR(7) DEFAULT '#FFFFFF',
    p_color VARCHAR(7) DEFAULT '#000000',
    s_color VARCHAR(7) DEFAULT '#666666',
    c_color VARCHAR(7) DEFAULT '#FFFFFF',
    ct_color VARCHAR(7) DEFAULT '#000000',
    b_color VARCHAR(7) DEFAULT '#1F2937',
    bt_color VARCHAR(7) DEFAULT '#FFFFFF',
    
    -- Font sizes
    hero_title_size VARCHAR(10) DEFAULT '36px',
    hero_subtitle_size VARCHAR(10) DEFAULT '16px',
    section_title_size VARCHAR(10) DEFAULT '28px',
    body_text_size VARCHAR(10) DEFAULT '14px',
    button_text_size VARCHAR(10) DEFAULT '14px',
    card_title_size VARCHAR(10) DEFAULT '18px',
    
    -- Layout & spacing
    hero_height VARCHAR(10) DEFAULT '500px',
    section_padding VARCHAR(10) DEFAULT '80px',
    card_radius VARCHAR(10) DEFAULT '4px',
    button_radius VARCHAR(10) DEFAULT '4px',
    
    -- Visual effects
    overlay_opacity DECIMAL(3,2) DEFAULT 0.30,
    accent_color VARCHAR(7) DEFAULT '#1F2937',
    
    -- Element visibility toggles
    show_video_button BOOLEAN DEFAULT TRUE,
    show_hero_icons BOOLEAN DEFAULT TRUE,
    show_feature_icons BOOLEAN DEFAULT TRUE,
    show_team_photos BOOLEAN DEFAULT TRUE,
    show_mission_section BOOLEAN DEFAULT TRUE,
    show_vision_section BOOLEAN DEFAULT TRUE,
    show_values_section BOOLEAN DEFAULT TRUE,
    show_hover_effects BOOLEAN DEFAULT TRUE,
    
    -- Status
    active BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_organization_id (organization_id),
    INDEX idx_active (active)
);

-- Insert sample data (optional)
-- INSERT INTO about_pages (organization_id, title, headline, aboutText, whatText, whyText, teamText, active) 
-- VALUES (1, 'About Us', 'Our Story', 'We are dedicated to making a positive impact...', 'We provide innovative solutions...', 'We believe in the power of community...', 'Meet our dedicated team...', TRUE);
