import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { useContext } from "react"
import { FaCheckCircle, FaHeart, FaShare, FaEnvelope, FaPhone } from "react-icons/fa";

const Display = () => {
   const { thankPageInputs } = useContext(ThankYouPageContext)

   return (
      <div 
         className="bg-white w-full"
         style={{ 
            backgroundColor: thankPageInputs.bg_color || '#f8fafc',
            backgroundImage: thankPageInputs.bg_image ? `url('${thankPageInputs.bg_image}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}
      >
         {/* Header */}
         <div className="bg-slate-800 w-full px-4 py-3">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-slate-100 text-sm font-medium">Thank You Page Preview</p>
               </div>
               <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-xs font-medium">Live Preview</span>
                  <div className="flex space-x-1">
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                     <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>

         {/* Content Container */}
         <div className="relative">
            <div className="max-w-lg mx-auto px-4 py-12">
               {/* Success Card */}
               <div className="bg-white border border-slate-200 p-6 text-center shadow-sm" style={{borderRadius: thankPageInputs.cardRadius || '12px'}}>
                  {/* Success Icon */}
                  <div className="mx-auto w-12 h-12 bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4" style={{borderRadius: thankPageInputs.cardRadius || '12px'}}>
                     <FaCheckCircle className="text-emerald-600 text-xl" />
                  </div>

                  {/* Thank You Message */}
                  <h1 
                     className="font-bold mb-3 leading-tight"
                     style={{ 
                        color: thankPageInputs.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(thankPageInputs.heroTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {thankPageInputs.headline || "Thank You!"}
                  </h1>
                  
                  <p 
                     className="leading-relaxed max-w-md mx-auto mb-6"
                     style={{ 
                        color: thankPageInputs.s_color || '#64748b',
                        fontSize: Math.min(parseInt(thankPageInputs.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {thankPageInputs.description || "Your generous donation has been received and will make a real difference in our mission. We're incredibly grateful for your support!"}
                  </p>

                  {/* Transaction Summary */}
                  <div className="bg-slate-50 p-4 mb-6 text-left" style={{borderRadius: thankPageInputs.cardRadius || '8px'}}>
                     <h3 className="font-semibold mb-3 text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>Donation Summary</h3>
                     <div className="space-y-2">
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#64748b' }}>Amount:</span>
                           <span className="font-semibold text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>$50.00</span>
                        </div>
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#64748b' }}>Fund:</span>
                           <span className="font-semibold text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>General Fund</span>
                        </div>
                        <div className="flex justify-between">
                           <span style={{ color: thankPageInputs.s_color || '#64748b' }}>Transaction ID:</span>
                           <span className="font-mono text-xs" style={{ color: thankPageInputs.s_color || '#64748b' }}>TX-2024-001</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mt-3">
                           <div className="flex justify-between">
                              <span className="font-semibold text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>Total:</span>
                              <span className="font-bold text-base" style={{ color: thankPageInputs.p_color || '#1e293b' }}>$50.00</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                     <button 
                        className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                        style={{ 
                           backgroundColor: thankPageInputs.p_color || '#475569',
                           borderRadius: thankPageInputs.buttonRadius || '6px',
                           fontSize: Math.min(parseInt(thankPageInputs.buttonTextSize) || 14, 16) + 'px'
                        }}
                     >
                        <FaHeart className="w-3 h-3" />
                        <span>Donate Again</span>
                     </button>
                     <button 
                        className="w-full py-3 px-4 font-semibold border border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2"
                        style={{ 
                           color: thankPageInputs.p_color || '#1e293b',
                           borderRadius: thankPageInputs.buttonRadius || '6px',
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
                        <h4 className="font-semibold mb-2 text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>What happens next?</h4>
                        <p className="text-xs leading-relaxed" style={{ color: thankPageInputs.s_color || '#64748b' }}>
                           You'll receive a confirmation email shortly. Your donation will be processed and you'll get updates on how your contribution is making a difference.
                        </p>
                     </div>
                     
                     <div>
                        <h4 className="font-semibold mb-2 text-sm" style={{ color: thankPageInputs.p_color || '#1e293b' }}>Need help?</h4>
                        <div className="flex items-center space-x-4 text-xs" style={{ color: thankPageInputs.s_color || '#64748b' }}>
                           <div className="flex items-center space-x-1.5">
                              <FaEnvelope className="w-3 h-3" />
                              <span>support@example.org</span>
                           </div>
                           <div className="flex items-center space-x-1.5">
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