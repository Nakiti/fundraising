import { BaseService } from '../base/BaseService.js';

/**
 * Page Service - Handles all page-related operations
 * Extends BaseService for common API operations and error handling
 */
export class PageService extends BaseService {
  constructor() {
    super('PageService');
  }

  // ===== LANDING PAGE OPERATIONS =====

  /**
   * Get landing page for organization
   */
  async getLandingPage(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/landing_page/get/${organizationId}`);
  }

  /**
   * Create landing page
   */
  async createLandingPage(organizationId, pageData, files = {}) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(pageData.title, 'Page title');
    
    const formData = this.createFormData({
      ...pageData,
      organization_id: organizationId,
      ...files
    });
    
    return await this.postFormData('/landing_page/create', formData);
  }

  /**
   * Update landing page
   */
  async updateLandingPage(organizationId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    console.log('pageData', pageData);
    console.log('files', files);
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/landing_page/update/${organizationId}/${pageId}`, formData);
  }

  // ===== ABOUT PAGE OPERATIONS =====

  /**
   * Get about page for organization
   */
  async getAboutPage(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/about_page/get/${organizationId}`);
  }

  /**
   * Create about page
   */
  async createAboutPage(organizationId, pageData, files = {}) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(pageData.title, 'Page title');
    
    const formData = this.createFormData({
      ...pageData,
      organization_id: organizationId,
      ...files
    });
    
    return await this.postFormData('/about_page/create', formData);
  }

  /**
   * Update about page
   */
  async updateAboutPage(organizationId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/about_page/update/${organizationId}/${pageId}`, formData);
  }

  // ===== DONATION PAGE OPERATIONS =====

  /**
   * Get donation page for campaign
   */
  async getDonationPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/donation_page/get/${campaignId}`);
  }

  /**
   * Create donation page
   */
  async createDonationPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    // this.validateRequired(pageData.title, 'Page title');
    
    return await this.post('/donation_page/create', {
      // ...pageData,
      campaign_id: campaignId
    });
  }

  /**
   * Update donation page
   */
  async updateDonationPage(organizationId, campaignId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    console.log('pageId', pageId);
    
    console.log('pageData', pageData);
    console.log('files', files);
    const formData = this.createFormData({
      ...pageData,
      ...files,
    });
    
    return await this.putFormData(`/donation_page/update/${organizationId}/${campaignId}/${pageId}`, formData);
  }

  // ===== DONATION FORM OPERATIONS =====

  /**
   * Get donation form for campaign
   */
  async getDonationForm(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/donation_form/get/${campaignId}`);
  }

  /**
   * Create donation form
   */
  async createDonationForm(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    // this.validateRequired(formData.title, 'Form title');
    
    return await this.post('/donation_form/create', {
      // ...formData,
      campaign_id: campaignId
    });
  }

  /**
   * Update donation form
   */
  async updateDonationForm(organizationId, campaignId, formId, formData, files = {}) {
    this.validateId(formId, 'Form ID');
    
    console.log('formData', formData);
    console.log('files', files);
    const formDataToSend = this.createFormData({
      ...formData,
      ...files
    });
    
    return await this.putFormData(`/donation_form/update/${organizationId}/${campaignId}/${formId}`, formDataToSend);
  }

  // ===== THANK YOU PAGE OPERATIONS =====

  /**
   * Get thank you page for campaign
   */
  async getThankYouPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/thankyou_page/get/${campaignId}`);
  }

  /**
   * Create thank you page
   */
  async createThankYouPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    // this.validateRequired(pageData.title, 'Page title');
    
    return await this.post('/thankyou_page/create', {
      // ...pageData,
      campaign_id: campaignId
    });
  }

  /**
   * Update thank you page
   */
  async updateThankYouPage(organizationId, campaignId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');

    console.log('pageData', pageData);
    console.log('files', files);
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/thankyou_page/update/${organizationId}/${campaignId}/${pageId}`, formData);
  }

  // ===== HEADER & FOOTER PAGE OPERATIONS =====

  /**
   * Get header page for organization
   */
  async getHeaderPage(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/header_page/get/${organizationId}`);
  }

  /**
   * Create header page
   */
  async createHeaderPage(organizationId, userId) {
    this.validateId(organizationId, 'Organization ID');
    this.validateId(userId, 'User ID');
    
    return await this.post('/header_page/create', {
      organization_id: organizationId,
      user_id: userId
    });
  }

  /**
   * Update header page
   */
  async updateHeaderPage(organizationId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/header_page/update/${organizationId}/${pageId}`, formData);
  }

  /**
   * Get footer page for organization
   */
  async getFooterPage(organizationId) {
    this.validateId(organizationId, 'Organization ID');
    return await this.get(`/footer_page/get/${organizationId}`);
  }

  /**
   * Create footer page
   */
  async createFooterPage(organizationId, userId) {
    this.validateId(organizationId, 'Organization ID');
    this.validateId(userId, 'User ID');
    
    return await this.post('/footer_page/create', {
      organization_id: organizationId,
      user_id: userId
    });
  }

  /**
   * Update footer page
   */
  async updateFooterPage(organizationId, pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/footer_page/update/${organizationId}/${pageId}`, formData);
  }

  // ===== PEER FUNDRAISING PAGE OPERATIONS =====

  /**
   * Get peer fundraising page for campaign
   */
  async getPeerFundraisingPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/peer_fundraising_page/get/${campaignId}`);
  }

  /**
   * Create peer fundraising page
   */
  async createPeerFundraisingPage(campaignId, pageData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(pageData.title, 'Page title');
    
    return await this.post('/peer_fundraising_page/create', {
      ...pageData,
      campaign_id: campaignId
    });
  }

  /**
   * Update peer fundraising page
   */
  async updatePeerFundraisingPage(pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/peer_fundraising_page/update/${pageId}`, formData);
  }

  // ===== PEER LANDING PAGE OPERATIONS =====

  /**
   * Get peer landing page for campaign
   */
  async getPeerLandingPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/peer_landing_page/get/${campaignId}`);
  }

  /**
   * Create peer landing page
   */
  async createPeerLandingPage(campaignId, currentUser) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(currentUser, 'Current user');
    
    return await this.post('/peer_landing_page/create', {
      campaign_id: campaignId,
      user_id: currentUser.id
    });
  }

  // ===== TICKET PAGE OPERATIONS =====

  /**
   * Get ticket page for campaign
   */
  async getTicketPage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/ticket_page/get/${campaignId}`);
  }

  /**
   * Create ticket page
   */
  async createTicketPage(campaignId, pageData) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(pageData.title, 'Page title');
    
    return await this.post('/ticket_page/create', {
      ...pageData,
      campaign_id: campaignId
    });
  }

  /**
   * Update ticket page
   */
  async updateTicketPage(pageId, pageData, files = {}) {
    this.validateId(pageId, 'Page ID');
    
    const formData = this.createFormData({
      ...pageData,
      ...files
    });
    
    return await this.putFormData(`/ticket_page/update/${pageId}`, formData);
  }

  /**
   * Get ticket purchase page for campaign
   */
  async getTicketPurchasePage(campaignId) {
    this.validateId(campaignId, 'Campaign ID');
    return await this.get(`/ticket_purchase_page/get/${campaignId}`);
  }

  /**
   * Create ticket purchase page
   */
  async createTicketPurchasePage(campaignId, currentUser) {
    this.validateId(campaignId, 'Campaign ID');
    this.validateRequired(currentUser, 'Current user');
    
    return await this.post('/ticket_purchase_page/create', {
      campaign_id: campaignId,
      user_id: currentUser.id
    });
  }

  /**
   * Update ticket purchase page
   */
  async updateTicketPurchasePage(pageId, pageData, userId) {
    this.validateId(pageId, 'Page ID');
    this.validateId(userId, 'User ID');
    
    return await this.put(`/ticket_purchase_page/update/${pageId}`, {
      ...pageData,
      user_id: userId
    });
  }

  // ===== PAGE SECTIONS OPERATIONS =====

  /**
   * Get page sections
   */
  async getPageSections(pageId) {
    this.validateId(pageId, 'Page ID');
    return await this.get(`/section/get/${pageId}`);
  }

  /**
   * Get page sections by page type and reference
   */
  async getPageSectionsByPage(organizationId, pageType, pageReferenceId) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(pageType, 'Page type');
    this.validateId(pageReferenceId, 'Page reference ID');
    
    return await this.get(`/section/getByPage`, {
      organization_id: organizationId,
      page_type: pageType,
      page_reference_id: pageReferenceId
    });
  }

  /**
   * Create page section
   */
  async createPageSection(sectionData) {
    this.validateRequired(sectionData.page_id, 'Page ID');
    this.validateRequired(sectionData.type, 'Section type');
    
    return await this.post('/section/create', sectionData);
  }

  /**
   * Create page section by page type and reference
   */
  async createPageSectionByPage(organizationId, pageType, pageReferenceId, name, active, currentUser) {
    this.validateId(organizationId, 'Organization ID');
    this.validateRequired(pageType, 'Page type');
    this.validateId(pageReferenceId, 'Page reference ID');
    this.validateRequired(name, 'Section name');
    this.validateRequired(currentUser, 'Current user');
    
    // Coerce active to DB bit (0/1)
    const activeBit = typeof active === 'boolean' ? (active ? 1 : 0) : (Number(active) ? 1 : 0);

    return await this.post('/section/createByPage', {
      organization_id: organizationId,
      page_type: pageType,
      page_reference_id: pageReferenceId,
      name: name,
      active: activeBit,
      user_id: currentUser.id
    });
  }

  /**
   * Update page section
   */
  async updatePageSection(sectionId, sectionData) {
    console.log("sectionId", sectionId)
    this.validateId(sectionId, 'Section ID');

    console.log('sectionData', sectionData);

    // Support boolean, string, or number for active; coerce to 0/1 for DB
    const activeBit = typeof sectionData === 'boolean' ? (sectionData ? 1 : 0) : (Number(sectionData) ? 1 : 0);
    return await this.put(`/section/update/${sectionId}`, { active: activeBit });
  }

  /**
   * Bulk update sections' active flags
   */
  async bulkUpdateSections(items) {
    if (!Array.isArray(items) || items.length === 0) return;
    // Ensure active is 0/1
    const payload = items.map((i) => ({ id: i.id, active: typeof i.active === 'boolean' ? (i.active ? 1 : 0) : (Number(i.active) ? 1 : 0) }));
    return await this.put(`/section/bulkUpdate`, { items: payload });
  }

  /**
   * Update section order for a page
   */
  async updateSectionsOrder(organizationId, pageType, pageReferenceId, sections) {
    return await this.put(`/section/updateOrder`, {
      organization_id: organizationId,
      page_type: pageType,
      page_reference_id: pageReferenceId,
      sections
    });
  }

  /**
   * Delete page section
   */
  async deletePageSection(sectionId) {
    this.validateId(sectionId, 'Section ID');
    return await this.delete(`/section/delete/${sectionId}`);
  }

  /**
   * Reorder page sections
   */
  async reorderPageSections(pageId, sectionOrder) {
    this.validateId(pageId, 'Page ID');
    this.validateArray(sectionOrder, 'Section order');
    
    return await this.put(`/section/reorder/${pageId}`, { sectionOrder });
  }

  // ===== PAGE VALIDATION =====

  /**
   * Validate page data
   */
  validatePageData(pageData, requiredFields = ['title']) {
    requiredFields.forEach(field => {
      this.validateRequired(pageData[field], field);
    });
    
    if (pageData.title) {
      this.validateMinLength(pageData.title, 2, 'Title');
      this.validateMaxLength(pageData.title, 255, 'Title');
    }
    
    if (pageData.description) {
      this.validateMaxLength(pageData.description, 1000, 'Description');
    }
  }

  /**
   * Validate page files
   */
  validatePageFiles(files, allowedTypes = ['image/jpeg', 'image/png', 'image/webp']) {
    Object.values(files).forEach(file => {
      if (file && !allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
      }
      
      if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }
    });
  }
}
