"use client"
import { getCampaignService, getPageService } from "@/app/services"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { FaArrowLeft, FaShare, FaHeart, FaUsers, FaShoppingCart } from "react-icons/fa"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import DonationLeaderboard from "./components/DonationLeaderboard"
import AddToCartButton from "@/app/components/AddToCartButton"
import { useCart } from "@/app/context/cartContext"

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
            const campaignResponse = await campaignService.getCampaignDetails(campaignId)
            console.log("Campaign details:", campaignResponse)
            
            if (campaignResponse.status == "active" || status == "preview") {
               setCampaignDetails(campaignResponse)

               const displayResponse = await pageService.getDonationPage(campaignId)
               setDisplay(displayResponse)
               console.log("Donation page display:", displayResponse)

               const designationResponse = await campaignService.getCampaignDesignations(campaignId)
               setDesignations(designationResponse)
               console.log("Designations:", designationResponse)

               const donationFormResponse = await pageService.getDonationForm(campaignId)
               setDonationForm(donationFormResponse)
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
   }, [campaignId, status])

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
            backgroundColor: display?.bg_color || '#fafafa',
            backgroundImage: display?.bg_image ? `url('${display.bg_image}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}
      >
      {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
      {display && <div>
         {/* Hero Section */}
         <div className="relative w-full" style={{height: 600}}>
            <img
               src={display.banner_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
               alt="Campaign Banner"
               className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div 
               className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 px-4"
               style={{
                  backgroundColor: `rgba(0, 0, 0, ${display.overlayOpacity || 0.4})`
               }}
            >
               <div className="max-w-2xl mx-auto space-y-4">
                  <h1 
                     className="font-bold text-white leading-tight"
                     style={{
                        color: display.bannerTitleColor || '#ffffff',
                        fontSize: Math.min(parseInt(display.bannerTitleSize) || 56, 80) + 'px'
                     }}
                  >
                     {display.headline || "Support Our Cause"}
                  </h1>
                  <p 
                     className="text-slate-100 max-w-xl mx-auto leading-relaxed"
                     style={{
                        color: display.bannerSubtitleColor || '#e2e8f0',
                        fontSize: Math.min(parseInt(display.bannerSubtitleSize) || 20, 28) + 'px'
                     }}
                  >
                     {display.description || "Your support makes a real difference in our community. Every donation, no matter the size, helps us achieve our mission and create positive change for those who need it most."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                     <Link 
                        href={getDonateUrl()}
                        className="font-semibold transition-all duration-300 flex items-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{
                           backgroundColor: display.b1_color || '#475569',
                           color: display.bt_color || '#FFFFFF',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.buttonTextSize) || 14, 16) + 'px',
                           padding: '10px 20px'
                        }}
                     >
                        <FaHeart className="w-3 h-3" />
                        <span>{display.donate_button_text || "Donate Now"}</span>
                     </Link>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-6" 
              style={{
                 paddingTop: Math.min(parseInt(display.sectionPadding) || 40, 60), 
                 paddingBottom: Math.min(parseInt(display.sectionPadding) || 40, 60)
              }}>
            <div className="grid lg:grid-cols-3 gap-8">
               {/* Main Content Area */}
               <div className="lg:col-span-2 space-y-8">
                  {/* Header Section */}
                  <div>
                     <div className="flex items-start justify-between mb-4">
                        <div>
                           <p 
                              className="text-sm font-medium mb-2"
                              style={{ 
                                 color: display.s_color || '#64748b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              {display.subtitle || "Fundraiser"}
                           </p>
                           <h2 
                              className="text-3xl font-bold leading-tight"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.sectionTitleSize) || 28, 32) + 'px'
                              }}
                           >
                              {display.mainHeadline || "Making a Difference Together"}
                           </h2>
                        </div>
                        <button 
                           className="text-sm hover:opacity-80 transition-opacity flex items-center space-x-2 px-3 py-2 rounded-md"
                           style={{ 
                              color: display.b1_color || '#475569',
                              backgroundColor: display.b1_color ? `${display.b1_color}15` : '#f1f5f9',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        >
                           <FaShare className="w-3 h-3" />
                           <span>{display.share_button_text || "Share"}</span>
                        </button>
                     </div>

                     {/* Main Content Text */}
                     <p 
                        className="leading-relaxed text-lg"
                        style={{
                           color: display.s_color || '#64748b',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                        }}
                     >
                        {display.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
                     </p>
                  </div>
                  
                  {/* Progress Section */}
                  {display.show_progress !== false && (
                     <div className="bg-white border border-slate-100 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                           <span 
                              className="font-semibold text-lg"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                              }}
                           >
                              ${(campaignInsights?.total_raised || 0).toLocaleString()} raised
                           </span>
                           <span 
                              className="font-medium text-sm"
                              style={{ 
                                 color: display.s_color || '#64748b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              of ${(campaignDetails?.goal || 0).toLocaleString()} goal
                           </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                           <div 
                              className="h-3 rounded-full transition-all duration-500 ease-out"
                              style={{ 
                                 backgroundColor: display.b1_color || '#475569',
                                 width: `${progressPercentage}%`
                              }}
                           ></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{ color: display.s_color || '#64748b' }}>
                           {display.show_donor_count !== false && (
                              <div className="flex items-center space-x-2">
                                 <FaUsers className="text-slate-400 w-4 h-4" />
                                 <span>{campaignInsights?.total_donors || 0} donations</span>
                              </div>
                           )}
                           {campaignInsights?.unique_donors > 0 && (
                              <div className="flex items-center space-x-2">
                                 <FaUsers className="text-slate-400 w-4 h-4" />
                                 <span>{campaignInsights.unique_donors} unique donors</span>
                              </div>
                           )}
                           {campaignInsights?.average_donation > 0 && (
                              <div className="flex items-center space-x-2">
                                 <FaHeart className="text-rose-400 w-4 h-4" />
                                 <span>${campaignInsights.average_donation.toFixed(2)} avg</span>
                              </div>
                           )}
                           {display.show_days_left !== false && (
                              <div className="flex items-center space-x-2">
                                 <FaHeart className="text-rose-400 w-4 h-4" />
                                 <span>{display.days_left || 23} days left</span>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Donation Leaderboard */}
                  <DonationLeaderboard campaignId={campaignId} display={display} />
               </div>

               {/* Sidebar */}
               <div className="lg:col-span-1">
                  <div className="bg-white border border-slate-100 p-6 rounded-xl sticky top-6">
                     <h3 
                        className="font-bold text-xl mb-6"
                        style={{
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.cardTitleSize) || 20, 24) + 'px'
                        }}
                     >
                        Choose Your Amount
                     </h3>
                     {display.show_amount_grid !== false && (
                        <div className="grid grid-cols-2 gap-3 mb-6">
                           {donationForm && [donationForm.button1, donationForm.button2, donationForm.button3, donationForm.button4, donationForm.button5, donationForm.button6].map((amount, index) => {
                              const buttonAmount = parseInt(amount || '25')
                              const isSelected = selectedAmount === buttonAmount
                              return (
                                 <button
                                    key={index}
                                    onClick={() => handleAmountSelect(amount || '25')}
                                    className={`p-4 border transition-all duration-200 text-center rounded-lg ${
                                       isSelected 
                                          ? 'border-2' 
                                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                    style={{
                                       borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '8px',
                                       borderColor: isSelected ? (display.b1_color || '#475569') : undefined,
                                       backgroundColor: isSelected ? `${display.b1_color || '#475569'}15` : undefined
                                    }}
                                 >
                                    <div 
                                       className="font-bold text-lg"
                                       style={{ 
                                          color: isSelected ? (display.b1_color || '#475569') : (display.p_color || '#1e293b'),
                                          fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                                       }}
                                    >
                                       ${amount || '25'}
                                    </div>
                                    <div 
                                       className="text-xs mt-1"
                                       style={{ 
                                          color: isSelected ? (display.b1_color || '#475569') : (display.s_color || '#64748b')
                                       }}
                                    >
                                       Donation
                                    </div>
                                 </button>
                              )
                           })}
                        </div>
                     )}
                     <Link 
                        href={getDonateUrl()}
                        className="w-full py-4 px-6 font-bold text-white transition-all duration-300 flex items-center justify-center space-x-3 hover:opacity-90 text-lg"
                        style={{
                           backgroundColor: display.b1_color || '#475569',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '12px',
                           fontSize: Math.min(parseInt(display.buttonTextSize) || 16, 18) + 'px'
                        }}
                     >
                        <FaHeart className="w-4 h-4" />
                        <span>{display.donate_button_text || "Donate Now"}</span>
                     </Link>
                     <button 
                        onClick={handleAddToCart}
                        className="w-full py-4 px-6 font-bold mt-4 text-white transition-all duration-300 flex items-center justify-center space-x-3 hover:opacity-90 text-lg"
                        style={{
                           backgroundColor: '#64748b',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '12px',
                           fontSize: Math.min(parseInt(display.buttonTextSize) || 16, 18) + 'px'
                        }}
                     >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>}
   </div>
   )
}

export default DonationLandingPage