import { api, validators, errorHandler } from './apiClient.js';

// Organization Services
export class OrganizationUpdateService {
   // Update organization
   static async updateOrganization(organizationId, data) {
      try {
         validators.id(organizationId, 'Organization ID');
         validators.required(data, 'Organization Data');

         const response = await api.put(`/organization/update/${organizationId}`, data);
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         formData.append("about", data.aboutText || "");
         
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
         
         // Status
         formData.append("active", data.active || false);

         const response = await api.put(`/landing_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
      } catch (error) {
         console.error('Error updating landing page:', error);
         throw error;
      }
   }

   // Update header page
   static async updateHeaderPage(id, data) {
      try {
         validators.id(id, 'Page ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         
         // Content fields
         if (data.logo instanceof File) {
            formData.append("logo", data.logo);
         } else if (data.logo) {
            formData.append("logo", data.logo);
         }
         formData.append("organizationName", data.organizationName || "");
         formData.append("tagline", data.tagline || "");
         formData.append("showTagline", data.showTagline !== false);
         
         // Navigation
         formData.append("showNavigation", data.showNavigation !== false);
         formData.append("navigationItems", data.navigationItems ? JSON.stringify(data.navigationItems) : "[]");
         formData.append("showSearch", data.showSearch !== false);
         formData.append("showLoginButton", data.showLoginButton !== false);
         formData.append("showDonateButton", data.showDonateButton !== false);
         
         // Styling
         formData.append("bgColor", data.bgColor || "#FFFFFF");
         formData.append("textColor", data.textColor || "#000000");
         formData.append("accentColor", data.accentColor || "#3B82F6");
         formData.append("headerHeight", data.headerHeight || "80px");
         formData.append("logoSize", data.logoSize || "40px");
         formData.append("fontSize", data.fontSize || "16px");
         formData.append("fontWeight", data.fontWeight || "500");
         formData.append("borderBottom", data.borderBottom !== false);
         formData.append("borderColor", data.borderColor || "#E5E7EB");
         formData.append("shadow", data.shadow !== false);
         
         // Layout
         formData.append("logoPosition", data.logoPosition || "left");
         formData.append("navigationPosition", data.navigationPosition || "center");
         formData.append("buttonPosition", data.buttonPosition || "right");
         
         // Status
         formData.append("active", data.active || false);

         const response = await api.put(`/header_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
      } catch (error) {
         console.error('Error updating header page:', error);
         throw error;
      }
   }

   // Update footer page
   static async updateFooterPage(id, data) {
      try {
         validators.id(id, 'Page ID');
         validators.required(data, 'Page Data');

         const formData = new FormData();
         
         // Content fields
         if (data.logo instanceof File) {
            formData.append("logo", data.logo);
         } else if (data.logo) {
            formData.append("logo", data.logo);
         }
         formData.append("organizationName", data.organizationName || "");
         formData.append("tagline", data.tagline || "");
         formData.append("showTagline", data.showTagline !== false);
         formData.append("description", data.description || "");
         formData.append("showDescription", data.showDescription !== false);
         formData.append("contactInfo", data.contactInfo || "");
         formData.append("showContactInfo", data.showContactInfo !== false);
         formData.append("links", data.links || "");
         formData.append("showLinks", data.showLinks !== false);
         formData.append("socialLinks", data.socialLinks || "");
         formData.append("showSocialLinks", data.showSocialLinks !== false);
         
         // Styling
         formData.append("bgColor", data.bgColor || "#1F2937");
         formData.append("textColor", data.textColor || "#FFFFFF");
         formData.append("linkColor", data.linkColor || "#60A5FA");
         formData.append("footerHeight", data.footerHeight || "auto");
         formData.append("fontSize", data.fontSize || "14px");
         formData.append("borderTop", data.borderTop !== false);
         formData.append("borderColor", data.borderColor || "#374151");
         formData.append("shadow", data.shadow !== false);
         
         // Layout
         formData.append("footerLayout", data.footerLayout || "three-column");
         formData.append("contentAlignment", data.contentAlignment || "left");
         formData.append("socialPosition", data.socialPosition || "bottom");
         
         // Social Media
         formData.append("socialIconSize", data.socialIconSize || "medium");
         formData.append("socialIconColor", data.socialIconColor || "#FFFFFF");
         formData.append("socialLayout", data.socialLayout || "horizontal");
         formData.append("socialSpacing", data.socialSpacing || "normal");
         
         // Status
         formData.append("active", data.active || false);

         const response = await api.put(`/footer_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
      } catch (error) {
         console.error('Error updating footer page:', error);
         throw error;
      }
   }
}

// Header Page Services
export class HeaderPageUpdateService {
   // Save header page (draft)
   static async saveHeaderPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Update header page content and styling (no validation for save)
         await PageUpdateService.updateHeaderPage(pageId, inputs);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Header page saved successfully!" };
      } catch (error) {
         console.error('Error saving header page:', error);
         throw error;
      }
   }

   // Publish header page
   static async publishHeaderPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Validate required fields for publishing
         const requiredFields = {
            logo: inputs.logo,
            organizationName: inputs.organizationName
         };

         const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key);

         if (missingFields.length > 0) {
            throw new Error(`Please fill in the following required fields to publish: ${missingFields.join(", ")}`);
         }

         // Update header page content and styling with active status
         const publishData = { ...inputs, active: true };
         await PageUpdateService.updateHeaderPage(pageId, publishData);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Header page published successfully!" };
      } catch (error) {
         console.error('Error publishing header page:', error);
         throw error;
      }
   }

   // Deactivate header page
   static async deactivateHeaderPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Update header page content and styling with inactive status
         const deactivateData = { ...inputs, active: false };
         await PageUpdateService.updateHeaderPage(pageId, deactivateData);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Header page deactivated successfully!" };
      } catch (error) {
         console.error('Error deactivating header page:', error);
         throw error;
      }
   }
}

// Footer Page Services
export class FooterPageUpdateService {
   // Save footer page (draft)
   static async saveFooterPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Update footer page content and styling (no validation for save)
         await PageUpdateService.updateFooterPage(pageId, inputs);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Footer page saved successfully!" };
      } catch (error) {
         console.error('Error saving footer page:', error);
         throw error;
      }
   }

   // Publish footer page
   static async publishFooterPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Validate required fields for publishing
         const requiredFields = {
            organizationName: inputs.organizationName
         };

         const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key);

         if (missingFields.length > 0) {
            throw new Error(`Please fill in the following required fields to publish: ${missingFields.join(", ")}`);
         }

         // Update footer page content and styling with active status
         const publishData = { ...inputs, active: true };
         await PageUpdateService.updateFooterPage(pageId, publishData);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Footer page published successfully!" };
      } catch (error) {
         console.error('Error publishing footer page:', error);
         throw error;
      }
   }

   // Deactivate footer page
   static async deactivateFooterPage(pageId, inputs, sections) {
      try {
         validators.id(pageId, 'Page ID');
         validators.required(inputs, 'Page Inputs');
         validators.required(sections, 'Page Sections');

         // Update footer page content and styling with inactive status
         const deactivateData = { ...inputs, active: false };
         await PageUpdateService.updateFooterPage(pageId, deactivateData);
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await PageUpdateService.updatePageSection(section.id, section.active);
            }
         }

         return { success: true, message: "Footer page deactivated successfully!" };
      } catch (error) {
         console.error('Error deactivating footer page:', error);
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         formData.append("bg_color", data.bg_color);
         formData.append("t_color", data.t_color);
         formData.append("b1_color", data.b1_color);
         formData.append("button1", data.button1);
         formData.append("button2", data.button2);
         formData.append("button3", data.button3);
         formData.append("button4", data.button4);
         formData.append("button5", data.button5);
         formData.append("button6", data.button6);
         formData.append("heroTitleSize", data.heroTitleSize);
         formData.append("sectionTitleSize", data.sectionTitleSize);
         formData.append("bodyTextSize", data.bodyTextSize);
         formData.append("buttonTextSize", data.buttonTextSize);
         formData.append("cardRadius", data.cardRadius);
         formData.append("buttonRadius", data.buttonRadius);
         formData.append("user_id", userId);

         const response = await api.put(`/donation_form/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         formData.append("heroTitleSize", data.heroTitleSize);
         formData.append("bodyTextSize", data.bodyTextSize);
         formData.append("buttonTextSize", data.buttonTextSize);
         formData.append("cardRadius", data.cardRadius);
         formData.append("buttonRadius", data.buttonRadius);

         const response = await api.put(`/thankyouPage/update/${campaignId}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         // Status
         formData.append("active", data.active || false);

         const response = await api.put(`/about_page/update/${id}`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         });
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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
         
         return response.success ? (response.data?.success ? null : response.data) : null;
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