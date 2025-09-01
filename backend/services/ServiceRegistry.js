import { CampaignService } from './CampaignService.js';
import { DonorService } from './DonorService.js';
import { OrganizationService } from './OrganizationService.js';
import { PageService } from './PageService.js';
import { DesignationService } from './DesignationService.js';
import { SectionService } from './SectionService.js';
import { OrganizationStatusService } from './OrganizationStatusService.js';
import { TransactionService } from './TransactionService.js';
import { UserOrganizationService } from './UserOrganizationService.js';
import { UserService } from './UserService.js';
import { StripeService } from './StripeService.js';

/**
 * Service Registry - Central location for managing all services
 * This provides a single point of access for all business logic services
 */
export class ServiceRegistry {
  constructor() {
    this._services = new Map();
    this._initialized = false;
  }

  /**
   * Initialize all services
   */
  initialize() {
    if (this._initialized) {
      return;
    }

    // Register all services
    this._services.set('campaign', new CampaignService());
    this._services.set('donor', new DonorService());
    this._services.set('organization', new OrganizationService());
    this._services.set('page', new PageService());
    this._services.set('designation', new DesignationService());
    this._services.set('section', new SectionService());
    this._services.set('organizationStatus', new OrganizationStatusService());
    this._services.set('transaction', new TransactionService());
    this._services.set('userOrganization', new UserOrganizationService());
    this._services.set('user', new UserService());
    this._services.set('stripe', new StripeService());
    
    this._initialized = true;
    console.log('Service Registry initialized with services:', Array.from(this._services.keys()));
  }

  /**
   * Get a service by name
   * @param {string} serviceName - Name of the service
   * @returns {Object} Service instance
   */
  get(serviceName) {
    if (!this._initialized) {
      this.initialize();
    }

    const service = this._services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found. Available services: ${Array.from(this._services.keys()).join(', ')}`);
    }

    return service;
  }

  /**
   * Register a new service
   * @param {string} name - Service name
   * @param {Object} serviceInstance - Service instance
   */
  register(name, serviceInstance) {
    this._services.set(name, serviceInstance);
    console.log(`Service '${name}' registered`);
  }

  /**
   * Get all available service names
   * @returns {Array<string>} Array of service names
   */
  getAvailableServices() {
    return Array.from(this._services.keys());
  }

  /**
   * Check if a service is registered
   * @param {string} serviceName - Name of the service
   * @returns {boolean} True if service exists
   */
  has(serviceName) {
    return this._services.has(serviceName);
  }

  /**
   * Get service health status
   * @returns {Object} Health status of all services
   */
  async getHealthStatus() {
    const status = {};
    
    for (const [name, service] of this._services) {
      try {
        // Basic health check - try to execute a simple query
        if (service.executeQuery) {
          await service.executeQuery('SELECT 1 as health_check');
          status[name] = 'healthy';
        } else {
          status[name] = 'no_health_check';
        }
      } catch (error) {
        status[name] = 'unhealthy';
        console.error(`Service '${name}' health check failed:`, error.message);
      }
    }
    
    return {
      overall: Object.values(status).every(s => s === 'healthy') ? 'healthy' : 'degraded',
      services: status,
      timestamp: new Date().toISOString()
    };
  }
}

// Create singleton instance
const serviceRegistry = new ServiceRegistry();

// Export singleton and class for flexibility
export default serviceRegistry;
export { ServiceRegistry as ServiceRegistryClass };

// Convenience getters for common services
export const getCampaignService = () => serviceRegistry.get('campaign');
export const getDonorService = () => serviceRegistry.get('donor');
export const getOrganizationService = () => serviceRegistry.get('organization');
export const getPageService = () => serviceRegistry.get('page');
export const getDesignationService = () => serviceRegistry.get('designation');
export const getSectionService = () => serviceRegistry.get('section');
export const getOrganizationStatusService = () => serviceRegistry.get('organizationStatus');
export const getTransactionService = () => serviceRegistry.get('transaction');
export const getUserOrganizationService = () => serviceRegistry.get('userOrganization');
export const getUserService = () => serviceRegistry.get('user');
export const getStripeService = () => serviceRegistry.get('stripe');
