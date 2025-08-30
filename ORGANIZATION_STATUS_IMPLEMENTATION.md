# Organization Status Management Implementation

## Overview
This implementation automatically manages organization status based on the activation state of required components. An organization can only be `active` when ALL required components are properly configured and activated.

## Required Components for Organization Activation

For an organization to be automatically set to `active` status, the following components MUST all be active:

1. **Landing Page** - `landing_pages.active = 1`
2. **About Page** - `about_pages.active = 1` 
3. **Header Page** - `header_pages.active = 1`
4. **Footer Page** - `footer_pages.active = 1`
5. **Stripe Configuration** - `organizations.stripe_charges_enabled = 1 AND organizations.stripe_details_submitted = 1`

## Automatic Status Management

### When Organization Status is Set to `active`:
- All 5 required components are active
- Organization status automatically changes from `inactive` to `active`

### When Organization Status is Set to `inactive`:
- Any ONE of the 5 required components becomes inactive
- Organization status automatically changes from `active` to `inactive`

## Implementation Details

### 1. Core Service (`organization_status.js`)
- **`checkAndUpdateOrganizationStatus(organizationId)`**: Main function that checks all components and updates organization status
- **`updateOrganizationStatus(organizationId, status)`**: Manual override for admin use
- **`getOrganizationStatusBreakdown(organizationId)`**: Detailed status breakdown for debugging

### 2. Automatic Triggers
The status check is automatically triggered when any of these components are updated:

#### Page Updates:
- **Landing Page**: `PUT /api/landing_page/update/:id`
- **About Page**: `PUT /api/about_page/update/:id`  
- **Header Page**: `PUT /api/header_page/update/:id`
- **Footer Page**: `PUT /api/footer_page/update/:id`

#### Stripe Updates:
- **Stripe Account Status**: `GET /api/stripe/connect/status/:organizationId` (when status is fetched and updated)

### 3. API Endpoints

#### Manual Status Management:
- `PUT /api/organization-status/update/:organizationId` - Manually set organization status
- `GET /api/organization-status/breakdown/:organizationId` - Get detailed status breakdown

### 4. Database Schema Requirements

The implementation expects the following database structure:

```sql
-- Organizations table
organizations.status (varchar) - 'active' or 'inactive'
organizations.stripe_charges_enabled (boolean)
organizations.stripe_details_submitted (boolean)

-- Page tables with active field
landing_pages.active (boolean)
about_pages.active (boolean)
header_pages.active (boolean)
footer_pages.active (boolean)
```

## Usage Examples

### 1. Page Activation Flow
```javascript
// When a landing page is published/activated
PUT /api/landing_page/update/123
{
  "active": true,
  // ... other page data
}

// System automatically:
// 1. Updates landing page
// 2. Checks all required components
// 3. Updates organization status if all components are now active
```

### 2. Stripe Configuration Flow
```javascript
// When Stripe account status is checked
GET /api/stripe/connect/status/456

// System automatically:
// 1. Fetches fresh Stripe account data
// 2. Updates organization's Stripe status fields
// 3. Checks all required components
// 4. Updates organization status accordingly
```

### 3. Status Breakdown API
```javascript
GET /api/organization-status/breakdown/456

// Response:
{
  "success": true,
  "data": {
    "organizationName": "My Nonprofit",
    "currentStatus": "inactive",
    "shouldBeActive": false,
    "statusMatch": true,
    "components": {
      "landing_page": {
        "status": "active",
        "id": 123,
        "exists": true
      },
      "about_page": {
        "status": "inactive",
        "id": 124,
        "exists": true
      },
      "header_page": {
        "status": "active",
        "id": 125,
        "exists": true
      },
      "footer_page": {
        "status": "active",
        "id": 126,
        "exists": true
      },
      "stripe_config": {
        "status": "inactive",
        "account_id": "acct_123",
        "charges_enabled": false,
        "details_submitted": true,
        "exists": true
      }
    }
  }
}
```

## Error Handling

- Status checking failures are logged but don't affect the primary operations
- If status checking fails, the main page/config update still succeeds
- Manual status override is available for edge cases

## Benefits

1. **Automatic Management**: No manual intervention needed for typical workflows
2. **Consistent State**: Organization status always reflects actual component readiness
3. **Donor Protection**: Ensures donors can't access incomplete/broken organization pages
4. **Admin Visibility**: Clear breakdown of what components need attention
5. **Fail-Safe**: Any component deactivation immediately protects the organization from public access

## Frontend Integration

This backend implementation works with the existing frontend inactive message component to ensure a seamless user experience when organizations are not ready for public access.

