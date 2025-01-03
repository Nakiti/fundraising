import { createContext, useState, useEffect } from "react";
import useFormInput from "../../hooks/useFormInput";
import { initialThankyouPageSections } from "../../constants/pageSectionsConfig";
import { getThankYouPage, getPageSections } from "@/app/services/fetchService";
export const ThankYouPageContext = createContext()

export const ThankYouPageContextProvider = ({campaignId, campaignType, children}) => {
   const [thankPageInputs, handleThankPageInputsChange, setThankPageInputs] = useFormInput({})
   const [thankyouPageSections, setThankyouPageSections] = useState(initialThankyouPageSections)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const thankyouPageResponse = await getThankYouPage(campaignId)
            const thankyouPageId = thankyouPageResponse.id
            setThankPageInputs({
               headline: thankyouPageResponse.headline || "",
               description: thankyouPageResponse.description || "",
               bg_image: thankyouPageResponse.bg_image || "",
               bg_color: thankyouPageResponse.bg_color || "",
               p_color: thankyouPageResponse.p_color || "",
               s_color: thankyouPageResponse.s_color || ""
            })
            const thankSections = await getPageSections(thankyouPageId)
            setThankyouPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = thankSections.find((item) => item.name == section.name)
                  return { ...section, id: match.id, active: match.active }
               })
            }) 
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <ThankYouPageContext.Provider value={{campaignId, thankPageInputs, thankyouPageSections, handleThankPageInputsChange, setThankyouPageSections}}>
         {children}
      </ThankYouPageContext.Provider>
   )
}