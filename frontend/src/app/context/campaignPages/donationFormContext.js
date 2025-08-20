import { initialDonationFormSections } from "@/app/constants/pageSectionsConfig";
import { ContentService, PageService, DesignationService } from "@/app/services/fetchService";
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { CampaignContext } from "../campaignContext";

export const DonationFormContext = createContext()

export const DonationFormContextProvider = ({campaignId, children}) => {
   const [donationFormInputs, handleDonationFormInputsChange, setDonationFormInputs] = useFormInput({})
   const [donationFormSections, setDonationFormSections] = useState(initialDonationFormSections)
   const [customQuestions, setCustomQuestions] = useState([])
   const [donationFormId, setDonationFormId] = useState(null)
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const donationResponse = await PageService.getDonationForm(campaignId)
            const donationPageId = donationResponse.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available
            setDonationFormId(donationPageId)
            
            setDonationFormInputs({
               // Basic Content
               headline: donationResponse.headline || "",
               description: donationResponse.description || "",
               subtitle: donationResponse.subtitle || "Donation Form",
               
               // Colors
               bg_color: donationResponse.bg_color || "#ffffff",
               p_color: donationResponse.p_color || "#1f2937",
               s_color: donationResponse.s_color || "#6b7280",
               b1_color: donationResponse.b1_color || "#3b82f6",
               b2_color: donationResponse.b2_color || "#6b7280",
               b3_color: donationResponse.b3_color || "#10b981",
               bt_color: donationResponse.bt_color || "#ffffff",
               
               // Donation Amounts
               button1: donationResponse.button1 || 25,
               button2: donationResponse.button2 || 50,
               button3: donationResponse.button3 || 100,
               button4: donationResponse.button4 || 250,
               button5: donationResponse.button5 || 500,
               button6: donationResponse.button6 || 1000,
               
               // Typography
               heroTitleSize: donationResponse.heroTitleSize || "36",
               heroSubtitleSize: donationResponse.heroSubtitleSize || "16",
               sectionTitleSize: donationResponse.sectionTitleSize || "28",
               bodyTextSize: donationResponse.bodyTextSize || "16",
               buttonTextSize: donationResponse.buttonTextSize || "16",
               
               // Layout
               cardRadius: donationResponse.cardRadius || "4",
               buttonRadius: donationResponse.buttonRadius || "4",
            })

            const customQuestionsResponse = await ContentService.getCustomQuestions(campaignId)
            setCustomQuestions(customQuestionsResponse)

            const donationSections = await PageService.getPageSectionsByPage(organizationId, 'campaign_form', donationPageId)
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