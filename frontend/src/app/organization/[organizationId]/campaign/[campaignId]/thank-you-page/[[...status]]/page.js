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
            backgroundColor: display?.bg_color || '#f8fafc',
            backgroundImage: display?.bg_image ? `url(${display.bg_image})` : 'none'
         }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}

         {display && (
            <div className="flex-1 flex items-center justify-center py-12 px-4">
               <div 
                  className="w-full max-w-lg shadow-sm rounded-lg overflow-hidden"
                  style={{ 
                     backgroundColor: display.bg_color || '#ffffff',
                     borderRadius: display.cardRadius ? `${display.cardRadius}px` : '12px'
                  }}
               >
                  {/* Header Section */}
                  <div className="pt-8 px-6 pb-6 text-center">
                     <div className="mb-4">
                        <FaCheckCircle 
                           className="mx-auto text-4xl mb-4"
                           style={{ color: display.b1_color || '#10b981' }}
                        />
                     </div>
                     <h1 
                        className="text-2xl font-bold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: display.heroTitleSize ? `${display.heroTitleSize}px` : '28px'
                        }}
                     >
                        {display.headline || "Thank You!"}
                     </h1>
                     <p 
                        className="text-sm leading-relaxed max-w-md mx-auto"
                        style={{ 
                           color: display.s_color || '#64748b',
                           fontSize: display.bodyTextSize ? `${display.bodyTextSize}px` : '14px'
                        }}
                     >
                        {display.description || "Your generous donation has been received and will make a real difference in our mission. We're grateful for your support and commitment to creating positive change in our community."}
                     </p>
                     
                     {/* Share Section */}
                     <div className="flex justify-center items-center mt-4 space-x-3">
                        <p 
                           className="text-xs"
                           style={{ color: display.s_color || '#64748b' }}
                        >
                           Share this campaign:
                        </p>
                        <button 
                           className="p-1.5 rounded-full hover:bg-slate-100 transition-all duration-200"
                           style={{ color: display.b1_color || '#475569' }}
                        >
                           <FaShare className="w-3 h-3" />
                        </button>
                     </div>
                  </div>

                  {/* Donation Information Section */}
                  <div 
                     className="px-6 py-6"
                     style={{ backgroundColor: display.bg_color ? `${display.bg_color}20` : '#f8fafc' }}
                  >
                     <h2 
                        className="text-lg font-semibold mb-3 pb-2 border-b border-slate-200"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '18px'
                        }}
                     >
                        Donation Information
                     </h2>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Amount Donated
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.p_color || '#1e293b' }}
                           >
                              $0.00
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Campaign
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.p_color || '#1e293b' }}
                           >
                              {campaignDetails?.external_name || 'Campaign Name'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Designation
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.p_color || '#1e293b' }}
                           >
                              General Fund
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Transaction Date
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.p_color || '#1e293b' }}
                           >
                              {new Date().toLocaleDateString()}
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Contact Section */}
                  <div className="px-6 py-6">
                     <h2 
                        className="text-lg font-semibold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '18px'
                        }}
                     >
                        Questions or Comments?
                     </h2>
                     <p 
                        className="text-xs mb-1"
                        style={{ color: display.s_color || '#64748b' }}
                     >
                        We'd love to hear from you! Contact us at:
                     </p>
                     <p 
                        className="text-xs font-medium"
                        style={{ color: display.b1_color || '#475569' }}
                     >
                        support@organization.com
                     </p>
                  </div>

                  {/* CTA Section */}
                  <div className="px-6 pb-8 text-center">
                     <button 
                        className="px-6 py-2.5 text-white font-medium rounded-md hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                        style={{ 
                           backgroundColor: display.b1_color || '#475569',
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px'
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
            className="py-4 border-t border-slate-200"
            style={{ backgroundColor: display?.bg_color || '#f8fafc' }}
         >
            <div className="text-center">
               <p 
                  className="text-xs"
                  style={{ color: display?.s_color || '#64748b' }}
               >
                  &copy; {new Date().getFullYear()} {campaignDetails?.external_name || 'Organization'}. All rights reserved.
               </p>
               <div className="mt-1 space-x-3">
                  <a 
                     href="#" 
                     className="text-xs hover:underline"
                     style={{ color: display?.s_color || '#64748b' }}
                  >
                     Privacy Policy
                  </a>
                  <a 
                     href="#" 
                     className="text-xs hover:underline"
                     style={{ color: display?.s_color || '#64748b' }}
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