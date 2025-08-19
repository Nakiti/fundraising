import { initialThankyouPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";

export const ThankYouPageContext = createContext()

export const ThankYouPageContextProvider = ({campaignId, children}) => {
   const [thankYouPageSections, setThankYouPageSections] = useState(initialThankyouPageSections)
   const [thankPageInputs, handleThankInputsChange, setThankPageInputs] = useFormInput({})

   useEffect(() => {
      const fetchData = async() => {
         try {
            const thankYouResponse = await PageService.getThankYouPage(campaignId)
            console.log("thanky response ", thankYouResponse)
            const thankYouPageId = thankYouResponse.id

            setThankPageInputs({
               // Basic Content
               headline: thankYouResponse.headline || "",
               description: thankYouResponse.description || "",
               
               // Images
               bg_image: thankYouResponse.bg_image || "",
               
               // Colors
               bg_color: thankYouResponse.bg_color || "#ffffff",
               p_color: thankYouResponse.p_color || "#1f2937",
               s_color: thankYouResponse.s_color || "#6b7280",
               
               // Typography
               heroTitleSize: thankYouResponse.heroTitleSize || "36",
               bodyTextSize: thankYouResponse.bodyTextSize || "16",
               buttonTextSize: thankYouResponse.buttonTextSize || "14",
               
               // Layout
               cardRadius: thankYouResponse.cardRadius || "4",
               buttonRadius: thankYouResponse.buttonRadius || "4",
            })

            const thankYouSections = await PageService.getPageSections(thankYouPageId)
            setThankYouPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = thankYouSections.find((item) => item.name == section.name)
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
         handleThankInputsChange, thankYouPageSections, setThankYouPageSections}}
      >
         {children}
      </ThankYouPageContext.Provider>
   )
}