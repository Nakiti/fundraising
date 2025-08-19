# Dashboard API Documentation

This document describes the new dashboard API endpoints that provide summary information and statistics for the fundraising dashboard.

## Overview

The dashboard API provides real-time statistics and data for the organization dashboard, including:
- Summary statistics with trend analysis
- Recent donations
- Top performing campaigns
- Organization status and health
- Dashboard notifications

## Base URL

All endpoints are prefixed with `/api/dashboard`

## Endpoints

### 1. Get Dashboard Summary

**Endpoint:** `GET /api/dashboard/summary/:organizationId`

**Description:** Returns summary statistics for the organization with trend analysis.

**Parameters:**
- `organizationId` (path): The organization ID
- `period` (query, optional): Time period for statistics (`week`, `month`, `year`). Default: `week`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDonations": {
      "value": 156,
      "change": 23,
      "trend": "up"
    },
    "newSupporters": {
      "value": 45,
      "change": 12,
      "trend": "up"
    },
    "totalRaised": {
      "value": 26300,
      "change": 18,
      "trend": "up"
    },
    "activeCampaigns": {
      "value": 5,
      "change": 2,
      "trend": "up"
    }
  },
  "message": "Dashboard summary retrieved successfully"
}
```

### 2. Get Recent Donations

**Endpoint:** `GET /api/dashboard/recent-donations/:organizationId`

**Description:** Returns the most recent donations for the organization.

**Parameters:**
- `organizationId` (path): The organization ID
- `limit` (query, optional): Number of donations to return. Default: 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sarah Johnson",
      "amount": 150,
      "campaign": "Temple Renovation",
      "time": "2024-01-15T10:30:00.000Z",
      "avatar": "SJ"
    }
  ],
  "message": "Recent donations retrieved successfully"
}
```

### 3. Get Top Campaigns

**Endpoint:** `GET /api/dashboard/top-campaigns/:organizationId`

**Description:** Returns the top performing campaigns for the organization.

**Parameters:**
- `organizationId` (path): The organization ID
- `limit` (query, optional): Number of campaigns to return. Default: 5

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Temple Renovation",
      "raised": 12500,
      "goal": 20000,
      "donors": 89,
      "trend": "+15%",
      "percentageFunded": 62
    }
  ],
  "message": "Top campaigns retrieved successfully"
}
```

### 4. Get Organization Status

**Endpoint:** `GET /api/dashboard/organization-status/:organizationId`

**Description:** Returns the organization's status and health information.

**Parameters:**
- `organizationId` (path): The organization ID

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "name": "Sample Organization",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "totalCampaigns": 10,
      "activeCampaigns": 5
    },
    "pages": {
      "landing": "active"
    },
    "health": {
      "score": 85,
      "status": "healthy"
    }
  },
  "message": "Organization status retrieved successfully"
}
```

### 5. Get Dashboard Notifications

**Endpoint:** `GET /api/dashboard/notifications/:organizationId`

**Description:** Returns recent notifications and activities for the dashboard.

**Parameters:**
- `organizationId` (path): The organization ID
- `limit` (query, optional): Number of notifications to return. Default: 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "message": "Sarah Johnson donated $150",
      "time": "2024-01-15T10:30:00.000Z",
      "type": "donation",
      "referenceId": 123
    }
  ],
  "message": "Notifications retrieved successfully"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Missing or invalid parameters
- `NOT_FOUND`: Organization not found
- `DATABASE_ERROR`: Database operation failed

## Frontend Integration

The frontend uses these services through the `DashboardService` class in `frontend/src/app/services/fetchService.js`:

```javascript
import { 
  getDashboardSummary,
  getRecentDonations,
  getTopCampaigns,
  getOrganizationStatus,
  getDashboardNotifications
} from "@/app/services/fetchService"

// Example usage
const summary = await getDashboardSummary(organizationId, 'week');
const donations = await getRecentDonations(organizationId, 10);
const campaigns = await getTopCampaigns(organizationId, 5);
const status = await getOrganizationStatus(organizationId);
const notifications = await getDashboardNotifications(organizationId, 10);
```

## Database Requirements

The API requires the following database tables:
- `organizations`
- `campaigns`
- `campaign_details`
- `transactions`
- `donors`
- `landing_page`

## Testing

Run the test script to verify the API setup:

```bash
cd backend
node test-dashboard.js
```

This will check if the required database tables exist and contain data for testing.

## Performance Considerations

- All queries are optimized with proper indexing
- Summary statistics are calculated on-demand
- Recent donations and campaigns are limited to prevent large result sets
- Consider implementing caching for frequently accessed data in production
