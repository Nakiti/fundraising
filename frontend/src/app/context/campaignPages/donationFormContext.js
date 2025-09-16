import { initialDonationFormSections } from "@/app/constants/pageSectionsConfig";
import { getPageService, getDesignationService, getContentService } from "@/app/services";
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { CampaignContext } from "../campaignContext";

export const DonationFormContext = createContext()

export const DonationFormContextProvider = ({campaignId, children, organizationId}) => {
   const [donationFormInputs, handleDonationFormInputsChange, setDonationFormInputs, filesToUpload] = useFormInput({})
   const [donationFormSections, setDonationFormSections] = useState(initialDonationFormSections)
   const [customQuestions, setCustomQuestions] = useState([])
   const [donationFormId, setDonationFormId] = useState(null)
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const designationService = getDesignationService();
            const contentService = getContentService();
            const donationResponse = await pageService.getDonationForm(campaignId)
            const donationPageId = donationResponse.data.id
            
            setDonationFormId(donationPageId)

            console.log("donationResponse", donationResponse)
            setDonationFormInputs({
               // Basic Content
               headline: donationResponse.data.headline || "",
               description: donationResponse.data.description || "",
               bg_image: donationResponse.data.bgImageUrl || "",
               
               // Colors
               bg_color: donationResponse.data.bgColor || "#ffffff",
               p_color: donationResponse.data.pColor || "#1f2937",
               s_color: donationResponse.data.sColor || "#6b7280",
               b1_color: donationResponse.data.b1Color || "#3b82f6",
               // b2_color: donationResponse.data.b2_color || "#6b7280",
               // b3_color: donationResponse.data.b3_color || "#10b981",
               // bt_color: donationResponse.data.btColor || "#ffffff",
               
               // Donation Amounts
               button1: donationResponse.data.button1 || 25,
               button2: donationResponse.data.button2 || 50,
               button3: donationResponse.data.button3 || 100,
               button4: donationResponse.data.button4 || 250,
               button5: donationResponse.data.button5 || 500,
               button6: donationResponse.data.button6 || 1000,
               
               // Typography
               // heroTitleSize: donationResponse.data.heroTitleSize || "36",
               // heroSubtitleSize: donationResponse.data.heroSubtitleSize || "16",
               // sectionTitleSize: donationResponse.data.sectionTitleSize || "28",
               // bodyTextSize: donationResponse.data.bodyTextSize || "16",
               // buttonTextSize: donationResponse.data.buttonTextSize || "16",
               
               // Layout
               // cardRadius: donationResponse.data.cardRadius || "4",
               // buttonRadius: donationResponse.data.buttonRadius || "4",
            })

            // Fetch designations for the campaign
            // const designationResponse = await designationService.getDesignationsByCampaign(campaignId)
            // setDesignations(designationResponse)

            // Fetch custom questions for the campaign
            const customQuestionsResponse = await contentService.getCustomQuestions(campaignId)
            setCustomQuestions(customQuestionsResponse)

            // Fetch page sections for the donation form
            const donationSections = await pageService.getPageSectionsByPage(organizationId, 'donation_form', donationPageId)
            console.log("donationSections", donationSections)
            setDonationFormSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.data.find((item) => item.name == section.name)
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
      <DonationFormContext.Provider value={{campaignId, donationFormId, donationFormInputs, handleDonationFormInputsChange, setDonationFormInputs,
        donationFormSections, setDonationFormSections, customQuestions, organizationId, filesToUpload
        }}
      >
         {children}
      </DonationFormContext.Provider>
   )
}