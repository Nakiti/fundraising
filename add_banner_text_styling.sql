-- Add banner text styling columns to donation_pages table
ALTER TABLE donation_pages 
ADD COLUMN bannerTitleColor VARCHAR(7) DEFAULT '#ffffff' AFTER bt_color,
ADD COLUMN bannerSubtitleColor VARCHAR(7) DEFAULT '#e2e8f0' AFTER bannerTitleColor,
ADD COLUMN bannerTitleSize VARCHAR(3) DEFAULT '56' AFTER cardTitleSize,
ADD COLUMN bannerSubtitleSize VARCHAR(3) DEFAULT '20' AFTER bannerTitleSize;
