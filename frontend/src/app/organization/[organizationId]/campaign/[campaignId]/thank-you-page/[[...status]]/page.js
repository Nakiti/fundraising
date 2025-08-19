"use client"
import { useState, useEffect } from "react"
import { getCampaignDetails, getThankYouPage } from "@/app/services/fetchService"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import { FaShare, FaHeart, FaCheckCircle } from "react-icons/fa"

const ThankYouPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            const displayResponse = await getThankYouPage(campaignId)
            setDisplay(displayResponse)
            console.log("asdasd", displayResponse)
         }
      }

      fetchData()
   }, [])

   return (
      <div 
         className="min-h-screen bg-cover bg-center flex flex-col" 
         style={{ 
            backgroundColor: display?.bg_color || '#f3f4f6',
            backgroundImage: display?.bg_image ? `url(${display.bg_image})` : 'none'
         }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}

         {display && (
            <div className="flex-1 flex items-center justify-center py-8 px-4">
               <div 
                  className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden"
                  style={{ 
                     backgroundColor: display.bg_color || '#ffffff',
                     borderRadius: display.cardRadius ? `${display.cardRadius}px` : '8px'
                  }}
               >
                  {/* Header Section */}
                  <div className="pt-10 px-10 pb-6 text-center">
                     <div className="mb-6">
                        <FaCheckCircle 
                           className="mx-auto text-6xl mb-4"
                           style={{ color: display.b1_color || '#10b981' }}
                        />
                     </div>
                     <h1 
                        className="text-3xl font-bold mb-4"
                        style={{ 
                           color: display.p_color || '#1f2937',
                           fontSize: display.heroTitleSize ? `${display.heroTitleSize}px` : '36px'
                        }}
                     >
                        {display.headline || "Thank You!"}
                     </h1>
                     <p 
                        className="text-lg leading-relaxed"
                        style={{ 
                           color: display.s_color || '#6b7280',
                           fontSize: display.bodyTextSize ? `${display.bodyTextSize}px` : '16px'
                        }}
                     >
                        {display.description || "Your generous donation has been received and will make a real difference in our mission. We're grateful for your support and commitment to creating positive change in our community."}
                     </p>
                     
                     {/* Share Section */}
                     <div className="flex justify-center items-center mt-6 space-x-4">
                        <p 
                           className="text-sm"
                           style={{ color: display.s_color || '#6b7280' }}
                        >
                           Share this campaign:
                        </p>
                        <button 
                           className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                           style={{ color: display.b1_color || '#3b82f6' }}
                        >
                           <FaShare className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  {/* Donation Information Section */}
                  <div 
                     className="px-10 py-8"
                     style={{ backgroundColor: display.bg_color ? `${display.bg_color}20` : '#f9fafb' }}
                  >
                     <h2 
                        className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200"
                        style={{ 
                           color: display.p_color || '#1f2937',
                           fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '20px'
                        }}
                     >
                        Donation Information
                     </h2>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#6b7280' }}
                           >
                              Amount Donated
                           </span>
                           <span 
                              className="font-semibold"
                              style={{ color: display.p_color || '#1f2937' }}
                           >
                              $0.00
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#6b7280' }}
                           >
                              Campaign
                           </span>
                           <span 
                              className="font-semibold"
                              style={{ color: display.p_color || '#1f2937' }}
                           >
                              {campaignDetails?.external_name || 'Campaign Name'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#6b7280' }}
                           >
                              Designation
                           </span>
                           <span 
                              className="font-semibold"
                              style={{ color: display.p_color || '#1f2937' }}
                           >
                              General Fund
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#6b7280' }}
                           >
                              Transaction Date
                           </span>
                           <span 
                              className="font-semibold"
                              style={{ color: display.p_color || '#1f2937' }}
                           >
                              {new Date().toLocaleDateString()}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Contact Section */}
                  <div className="px-10 py-8">
                     <h2 
                        className="text-xl font-semibold mb-4"
                        style={{ 
                           color: display.p_color || '#1f2937',
                           fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '20px'
                        }}
                     >
                        Questions or Comments?
                     </h2>
                     <p 
                        className="text-sm mb-2"
                        style={{ color: display.s_color || '#6b7280' }}
                     >
                        We'd love to hear from you! Contact us at:
                     </p>
                     <p 
                        className="text-sm font-medium"
                        style={{ color: display.b1_color || '#3b82f6' }}
                     >
                        support@organization.com
                     </p>
                  </div>

                  {/* CTA Section */}
                  <div className="px-10 pb-10 text-center">
                     <button 
                        className="px-8 py-3 text-white font-medium rounded-md hover:opacity-90 transition-colors duration-200"
                        style={{ 
                           backgroundColor: display.b1_color || '#3b82f6',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        onClick={() => window.history.back()}
                     >
                        Return to Campaign
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Footer */}
         <div 
            className="py-6 border-t border-gray-200"
            style={{ backgroundColor: display?.bg_color || '#f9fafb' }}
         >
            <div className="text-center">
               <p 
                  className="text-xs"
                  style={{ color: display?.s_color || '#6b7280' }}
               >
                  &copy; {new Date().getFullYear()} {campaignDetails?.external_name || 'Organization'}. All rights reserved.
               </p>
               <div className="mt-1 space-x-4">
                  <a 
                     href="#" 
                     className="text-xs hover:underline"
                     style={{ color: display?.s_color || '#6b7280' }}
                  >
                     Privacy Policy
                  </a>
                  <a 
                     href="#" 
                     className="text-xs hover:underline"
                     style={{ color: display?.s_color || '#6b7280' }}
                  >
                     Terms of Service
                  </a>
               </div>
            </div>
         </div>
      </div>      
   )
}

export default ThankYouPage