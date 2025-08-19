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
         style={{ backgroundColor: display?.bg_color || '#ffffff' }}
      >
      {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
      {display && <div>
         {/* Hero Section */}
         <div className="relative w-full">
            <img
               src={display.banner_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"}
               alt="Campaign Banner"
               className="w-full object-cover bg-gray-50"
               style={{
                  height: display.heroHeight ? `${display.heroHeight}px` : "70vh"
               }}
            />
            {/* Overlay */}
            <div 
               className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-8 px-6"
               style={{
                  backgroundColor: `rgba(0, 0, 0, ${display.overlayOpacity || 0.3})`
               }}
            >
               <div className="max-w-4xl mx-auto space-y-6">
                  <h1 
                     className="font-bold text-white leading-tight"
                     style={{
                        color: display.p_color || '#ffffff',
                        fontSize: display.heroTitleSize ? `${display.heroTitleSize}px` : '36px'
                     }}
                  >
                     {display.headline || "Support Our Cause"}
                  </h1>
                  <p 
                     className="text-gray-100 max-w-3xl mx-auto leading-relaxed"
                     style={{
                        color: display.s_color || '#e5e7eb',
                        fontSize: display.heroSubtitleSize ? `${display.heroSubtitleSize}px` : '16px'
                     }}
                  >
                     {display.description || "Your support makes a real difference in our community. Every donation, no matter the size, helps us achieve our mission and create positive change for those who need it most."}
                  </p>
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="w-3/4 mx-auto relative flex flex-row mb-8 space-x-6 pt-2">
            <div className="w-full mt-8">
               {/* Header Section */}
               <div className="flex flex-row justify-between mb-10 w-11/12">
                  <div>
                     <p 
                        className="text-md"
                        style={{ color: display.s_color || '#6b7280' }}
                     >
                        {display.subtitle || "Fundraiser"}
                     </p>
                     <h1 
                        className="text-4xl font-semibold"
                        style={{ 
                           color: display.p_color || '#1f2937',
                           fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '28px'
                        }}
                     >
                        {display.headline || "Headline"}
                     </h1>
                  </div>
                  <button 
                     className="text-md hover:underline"
                     style={{ color: display.b1_color || '#3b82f6' }}
                  >
                     <FaShare className="inline mr-1" />
                     Share
                  </button>
               </div>

               {/* Progress Section */}
               <div className="mb-12 flex flex-row w-full items-center space-x-8">
                  <div className="w-3/4">
                     <p 
                        className="text-xl mb-3"
                        style={{ color: display.p_color || '#1f2937' }}
                     >
                        ${amountRaised.toLocaleString()} raised of ${campaignDetails?.goal?.toLocaleString() || '0'} goal
                     </p>
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                        <div 
                           className="h-3 rounded-full transition-all duration-500"
                           style={{ 
                              backgroundColor: display.b1_color || '#3b82f6',
                              width: `${progressPercentage}%`
                           }}
                        ></div>
                     </div>
                     <p 
                        className="text-sm"
                        style={{ color: display.s_color || '#6b7280' }}
                     >
                        {donorCount} donors have supported this campaign
                     </p>
                  </div>
                  <div className="w-1/12">
                     <Link 
                        href={status ? 
                           `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview` :
                           `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                        }
                        className="px-10 py-2 text-lg text-white rounded-md transition-colors duration-200 hover:opacity-90"
                        style={{ 
                           backgroundColor: display.b1_color || '#3b82f6',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                     >
                        Donate
                     </Link>
                  </div>
               </div>

               {/* About Section */}
               <div 
                  className="space-y-4 py-4 mt-8 border-t border-gray-200 pt-12"
                  style={{ paddingTop: display.sectionPadding ? `${display.sectionPadding}px` : '80px' }}
               >
                  <h2 
                     className="text-3xl text-center mb-6"
                     style={{ 
                        color: display.p_color || '#1f2937',
                        fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '28px'
                     }}
                  >
                     About
                  </h2>
                  <pre 
                     className="text-md w-3/4 mx-auto text-wrap whitespace-pre-wrap"
                     style={{ 
                        color: display.s_color || '#6b7280',
                        fontSize: display.bodyTextSize ? `${display.bodyTextSize}px` : '16px'
                     }}
                  >
                     {display.description || display.mainText || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </pre>
               </div>

               {/* CTA Section */}
               <div className="flex justify-center items-center mt-8 mx-auto">
                  <Link 
                     href={status ? 
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/preview` :
                        `/organization/${organizationId}/campaign/${campaignId}/donation-form/`
                     }
                     className="w-1/5 py-3 text-center text-white rounded-md shadow-md hover:opacity-90 transition-colors duration-200"
                     style={{ 
                        backgroundColor: display.b1_color || '#3b82f6',
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                     }}
                  >
                     Donate Now
                  </Link>
               </div>
            </div>
         </div>
      </div>}
   </div>
   )
}

export default DonationLandingPage