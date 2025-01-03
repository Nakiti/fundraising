import { initialDonationFormSections } from "@/app/constants/pageSectionsConfig";
import { getCustomQuestions, getDonationForm, getPageSections } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";

export const DonationFormContext = createContext()

export const DonationFormContextProvider = ({campaignId, children}) => {
   const [donationFormInputs, handleDonationFormInputsChange, setDonationFormInputs] = useFormInput({})
   const [donationFormSections, setDonationFormSections] = useState(initialDonationFormSections)
   const [customQuestions, setCustomQuestions] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const donationResponse = await getDonationForm(campaignId)
            const donationPageId = donationResponse.id
            setDonationFormInputs({ //can also redo this to have default values in SQL DB
               bg_image: donationResponse.bg_image || "",
               headline: donationResponse.headline || "",
               description: donationResponse.description || "",
               bg_color: donationResponse.bg_color || "",
               p_color: donationResponse.p_color || "",
               s_color: donationResponse.s_color || "",
               t_color: donationResponse.t_color || "",
               button1: donationResponse.button1 || 0,
               button2: donationResponse.button2 || 0,
               button3: donationResponse.button3 || 0,
               button4: donationResponse.button4 || 0,
               button5: donationResponse.button5 || 0,
               button6: donationResponse.button6 || 0,
            })

            const customQuestionsResponse = await getCustomQuestions(campaignId)
            setCustomQuestions(customQuestionsResponse)

            // const donationSections = await getPageSections(donationPageId)
            // setDonationFormSections((prevSections) => {
            //    return prevSections.map(section => {
            //       const match = donationSections.find((item) => item.name == section.name)
            //       return {...section, id: match.id, active: match.active }
            //    })
            // })

            // const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
            // setSelectedDesignations(selectedDesignationsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <DonationFormContext.Provider value={{campaignId, donationFormInputs, handleDonationFormInputsChange,
         donationFormSections, setDonationFormSections, customQuestions 
         }}
      >
         {children}
      </DonationFormContext.Provider>
   )
}