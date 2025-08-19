import { initialDonationFormSections } from "@/app/constants/pageSectionsConfig";
import { ContentService, PageService, DesignationService } from "@/app/services/fetchService";
import { createContext, useState, useEffect } from "react";
import useFormInput from "@/app/hooks/useFormInput";

export const DonationFormContext = createContext()

export const DonationFormContextProvider = ({campaignId, children}) => {
   const [donationFormInputs, handleDonationFormInputsChange, setDonationFormInputs] = useFormInput({})
   const [donationFormSections, setDonationFormSections] = useState(initialDonationFormSections)
   const [customQuestions, setCustomQuestions] = useState(null)
   const [donationFormId, setDonationFormId] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const donationResponse = await PageService.getDonationForm(campaignId)
            const donationPageId = donationResponse.id
            setDonationFormId(donationPageId)
            setDonationFormInputs({ //can also redo this to have default values in SQL DB
               // Basic Content
               bg_image: donationResponse.bg_image || "",
               headline: donationResponse.headline || "",
               description: donationResponse.description || "",
               
               // Colors
               bg_color: donationResponse.bg_color || "#ffffff",
               p_color: donationResponse.p_color || "#1f2937",
               s_color: donationResponse.s_color || "#6b7280",
               t_color: donationResponse.t_color || "#3b82f6",
               b1_color: donationResponse.b1_color || "#3b82f6",
               
               // Donation Amounts
               button1: donationResponse.button1 || 25,
               button2: donationResponse.button2 || 50,
               button3: donationResponse.button3 || 100,
               button4: donationResponse.button4 || 250,
               button5: donationResponse.button5 || 500,
               button6: donationResponse.button6 || 1000,
               
               // Typography
               heroTitleSize: donationResponse.heroTitleSize || "36",
               sectionTitleSize: donationResponse.sectionTitleSize || "20",
               bodyTextSize: donationResponse.bodyTextSize || "16",
               buttonTextSize: donationResponse.buttonTextSize || "16",
               
               // Layout
               cardRadius: donationResponse.cardRadius || "4",
               buttonRadius: donationResponse.buttonRadius || "4",
            })

            const customQuestionsResponse = await ContentService.getCustomQuestions(campaignId)
            setCustomQuestions(customQuestionsResponse)

            const donationSections = await PageService.getPageSections(donationPageId)
            setDonationFormSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.find((item) => item.name == section.name)
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
      <DonationFormContext.Provider value={{campaignId, donationFormId, donationFormInputs, handleDonationFormInputsChange,
         donationFormSections, setDonationFormSections, customQuestions 
         }}
      >
         {children}
      </DonationFormContext.Provider>
   )
}