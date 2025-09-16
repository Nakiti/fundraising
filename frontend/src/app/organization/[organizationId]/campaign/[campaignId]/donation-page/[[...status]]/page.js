"use client"
import { getCampaignService, getPageService } from "@/app/services"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import DonationLeaderboard from "./components/DonationLeaderboard"
import { useCart } from "@/app/context/cartContext"
import HeroSection from "./components/HeroSection"
import HeaderSection from "./components/HeaderSection"
import ProgressSection from "./components/ProgressSection"
import DonationSidebar from "./components/DonationSidebar"

const DonationLandingPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [campaignInsights, setCampaignInsights] = useState(null)
   const [loading, setLoading] = useState(true)
   const [selectedAmount, setSelectedAmount] = useState(null)
   const router = useRouter()
   const parameters = useParams()
   const { addToCart } = useCart()
   const [donationForm, setDonationForm] = useState(null)

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   // Handle amount selection
   const handleAmountSelect = (amount) => {
      const numAmount = parseInt(amount)
      if (selectedAmount === numAmount) {
         // Deactivate if same amount is clicked
         setSelectedAmount(null)
      } else {
         // Activate the selected amount
         setSelectedAmount(numAmount)
      }
   }

   // Handle add to cart with selected amount
   const handleAddToCart = async () => {
      if (!selectedAmount) {
         alert('Please select a donation amount first')
         return
      }
      
      try {
         await addToCart(campaignId, selectedAmount)
         alert('Campaign added to cart successfully!')
      } catch (error) {
         console.error('Error adding to cart:', error)
         alert('Failed to add to cart. Please try again.')
      }
   }

   // Generate donation form URL with amount parameter
   const getDonateUrl = () => {
      const baseUrl = status ? 
         `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview` :
         `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
      return selectedAmount ? `${baseUrl}?amount=${selectedAmount}` : baseUrl
   }


   useEffect(() => {
      const fetchData = async() => {
         try {
            setLoading(true)
            const campaignService = getCampaignService();
            const pageService = getPageService();
            
            const campaignResponse = await campaignService.getCampaignWithDetails(campaignId)
            console.log("Campaign details:", campaignResponse)
            
            if (campaignResponse.data.status == "active" || status == "preview") {
               setCampaignDetails(campaignResponse.data)

               const displayResponse = await pageService.getDonationPage(campaignId)
               setDisplay(displayResponse.data)
               console.log("Donation page display:", displayResponse)

               const designationResponse = await campaignService.getCampaignDesignations(campaignId)
               setDesignations(designationResponse.data)
               console.log("Designations:", designationResponse)

               const donationFormResponse = await pageService.getDonationForm(campaignId)
               setDonationForm(donationFormResponse.data)
               console.log("Donation form:", donationFormResponse)

               // Use campaign details for basic statistics
               setCampaignInsights({
                  total_raised: campaignResponse.raised || 0,
                  total_donors: campaignResponse.donors || 0,
                  goal: campaignResponse.goal || 0
               })
            }
         } catch (error) {
            console.error("Error fetching campaign data:", error)
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [])

   // Calculate progress percentage using real data
   const progressPercentage = campaignDetails?.goal && campaignInsights?.total_raised 
      ? Math.min((campaignInsights.total_raised / campaignDetails.goal) * 100, 100) 
      : 0

   // Show loading state
   if (loading) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-4 text-gray-600">Loading campaign...</p>
            </div>
         </div>
      )
   }

   // Check if campaign exists and is active (unless in preview mode)
   if (!campaignDetails || (!campaignDetails.status === "active" && status !== "preview")) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="text-red-600 text-xl mb-4">Campaign Not Found</div>
               <p className="text-gray-600">This campaign may be inactive or no longer available.</p>
            </div>
         </div>
      )
   }

   return (
      <div 
         className="w-full mb-4 overflow-y-auto" 
         style={{ 
            backgroundColor: display?.bgColor || '#fafafa',
            // backgroundImage: display?.bannerImageUrl ? `url('${display.bannerImageUrl}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}
      >
      {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
      {display && <div>
         <HeroSection display={display} donateUrl={getDonateUrl()} />

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-6" 
              style={{
                 paddingTop: 60, 
                 paddingBottom: 60
              }}>
            <div className="grid lg:grid-cols-3 gap-8">
               {/* Main Content Area */}
               <div className="lg:col-span-2 space-y-8">
                  <HeaderSection display={display} />
                  
                  <ProgressSection 
                    display={display} 
                    campaignDetails={campaignDetails}
                    campaignInsights={campaignInsights}
                    progressPercentage={progressPercentage}
                  />

                  {/* Donation Leaderboard */}
                  <DonationLeaderboard campaignId={campaignId} display={display} />
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-1">
                 <DonationSidebar 
                   display={display}
                   donationForm={donationForm}
                   selectedAmount={selectedAmount}
                   handleAmountSelect={handleAmountSelect}
                   donateUrl={getDonateUrl()}
                   handleAddToCart={handleAddToCart}
                 />
               </div>
            </div>
         </div>
      </div>}
   </div>
   )
}

export default DonationLandingPage