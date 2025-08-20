import { api, validators, errorHandler } from './apiClient.js';

// Organization Services
export class OrganizationCreateService {
   // Create organization
   static async createOrganization(data, userId) {
      try {
         // Validate required fields
         validators.required(data.name, 'Organization Name');
         validators.minLength(data.name, 2, 'Organization Name');
         validators.id(userId, 'User ID');

         const response = await api.post('/organization/register', {
            ...data,
            userId: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating organization:', error);
         throw error;
      }
   }

   // Create landing page
   static async createLandingPage(data, organizationId) {
      try {
         validators.required(data.title, 'Title');
         validators.minLength(data.title, 2, 'Title');
         validators.id(organizationId, 'Organization ID');

         const formData = new FormData();
         
         // Basic content
         formData.append("organization_id", organizationId);
         formData.append("title", data.title);
         formData.append("description", data.description || "");
         formData.append("about", data.about || "");
         
         // Content fields
         formData.append("mainHeadline", data.mainHeadline || "");
         formData.append("mainText", data.mainText || "");
         formData.append("impactText", data.impactText || "");
         formData.append("headlineOne", data.headlineOne || "");
         formData.append("descriptionOne", data.descriptionOne || "");
         formData.append("headlineTwo", data.headlineTwo || "");
         formData.append("descriptionTwo", data.descriptionTwo || "");
         formData.append("headlineThree", data.headlineThree || "");
         formData.append("descriptionThree", data.descriptionThree || "");
         
         // Images
         if (data.bgImage instanceof File) {
            formData.append("bgImage", data.bgImage);
         }
         if (data.aboutImage instanceof File) {
            formData.append("aboutImage", data.aboutImage);
         }
         if (data.textImage instanceof File) {
            formData.append("textImage", data.textImage);
         }
         if (data.imageOne instanceof File) {
            formData.append("imageOne", data.imageOne);
         }
         if (data.imageTwo instanceof File) {
            formData.append("imageTwo", data.imageTwo);
         }
         if (data.imageThree instanceof File) {
            formData.append("imageThree", data.imageThree);
         }
         
         // Color customization
         formData.append("bg_color", data.bg_color || "#FFFFFF");
         formData.append("p_color", data.p_color || "#000000");
         formData.append("s_color", data.s_color || "#666666");
         formData.append("c_color", data.c_color || "#FFFFFF");
         formData.append("ct_color", data.ct_color || "#000000");
         formData.append("b_color", data.b_color || "#1F2937");
         formData.append("bt_color", data.bt_color || "#FFFFFF");
         
         // Font sizes
         formData.append("hero_title_size", data.heroTitleSize || "36px");
         formData.append("hero_subtitle_size", data.heroSubtitleSize || "16px");
         formData.append("section_title_size", data.sectionTitleSize || "28px");
         formData.append("body_text_size", data.bodyTextSize || "14px");
         formData.append("button_text_size", data.buttonTextSize || "14px");
         formData.append("card_title_size", data.cardTitleSize || "18px");
         
         // Layout & spacing
         formData.append("hero_height", data.heroHeight || "500px");
         formData.append("section_padding", data.sectionPadding || "80px");
         formData.append("card_radius", data.cardRadius || "4px");
         formData.append("button_radius", data.buttonRadius || "4px");
         
         // Visual effects
         formData.append("overlay_opacity", data.overlayOpacity || "0.3");
         formData.append("accent_color", data.accentColor || "#1F2937");
         
         // Element visibility toggles
         formData.append("show_video_button", data.showVideoButton !== false);
         formData.append("show_hero_icons", data.showHeroIcons !== false);
         formData.append("show_feature_icons", data.showFeatureIcons !== false);
         formData.append("show_campaign_badges", data.showCampaignBadges !== false);
         formData.append("show_trust_badge", data.showTrustBadge !== false);
         formData.append("show_progress_indicators", data.showProgressIndicators !== false);
         formData.append("show_statistics", data.showStatistics !== false);
         formData.append("show_hover_effects", data.showHoverEffects !== false);

         const response = await api.post('/landing_page/create', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating landing page:', error);
         throw error;
      }
   }

   // Create about page
   static async createAboutPage(data, organizationId) {
      try {
         validators.required(data.title, 'Title');
         validators.minLength(data.title, 2, 'Title');
         validators.id(organizationId, 'Organization ID');

         const formData = new FormData();
         
         // Basic content
         formData.append("organization_id", organizationId);
         formData.append("title", data.title);
         formData.append("description", data.description || "");
         formData.append("headline", data.headline || "");
         
         // Content fields
         formData.append("aboutText", data.aboutText || "");
         formData.append("whatText", data.whatText || "");
         formData.append("whyText", data.whyText || "");
         formData.append("teamText", data.teamText || "");
         formData.append("missionText", data.missionText || "");
         formData.append("visionText", data.visionText || "");
         formData.append("valuesText", data.valuesText || "");
         
         // Images
         if (data.bgImage instanceof File) {
            formData.append("bgImage", data.bgImage);
         }
         if (data.aboutImage instanceof File) {
            formData.append("aboutImage", data.aboutImage);
         }
         if (data.teamImage instanceof File) {
            formData.append("teamImage", data.teamImage);
         }
         if (data.missionImage instanceof File) {
            formData.append("missionImage", data.missionImage);
         }
         if (data.visionImage instanceof File) {
            formData.append("visionImage", data.visionImage);
         }
         if (data.valuesImage instanceof File) {
            formData.append("valuesImage", data.valuesImage);
         }
         
         // Color customization
         formData.append("bg_color", data.bg_color || "#FFFFFF");
         formData.append("p_color", data.p_color || "#000000");
         formData.append("s_color", data.s_color || "#666666");
         formData.append("c_color", data.c_color || "#FFFFFF");
         formData.append("ct_color", data.ct_color || "#000000");
         formData.append("b_color", data.b_color || "#1F2937");
         formData.append("bt_color", data.bt_color || "#FFFFFF");
         
         // Font sizes
         formData.append("hero_title_size", data.heroTitleSize || "36px");
         formData.append("hero_subtitle_size", data.heroSubtitleSize || "16px");
         formData.append("section_title_size", data.sectionTitleSize || "28px");
         formData.append("body_text_size", data.bodyTextSize || "14px");
         formData.append("button_text_size", data.buttonTextSize || "14px");
         formData.append("card_title_size", data.cardTitleSize || "18px");
         
         // Layout & spacing
         formData.append("hero_height", data.heroHeight || "500px");
         formData.append("section_padding", data.sectionPadding || "80px");
         formData.append("card_radius", data.cardRadius || "4px");
         formData.append("button_radius", data.buttonRadius || "4px");
         
         // Visual effects
         formData.append("overlay_opacity", data.overlayOpacity || "0.3");
         formData.append("accent_color", data.accentColor || "#1F2937");
         
         // Element visibility toggles
         formData.append("show_video_button", data.showVideoButton !== false);
         formData.append("show_hero_icons", data.showHeroIcons !== false);
         formData.append("show_feature_icons", data.showFeatureIcons !== false);
         formData.append("show_team_photos", data.showTeamPhotos !== false);
         formData.append("show_mission_section", data.showMissionSection !== false);
         formData.append("show_vision_section", data.showVisionSection !== false);
         formData.append("show_values_section", data.showValuesSection !== false);
         formData.append("show_hover_effects", data.showHoverEffects !== false);

         const response = await api.post('/about_page/create', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating about page:', error);
         throw error;
      }
   }

   // Create page section
   static async createPageSection(organizationId, pageType, pageReferenceId, sectionName, active = true, userId = null) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(pageType, 'Page Type');
         validators.id(pageReferenceId, 'Page Reference ID');
         validators.required(sectionName, 'Section Name');

         const response = await api.post(`/sections/create`, {
            organization_id: organizationId,
            page_type: pageType,
            page_reference_id: pageReferenceId,
            name: sectionName,
            active: active,
            user_id: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating page section:', error);
         throw error;
      }
   }

   // Initialize landing page sections
   static async initializeLandingPageSections(organizationId, landingPageId, userId) {
      try {
         const sections = [
            { name: "banner", active: true },
            { name: "main", active: false },
            { name: "about", active: false },
            { name: "impact", active: false },
            { name: "featured", active: false },
            { name: "triple", active: false }
         ];

         const createPromises = sections.map(section => 
            this.createPageSection(organizationId, 'landing', landingPageId, section.name, section.active, userId)
         );

         await Promise.all(createPromises);
         console.log('Landing page sections initialized successfully');
      } catch (error) {
         console.error('Error initializing landing page sections:', error);
         throw error;
      }
   }

   // Initialize about page sections
   static async initializeAboutPageSections(organizationId, aboutPageId, userId) {
      try {
         const sections = [
            { name: "banner", active: true },
            { name: "what", active: false },
            { name: "why", active: false },
            { name: "team", active: false }
         ];

         const createPromises = sections.map(section => 
            this.createPageSection(organizationId, 'about', aboutPageId, section.name, section.active, userId)
         );

         await Promise.all(createPromises);
         console.log('About page sections initialized successfully');
      } catch (error) {
         console.error('Error initializing about page sections:', error);
         throw error;
      }
   }
}

// Campaign Services
export class CampaignCreateService {
   // Create campaign
   static async createCampaign(currentUser, organizationId) {
      try {
         validators.id(currentUser?.id, 'User ID');
         validators.id(organizationId, 'Organization ID');

         const response = await api.post('/campaign/create', {
            organization_id: organizationId,
            created_by: currentUser.id,
         });
         
         return response.success ? response.data.campaignId : null;
      } catch (error) {
         console.error('Error creating campaign:', error);
         return { id: null, error: error.message };
      }
   }

   // Create campaign details
   static async createCampaignDetails(campaignId, currentUser, type, internalName) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');
         validators.required(type, 'Type');
         validators.required(internalName, 'Internal Name');

         const response = await api.post('/campaign_details/create', {
            campaign_id: campaignId,
            user_id: currentUser.id,
            type: type,
            internalName: internalName
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign details:', error);
         throw error;
      }
   }

   // Create campaign designation
   static async createCampaignDesignation(campaignId, designations) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(designations, 'Designations');

         const response = await api.post(`/campaign_designation/create/${campaignId}`, designations);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign designation:', error);
         throw error;
      }
   }

   // Create campaign ticket
   static async createCampaignTicket(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Ticket Data');

         const response = await api.post(`/campaign_ticket/create/${campaignId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating campaign ticket:', error);
         throw error;
      }
   }

   // Create custom question
   static async createCustomQuestion(campaignId, questions) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(questions, 'Questions');

         const response = await api.post(`/campaign_question/create/${campaignId}`, questions);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating custom question:', error);
         throw error;
      }
   }

   // Create FAQ
   static async createFaq(data, campaignId) {
      try {
         validators.required(data, 'FAQ Data');
         validators.id(campaignId, 'Campaign ID');

         const response = await api.post(`/faq/create/${campaignId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating FAQ:', error);
         throw error;
      }
   }
}

// Page Services
export class PageCreateService {
   // Create donation page
   static async createDonationPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/donationPage/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating donation page:', error);
         throw error;
      }
   }

   // Create thank you page
   static async createThankYouPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/thankYouPage/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating thank you page:', error);
         throw error;
      }
   }

   // Create ticket purchase page
   static async createTicketPurchasePage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/ticket_purchase_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating ticket purchase page:', error);
         throw error;
      }
   }

   // Create peer landing page
   static async createPeerLandingPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/peer_landing_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating peer landing page:', error);
         throw error;
      }
   }

   // Create donation form
   static async createDonationForm(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/donation_form/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.formId : null;
      } catch (error) {
         console.error('Error creating donation form:', error);
         throw error;
      }
   }

   // Create peer fundraising page
   static async createPeerFundraisingPage(campaignId, currentUser) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/peer_fundraising_page/create', {
            campaign_id: campaignId,
            user_id: currentUser.id
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating peer fundraising page:', error);
         throw error;
      }
   }

   // Create ticket page
   static async createTicketPage(campaignId) {
      try {
         validators.id(campaignId, 'Campaign ID');

         const response = await api.post('/ticket_page/create', {
            campaignId: campaignId
         });
         
         return response.success ? response.data.pageId : null;
      } catch (error) {
         console.error('Error creating ticket page:', error);
         throw error;
      }
   }

   // Create page section (legacy method for backward compatibility)
   static async createPageSection(pageId, name, active, currentUser) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(name, 'Section Name');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/sections/create', {
            page_id: pageId,
            name: name,
            active: active,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating page section:', error);
         throw error;
      }
   }

   // Create page section with new structure
   static async createPageSectionByPage(organizationId, pageType, pageReferenceId, name, active, currentUser) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(pageType, 'Page Type');
         validators.id(pageReferenceId, 'Page Reference ID');
         validators.required(name, 'Section Name');
         validators.id(currentUser?.id, 'User ID');

         const response = await api.post('/sections/create', {
            organization_id: organizationId,
            page_type: pageType,
            page_reference_id: pageReferenceId,
            name: name,
            active: active,
            user_id: currentUser.id
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating page section:', error);
         throw error;
      }
   }
}

// User Services
export class UserCreateService {
   // Create user
   static async createUser(data) {
      try {
         // Validate user data
         validators.required(data.firstName, 'First Name');
         validators.minLength(data.firstName, 2, 'First Name');
         validators.required(data.lastName, 'Last Name');
         validators.minLength(data.lastName, 2, 'Last Name');
         validators.required(data.email, 'Email');
         validators.email(data.email);
         validators.required(data.password, 'Password');
         validators.password(data.password, 8);

         const response = await api.post('/user/create', data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   // Create user organization relation
   static async createUserOrganizationRelation(userId, organizationId, status, role) {
      try {
         validators.id(userId, 'User ID');
         validators.id(organizationId, 'Organization ID');
         validators.required(status, 'Status');
         validators.required(role, 'Role');

         const response = await api.post('/user_organization/create', {
            userId: userId,
            organizationId: organizationId,
            status: status,
            role: role
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating user organization relation:', error);
         throw error;
      }
   }
}

// Designation Services
export class DesignationCreateService {
   // Create designation
   static async createDesignation(data) {
      try {
         validators.required(data.name, 'Designation Name');
         validators.minLength(data.name, 2, 'Designation Name');

         const response = await api.post('/designation/create', data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error creating designation:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const createOrganization = OrganizationCreateService.createOrganization;
export const createLandingPage = OrganizationCreateService.createLandingPage;
export const createAboutPage = OrganizationCreateService.createAboutPage;
export const createPageSection = OrganizationCreateService.createPageSection;
export const initializeLandingPageSections = OrganizationCreateService.initializeLandingPageSections;
export const initializeAboutPageSections = OrganizationCreateService.initializeAboutPageSections;

export const createCampaign = CampaignCreateService.createCampaign;
export const createCampaignDetails = CampaignCreateService.createCampaignDetails;
export const createCampaignDesignation = CampaignCreateService.createCampaignDesignation;
export const createCampaignTicket = CampaignCreateService.createCampaignTicket;
export const createCustomQuestion = CampaignCreateService.createCustomQuestion;
export const createFaq = CampaignCreateService.createFaq;

export const createDonationPage = PageCreateService.createDonationPage;
export const createThankYouPage = PageCreateService.createThankYouPage;
export const createTicketPurchasePage = PageCreateService.createTicketPurchasePage;
export const createPeerLandingPage = PageCreateService.createPeerLandingPage;
export const createDonationForm = PageCreateService.createDonationForm;
export const createPeerFundraisingPage = PageCreateService.createPeerFundraisingPage;
export const createTicketPage = PageCreateService.createTicketPage;
export const createPageSectionByPage = PageCreateService.createPageSectionByPage;

export const createUser = UserCreateService.createUser;
export const createUserOrganizationRelation = UserCreateService.createUserOrganizationRelation;

export const createDesignation = DesignationCreateService.createDesignation;