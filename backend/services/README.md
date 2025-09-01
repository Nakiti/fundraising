# Backend Service Layer Architecture

This directory contains the new service layer architecture that separates business logic from controllers and provides a clean, maintainable structure for the application.

## Architecture Overview

```
Controllers (HTTP Layer) → Services (Business Logic) → Database
```

### Key Components

1. **BaseService** - Foundation class with common database operations
2. **Domain Services** - Specific business logic for each domain (Campaign, Donor, etc.)
3. **ServiceRegistry** - Central management of all services
4. **Refactored Controllers** - Thin HTTP layer that delegates to services

## Files Structure

```
backend/services/
├── BaseService.js           # Base class with common DB operations
├── CampaignService.js       # Campaign business logic
├── DonorService.js          # Donor business logic
├── ServiceRegistry.js       # Service management and registry
└── README.md               # This file
```

## BaseService Features

The `BaseService` class provides common functionality for all services:

- **Database Operations**: CRUD operations with error handling
- **Query Execution**: Promise-wrapped database queries
- **Validation**: Common validation utilities
- **Transactions**: Database transaction management
- **Error Handling**: Consistent error throwing and handling

### Example Usage

```javascript
import { BaseService } from './BaseService.js';

class MyService extends BaseService {
  constructor() {
    super('my_table');
  }

  async createRecord(data) {
    this.validateRequiredFields(data, ['name', 'email']);
    return await this.create(data);
  }
}
```

## Domain Services

### CampaignService

Handles all campaign-related business logic:

- Campaign creation and validation
- Campaign search and filtering
- Campaign statistics
- URL uniqueness validation
- Permission checking

**Key Methods:**
- `createCampaign(campaignData)`
- `getCampaignWithDetails(campaignId)`
- `searchCampaigns(query, organizationId)`
- `getCampaignStats(campaignId)`

### DonorService

Handles all donor-related business logic:

- Donor registration and authentication
- Profile management
- Session management
- Guest donor conversion
- Donation history

**Key Methods:**
- `registerDonor(organizationId, donorData)`
- `loginDonor(organizationId, email, password)`
- `getDonorDonations(donorId, options)`
- `convertGuestToRegistered(organizationId, conversionData)`

## ServiceRegistry

Central service management with:

- Service registration and discovery
- Health monitoring
- Singleton pattern for service instances
- Convenience getters for common services

### Usage

```javascript
import serviceRegistry, { getCampaignService } from './ServiceRegistry.js';

// Get service via registry
const campaignService = serviceRegistry.get('campaign');

// Or use convenience getter
const campaignService = getCampaignService();
```

## Refactored Controllers

The new controllers are thin HTTP layers that:

- Handle request/response formatting
- Delegate business logic to services
- Manage authentication and authorization
- Return standardized responses

### Example

```javascript
import { getCampaignService } from '../services/ServiceRegistry.js';

const campaignService = getCampaignService();

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  sendCreated(res, { campaignId: campaign.id }, 'Campaign created successfully');
});
```

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Controllers handle HTTP concerns
- Services handle business logic
- Database access is abstracted

### 2. **Testability**
- Services can be unit tested independently
- Mock services for controller testing
- Clear boundaries for testing

### 3. **Reusability**
- Business logic can be reused across different endpoints
- Services can be used by background jobs, CLI tools, etc.

### 4. **Maintainability**
- Single responsibility principle
- Easier to locate and modify business logic
- Consistent patterns across the application

### 5. **Error Handling**
- Centralized error handling in BaseService
- Consistent error types and messages
- Proper error propagation

## Migration Guide

### From Old Controllers to New Architecture

**Before (Old Controller):**
```javascript
export const createCampaign = asyncHandler(async (req, res) => {
  const { organization_id, created_by } = req.body;
  
  if (!organization_id || !created_by) {
    throw new ValidationError('Missing required fields');
  }

  const query = "INSERT INTO campaigns (organization_id, created_by) VALUES (?, ?)";
  
  return new Promise((resolve, reject) => {
    db.query(query, [organization_id, created_by], (err, data) => {
      if (err) reject(new DatabaseError('Failed to create campaign', err));
      sendCreated(res, { campaignId: data.insertId }, 'Campaign created');
      resolve();
    });
  });
});
```

**After (New Architecture):**
```javascript
export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  sendCreated(res, { campaignId: campaign.id }, 'Campaign created successfully');
});
```

### Steps to Migrate

1. **Identify Business Logic**: Extract business logic from controllers
2. **Create Service Methods**: Move logic to appropriate service classes
3. **Update Controllers**: Replace direct DB access with service calls
4. **Update Routes**: Point to new controller methods
5. **Test**: Ensure functionality remains intact

## Best Practices

### 1. **Service Design**
- Keep services focused on a single domain
- Use dependency injection for service dependencies
- Return domain objects, not database records

### 2. **Error Handling**
- Let services throw business logic errors
- Handle HTTP-specific errors in controllers
- Use custom error types for different scenarios

### 3. **Validation**
- Validate input at service level
- Use BaseService validation utilities
- Throw ValidationError for invalid input

### 4. **Database Access**
- Use BaseService methods when possible
- Create custom queries for complex operations
- Always use parameterized queries

### 5. **Testing**
- Write unit tests for service methods
- Mock database calls in tests
- Test error conditions and edge cases

## Future Enhancements

### Planned Improvements

1. **Repository Pattern**: Further abstract database access
2. **Dependency Injection**: Formal DI container
3. **Event System**: Service-to-service communication
4. **Caching Layer**: Redis integration for performance
5. **Logging**: Structured logging for service operations

### Additional Services to Create

- `OrganizationService`
- `UserService`
- `TransactionService`
- `PageService`
- `DesignationService`

## Health Monitoring

The ServiceRegistry provides health monitoring:

```javascript
const health = await serviceRegistry.getHealthStatus();
console.log(health);
// {
//   overall: 'healthy',
//   services: { campaign: 'healthy', donor: 'healthy' },
//   timestamp: '2024-01-15T10:30:00.000Z'
// }
```

## Getting Started

1. **Use New Controllers**: Replace old controller imports with refactored versions
2. **Update Routes**: Point routes to new controller methods
3. **Test Thoroughly**: Ensure all functionality works as expected
4. **Monitor**: Use health endpoints to monitor service status

This architecture provides a solid foundation for scaling the application while maintaining code quality and testability.
