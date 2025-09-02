"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import LogoSection from "@/app/org/[organizationId]/page/header/components/sections/logoSection";
import useFormInput from "@/app/hooks/useFormInput";

export const HeaderPageContext = createContext()

export const HeaderPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)

   const [sections, setSections] = useState([
      {name: "logo", displayText: "Logo & Branding", active: true, required: true, dropdown: false, content: <LogoSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const response = await pageService.getHeaderPage(organizationId)
            console.log('Header page response:', response);
            const headerPageId = response.data.id
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

            // Fetch page sections for the header
            const sectionsResponse = await pageService.getPageSectionsByPage(organizationId, 'header', headerPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.data.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (error) {
            console.error("Error fetching header page data:", error)
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()
   }, [])

   return (
      <HeaderPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections, isLoading}}>
         {children}
      </HeaderPageContext.Provider>
   )
}
