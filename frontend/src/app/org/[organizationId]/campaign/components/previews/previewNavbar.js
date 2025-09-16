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
import { useTheme } from "@/app/hooks/useTheme"
import { getDefaultTheme } from "@/app/utils/themeUtils"

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
   
   // Get organization theme
   const { theme: organizationTheme, getColor, loading: themeLoading } = useTheme(organizationId, {
      autoApply: false,
      fallbackOnError: true
   })

   // Theme-aware color configuration - only colors from organization theme
   const getThemeColors = () => {
      return {
         // Core colors from organization theme
         bgColor: getColor('background_color', '#ffffff'),
         pColor: getColor('text_primary_color', '#1f2937'), 
         sColor: getColor('text_secondary_color', '#64748b'),
         b1Color: getColor('button_background_color', '#3b82f6'),
         b2Color: getColor('secondary_color', '#6b7280'),
         b3Color: getColor('success_color', '#10b981'),
         btColor: getColor('button_text_color', '#ffffff'),
         cColor: getColor('surface_color', '#ffffff'),
         ctColor: getColor('text_primary_color', '#1f2937'),
         tColor: getColor('text_primary_color', '#1f2937'),
         // Additional color mappings for different page types
         bannerTitleText: getColor('text_primary_color', '#ffffff'),
         bannerSubtitleText: getColor('text_secondary_color', '#e2e8f0'),
         heroSubtitleColor: getColor('text_primary_color', '#ffffff'),
         bannerTitleColor: getColor('text_primary_color', '#ffffff'),
         bannerSubtitleColor: getColor('text_secondary_color', '#e2e8f0')
      }
   }

   // Determine which page type is currently being edited
   const getCurrentPageType = () => {
      if (pathname.includes('donation-form')) return 'donation-form'
      if (pathname.includes('thank-you-page')) return 'thank-you'
      if (pathname.includes('donation-page')) return 'donation-page'
      return null
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

      // Wait for theme to load if still loading
      if (themeLoading) {
         showError("Error", "Theme is still loading. Please wait a moment and try again.")
         return
      }

      const currentPageType = getCurrentPageType()
      if (!currentPageType) {
         showError("Error", "Unable to determine current page type.")
         return
      }

      setIsApplyingStyles(true)
      
      try {
         const themeColors = getThemeColors()
         let pageName = ''
         let updatePromise = null

         // Apply colors only to the current page being edited
         switch (currentPageType) {
            case 'donation-form':
               if (!donationFormContext || !donationFormContext.donationFormId) {
                  showError("Error", "Donation form context not available.")
                  return
               }
               pageName = 'donation form'
               const updatedDonationFormInputs = {
                  ...donationFormContext.donationFormInputs,
                  ...themeColors
               }
               donationFormContext.setDonationFormInputs(updatedDonationFormInputs)
               // updatePromise = updateDonationForm(donationFormContext.donationFormId, updatedDonationFormInputs, currentUser.id)
               break

            case 'thank-you':
               if (!thankYouPageContext) {
                  showError("Error", "Thank you page context not available.")
                  return
               }
               pageName = 'thank you page'
               const updatedThankYouInputs = {
                  ...thankYouPageContext.thankPageInputs,
                  ...themeColors
               }
               thankYouPageContext.setThankPageInputs(updatedThankYouInputs)
               // updatePromise = updateThankYouPage(campaignId, updatedThankYouInputs)
               break

            case 'donation-page':
               if (!donationPageContext) {
                  showError("Error", "Donation page context not available.")
                  return
               }
               pageName = 'donation page'
               const updatedDonationPageInputs = {
                  ...donationPageContext.donationPageInputs,
                  ...themeColors
               }
               donationPageContext.setDonationPageInputs(updatedDonationPageInputs)
               // updatePromise = updateDonationPage(campaignId, updatedDonationPageInputs)
               break

            default:
               showError("Error", "Unknown page type.")
               return
         }

         // Execute the update
         // await updatePromise
         
         // Show success feedback
         showSuccess("Colors Applied", `Organization theme colors have been applied to the ${pageName} successfully!`)
         
      } catch (error) {
         const handledError = errorHandler.handle(error)
         console.error("Error applying theme colors:", handledError.message)
         showError("Error", "Failed to apply theme colors. Please try again.")
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
               </div>
               <div className="flex space-x-1">
                  <button
                     onClick={applyDefaultStyles}
                     disabled={isApplyingStyles || themeLoading}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isApplyingStyles || themeLoading
                           ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                           : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
                     }`}
                  >
                     {isApplyingStyles ? "Applying..." : themeLoading ? "Loading Theme..." : "Apply Default Organization Theme"}
                  </button>
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