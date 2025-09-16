"use client";
import { getPageService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import { initialThankyouPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";

export const ThankYouPageContext = createContext()

export const ThankYouPageContextProvider = ({campaignId, children, organizationId}) => {
   const [thankYouPageSections, setThankYouPageSections] = useState(initialThankyouPageSections)
   const [thankPageInputs, handleThankInputsChange, setThankPageInputs, filesToUpload] = useFormInput({})
   const [thankYouPageId, setThankYouPageId] = useState(null)  

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const thankYouResponse = await pageService.getThankYouPage(campaignId)
            const thankYouPageId = thankYouResponse.data.id
            setThankYouPageId(thankYouPageId)
            setThankPageInputs({

               // Basic Content
               headline: thankYouResponse.data.headline || "",
               description: thankYouResponse.data.description || "",
               
               // Images
               bg_image: thankYouResponse.data.bgImageUrl || "",
               
               // Colors
               bg_color: thankYouResponse.data.bgColor || "#ffffff",
               p_color: thankYouResponse.data.pColor || "#1f2937",
               s_color: thankYouResponse.data.sColor || "#6b7280",
               
               // Typography
               // heroTitleSize: thankYouResponse.data.heroTitleSize || "36",
               // bodyTextSize: thankYouResponse.data.bodyTextSize || "16",
               // buttonTextSize: thankYouResponse.data.buttonTextSize || "14",
               
               // Layout
               // cardRadius: thankYouResponse.data.cardRadius || "4",
               // buttonRadius: thankYouResponse.data.buttonRadius || "4",
            })

            const thankYouSections = await pageService.getPageSectionsByPage(organizationId, 'thankyou_page', thankYouPageId)
            console.log("thankYouSections", thankYouSections)
            setThankYouPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = thankYouSections.data.find((item) => item.name == section.name)
                  return match ? {...section, pageSectionId: match.id, active: match.active } : section
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
        handleThankInputsChange, setThankPageInputs, thankYouPageSections, setThankYouPageSections, organizationId, thankYouPageId, filesToUpload}}
      >
         {children}
      </ThankYouPageContext.Provider>
   )
}