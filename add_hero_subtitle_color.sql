-- Add hero subtitle color field to about_pages table
ALTER TABLE about_pages 
ADD COLUMN hero_subtitle_color VARCHAR(7) DEFAULT '#ffffff' AFTER s_color;
