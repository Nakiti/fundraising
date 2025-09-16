-- Extend campaigns table with fields previously stored in campaign_details
ALTER TABLE campaigns
  ADD COLUMN internal_name VARCHAR(45) NOT NULL AFTER organization_id,
  ADD COLUMN external_name VARCHAR(45) NULL AFTER internal_name,
  ADD COLUMN raised INT NOT NULL DEFAULT 0 AFTER external_name,
  ADD COLUMN visits INT NOT NULL DEFAULT 0 AFTER raised,
  ADD COLUMN status VARCHAR(45) NOT NULL DEFAULT 'draft' AFTER visits,
  ADD COLUMN type VARCHAR(45) NULL AFTER status,
  ADD COLUMN goal INT NULL AFTER type,
  ADD COLUMN default_designation INT NULL AFTER goal,
  ADD COLUMN url VARCHAR(45) NULL AFTER default_designation,
  ADD COLUMN show_phone TINYINT(1) NOT NULL DEFAULT 0 AFTER url,
  ADD COLUMN show_title TINYINT(1) NOT NULL DEFAULT 0 AFTER show_phone,
  ADD COLUMN show_suffix TINYINT(1) NOT NULL DEFAULT 0 AFTER show_title,
  ADD COLUMN show_company_name TINYINT(1) NOT NULL DEFAULT 0 AFTER show_suffix,
  ADD COLUMN show_website_url TINYINT(1) NOT NULL DEFAULT 0 AFTER show_company_name,
  ADD COLUMN donations INT NOT NULL DEFAULT 0 AFTER show_website_url;

-- Optional: unique slug per organization
ALTER TABLE campaigns
  ADD UNIQUE KEY uq_campaigns_org_url (organization_id, url);

-- Backfill data from campaign_details into campaigns
UPDATE campaigns c
LEFT JOIN campaign_details cd ON cd.campaign_id = c.id
SET 
  c.internal_name = COALESCE(c.internal_name, cd.internal_name),
  c.external_name = COALESCE(c.external_name, cd.external_name),
  c.goal = COALESCE(c.goal, cd.goal),
  c.default_designation = COALESCE(c.default_designation, cd.default_designation),
  c.status = COALESCE(c.status, cd.status),
  c.type = COALESCE(c.type, cd.type),
  c.url = COALESCE(c.url, cd.url),
  c.visits = COALESCE(c.visits, cd.visits, 0),
  c.donations = COALESCE(c.donations, cd.donations, 0),
  c.raised = COALESCE(c.raised, cd.raised, 0),
  c.show_phone = COALESCE(c.show_phone, cd.show_phone, 0),
  c.show_title = COALESCE(c.show_title, cd.show_title, 0),
  c.show_suffix = COALESCE(c.show_suffix, cd.show_suffix, 0),
  c.show_company_name = COALESCE(c.show_company_name, cd.show_company_name, 0),
  c.show_website_url = COALESCE(c.show_website_url, cd.show_website_url, 0),
  c.updated_at = CASE 
                   WHEN c.updated_at IS NULL THEN cd.updated_at 
                   WHEN cd.updated_at IS NOT NULL AND cd.updated_at > c.updated_at THEN cd.updated_at 
                   ELSE c.updated_at 
                 END,
  c.updated_by = COALESCE(c.updated_by, cd.updated_by);

-- Note: Keep campaign_details for compatibility until application code is updated.

