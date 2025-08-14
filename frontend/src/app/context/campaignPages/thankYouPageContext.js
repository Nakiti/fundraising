import { initialThankyouPageSections } from "@/app/constants/pageSectionsConfig";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";

export const ThankYouPageContext = createContext()

export const ThankYouPageContextProvider = ({campaignId, children}) => {
   const [thankYouPageSections, setThankYouPageSections] = useState(initialThankyouPageSections)
   const [thankYouPageInputs, handleThankYouPageInputsChange, setThankYouPageInputs] = useFormInput({})

   useEffect(() => {
      const fetchData = async() => {
         try {
            const thankYouResponse = await PageService.getThankYouPage(campaignId)
            const thankYouPageId = thankYouResponse.id

            setThankYouPageInputs({
               headline: thankYouResponse.headline || "",
               description: thankYouResponse.description || "",
               bg_image: thankYouResponse.bg_image || "",
               bg_color: thankYouResponse.bg_color || "",
               p_color: thankYouResponse.p_color || "",
               s_color: thankYouResponse.s_color || "",
            })

            const thankYouSections = await PageService.getPageSections(thankYouPageId)
            setThankYouPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = thankYouSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <ThankYouPageContext.Provider value={{campaignId, thankYouPageInputs, 
         handleThankYouPageInputsChange, thankYouPageSections, setThankYouPageSections}}
      >
         {children}
      </ThankYouPageContext.Provider>
   )
}