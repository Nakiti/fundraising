"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import BannerSection from "@/app/org/[organizationId]/page/about/components/sections/bannerSection";
import StorySection from "@/app/org/[organizationId]/page/about/components/sections/storySection";
import WhatSection from "@/app/org/[organizationId]/page/about/components/sections/whatSection";
import WhySection from "@/app/org/[organizationId]/page/about/components/sections/whySection";
import TeamSection from "@/app/org/[organizationId]/page/about/components/sections/teamSection";

export const AboutPageContext = createContext()

export const AboutPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "story", displayText: "Our Story", active: true, required: false, dropdown: false, content: <StorySection />},
      {name: "what", displayText: "What We Do", active: false, required: false, dropdown: false, content: <WhatSection />},
      {name: "why", displayText: "Why We Do It", active: false, required: false, dropdown: false, content: <WhySection />},
      {name: "team", displayText: "Our Team", active: false, required: false, dropdown: false, content: <TeamSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         if (!organizationId) return;
         
         try {
            const pageService = getPageService();
            const response = await pageService.getAboutPage(organizationId)
            console.log('About page response:', response);
            const aboutPageId = response.data.id
            
            setInputs({
               // Basic Content
               title: response.title || "",
               subtitle: response.subtitle || "",
               description: response.description || "",
               
               // Colors
               bg_color: response.bg_color || "#ffffff",
               p_color: response.p_color || "#1f2937",
               s_color: response.s_color || "#6b7280",
               b_color: response.b_color || "#3b82f6",
               bt_color: response.bt_color || "#ffffff",
               
               // Typography
               heroTitleSize: response.heroTitleSize || "36",
               heroSubtitleSize: response.heroSubtitleSize || "16",
               sectionTitleSize: response.sectionTitleSize || "28",
               bodyTextSize: response.bodyTextSize || "16",
               buttonTextSize: response.buttonTextSize || "16",
               
               // Layout
               cardRadius: response.cardRadius || "4",
               buttonRadius: response.buttonRadius || "4",
            })

            // Fetch page sections for the about page
            const sectionsResponse = await pageService.getPageSectionsByPage(organizationId, 'about', aboutPageId)
            console.log('Sections response:', sectionsResponse)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.data.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (err) {
            console.log('Error fetching about page data:', err)
            // Set default values if about page doesn't exist
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
               bg_color: "#FFFFFF",
               p_color: "#000000",
               s_color: "#666666",
               hero_subtitle_color: "#ffffff",
               c_color: "#FFFFFF",
               ct_color: "#000000",
               b_color: "#1F2937",
               bt_color: "#FFFFFF",
               banner_title_text: "#ffffff",
               banner_subtitle_text: "#ffffff",
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
               accentColor: "#1F2937",
               showVideoButton: true,
               showHeroIcons: true,
               showFeatureIcons: true,
               showTeamPhotos: true,
               showMissionSection: true,
               showVisionSection: true,
               showValuesSection: true,
               showHoverEffects: true,
               active: false
            })
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()
   }, [organizationId])

   return (
      <AboutPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections, isLoading}}>
         {children}
      </AboutPageContext.Provider>
   )
}