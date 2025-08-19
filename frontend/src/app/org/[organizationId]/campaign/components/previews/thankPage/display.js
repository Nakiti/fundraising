import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { useContext } from "react"
import { FaCheckCircle, FaHeart, FaShare, FaEnvelope, FaPhone } from "react-icons/fa";

const Display = () => {
   const { thankPageInputs } = useContext(ThankYouPageContext)

   return (
      <div 
         className="bg-white w-full"
         style={{ 
            backgroundColor: thankPageInputs.bg_color || '#ffffff',
            backgroundImage: thankPageInputs.bg_image ? `url('${thankPageInputs.bg_image}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}
      >
         {/* Header */}
         <div className="bg-gray-900 w-full px-4 py-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-white text-sm font-medium">Thank You Page Preview</p>
               </div>
               <div className="flex items-center space-x-2 text-gray-400">
                  <span className="text-xs">Live Preview</span>
                  <div className="flex space-x-1">
                     <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Content Container */}
         <div className="relative">
            <div className="max-w-lg mx-auto px-4 py-8">
               {/* Success Card */}
               <div className="bg-white border border-gray-100 p-6 text-center shadow-sm" style={{borderRadius: thankPageInputs.cardRadius || '4px'}}>
                  {/* Success Icon */}
                  <div className="mx-auto w-12 h-12 bg-green-50 border border-green-100 flex items-center justify-center mb-4" style={{borderRadius: thankPageInputs.cardRadius || '4px'}}>
                     <FaCheckCircle className="text-green-600 text-xl" />
                  </div>

                  {/* Thank You Message */}
                  <h1 
                     className="font-bold mb-3 leading-tight"
                     style={{ 
                        color: thankPageInputs.p_color || '#1f2937',
                        fontSize: Math.min(parseInt(thankPageInputs.heroTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {thankPageInputs.headline || "Thank You!"}
                  </h1>
                  
                  <p 
                     className="leading-relaxed text-sm mb-6"
                     style={{ 
                        color: thankPageInputs.s_color || '#6b7280',
                        fontSize: Math.min(parseInt(thankPageInputs.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {thankPageInputs.description || "Your generous donation has been received and will make a real difference in our mission. We're incredibly grateful for your support!"}
                  </p>

                  {/* Transaction Summary */}
                  <div className="bg-gray-50 p-4 mb-6 text-left" style={{borderRadius: thankPageInputs.cardRadius || '4px'}}>
                     <h3 className="font-semibold mb-3 text-sm" style={{ color: thankPageInputs.p_color || '#1f2937' }}>Donation Summary</h3>
                     <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#6b7280' }}>Amount:</span>
                           <span className="font-semibold" style={{ color: thankPageInputs.p_color || '#1f2937' }}>$50.00</span>
                        </div>
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#6b7280' }}>Fund:</span>
                           <span className="font-semibold" style={{ color: thankPageInputs.p_color || '#1f2937' }}>General Fund</span>
                        </div>
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#6b7280' }}>Transaction ID:</span>
                           <span className="font-mono text-xs" style={{ color: thankPageInputs.s_color || '#6b7280' }}>TX-2024-001</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-3">
                           <div className="flex justify-between">
                              <span className="font-semibold" style={{ color: thankPageInputs.p_color || '#1f2937' }}>Total:</span>
                              <span className="font-bold" style={{ color: thankPageInputs.p_color || '#1f2937' }}>$50.00</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                     <button 
                        className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
                        style={{ 
                           backgroundColor: thankPageInputs.p_color || '#3b82f6',
                           borderRadius: thankPageInputs.buttonRadius || '4px',
                           fontSize: Math.min(parseInt(thankPageInputs.buttonTextSize) || 14, 16) + 'px'
                        }}
                     >
                        <FaHeart className="w-3 h-3" />
                        <span>Donate Again</span>
                     </button>
                     <button 
                        className="w-full py-3 px-4 font-semibold border border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2"
                        style={{ 
                           color: thankPageInputs.p_color || '#1f2937',
                           borderRadius: thankPageInputs.buttonRadius || '4px',
                           fontSize: Math.min(parseInt(thankPageInputs.buttonTextSize) || 14, 16) + 'px'
                        }}
                     >
                        <FaShare className="w-3 h-3" />
                        <span>Share This Campaign</span>
                     </button>
                  </div>

                  {/* Additional Information */}
                  <div className="text-left space-y-4">
                     <div>
                        <h4 className="font-semibold mb-2 text-sm" style={{ color: thankPageInputs.p_color || '#1f2937' }}>What happens next?</h4>
                        <p className="text-xs leading-relaxed" style={{ color: thankPageInputs.s_color || '#6b7280' }}>
                           You'll receive a confirmation email shortly. Your donation will be processed and you'll get updates on how your contribution is making a difference.
                        </p>
                     </div>
                     
                     <div>
                        <h4 className="font-semibold mb-2 text-sm" style={{ color: thankPageInputs.p_color || '#1f2937' }}>Need help?</h4>
                        <div className="flex items-center space-x-4 text-xs" style={{ color: thankPageInputs.s_color || '#6b7280' }}>
                           <div className="flex items-center space-x-1">
                              <FaEnvelope className="w-3 h-3" />
                              <span>support@example.org</span>
                           </div>
                           <div className="flex items-center space-x-1">
                              <FaPhone className="w-3 h-3" />
                              <span>(555) 123-4567</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Display