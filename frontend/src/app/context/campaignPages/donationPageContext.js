import { createContext, useEffect, useState, useContext } from "react";
import useFormInput from "../../hooks/useFormInput";
import { PageService, DesignationService } from "../../services/fetchService";
import { initialDonationPageSections } from "../../constants/pageSectionsConfig";
import { CampaignContext } from "../campaignContext";

export const DonationPageContext = createContext()

export const DonationPageContextProvider = ({campaignId, children}) => {
   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs] = useFormInput({})
   const [donationPageSections, setDonationPageSections] = useState(initialDonationPageSections)
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const {campaignType} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const donationResponse = await PageService.getDonationPage(campaignId)
            const donationPageId = donationResponse.id
            setDonationPageInputs({
               // Basic Content
               headline: donationResponse.headline || "",
               description: donationResponse.description || "",
               subtitle: donationResponse.subtitle || "Fundraiser",
               mainHeadline: donationResponse.mainHeadline || "Making a Difference Together",
               mainText: donationResponse.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone.",
               
               // Images
               banner_image: donationResponse.banner_image || "",
               small_image: donationResponse.small_image || "",
               
               // Colors
               bg_color: donationResponse.bg_color || "#ffffff",
               p_color: donationResponse.p_color || "#1f2937",
               s_color: donationResponse.s_color || "#3b82f6",
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
               
               // Campaign Stats
               goal_amount: donationResponse.goal_amount || 10000,
               raised_amount: donationResponse.raised_amount || 2450,
               donor_count: donationResponse.donor_count || 127,
               days_left: donationResponse.days_left || 23,
               
               // Layout Options
               show_progress: donationResponse.show_progress !== false,
               show_donor_count: donationResponse.show_donor_count !== false,
               show_days_left: donationResponse.show_days_left !== false,
               show_amount_grid: donationResponse.show_amount_grid !== false,
               
               // Button Text
               donate_button_text: donationResponse.donate_button_text || "Donate Now",
               share_button_text: donationResponse.share_button_text || "Share",
               
               // Footer
               footer_text: donationResponse.footer_text || "Your Organization",
               privacy_policy_url: donationResponse.privacy_policy_url || "#",
               terms_of_service_url: donationResponse.terms_of_service_url || "#",
               
               // Typography
               heroTitleSize: donationResponse.heroTitleSize || "36",
               heroSubtitleSize: donationResponse.heroSubtitleSize || "16",
               sectionTitleSize: donationResponse.sectionTitleSize || "28",
               bodyTextSize: donationResponse.bodyTextSize || "16",
               buttonTextSize: donationResponse.buttonTextSize || "16",
               cardTitleSize: donationResponse.cardTitleSize || "18",
               
               // Layout
               heroHeight: donationResponse.heroHeight || "500",
               sectionPadding: donationResponse.sectionPadding || "80",
               cardRadius: donationResponse.cardRadius || "4",
               buttonRadius: donationResponse.buttonRadius || "4",
               
               // Visual Effects
               overlayOpacity: donationResponse.overlayOpacity || "0.3",
            })

            const donationSections = await PageService.getPageSections(donationPageId)
            setDonationPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.find((item) => item.name == section.name)
                  return match ? {...section, id: match.id, active: match.active } : section
               })
            })

            const selectedDesignationsResponse = await DesignationService.getCampaignDesignations(campaignId)
            setSelectedDesignations(selectedDesignationsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      if (campaignType == "donation") {
         fetchData()
      }
   }, [])

   return (
      <DonationPageContext.Provider value={{donationPageInputs, handleDonationPageInputsChange, 
         donationPageSections, setDonationPageSections, campaignId, selectedDesignations, setSelectedDesignations}}
      >
         {children}
      </DonationPageContext.Provider>
   )
}