"use client"
import { getCampaignService, getPageService, getTransactionService } from "@/app/services"
import { useState, useEffect } from "react"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import { FaShare, FaHeart, FaCheckCircle, FaSpinner } from "react-icons/fa"
import { useSearchParams } from "next/navigation"

const ThankYouPage = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [transactionData, setTransactionData] = useState(null)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState("")

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const searchParams = useSearchParams()
   const transactionId = searchParams.get('transactionId')

   useEffect(() => {
      const fetchData = async() => {
         try {
            setLoading(true)
            setError("")
            
            const campaignService = getCampaignService();
            const pageService = getPageService();
            
            const campaignResponse = await campaignService.getCampaignWithDetails(campaignId)
            
            if (campaignResponse.data.status == "active" || status == "preview") {
               setCampaignDetails(campaignResponse.data)

               const displayResponse = await pageService.getThankYouPage(campaignId)
               setDisplay(displayResponse.data)
               
               // Fetch transaction data if transaction ID is provided
               if (transactionId) {
                  try {
                     const transactionService = getTransactionService();
                     const transactionResponse = await transactionService.getTransactionForThankYou(transactionId, campaignId)
                     setTransactionData(transactionResponse.data)
                  } catch (transactionError) {
                     console.error('Error fetching transaction data:', transactionError)
                     setError('Unable to load transaction details')
                  }
               }
            }
         } catch (err) {
            console.error('Error fetching thank you page data:', err)
            setError('Failed to load thank you page')
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [campaignId, status, transactionId])

   if (loading) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center">
               <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
               <p className="text-gray-600">Loading thank you page...</p>
            </div>
         </div>
      )
   }

   if (error && !display) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
               <div className="text-red-600 text-6xl mb-4">⚠️</div>
               <h2 className="text-xl font-semibold mb-2">Unable to Load Page</h2>
               <p className="text-gray-600 mb-4">{error}</p>
            </div>
         </div>
      )
   }

   return (
      <div 
         className="min-h-screen bg-cover bg-center flex flex-col" 
         style={{ 
            backgroundColor: display?.bgColor || '#f8fafc',
            backgroundImage: display?.bgImageUrl ? `url(${display.bgImageUrl})` : 'none'
         }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}

         {display && (
            <div className="flex-1 flex items-center justify-center py-12 px-4">
               <div 
                  className="w-full max-w-lg shadow-sm rounded-lg overflow-hidden"
                  style={{ 
                     backgroundColor: display.bgColor || '#ffffff',
                     borderRadius: '12px'
                  }}
               >
                  {/* Header Section */}
                  <div className="pt-8 px-6 pb-6 text-center">
                     <div className="mb-4">
                        <FaCheckCircle 
                           className="mx-auto text-4xl mb-4"
                           style={{ color: display.b1Color || '#10b981' }}
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
                           color: display.sColor || '#64748b',
                           fontSize: '14px'
                        }}
                     >
                        {display.description || "Your generous donation has been received and will make a real difference in our mission. We're grateful for your support and commitment to creating positive change in our community."}
                     </p>
                     
                     {/* Share Section */}
                     <div className="flex justify-center items-center mt-4 space-x-3">
                        <p 
                           className="text-xs"
                           style={{ color: display.sColor || '#64748b' }}
                        >
                           Share this campaign:
                        </p>
                        <button 
                           className="p-1.5 rounded-full hover:bg-slate-100 transition-all duration-200"
                           style={{ color: display.b1Color || '#475569' }}
                        >
                           <FaShare className="w-3 h-3" />
                        </button>
                     </div>
                  </div>

                  {/* Donation Information Section */}
                  <div 
                     className="px-6 py-6"
                     style={{ backgroundColor: display.bgColor ? `${display.bgColor}20` : '#f8fafc' }}
                  >
                     <h2 
                        className="text-lg font-semibold mb-3 pb-2 border-b border-slate-200"
                        style={{ 
                           color: display.pColor || '#1e293b',
                           fontSize: '18px'
                        }}
                     >
                        Donation Information
                     </h2>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.sColor || '#64748b' }}
                           >
                              Amount Donated
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.pColor || '#1e293b' }}
                           >
                              ${transactionData ? parseFloat(transactionData.amount).toFixed(2) : '0.00'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.sColor || '#64748b' }}
                           >
                              Campaign
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.pColor || '#1e293b' }}
                           >
                              {transactionData?.campaign_name || campaignDetails?.externalName || 'Campaign Name'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.sColor || '#64748b' }}
                           >
                              Designation
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.pColor || '#1e293b' }}
                           >
                              {transactionData?.designation_name || 'General Fund'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                           <span 
                              className="text-xs"
                              style={{ color: display.sColor || '#64748b' }}
                           >
                              Transaction Date
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ color: display.pColor || '#1e293b' }}
                           >
                              {transactionData ? new Date(transactionData.date).toLocaleDateString() : new Date().toLocaleDateString()}
                           </span>
                        </div>
                        {transactionData && (
                           <div className="flex justify-between items-center py-1.5">
                              <span 
                                 className="text-xs"
                                 style={{ color: display.sColor || '#64748b' }}
                              >
                                 Transaction ID
                              </span>
                              <span 
                                 className="font-semibold text-sm"
                                 style={{ color: display.pColor || '#1e293b' }}
                              >
                                 #{transactionData.id}
                              </span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Contact Section */}
                  <div className="px-6 py-6">
                     <h2 
                        className="text-lg font-semibold mb-3"
                        style={{ 
                           color: display.pColor || '#1e293b',
                           fontSize: '18px'
                        }}
                     >
                        Questions or Comments?
                     </h2>
                     <p 
                        className="text-xs mb-1"
                        style={{ color: display.sColor || '#64748b' }}
                     >
                        We'd love to hear from you! Contact us at:
                     </p>
                     <p 
                        className="text-xs font-medium"
                        style={{ color: display.b1Color || '#475569' }}
                     >
                        support@organization.com
                     </p>
                  </div>

                  {/* CTA Section */}
                  <div className="px-6 pb-8 text-center">
                     <button 
                        className="px-6 py-2.5 text-white font-medium rounded-md hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                        style={{ 
                           backgroundColor: display.b1Color || '#475569',
                           borderRadius: '6px'
                        }}
                        onClick={() => window.history.back()}
                     >
                        Return to Campaign
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>      
   )
}

export default ThankYouPage