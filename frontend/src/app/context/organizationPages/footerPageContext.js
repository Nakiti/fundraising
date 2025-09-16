"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { initialFooterPageSections } from "@/app/constants/pageSectionsConfig";

export const FooterPageContext = createContext()

export const FooterPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs, filesToUpload] = useFormInput({})
   const [isLoading, setIsLoading] = useState(true)

   const [sections, setSections] = useState(initialFooterPageSections)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const response = await pageService.getFooterPage(organizationId)
            // console.log('Footer page response:', response);
            const footerPageId = response.data.id
            setInputs({
               // Basic Content
               title: response.data.title || "",
               subtitle: response.data.subtitle || "",
               description: response.data.description || "",
               
               // Colors
               bgColor: response.data.bgColor || "#ffffff",
               pColor: response.data.pColor || "#1f2937",
               sColor: response.data.sColor || "#6b7280",
               bColor: response.data.bColor || "#3b82f6",
               btColor: response.data.btColor || "#ffffff",
               
               // Typography
               // heroTitleSize: response.heroTitleSize || "36",
               // heroSubtitleSize: response.heroSubtitleSize || "16",
               // sectionTitleSize: response.sectionTitleSize || "28",
               // bodyTextSize: response.bodyTextSize || "16",
               // buttonTextSize: response.buttonTextSize || "16",
               
               // // Layout
               // cardRadius: response.cardRadius || "4",
               // buttonRadius: response.buttonRadius || "4",
               active: response.data.active == 1 ? true : false
            })

            // Fetch page sections for the footer
            const sectionsResponse = await pageService.getPageSectionsByPage(organizationId, 'footer', footerPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.data.find((item) => item.name === section.name)
                  return match ? { ...section, pageSectionId: match.id, active: match.active } : section
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
