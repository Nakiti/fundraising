-- Add banner text color columns to about_pages table
ALTER TABLE about_pages 
ADD COLUMN banner_title_text VARCHAR(7) DEFAULT '#ffffff' AFTER bt_color,
ADD COLUMN banner_subtitle_text VARCHAR(7) DEFAULT '#ffffff' AFTER banner_title_text;
