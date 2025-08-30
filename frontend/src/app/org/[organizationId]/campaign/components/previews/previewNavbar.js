import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useContext, useState } from "react"
import { useParams } from "next/navigation"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import { PageUpdateService, updateThankYouPage, updateDonationForm, updateDonationPage } from "@/app/services/updateServices"
import { errorHandler } from "@/app/services/apiClient"
import { useToast } from "@/app/components/Toast"

const PreviewNavbar = ({heading, links}) => {
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const params = useParams()
   const type = searchParams.get("type")
   const [isApplyingStyles, setIsApplyingStyles] = useState(false)
   const { showSuccess, showError } = useToast()
   
   // Get contexts
   const { campaignType, campaignDetails } = useContext(CampaignContext)
   const { currentUser } = useContext(AuthContext)
   
   // Get page contexts
   const donationFormContext = useContext(DonationFormContext)
   const thankYouPageContext = useContext(ThankYouPageContext)
   const donationPageContext = useContext(DonationPageContext)
   
   const campaignId = params?.id
   const organizationId = params?.organizationId

   // Default styles configuration - Modern, clean, and professional
   const defaultStyles = {
      // Colors - Clean, modern palette
      bg_color: "#ffffff",
      p_color: "#1f2937", 
      s_color: "#64748b",
      b1_color: "#3b82f6",
      b2_color: "#6b7280",
      b3_color: "#10b981",
      bt_color: "#ffffff",
      
      // Typography - Readable and modern
      heroTitleSize: "48",
      heroSubtitleSize: "18", 
      sectionTitleSize: "32",
      bodyTextSize: "16",
      buttonTextSize: "16",
      
      // Layout - Modern spacing and rounded corners
      cardRadius: "12",
      buttonRadius: "8",
      heroHeight: "600",
      sectionPadding: "100",
      
      // Visual Effects - Subtle and elegant
      overlayOpacity: "0.4"
   }

   // Page-specific default styles to handle attribute inconsistencies
   const donationFormDefaultStyles = {
      ...defaultStyles,
      // Donation form specific adjustments
      heroTitleSize: "36", // Smaller for form context
      sectionTitleSize: "20", // Smaller section titles
      bodyTextSize: "14", // Smaller body text for forms
      buttonTextSize: "14", // Smaller button text
      cardRadius: "8", // Slightly smaller radius for forms
      buttonRadius: "6", // Smaller button radius for forms
      // Additional form-specific attributes
      t_color: "#1f2937", // Text color for form elements
   }

   const thankYouPageDefaultStyles = {
      ...defaultStyles,
      // Thank you page specific adjustments
      heroTitleSize: "32", // Appropriate for thank you messages
      sectionTitleSize: "24", // Medium section titles
      bodyTextSize: "16", // Standard body text
      buttonTextSize: "14", // Standard button text
      cardRadius: "12", // Standard card radius
      buttonRadius: "8", // Standard button radius
      // Additional thank you page attributes
      t_color: "#1f2937", // Text color for thank you page elements
   }

   const donationPageDefaultStyles = {
      ...defaultStyles,
      // Donation page specific adjustments (landing page style)
      heroTitleSize: "56", // Larger for hero sections
      heroSubtitleSize: "20", // Larger subtitle
      sectionTitleSize: "36", // Larger section titles
      bodyTextSize: "18", // Larger body text for readability
      buttonTextSize: "16", // Larger button text
      cardRadius: "16", // Larger radius for modern look
      buttonRadius: "10", // Larger button radius
      heroHeight: "700", // Taller hero section
      sectionPadding: "120", // More padding for spacious feel
      overlayOpacity: "0.5", // Slightly more overlay for better text contrast
      // Additional donation page attributes
      cardTitleSize: "24", // Card title size for donation page
      t_color: "#1f2937", // Text color for donation page elements
      // Banner-specific styling
      bannerTitleColor: "#ffffff", // White text for banner title
      bannerSubtitleColor: "#e2e8f0", // Light gray for banner subtitle
      bannerTitleSize: "56", // Large banner title
      bannerSubtitleSize: "20", // Medium banner subtitle
   }

   const applyDefaultStyles = async () => {
      if (!campaignId) {
         showError("Error", "Campaign ID not available")
         return
      }

      if (!currentUser?.id) {
         showError("Error", "User authentication required. Please log in again.")
         return
      }

      // Check if we have access to at least one page context
      if (!donationFormContext && !thankYouPageContext && !donationPageContext) {
         showError("Error", "No page contexts available. Please refresh the page and try again.")
         return
      }

      setIsApplyingStyles(true)
      
      try {
         const updatePromises = []

         // Update donation form styles
         if (donationFormContext && donationFormContext.donationFormId) {
            const updatedDonationFormInputs = {
               ...donationFormContext.donationFormInputs,
               ...donationFormDefaultStyles
            }
            donationFormContext.setDonationFormInputs(updatedDonationFormInputs)
            updatePromises.push(
               updateDonationForm(donationFormContext.donationFormId, updatedDonationFormInputs, currentUser.id)
            )
         }

         // Update thank you page styles
         if (thankYouPageContext) {
            const updatedThankYouInputs = {
               ...thankYouPageContext.thankPageInputs,
               ...thankYouPageDefaultStyles
            }
            thankYouPageContext.setThankPageInputs(updatedThankYouInputs)
            updatePromises.push(
               updateThankYouPage(campaignId, updatedThankYouInputs)
            )
         }

         // Update donation page styles (for crowdfunding campaigns)
         if (donationPageContext && campaignType === "crowdfunding") {
            const updatedDonationPageInputs = {
               ...donationPageContext.donationPageInputs,
               ...donationPageDefaultStyles
            }
            donationPageContext.setDonationPageInputs(updatedDonationPageInputs)
            updatePromises.push(
               updateDonationPage(campaignId, updatedDonationPageInputs)
            )
         }

         // Check if we have any updates to perform
         if (updatePromises.length === 0) {
            showError("Error", "No pages available to update. Please check your campaign configuration.")
            return
         }

         // Execute all updates in parallel
         await Promise.all(updatePromises)
         
         // Show success feedback
         showSuccess("Styles Applied", "Default styles have been applied to all pages successfully!")
         
      } catch (error) {
         const handledError = errorHandler.handle(error)
         console.error("Error applying default styles:", handledError.message)
         showError("Error", "Failed to apply default styles. Please try again.")
      } finally {
         setIsApplyingStyles(false)
      }
   }

   return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
         <div className="px-4 py-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
                  <button
                     onClick={applyDefaultStyles}
                     disabled={isApplyingStyles}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isApplyingStyles 
                           ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                           : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                     }`}
                  >
                     {isApplyingStyles ? "Applying..." : "Apply Default Styles"}
                  </button>
               </div>
               <div className="flex space-x-1">

                  <Link 
                     href={links[0]}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        links[0] == pathname 
                           ? "bg-blue-50 text-blue-700 border border-blue-200" 
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                     }`}
                  >
                     Elements
                  </Link>
                  <Link 
                     href={links[1]}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        links[1] == pathname 
                           ? "bg-blue-50 text-blue-700 border border-blue-200" 
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                     }`}
                  >
                     Design
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PreviewNavbar