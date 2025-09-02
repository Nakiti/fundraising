"use client";
import { getPageService, getDesignationService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import useFormInput from "../../hooks/useFormInput";
import { initialDonationPageSections } from "../../constants/pageSectionsConfig";
import { CampaignContext } from "../campaignContext";

export const DonationPageContext = createContext()

export const DonationPageContextProvider = ({campaignId, children, organizationId}) => {
   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs] = useFormInput({})
   const [donationPageSections, setDonationPageSections] = useState(initialDonationPageSections)
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const {campaignType, campaignDetails} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            console.log("campaignId", campaignId)
            const pageService = getPageService();
            const designationService = getDesignationService();
            
            const donationResponse = await pageService.getDonationPage(campaignId)
            console.log("donationResponse", donationResponse)
            const donationPageId = donationResponse.data.id
            const organizationId = campaignDetails?.organization_id || 1 // Fallback to 1 if not available
                        
            setDonationPageInputs({
               // Basic Content
               title: donationResponse.data.title || "",
               subtitle: donationResponse.data.subtitle || "",
               description: donationResponse.data.description || "",
               
               // Colors
               bg_color: donationResponse.data.bg_color || "#ffffff",
               p_color: donationResponse.data.p_color || "#1f2937",
               s_color: donationResponse.data.s_color || "#6b7280",
               b_color: donationResponse.data.b_color || "#3b82f6",
               bt_color: donationResponse.data.bt_color || "#ffffff",
               
               // Typography
               heroTitleSize: donationResponse.data.heroTitleSize || "36",
               heroSubtitleSize: donationResponse.data.heroSubtitleSize || "16",
               sectionTitleSize: donationResponse.data.sectionTitleSize || "28",
               bodyTextSize: donationResponse.data.bodyTextSize || "16",
               buttonTextSize: donationResponse.data.buttonTextSize || "16",
               
               // Layout
               cardRadius: donationResponse.data.cardRadius || "4",
               buttonRadius: donationResponse.data.buttonRadius || "4",
            })

            // Fetch page sections for the donation page
            const donationSections = await pageService.getPageSectionsByPage(organizationId, 'campaign_donation', donationPageId)
            setDonationPageSections((prevSections) => {
               return prevSections.map(section => {
                  const matchingSection = donationSections.data.find(s => s.name === section.name);
                  return {
                     ...section,
                     active: matchingSection ? matchingSection.active : section.active,
                     required: matchingSection ? matchingSection.required : section.required,
                     dropdown: matchingSection ? matchingSection.dropdown : section.dropdown
                  };
               });
            })

            // Fetch designations for the campaign
            const selectedDesignationsResponse = await designationService.getDesignationsByCampaign(campaignId)
            setSelectedDesignations(selectedDesignationsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [campaignId])

      return (
      <DonationPageContext.Provider value={{donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs,
        donationPageSections, setDonationPageSections, campaignId, selectedDesignations, setSelectedDesignations}}
      >
         {children}
      </DonationPageContext.Provider>
   )
}