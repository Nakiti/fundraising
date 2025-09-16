"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { useTheme } from "@/app/hooks/useTheme";
import { initialAboutPageSections } from "@/app/constants/pageSectionsConfig";

export const AboutPageContext = createContext()

export const AboutPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs, filesToUpload] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)
   const [sections, setSections] = useState(initialAboutPageSections)
   
   // Get organization theme
   const { theme: organizationTheme, getColor } = useTheme(organizationId, {
      autoApply: false, // Don't auto-apply to document, we'll use it in context
      fallbackOnError: true
   })

   useEffect(() => {
      const fetchData = async() => {
         if (!organizationId) return;
         
         try {
            const pageService = getPageService();
            const response = await pageService.getAboutPage(organizationId)
            // console.log('About page response:', response);
            const aboutPageId = response.data.id
            
            // Get merged theme colors (organization theme + page overrides)
            const mergedTheme = response.data.theme || organizationTheme;
            
            setInputs({
               // Basic Content
               title: response.data.title || "",
               subtitle: response.data.subtitle || "",
               description: response.data.description || "",
               
               // Colors - use merged theme with page-specific overrides
               bgColor: response.data.bgColor || getColor('background_color', '#ffffff'),
               pColor: response.data.pColor || getColor('text_primary_color', '#1f2937'),
               sColor: response.data.sColor || getColor('text_secondary_color', '#6b7280'),
               bColor: response.data.bColor || getColor('button_background_color', '#3b82f6'),
               btColor: response.data.btColor || getColor('button_text_color', '#ffffff'),
               
               // Typography
               // heroTitleSize: response.heroTitleSize || "36",
               // heroSubtitleSize: response.heroSubtitleSize || "16",
               // sectionTitleSize: response.sectionTitleSize || "28",
               // bodyTextSize: response.bodyTextSize || "16",
               // buttonTextSize: response.buttonTextSize || "16",
               
               // // Layout
               // cardRadius: response.cardRadius || "4",
               // buttonRadius: response.buttonRadius || "4",
               active: response.data.active == 1 ? true : false,
               
               // Store merged theme for reference
               mergedTheme: mergedTheme
            })

            // Fetch page sections for the about page
            const sectionsResponse = await pageService.getPageSectionsByPage(organizationId, 'about', aboutPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.data.find((item) => item.name === section.name)
                  return match ? { ...section, pageSectionId: match.id, active: (typeof match.active === 'number' ? match.active === 1 : !!match.active) } : section
               })
            })
         } catch (err) {
            console.log('Error fetching about page data:', err)
            // Set default values if about page doesn't exist, using organization theme
            setInputs({
               organizationId: organizationId,
               id: null,
               title: "",
               description: "",
               headline: "About Our Organization",
               heroSubtitle: "We are dedicated to making a positive impact in our community through innovative solutions and unwavering commitment to our mission.",
               storyTitle: "Our Story",
               storyText: "",
               aboutText: "",
               whatText: "",
               whyText: "",
               teamText: "",
               missionText: "",
               visionText: "",
               valuesText: "",
               bgImage: "",
               storyImage: "",
               aboutImage: "",
               teamImage: "",
               missionImage: "",
               visionImage: "",
               valuesImage: "",
               // Use organization theme colors as defaults
               bg_color: getColor('background_color', '#FFFFFF'),
               p_color: getColor('text_primary_color', '#000000'),
               s_color: getColor('text_secondary_color', '#666666'),
               hero_subtitle_color: getColor('text_primary_color', '#ffffff'),
               c_color: getColor('surface_color', '#FFFFFF'),
               ct_color: getColor('text_primary_color', '#000000'),
               b_color: getColor('button_background_color', '#1F2937'),
               bt_color: getColor('button_text_color', '#FFFFFF'),
               banner_title_text: getColor('text_primary_color', '#ffffff'),
               banner_subtitle_text: getColor('text_secondary_color', '#ffffff'),
               heroTitleSize: "36px",
               heroSubtitleSize: "16px",
               sectionTitleSize: "28px",
               bodyTextSize: "14px",
               buttonTextSize: "14px",
               cardTitleSize: "18px",
               heroHeight: "500px",
               sectionPadding: "80px",
               cardRadius: "4px",
               buttonRadius: "4px",
               overlayOpacity: "0.3",
               accentColor: getColor('accent_color', '#1F2937'),
               showVideoButton: true,
               showHeroIcons: true,
               showFeatureIcons: true,
               showTeamPhotos: true,
               showMissionSection: true,
               showVisionSection: true,
               showValuesSection: true,
               showHoverEffects: true,
               active: false,
               // Store organization theme for reference
               mergedTheme: organizationTheme
            })
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()
   }, [organizationId])

   return (
      <AboutPageContext.Provider value={{
         inputs, 
         handleInputsChange, 
         setInputs, 
         sections, 
         setSections, 
         isLoading,
         organizationTheme,
         getColor
      }}>
         {children}
      </AboutPageContext.Provider>
   )
}