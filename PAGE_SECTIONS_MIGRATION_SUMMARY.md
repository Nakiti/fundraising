# Page Sections Migration Summary

## Overview
This document summarizes the complete migration from the old `sections` table to the new `page_sections` table structure across both frontend and backend.

## Database Changes

### New Table Structure
```sql
CREATE TABLE page_sections (
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
    
    UNIQUE KEY unique_page_section (organization_id, page_type, page_reference_id, name),
    INDEX idx_org_page (organization_id, page_type, page_reference_id),
    INDEX idx_page_active (organization_id, page_type, page_reference_id, active),
    INDEX idx_display_order (organization_id, page_type, page_reference_id, display_order),
    INDEX idx_organization (organization_id),
    INDEX idx_page_type (page_type)
);
```

### Key Improvements
- **Organization-based**: Sections are now organized by organization
- **Page Type Support**: Supports multiple page types (landing, about, campaign_donation, etc.)
- **No ID Conflicts**: Uses `page_reference_id` to avoid conflicts between different page tables
- **Better Performance**: Optimized indexes for common queries
- **Display Order**: Added support for section ordering
- **Audit Trail**: Proper timestamps and user tracking

## Backend Changes

### Updated Files:
1. **`backend/controllers/section.js`**
   - Updated `createSection` to use new parameters
   - Updated `updateSection` to support display_order
   - Added `getSectionsByPage` for new API structure
   - Added `updateSectionOrder` for bulk order updates
   - Maintained legacy `getSectionByPage` for backward compatibility

2. **`backend/routes/sectionRoutes.js`**
   - Added new route for `getSectionsByPage` with query parameters
   - Added route for `updateSectionOrder`
   - Maintained legacy routes for backward compatibility

### New API Endpoints:
- `GET /sections/getSectionsByPage?organization_id=X&page_type=Y&page_reference_id=Z`
- `PUT /sections/updateOrder` - Bulk update section order

## Frontend Changes

### Updated Services:
1. **`frontend/src/app/services/fetchService.js`**
   - Added `getPageSectionsByPage(organizationId, pageType, pageReferenceId)`
   - Maintained legacy `getPageSections(pageId)` for backward compatibility

2. **`frontend/src/app/services/createServices.js`**
   - Added `createPageSectionByPage(organizationId, pageType, pageReferenceId, name, active, currentUser)`
   - Maintained legacy `createPageSection(pageId, name, active, currentUser)` for backward compatibility

3. **`frontend/src/app/services/index.js`**
   - Added new methods to Services exports
   - Updated Page service exports

### Updated Contexts:
1. **`frontend/src/app/context/organizationPages/landingPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'landing', landingPageId)`

2. **`frontend/src/app/context/organizationPages/aboutPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'about', aboutPageId)`

3. **`frontend/src/app/context/campaignPages/donationPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'campaign_donation', donationPageId)`
   - Added organizationId from campaign context

4. **`frontend/src/app/context/campaignPages/donationFormContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'campaign_form', donationPageId)`
   - Added organizationId from campaign context

5. **`frontend/src/app/context/campaignPages/ticketPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'ticket_landing', ticketPageId)`
   - Added organizationId from campaign context

6. **`frontend/src/app/context/campaignPages/ticketPurchasePageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'ticket_purchase', ticketPurchasePageId)`
   - Added organizationId from campaign context

7. **`frontend/src/app/context/campaignPages/peerLandingPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'peer_landing', peerLandingPageId)`
   - Added organizationId from campaign context

8. **`frontend/src/app/context/campaignPages/peerFundraisingPageContext.js`**
   - Updated to use `getPageSectionsByPage(organizationId, 'peer_fundraising', peerFundraisingPageId)`
   - Added organizationId from campaign context

## Page Type Mapping

| Page Type | Description | Used For |
|-----------|-------------|----------|
| `landing` | Organization landing pages | Public organization landing pages |
| `about` | Organization about pages | Public organization about pages |
| `campaign_donation` | Campaign donation pages | Donation landing pages |
| `campaign_form` | Campaign donation forms | Donation form pages |
| `ticket_landing` | Ticket event landing pages | Ticket event landing pages |
| `ticket_purchase` | Ticket purchase pages | Ticket purchase forms |
| `peer_landing` | Peer fundraising landing pages | Peer fundraising landing pages |
| `peer_fundraising` | Peer fundraising pages | Individual peer fundraising pages |

## Migration Process

### 1. Database Migration
Run the migration script in `database_migration.sql`:
```sql
-- This will create the new table and migrate existing data
-- Adjust organization_id values as needed for your data
```

### 2. Backend Deployment
- Deploy updated backend controllers and routes
- New endpoints will be available alongside legacy ones

### 3. Frontend Deployment
- Deploy updated frontend services and contexts
- Legacy methods maintained for backward compatibility

### 4. Testing
- Test new API endpoints
- Verify section functionality across all page types
- Ensure backward compatibility with existing code

## Benefits of New Structure

1. **Scalability**: Supports multiple organizations without ID conflicts
2. **Flexibility**: Easy to add new page types
3. **Performance**: Optimized indexes for common queries
4. **Organization**: Clear separation by organization and page type
5. **Maintainability**: Better structure for future enhancements
6. **Backward Compatibility**: Legacy endpoints maintained during transition

## Next Steps

1. **Run Migration**: Execute the database migration script
2. **Test Thoroughly**: Verify all section functionality works correctly
3. **Monitor Performance**: Check query performance with new indexes
4. **Clean Up**: Remove legacy code after confirming everything works
5. **Documentation**: Update API documentation for new endpoints

## Rollback Plan

If issues arise:
1. Keep legacy endpoints functional
2. Revert to using legacy methods in contexts
3. Drop new table if necessary
4. Restore from backup if needed

The migration maintains full backward compatibility, so rollback is straightforward if needed.
