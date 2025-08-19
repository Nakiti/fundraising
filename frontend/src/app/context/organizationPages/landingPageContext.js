import { createContext, useContext, useEffect, useState } from "react";
import BannerSection from "@/app/org/[organizationId]/page/landing/components/sections/bannerSection";
import AboutSection from "@/app/org/[organizationId]/page/landing/components/sections/aboutSection";
import ImpactSection from "@/app/org/[organizationId]/page/landing/components/sections/impactSection";
import LargeTextSection from "@/app/org/[organizationId]/page/landing/components/sections/largeTextSection";
import TripleSection from "@/app/org/[organizationId]/page/landing/components/sections/tripleSection";
import { PageService } from "@/app/services/fetchService";
import useFormInput from "@/app/hooks/useFormInput";

export const LandingPageContext = createContext()

export const LandingPageContextProvider = ({organizationId, children}) => {
   // const {currentUser} = useContext(AuthContext)
   // const organizationId = currentUser.organization_id
 
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "main", displayText: "Main Section", active: false, required: false, dropdown: false, content: <LargeTextSection />},
      {name: "about", displayText: "About Section", active: false, required: false, dropdown: false, content: <AboutSection />},
      {name: "impact", displayText: "Impact Section", active: false, required: false, dropdown: false, content: <ImpactSection />},
      {name: "featured", displayText: "Featured Campaign", active: false, required: false, dropdown: false, content: <ImpactSection />},
      {name: "triple", displayText: "Triple Section", active: false, required: false, dropdown: false, content: <TripleSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {

         const response = await PageService.getLandingPage(organizationId)
         const landingPageId = response.id
         setInputs({
            // Content fields
            title: response.title || "",
            description: response.description || "",
            bgImage: response.bgImage || "", // Now contains SAS URL
            mainHeadline: response.mainHeadline || "",
            mainText: response.mainText || "",
            aboutText: response.aboutText || "",
            aboutImage: response.aboutImage || "", // Now contains SAS URL
            impactText: response.impactText || "",
            textImage: response.textImage || "", // Now contains SAS URL
            headlineOne: response.headlineOne || "",
            descriptionOne: response.descriptionOne || "",
            imageOne: response.imageOne || "", // Now contains SAS URL
            headlineTwo: response.headlineTwo || "",
            descriptionTwo: response.descriptionTwo || "",
            imageTwo: response.imageTwo || "", // Now contains SAS URL
            headlineThree: response.headlineThree || "",
            descriptionThree: response.descriptionThree || "",
            imageThree: response.imageThree || "", // Now contains SAS URL
            
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
            showCampaignBadges: response.show_campaign_badges !== false,
            showTrustBadge: response.show_trust_badge !== false,
            showProgressIndicators: response.show_progress_indicators !== false,
            showStatistics: response.show_statistics !== false,
            showHoverEffects: response.show_hover_effects !== false,
            
            // Status
            active: response.active || false
         })

         const sectionsResponse = await PageService.getPageSections(landingPageId)
         setSections((prevSections) => {
            return prevSections.map(section => {
               const match = sectionsResponse.find((item) => item.name == section.name)
               return match ? { ...section, id: match.id, active: match.active } : {...section}
            })
         })
      }

      fetchData()
   }, [])

   return (
      <LandingPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </LandingPageContext.Provider>
   )
}