import { api, validators, errorHandler } from './apiClient.js';

// Organization Services
export class OrganizationUpdateService {
   // Update organization
   static async updateOrganization(organizationId, data) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(data, 'Organization Data');

         const response = await api.put(`/organization/update/${organizationId}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating organization:', error);
         throw error;
      }
   }
}

// Campaign Services
export class CampaignUpdateService {
   // Update campaign details
   static async updateCampaignDetails(campaignId, inputs, status, currentUser, questionInputs = null) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(currentUser?.id, 'User ID');
         validators.required(inputs, 'Campaign Inputs');

         const requestBody = {
            defaultDesignation: inputs.defaultDesignation,
            externalName: inputs.campaignName,
            internalName: inputs.internalName,
            goal: inputs.goal,
            url: inputs.url,
            status: status,
            userId: currentUser.id
         };

         // Add question input values if provided
         if (questionInputs) {
            requestBody.showPhone = questionInputs.phone || false;
            requestBody.showTitle = questionInputs.title || false;
            requestBody.showSuffix = questionInputs.suffix || false;
            requestBody.showCompanyName = questionInputs.companyorganizationname || false;
            requestBody.showWebsiteUrl = questionInputs.websiteurl || false;
         }

         const response = await api.put(`/campaign_details/update/${campaignId}`, requestBody);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating campaign details:', error);
         throw error;
      }
   }

   // Deactivate campaign
   static async deactivateCampaign(campaignId, userId) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.id(userId, 'User ID');

         const response = await api.put(`/campaign/deactivate/${campaignId}`, {
            updatedBy: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error deactivating campaign:', error);
         throw error;
      }
   }
}

// Page Services
export class PageUpdateService {
   // Update donation page
   static async updateDonationPage(campaignId, inputs) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(inputs, 'Page Inputs');

         const formData = new FormData();
         
         // Basic Content
         formData.append("headline", inputs.headline || "");
         formData.append("description", inputs.description || "");
         formData.append("subtitle", inputs.subtitle || "");
         formData.append("mainHeadline", inputs.mainHeadline || "");
         formData.append("mainText", inputs.mainText || "");
         
         // Images
         formData.append("banner_image", inputs.banner_image || "");
         formData.append("small_image", inputs.small_image || "");
         
         // Colors
         formData.append("bg_color", inputs.bg_color || "#ffffff");
         formData.append("p_color", inputs.p_color || "#1f2937");
         formData.append("s_color", inputs.s_color || "#3b82f6");
         formData.append("b1_color", inputs.b1_color || "#3b82f6");
         formData.append("b2_color", inputs.b2_color || "#6b7280");
         formData.append("b3_color", inputs.b3_color || "#10b981");
         formData.append("bt_color", inputs.bt_color || "#ffffff");
         
         // Donation Amounts
         formData.append("button1", inputs.button1 || 25);
         formData.append("button2", inputs.button2 || 50);
         formData.append("button3", inputs.button3 || 100);
         formData.append("button4", inputs.button4 || 250);
         formData.append("button5", inputs.button5 || 500);
         formData.append("button6", inputs.button6 || 1000);
         
         // Campaign Stats
         formData.append("goal_amount", inputs.goal_amount || 10000);
         formData.append("raised_amount", inputs.raised_amount || 2450);
         formData.append("donor_count", inputs.donor_count || 127);
         formData.append("days_left", inputs.days_left || 23);
         
         // Layout Options
         formData.append("show_progress", inputs.show_progress !== false);
         formData.append("show_donor_count", inputs.show_donor_count !== false);
         formData.append("show_days_left", inputs.show_days_left !== false);
         formData.append("show_amount_grid", inputs.show_amount_grid !== false);
         
         // Button Text
         formData.append("donate_button_text", inputs.donate_button_text || "Donate Now");
         formData.append("share_button_text", inputs.share_button_text || "Share");
         
         // Footer
         formData.append("footer_text", inputs.footer_text || "Your Organization");
         formData.append("privacy_policy_url", inputs.privacy_policy_url || "#");
         formData.append("terms_of_service_url", inputs.terms_of_service_url || "#");
         
         // Typography
         formData.append("heroTitleSize", inputs.heroTitleSize || "36");
         formData.append("heroSubtitleSize", inputs.heroSubtitleSize || "16");
         formData.append("sectionTitleSize", inputs.sectionTitleSize || "28");
         formData.append("bodyTextSize", inputs.bodyTextSize || "16");
         formData.append("buttonTextSize", inputs.buttonTextSize || "16");
         formData.append("cardTitleSize", inputs.cardTitleSize || "18");
         
         // Layout
         formData.append("heroHeight", inputs.heroHeight || "500");
         formData.append("sectionPadding", inputs.sectionPadding || "80");
         formData.append("cardRadius", inputs.cardRadius || "4");
         formData.append("buttonRadius", inputs.buttonRadius || "4");
         
         // Visual Effects
         formData.append("overlayOpacity", inputs.overlayOpacity || "0.3");

         const response = await api.put(`/donationPage/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donation page:', error);
         throw error;
      }
   }

   // Update landing page
   static async updateLandingPage(id, data) {
      try {
         validators.id(id, 'Page ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         
         // Basic content
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

         const response = await api.put(`/landing_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating landing page:', error);
         throw error;
      }
   }

   // Update peer landing page
   static async updatePeerLandingPage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("tagline", data.tagline);
         formData.append("description", data.description);
         formData.append("banner_image", data.banner_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.bg_color);
         formData.append("t_color", data.t_color);
         formData.append("user_id", userId);

         const response = await api.put(`/peer_landing_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating peer landing page:', error);
         throw error;
      }
   }

   // Update donation form
   static async updateDonationForm(id, data, userId) {
      try {
         validators.id(id, 'Form ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Form Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("bg_image", data.bg_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.b1_color);
         formData.append("t_color", data.b2_color);
         formData.append("button1", data.button1);
         formData.append("button2", data.button2);
         formData.append("button3", data.button3);
         formData.append("button4", data.button4);
         formData.append("button5", data.button5);
         formData.append("button6", data.button6);
         formData.append("user_id", userId);

         const response = await api.put(`/donation_form/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating donation form:', error);
         throw error;
      }
   }

   // Update ticket purchase page
   static async updateTicketPurchasePage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const response = await api.put(`/ticket_purchase_page/update/${id}`, {
            ...data,
            userId: userId
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating ticket purchase page:', error);
         throw error;
      }
   }

   // Update peer fundraising page
   static async updatePeerFundraisingPage(id, data, userId) {
      try {
         validators.id(id, 'Page ID');
         validators.id(userId, 'User ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("banner_image", data.banner_image);
         formData.append("person_image", data.person_image);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("bg_color", data.bg_color);
         formData.append("t_color", data.t_color);
         formData.append("user_id", userId);

         const response = await api.put(`/peer_fundraising_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating peer fundraising page:', error);
         throw error;
      }
   }

   // Update thank you page
   static async updateThankYouPage(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("headline", data.headline);
         formData.append("description", data.description);
         formData.append("bg_image", data.bg_image);
         formData.append("bg_color", data.bg_color);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);

         const response = await api.put(`/thankyouPage/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating thank you page:', error);
         throw error;
      }
   }

   // Update ticket page
   static async updateTicketPage(campaignId, data) {
      try {
         validators.id(campaignId, 'Campaign ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         formData.append("title", data.title);
         formData.append("date", data.date);
         formData.append("address", data.address);
         formData.append("bgImage", data.bgImage);
         formData.append("aboutDescription", data.aboutDescription);
         formData.append("venueName", data.venueName);
         formData.append("instructions", data.instructions);
         formData.append("bg_color", data.bg_color);
         formData.append("bg_color2", data.bg_color2);
         formData.append("p_color", data.p_color);
         formData.append("s_color", data.s_color);
         formData.append("b1_color", data.b1_color);

         const response = await api.put(`/ticket_page/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating ticket page:', error);
         throw error;
      }
   }

   // Update page section
   static async updatePageSection(id, active) {
      try {
         validators.id(id, 'Section ID');

         const response = await api.put(`/sections/update/${id}`, { active: active });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating page section:', error);
         throw error;
      }
   }

   // Update about page
   static async updateAboutPage(id, data) {
      try {
         validators.id(id, 'Page ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         
         // Basic content
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

         const response = await api.put(`/about_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating about page:', error);
         throw error;
      }
   }
}

// User Services
export class UserUpdateService {
   // Update user
   static async updateUser(id, data) {
      try {
         validators.id(id, 'User ID');
         validators.required(data, 'User Data');

         const response = await api.put(`/user/update/${id}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating user:', error);
         throw error;
      }
   }

   // Update user organization relation
   static async updateUserOrganizationRelation(id) {
      try {
         validators.id(id, 'Relation ID');

         const response = await api.put(`/user_organization/update/${id}`);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating user organization relation:', error);
         throw error;
      }
   }
}

// Designation Services
export class DesignationUpdateService {
   // Update designation
   static async updateDesignation(id, data) {
      try {
         validators.id(id, 'Designation ID');
         validators.required(data, 'Designation Data');

         const response = await api.put(`/designation/update/${id}`, data);
         
         return response.success ? response.data : null;
      } catch (error) {
         console.error('Error updating designation:', error);
         throw error;
      }
   }
}

// Legacy function exports for backward compatibility
export const updateOrganization = OrganizationUpdateService.updateOrganization;

export const updateCampaignDetails = CampaignUpdateService.updateCampaignDetails;
export const deactivateCampaign = CampaignUpdateService.deactivateCampaign;

export const updateDonationPage = PageUpdateService.updateDonationPage;
export const updateLandingPage = PageUpdateService.updateLandingPage;
export const updatePeerLandingPage = PageUpdateService.updatePeerLandingPage;
export const updateDonationForm = PageUpdateService.updateDonationForm;
export const updateTicketPurchasePage = PageUpdateService.updateTicketPurchasePage;
export const updatePeerFundraisingPage = PageUpdateService.updatePeerFundraisingPage;
export const updateThankYouPage = PageUpdateService.updateThankYouPage;
export const updateTicketPage = PageUpdateService.updateTicketPage;
export const updatePageSection = PageUpdateService.updatePageSection;
export const updateAboutPage = PageUpdateService.updateAboutPage;

export const updateUser = UserUpdateService.updateUser;
export const updateUserOrganizationRelation = UserUpdateService.updateUserOrganizationRelation;

export const updateDesignation = DesignationUpdateService.updateDesignation;