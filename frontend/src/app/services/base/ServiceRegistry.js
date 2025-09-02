/**
 * Service Registry - Central management for all domain services
 * Provides singleton instances and lazy loading of services
 */
class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.initialized = false;
  }

  /**
   * Initialize all services (called once on app startup)
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // Import and initialize all services
      await this.initializeServices();
      this.initialized = true;
      console.log('[ServiceRegistry] All services initialized successfully');
    } catch (error) {
      console.error('[ServiceRegistry] Failed to initialize services:', error);
      throw error;
    }
  }

  /**
   * Initialize individual services
   */
  async initializeServices() {
    // Auth Service
    const { AuthService } = await import('../domain/AuthService.js');
    this.services.set('auth', new AuthService());

    // Dashboard Service
    const { DashboardService } = await import('../domain/DashboardService.js');
    this.services.set('dashboard', new DashboardService());

    // Donor Service
    const { DonorService } = await import('../domain/DonorService.js');
    this.services.set('donor', new DonorService());

    // Campaign Service
    const { CampaignService } = await import('../domain/CampaignService.js');
    this.services.set('campaign', new CampaignService());

    // Page Service
    const { PageService } = await import('../domain/PageService.js');
    this.services.set('page', new PageService());

    // Organization Service
    const { OrganizationService } = await import('../domain/OrganizationService.js');
    this.services.set('organization', new OrganizationService());

    // User Service
    const { UserService } = await import('../domain/UserService.js');
    this.services.set('user', new UserService());

    // Transaction Service
    const { TransactionService } = await import('../domain/TransactionService.js');
    this.services.set('transaction', new TransactionService());

    // Designation Service
    const { DesignationService } = await import('../domain/DesignationService.js');
    this.services.set('designation', new DesignationService());

    // Content Service
    const { ContentService } = await import('../domain/ContentService.js');
    this.services.set('content', new ContentService());

    // Stripe Service
    const { StripeService } = await import('../domain/StripeService.js');
    this.services.set('stripe', new StripeService());
  }

  /**
   * Get a service by name
   */
  getService(serviceName) {
    if (!this.initialized) {
      throw new Error(`ServiceRegistry not initialized. Call initialize() first.`);
    }
    
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service '${serviceName}' not found in registry.`);
    }
    
    return service;
  }

  /**
   * Check if a service exists
   */
  hasService(serviceName) {
    return this.services.has(serviceName);
  }

  /**
   * Get all registered service names
   */
  getServiceNames() {
    return Array.from(this.services.keys());
  }

  /**
   * Get service instance (alias for getService)
   */
  get(serviceName) {
    return this.getService(serviceName);
  }

  /**
   * Reset registry (useful for testing)
   */
  reset() {
    this.services.clear();
    this.initialized = false;
  }
}

// Create singleton instance
const serviceRegistry = new ServiceRegistry();

// Convenience getters for each service
export const getAuthService = () => serviceRegistry.getService('auth');
export const getDashboardService = () => serviceRegistry.getService('dashboard');
export const getDonorService = () => serviceRegistry.getService('donor');
export const getCampaignService = () => serviceRegistry.getService('campaign');
export const getPageService = () => serviceRegistry.getService('page');
export const getOrganizationService = () => serviceRegistry.getService('organization');
export const getUserService = () => serviceRegistry.getService('user');
export const getTransactionService = () => serviceRegistry.getService('transaction');
export const getDesignationService = () => serviceRegistry.getService('designation');
export const getContentService = () => serviceRegistry.getService('content');
export const getStripeService = () => serviceRegistry.getService('stripe');

// Export the registry instance and initialization function
export { serviceRegistry };
export const initializeServices = () => serviceRegistry.initialize();
