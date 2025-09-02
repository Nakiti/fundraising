"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import SocialSection from "@/app/org/[organizationId]/page/footer/components/sections/socialSection";
import useFormInput from "@/app/hooks/useFormInput";
import ContactSection from "@/app/org/[organizationId]/page/footer/components/sections/contactSection";

export const FooterPageContext = createContext()

export const FooterPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)

   const [sections, setSections] = useState([
      {name: "contact", displayText: "Footer Contact", active: true, required: true, dropdown: false, content: <ContactSection />},
      {name: "social", displayText: "Social Media", active: true, required: false, dropdown: false, content: <SocialSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const response = await pageService.getFooterPage(organizationId)
            console.log('Footer page response:', response);
            const footerPageId = response.data.id
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

            // Fetch page sections for the footer
            const sectionsResponse = await pageService.getPageSectionsByPage(organizationId, 'footer', footerPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.data.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (error) {
            console.error("Error fetching footer page data:", error)
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()
   }, [])

   return (
      <FooterPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections, isLoading}}>
         {children}
      </FooterPageContext.Provider>
   )
}
