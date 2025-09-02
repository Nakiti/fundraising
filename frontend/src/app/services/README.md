# Frontend Services Architecture

## Overview

This directory contains the refactored frontend services architecture that provides a clean, maintainable, and scalable approach to managing API calls and business logic.

## Architecture Components

### 1. Base Services (`/base/`)

#### `BaseService.js`
- **Purpose**: Common foundation for all domain services
- **Features**:
  - Standardized HTTP methods (GET, POST, PUT, DELETE, PATCH)
  - FormData handling for file uploads
  - Centralized error handling with service context
  - Built-in validation methods
  - Utility methods for common operations

#### `ValidationService.js`
- **Purpose**: Centralized validation logic
- **Features**:
  - Field validation (required, ID, email, length, etc.)
  - File validation (type, size)
  - Data structure validation
  - Custom validation rules

#### `ServiceRegistry.js`
- **Purpose**: Central service management
- **Features**:
  - Singleton pattern for service instances
  - Lazy loading of services
  - Service discovery and management
  - Convenience getters for each service

### 2. Domain Services (`/domain/`)

#### `CampaignService.js`
- **Purpose**: All campaign-related operations
- **Features**:
  - CRUD operations for campaigns
  - Campaign queries and filtering
  - Analytics and statistics
  - Designation management
  - Ticket management
  - FAQ management
  - Bulk operations

#### `PageService.js`
- **Purpose**: All page-related operations
- **Features**:
  - Landing page management
  - About page management
  - Donation page management
  - Form management
  - Thank you page management
  - Header/Footer page management
  - Page sections management
  - File upload handling

## Usage Examples

### Basic Usage

```javascript
import { getCampaignService, getPageService } from './services';

// Get service instances
const campaignService = getCampaignService();
const pageService = getPageService();

// Use services
const campaign = await campaignService.getCampaign(campaignId);
const landingPage = await pageService.getLandingPage(organizationId);
```

### Advanced Usage

```javascript
import { getCampaignService } from './services';

const campaignService = getCampaignService();

// Filtered campaigns with pagination
const campaigns = await campaignService.getFilteredCampaigns(organizationId, {
  status: 'active',
  type: 'donation',
  limit: 10,
  offset: 0
});

// Campaign analytics
const performance = await campaignService.getCampaignPerformance(campaignId, '30d');

// Bulk operations
await campaignService.bulkUpdateStatus([1, 2, 3], 'active');
```

### File Upload Example

```javascript
import { getPageService } from './services';

const pageService = getPageService();

// Update landing page with images
const formData = new FormData();
formData.append('title', 'New Title');
formData.append('bgImage', fileInput.files[0]);

await pageService.updateLandingPage(pageId, {
  title: 'New Title',
  description: 'New description'
}, {
  bgImage: fileInput.files[0]
});
```

## Migration from Legacy Services

### Before (Legacy)
```javascript
import { getCampaign, getAllCampaigns } from './services';

const campaign = await getCampaign(campaignId);
const campaigns = await getAllCampaigns(organizationId);
```

### After (New Architecture)
```javascript
import { getCampaignService } from './services';

const campaignService = getCampaignService();
const campaign = await campaignService.getCampaign(campaignId);
const campaigns = await campaignService.getCampaignsByOrganization(organizationId);
```

## Benefits of New Architecture

### 1. **Consistency**
- All services follow the same pattern
- Consistent error handling and validation
- Standardized API response handling

### 2. **Maintainability**
- Smaller, focused service files
- Clear separation of concerns
- Easy to locate and modify specific functionality

### 3. **Reusability**
- Common functionality in base services
- Shared validation and error handling
- Consistent patterns across services

### 4. **Testability**
- Easy to mock individual services
- Clear interfaces for testing
- Isolated business logic

### 5. **Scalability**
- Easy to add new services
- No impact on existing services
- Clear extension points

### 6. **Error Handling**
- Centralized error logging
- Service context in error messages
- Consistent error format

### 7. **Validation**
- Built-in validation methods
- Consistent validation rules
- Easy to extend validation logic

## Best Practices

### 1. **Service Design**
- Extend `BaseService` for all domain services
- Use descriptive method names
- Group related methods together
- Add comprehensive JSDoc comments

### 2. **Error Handling**
- Always use the service's error handling methods
- Provide meaningful error messages
- Log errors with service context
- Handle specific error types appropriately

### 3. **Validation**
- Validate inputs at the service level
- Use built-in validation methods
- Provide clear validation error messages
- Validate both required fields and data types

### 4. **File Handling**
- Use `createFormData()` for file uploads
- Validate file types and sizes
- Handle both single and multiple files
- Clean up temporary files appropriately

### 5. **API Calls**
- Use appropriate HTTP methods
- Handle query parameters correctly
- Manage request/response data properly
- Use consistent endpoint patterns

## Adding New Services

### 1. **Create Service Class**
```javascript
import { BaseService } from '../base/BaseService.js';

export class NewService extends BaseService {
  constructor() {
    super('NewService');
  }

  async getNewItem(id) {
    this.validateId(id, 'Item ID');
    return await this.get(`/new/${id}`);
  }
}
```

### 2. **Add to ServiceRegistry**
```javascript
// In ServiceRegistry.js
const { NewService } = await import('../domain/NewService.js');
this.services.set('new', new NewService());

// Add convenience getter
export const getNewService = () => serviceRegistry.getService('new');
```

### 3. **Export from Index**
```javascript
// In index.js
export { getNewService } from './base/ServiceRegistry.js';
```

## Testing

### 1. **Service Testing**
```javascript
import { NewService } from './NewService';

describe('NewService', () => {
  let service;

  beforeEach(() => {
    service = new NewService();
  });

  it('should validate ID correctly', () => {
    expect(() => service.validateId(null, 'ID')).toThrow();
    expect(() => service.validateId(0, 'ID')).toThrow();
    expect(() => service.validateId(1, 'ID')).not.toThrow();
  });
});
```

### 2. **Mocking Services**
```javascript
// Mock the service registry
jest.mock('./services', () => ({
  getNewService: () => ({
    getNewItem: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
  })
}));
```

## Performance Considerations

### 1. **Lazy Loading**
- Services are loaded only when needed
- Reduces initial bundle size
- Improves startup performance

### 2. **Caching**
- Service instances are cached in registry
- No repeated instantiation
- Consistent state across components

### 3. **Error Handling**
- Efficient error logging
- Minimal performance impact
- Service context preserved

## Future Enhancements

### 1. **TypeScript Support**
- Add type definitions
- Interface definitions for services
- Generic type support

### 2. **Advanced Caching**
- Response caching
- Cache invalidation
- Memory management

### 3. **Request Batching**
- Batch multiple API calls
- Reduce network overhead
- Improve performance

### 4. **Offline Support**
- Service worker integration
- Offline data storage
- Sync when online

## Troubleshooting

### Common Issues

1. **Service Not Found**
   - Ensure service is registered in ServiceRegistry
   - Check service name spelling
   - Verify service initialization

2. **Validation Errors**
   - Check input data types
   - Verify required fields
   - Use appropriate validation methods

3. **File Upload Issues**
   - Check file size limits
   - Verify file types
   - Use FormData correctly

4. **API Errors**
   - Check endpoint URLs
   - Verify request parameters
   - Check server response format

### Debug Mode

Enable debug logging in development:
```javascript
// In BaseService.js
if (process.env.NODE_ENV === 'development') {
  console.log(`[${this.serviceName}] ${method} ${endpoint}`, data);
}
```

## Support

For questions or issues with the new services architecture:

1. Check this README for usage examples
2. Review the migration guide
3. Check service implementation for specific methods
4. Review error logs for debugging information
5. Consult the backend services for API compatibility
