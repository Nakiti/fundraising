"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import { initialThankyouPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";

export const ThankYouPageContext = createContext()

export const ThankYouPageContextProvider = ({campaignId, children, organizationId}) => {
   const [thankYouPageSections, setThankYouPageSections] = useState(initialThankyouPageSections)
   const [thankPageInputs, handleThankInputsChange, setThankPageInputs] = useFormInput({})

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const thankYouResponse = await pageService.getThankYouPage(campaignId)
            const thankYouPageId = thankYouResponse.data.id

            setThankPageInputs({
               // Basic Content
               headline: thankYouResponse.data.headline || "",
               description: thankYouResponse.data.description || "",
               
               // Images
               bg_image: thankYouResponse.data.bg_image || "",
               
               // Colors
               bg_color: thankYouResponse.data.bg_color || "#ffffff",
               p_color: thankYouResponse.data.p_color || "#1f2937",
               s_color: thankYouResponse.data.s_color || "#6b7280",
               
               // Typography
               heroTitleSize: thankYouResponse.data.heroTitleSize || "36",
               bodyTextSize: thankYouResponse.data.bodyTextSize || "16",
               buttonTextSize: thankYouResponse.data.buttonTextSize || "14",
               
               // Layout
               cardRadius: thankYouResponse.data.cardRadius || "4",
               buttonRadius: thankYouResponse.data.buttonRadius || "4",
            })

            console.log("organizationId", organizationId)
            const thankYouSections = await pageService.getPageSectionsByPage(organizationId, 'thankyou-page', thankYouPageId)
            setThankYouPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = thankYouSections.data.find((item) => item.name == section.name)
                  return match ? {...section, id: match.id, active: match.active } : section
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

      return (
      <ThankYouPageContext.Provider value={{campaignId, thankPageInputs, 
        handleThankInputsChange, setThankPageInputs, thankYouPageSections, setThankYouPageSections}}
      >
         {children}
      </ThankYouPageContext.Provider>
   )
}