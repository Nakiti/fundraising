"use client"
import { getCampaignDesignations, getCampaignDetails, getDonationPage, getSumRaised } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { FaArrowLeft, FaShare, FaHeart, FaUsers } from "react-icons/fa"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"

const DonationLandingPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [amountRaised, setAmountRaised] = useState(0)
   const [donorCount, setDonorCount] = useState(0)
   const router = useRouter()
   const parameters = useParams()

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         console.log(campaignResponse, parameters, campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            const displayResponse = await getDonationPage(campaignId)
            setDisplay(displayResponse)
            console.log("asdasd", displayResponse)

            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)
            console.log(designationResponse)

            // Fetch amount raised
            try {
               const raisedResponse = await getSumRaised(campaignId)
               setAmountRaised(raisedResponse.total_raised || 0)
            } catch (error) {
               console.log("Error fetching amount raised:", error)
            }
         }
      }

      fetchData()
   }, [])

   // Calculate progress percentage
   const progressPercentage = campaignDetails?.goal ? Math.min((amountRaised / campaignDetails.goal) * 100, 100) : 0

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
         <div className="relative w-full" style={{height: Math.min(parseInt(display.heroHeight) || 300, 400)}}>
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
                        color: display.p_color || '#ffffff',
                        fontSize: Math.min(parseInt(display.heroTitleSize) || 28, 32) + 'px'
                     }}
                  >
                     {display.headline || "Support Our Cause"}
                  </h1>
                  <p 
                     className="text-slate-100 max-w-xl mx-auto leading-relaxed"
                     style={{
                        color: display.s_color || '#e2e8f0',
                        fontSize: Math.min(parseInt(display.heroSubtitleSize) || 14, 16) + 'px'
                     }}
                  >
                     {display.description || "Your support makes a real difference in our community. Every donation, no matter the size, helps us achieve our mission and create positive change for those who need it most."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                     <Link 
                        href={status ? 
                           `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview` :
                           `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                        }
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
                     <button 
                        className="font-semibold transition-all duration-300 flex items-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{
                           backgroundColor: display.b2_color || '#64748b',
                           color: display.bt_color || '#FFFFFF',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.buttonTextSize) || 14, 16) + 'px',
                           padding: '10px 20px'
                        }}
                     >
                        <FaShare className="w-3 h-3" />
                        <span>{display.share_button_text || "Share"}</span>
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="flex flex-col lg:flex-row w-full px-6 space-y-8 lg:space-y-0 lg:space-x-8" 
              style={{
                 paddingTop: Math.min(parseInt(display.sectionPadding) || 40, 60), 
                 paddingBottom: Math.min(parseInt(display.sectionPadding) || 40, 60)
              }}>
            <div className="lg:w-2/3">
               {/* Header Section */}
               <div className="flex flex-row justify-between mb-6 w-full">
                  <div>
                     <p 
                        className="text-sm mb-2"
                        style={{ 
                           color: display.s_color || '#64748b',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     >
                        {display.subtitle || "Fundraiser"}
                     </p>
                     <h2 
                        className="text-2xl font-semibold"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 24, 28) + 'px'
                        }}
                     >
                        {display.mainHeadline || "Making a Difference Together"}
                     </h2>
                  </div>
                  <button 
                     className="text-sm hover:underline flex items-center space-x-1"
                     style={{ 
                        color: display.b1_color || '#475569',
                        fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     <FaShare className="w-3 h-3" />
                     <span>{display.share_button_text || "Share"}</span>
                  </button>
               </div>

               {/* Main Content Text */}
               <p 
                  className="leading-relaxed mb-6"
                  style={{
                     color: display.s_color || '#64748b',
                     fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                  }}
               >
                  {display.mainText || "Our organization works tirelessly to create positive change in the community. Through innovative programs and dedicated volunteers, we're building a better future for everyone."}
               </p>
               
               {/* Progress Section */}
               {display.show_progress !== false && (
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-2">
                        <span 
                           className="font-medium text-sm"
                           style={{ 
                              color: display.s_color || '#64748b',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        >
                           ${amountRaised.toLocaleString()} raised
                        </span>
                        <span 
                           className="font-medium text-sm"
                           style={{ 
                              color: display.s_color || '#64748b',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        >
                           of ${campaignDetails?.goal?.toLocaleString() || '0'} goal
                        </span>
                     </div>
                     <div className="w-full bg-slate-200 rounded-full h-2 mb-3 overflow-hidden">
                        <div 
                           className="h-2 rounded-full transition-all duration-500 ease-out"
                           style={{ 
                              backgroundColor: display.s_color || '#475569',
                              width: `${progressPercentage}%`
                           }}
                        ></div>
                     </div>
                     <div className="flex justify-start items-center space-x-4 text-sm" style={{ color: display.s_color || '#64748b' }}>
                        {display.show_donor_count !== false && (
                           <div className="flex items-center space-x-1.5">
                              <FaUsers className="text-slate-600 w-3 h-3" />
                              <span>{donorCount} donors</span>
                           </div>
                        )}
                        {display.show_days_left !== false && (
                           <div className="flex items-center space-x-1.5">
                              <FaHeart className="text-rose-500 w-3 h-3" />
                              <span>{display.days_left || 23} days left</span>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
               <div 
                  className="bg-white border border-slate-200 p-4 shadow-sm"
                  style={{borderRadius: display.cardRadius ? `${display.cardRadius}px` : '8px'}}
               >
                  <h3 
                     className="font-semibold mb-4"
                     style={{
                        color: display.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(display.cardTitleSize) || 18, 20) + 'px'
                     }}
                  >
                     Choose Your Amount
                  </h3>
                  {display.show_amount_grid !== false && (
                     <div className="space-y-2 mb-4">
                        {[display.button1, display.button2, display.button3, display.button4, display.button5, display.button6].map((amount, index) => (
                           <button
                              key={index}
                              className="w-full p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-center"
                              style={{borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px'}}
                           >
                              <div 
                                 className="font-semibold text-sm"
                                 style={{ 
                                    color: display.p_color || '#1e293b',
                                    fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                 }}
                              >
                                 ${amount || '25'}
                              </div>
                              <div 
                                 className="text-xs mt-0.5"
                                 style={{ color: display.s_color || '#64748b' }}
                              >
                                 Donation
                              </div>
                           </button>
                        ))}
                     </div>
                  )}
                  <Link 
                     href={status ? 
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview` :
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                     }
                     className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                     style={{
                        backgroundColor: display.b1_color || '#475569',
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                        fontSize: Math.min(parseInt(display.buttonTextSize) || 14, 16) + 'px'
                     }}
                  >
                     <FaHeart className="w-3 h-3" />
                     <span>{display.donate_button_text || "Donate Now"}</span>
                  </Link>
               </div>
            </div>
         </div>

         {/* Footer */}
         <div 
            className="border-t border-slate-200 py-6 px-6 text-center"
            style={{paddingTop: Math.min(parseInt(display.sectionPadding) || 40, 60) / 2}}
         >
            <p 
               className="text-sm"
               style={{ color: display.s_color || '#64748b' }}
            >
               {display.footer_text || "Your Organization"}
            </p>
            <div className="flex justify-center space-x-4 mt-2">
               <a 
                  href={display.privacy_policy_url || "#"}
                  className="text-xs hover:underline"
                  style={{ color: display.s_color || '#64748b' }}
               >
                  Privacy Policy
               </a>
               <a 
                  href={display.terms_of_service_url || "#"}
                  className="text-xs hover:underline"
                  style={{ color: display.s_color || '#64748b' }}
               >
                  Terms of Service
               </a>
            </div>
         </div>
      </div>}
   </div>
   )
}

export default DonationLandingPage