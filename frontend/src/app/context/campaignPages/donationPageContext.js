"use client";
import { getPageService, getDesignationService } from "@/app/services";
import { createContext, useContext, useState, useEffect } from "react";
import useFormInput from "../../hooks/useFormInput";
import { initialDonationPageSections } from "../../constants/pageSectionsConfig";

export const DonationPageContext = createContext()

export const DonationPageContextProvider = ({campaignId, children, organizationId}) => {
   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs, filesToUpload] = useFormInput({})
   const [donationPageSections, setDonationPageSections] = useState(initialDonationPageSections)
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [donationPageId, setDonationPageId] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const pageService = getPageService();
            const designationService = getDesignationService();
            
            const donationResponse = await pageService.getDonationPage(campaignId)
            // console.log("donationResponse", donationResponse)
            const donationPageId = donationResponse.data.id
            setDonationPageId(donationPageId)
            setDonationPageInputs({

               // Basic Content
               headline: donationResponse.data.headline || "",
               subtitle: donationResponse.data.subtitle || "",
               description: donationResponse.data.description || "",
               banner_image: donationResponse.data.bannerImageUrl || "",

               mainHeadline: donationResponse.data.mainHeadline || "",
               mainText: donationResponse.data.mainText || "",
               
               // Colors
               bgColor: donationResponse.data.bgColor || "#ffffff",
               pColor: donationResponse.data.pColor || "#1f2937",
               sColor: donationResponse.data.sColor || "#6b7280",
               btColor: donationResponse.data.btColor || "#ffffff",

               bannerTitleColor: donationResponse.data.bannerTitleColor || "#ffffff",
               bannerSubtitleColor: donationResponse.data.bannerSubtitleColor || "#e2e8f0",

               b1Color: donationResponse.data.b1Color || "#3b82f6",
               
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

            // Fetch page sections for the donation page
            const donationSections = await pageService.getPageSectionsByPage(organizationId, 'donation_page', donationPageId)
            console.log("donationSections", donationSections)
            setDonationPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.data.find(s => s.name === section.name);
                  return match ? {...section, pageSectionId: match.id, active: match.active } : section

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
   }, [campaignId, organizationId])

      return (
      <DonationPageContext.Provider value={{donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs,
        donationPageSections, setDonationPageSections, campaignId, selectedDesignations, setSelectedDesignations, donationPageId, organizationId, filesToUpload}}
      >
         {children}
      </DonationPageContext.Provider>
   )
}