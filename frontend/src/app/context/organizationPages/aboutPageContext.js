import { createContext, useEffect, useState } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";
import BannerSection from "@/app/org/[organizationId]/page/about/components/sections/bannerSection";
import WhatSection from "@/app/org/[organizationId]/page/about/components/sections/whatSection";
import WhySection from "@/app/org/[organizationId]/page/about/components/sections/whySection";
import TeamSection from "@/app/org/[organizationId]/page/about/components/sections/teamSection";

export const AboutPageContext = createContext()

export const AboutPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "what", displayText: "What We Do", active: false, required: false, dropdown: false, content: <WhatSection />},
      {name: "why", displayText: "Why We Do It", active: false, required: false, dropdown: false, content: <WhySection />},
      {name: "team", displayText: "Our Team", active: false, required: false, dropdown: false, content: <TeamSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getAboutPage(organizationId)
            const aboutPageId = response.id
            
            setInputs({
               // Page ID for updates
               id: aboutPageId,
               
               // Content fields
               title: response.title || "",
               description: response.description || "",
               headline: response.headline || "",
               aboutText: response.aboutText || "",
               whatText: response.whatText || "",
               whyText: response.whyText || "",
               teamText: response.teamText || "",
               missionText: response.missionText || "",
               visionText: response.visionText || "",
               valuesText: response.valuesText || "",
               
               // Images
               bgImage: response.bgImage || "", // Now contains SAS URL
               aboutImage: response.aboutImage || "", // Now contains SAS URL
               teamImage: response.teamImage || "", // Now contains SAS URL
               missionImage: response.missionImage || "", // Now contains SAS URL
               visionImage: response.visionImage || "", // Now contains SAS URL
               valuesImage: response.valuesImage || "", // Now contains SAS URL
               
               // Color customization
               bg_color: response.bg_color || "#FFFFFF",
               p_color: response.p_color || "#000000",
               s_color: response.s_color || "#666666",
               c_color: response.c_color || "#FFFFFF",
               ct_color: response.ct_color || "#000000",
               b_color: response.b_color || "#1F2937",
               bt_color: response.bt_color || "#FFFFFF",
               
               // Font sizes
               heroTitleSize: response.hero_title_size || "36px",
               heroSubtitleSize: response.hero_subtitle_size || "16px",
               sectionTitleSize: response.section_title_size || "28px",
               bodyTextSize: response.body_text_size || "14px",
               buttonTextSize: response.button_text_size || "14px",
               cardTitleSize: response.card_title_size || "18px",
               
               // Layout & spacing
               heroHeight: response.hero_height || "500px",
               sectionPadding: response.section_padding || "80px",
               cardRadius: response.card_radius || "4px",
               buttonRadius: response.button_radius || "4px",
               
               // Visual effects
               overlayOpacity: response.overlay_opacity || "0.3",
               accentColor: response.accent_color || "#1F2937",
               
               // Element visibility toggles
               showVideoButton: response.show_video_button !== false,
               showHeroIcons: response.show_hero_icons !== false,
               showFeatureIcons: response.show_feature_icons !== false,
               showTeamPhotos: response.show_team_photos !== false,
               showMissionSection: response.show_mission_section !== false,
               showVisionSection: response.show_vision_section !== false,
               showValuesSection: response.show_values_section !== false,
               showHoverEffects: response.show_hover_effects !== false,
               
               // Status
               active: response.active || false
            })

            const sectionsResponse = await PageService.getPageSections(aboutPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <AboutPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </AboutPageContext.Provider>
   )
}