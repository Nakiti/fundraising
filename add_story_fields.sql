-- Add new story fields to about_pages table
ALTER TABLE about_pages 
ADD COLUMN heroSubtitle TEXT AFTER headline,
ADD COLUMN storyTitle VARCHAR(255) AFTER heroSubtitle,
ADD COLUMN storyText TEXT AFTER storyTitle,
ADD COLUMN storyImage VARCHAR(500) AFTER storyText;
