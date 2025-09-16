"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { initialLandingPageSections } from "@/app/constants/pageSectionsConfig";
import { getPageService } from "@/app/services";
import { useSections } from "@/app/hooks/useSections";
import useFormInput from "@/app/hooks/useFormInput";
import { useTheme } from "@/app/hooks/useTheme";

export const LandingPageContext = createContext()

export const LandingPageContextProvider = ({organizationId, children}) => {
   // const {currentUser} = useContext(AuthContext)
   // const organizationId = currentUser.organization_id
 
   const [inputs, handleInputsChange, setInputs, filesToUpload] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)
   const [landingPageId, setLandingPageId] = useState(null)
   
   // Get organization theme
   const { theme: organizationTheme, getColor } = useTheme(organizationId, {
      autoApply: false, // Don't auto-apply to document, we'll use it in context
      fallbackOnError: true
   })

   const {
      sections,
      setSections,
      saveActives: saveSectionsActives,
      saveOrder: saveSectionsOrder,
   } = useSections({
      organizationId,
      pageType: 'landing',
      pageReferenceId: landingPageId,
      registrySections: initialLandingPageSections
   })

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const response = await pageService.getLandingPage(organizationId)
            console.log('Landing page response:', response);
            const landingPageId = response.data.id
            setInputs({
             // Page ID
             id: landingPageId,
             // Content fields
             title: response.data.title || "",
             description: response.data.description || "",
             bg_image: response.data.bgImageUrl || "", // Now contains SAS URL
             mainHeadline: response.data.mainHeadline || "",
             mainText: response.data.mainText || "",
             aboutText: response.data.aboutText || "",
             about_image: response.data.aboutImageUrl || "", // Now contains SAS URL
             impactText: response.data.impactText || "",
             text_image: response.data.textImageUrl || "", // Now contains SAS URL
             headlineOne: response.data.headlineOne || "",
             descriptionOne: response.descriptionOne || "",
             image_one: response.data.imageOneUrl || "", // Now contains SAS URL
             headlineTwo: response.data.headlineTwo || "",
             descriptionTwo: response.data.descriptionTwo || "",
             image_two: response.data.imageTwoUrl || "", // Now contains SAS URL
             headlineThree: response.data.headlineThree || "",
             descriptionThree: response.data.descriptionThree || "",
             image_three: response.data.imageThreeUrl || "", // Now contains SAS URL
             
            // Color customization - use merged theme with page-specific overrides
            bgColor: response.data.bgColor || getColor('background_color', '#FFFFFF'),
            pColor: response.data.pColor || getColor('text_primary_color', '#000000'),
            sColor: response.data.sColor || getColor('text_secondary_color', '#666666'),
            cColor: response.data.cColor || getColor('surface_color', '#FFFFFF'),
            ctColor: response.data.ctColor || getColor('text_primary_color', '#000000'),
            bColor: response.data.bColor || getColor('button_background_color', '#1F2937'),
            btColor: response.data.btColor || getColor('button_text_color', '#FFFFFF'),
             
             // Font sizes
            //  heroTitleSize: response.hero_title_size || "36px",
            //  heroSubtitleSize: response.hero_subtitle_size || "16px",
            //  sectionTitleSize: response.section_title_size || "28px",
            //  bodyTextSize: response.body_text_size || "14px",
            //  buttonTextSize: response.button_text_size || "14px",
            //  cardTitleSize: response.card_title_size || "18px",
             
            //  // Layout & spacing
            //  heroHeight: response.hero_height || "500px",
            //  sectionPadding: response.section_padding || "80px",
            //  cardRadius: response.card_radius || "4px",
            //  buttonRadius: response.button_radius || "4px",
             
            //  // Visual effects
            //  overlayOpacity: response.overlay_opacity || "0.3",
            //  accentColor: response.accent_color || "#1F2937",
             
            //  // Element visibility toggles
            //  showVideoButton: response.show_video_button !== false,
            //  showHeroIcons: response.show_hero_icons !== false,
            //  showFeatureIcons: response.show_feature_icons !== false,
            //  showCampaignBadges: response.show_campaign_badges !== false,
            //  showTrustBadge: response.show_trust_badge !== false,
            //  showProgressIndicators: response.show_progress_indicators !== false,
            //  showStatistics: response.show_statistics !== false,
            //  showHoverEffects: response.show_hover_effects !== false,
             
             // Status
             active: response.data.active,
             
             // Store merged theme for reference
             mergedTheme: response.data.theme || organizationTheme
            })

            setLandingPageId(landingPageId)
         } catch (error) {
            console.error("Error fetching landing page data:", error)
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()
   }, [])

   return (
      <LandingPageContext.Provider value={{
         inputs, 
         handleInputsChange, 
         setInputs, 
         sections, 
         setSections, 
         isLoading, 
         filesToUpload, 
         saveSectionsActives, 
         saveSectionsOrder,
         organizationTheme,
         getColor
      }}>
         {children}
      </LandingPageContext.Provider>
   )
}