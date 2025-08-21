"use client";
import { useContext } from "react";
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext";
import { FaCreditCard, FaPaypal, FaLock, FaHeart } from "react-icons/fa";

const Display = () => {
   const { donationFormInputs, customQuestions } = useContext(DonationFormContext)
   
   return (
      <div 
         className="bg-white w-full"
         style={{ 
            backgroundColor: donationFormInputs.bg_color || '#f8fafc',
            backgroundImage: donationFormInputs.bg_image ? `url('${donationFormInputs.bg_image}')` : 'none',
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
                  <p className="text-slate-100 text-sm font-medium">Donation Form Preview</p>
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
         <div>
            <div className={`max-w-xl mx-auto px-4 py-8 ${donationFormInputs.bg_image ? 'relative z-10' : ''}`}>
               {/* Header */}
               <div className="text-center mb-6">
                  <h1 
                     className="font-bold mb-3 leading-tight"
                     style={{ 
                        color: donationFormInputs.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(donationFormInputs.heroTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {donationFormInputs.headline || "Make a Donation"}
                  </h1>
                  <p 
                     className="leading-relaxed max-w-md mx-auto"
                     style={{ 
                        color: donationFormInputs.s_color || '#64748b',
                        fontSize: Math.min(parseInt(donationFormInputs.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {donationFormInputs.description || "Your generous contribution helps us continue our mission and make a positive impact in our community."}
                  </p>
               </div>

               {/* Main Form */}
               <div className="bg-white border border-slate-200 p-6 shadow-sm" style={{ borderRadius: donationFormInputs.cardRadius || '12px' }}>
                  {/* Donation Amount Section */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Choose Your Amount
                     </h2>
                     <div className="grid grid-cols-3 gap-2 mb-3">
                        {[donationFormInputs.button1, donationFormInputs.button2, donationFormInputs.button3, donationFormInputs.button4, donationFormInputs.button5].map((amount, index) => (
                           <button
                              key={index}
                              className="p-3 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 text-center"
                              style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                           >
                              <div className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>${amount || '25'}</div>
                           </button>
                        ))}
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-center text-sm"
                           placeholder="Custom"
                           style={{ 
                              gridColumn: 'span 2',
                              borderRadius: donationFormInputs.buttonRadius || '6px'
                           }}
                        />
                     </div>
                  </div>

                  {/* Fund Selection */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Select Fund
                     </h2>
                     <select 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 bg-white text-sm"
                        defaultValue=""
                        style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                     >
                        <option value="" disabled>Choose a fund</option>
                        <option value="general">General Fund</option>
                        <option value="emergency">Emergency Relief</option>
                        <option value="education">Education Fund</option>
                     </select>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Your Information
                     </h2>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="First Name"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="Last Name"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-3 text-sm"
                        placeholder="Email Address"
                        type="email"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                     />
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-3 text-sm"
                        placeholder="Street Address"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                     />
                     <div className="grid grid-cols-3 gap-3 mb-3">
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="City"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="State"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="ZIP Code"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                        placeholder="Phone Number"
                        type="tel"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                     />
                  </div>

                  {/* Custom Questions */}
                  {customQuestions && customQuestions.length > 0 && (
                     <div className="mb-6">
                        <h2 
                           className="font-semibold mb-3"
                           style={{ 
                              color: donationFormInputs.p_color || '#1e293b',
                              fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                           }}
                        >
                           Additional Questions
                        </h2>
                        <div className="space-y-3">
                           {customQuestions.map((question, index) => (
                              <div key={index}>
                                 <label className="block text-sm font-medium mb-1" style={{ color: donationFormInputs.p_color || '#1e293b' }}>
                                    {question.text}
                                 </label>
                                 <input 
                                    className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                                    placeholder="Your answer"
                                    style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Summary */}
                  <div className="bg-slate-50 p-4 mb-6" style={{ borderRadius: donationFormInputs.cardRadius || '8px' }}>
                     <h3 className="font-semibold mb-3 text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>Donation Summary</h3>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span style={{ color: donationFormInputs.s_color || '#64748b' }}>Amount:</span>
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>$25.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span style={{ color: donationFormInputs.s_color || '#64748b' }}>Fund:</span>
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>General Fund</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mt-3">
                           <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>Total:</span>
                              <span className="font-bold text-base" style={{ color: donationFormInputs.b1_color || '#475569' }}>$25.00</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Payment Method
                     </h2>
                     <div className="space-y-2">
                        <button 
                           className="w-full p-3 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '6px' }}
                        >
                           <FaPaypal className="text-blue-600 w-4 h-4" />
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>PayPal</span>
                        </button>
                        <button 
                           className="w-full p-3 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
                           style={{ 
                              borderRadius: donationFormInputs.buttonRadius || '6px',
                              borderColor: donationFormInputs.b1_color || '#475569'
                           }}
                        >
                           <FaCreditCard className="w-4 h-4" style={{ color: donationFormInputs.b1_color || '#475569' }} />
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1e293b' }}>Credit Card</span>
                        </button>
                     </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center space-x-2 mb-4" style={{ color: donationFormInputs.s_color || '#64748b' }}>
                     <FaLock className="text-emerald-600 w-3 h-3" />
                     <span className="text-xs">Your payment information is secure and encrypted</span>
                  </div>

                  {/* Submit Button */}
                  <button 
                     className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                     style={{ 
                        backgroundColor: donationFormInputs.b1_color || '#475569',
                        borderRadius: donationFormInputs.buttonRadius || '6px',
                        fontSize: Math.min(parseInt(donationFormInputs.buttonTextSize) || 14, 16) + 'px'
                     }}
                  >
                     <FaHeart className="w-3 h-3" />
                     <span>Complete Donation</span>
                  </button>
               </div>

               {/* Footer */}
               <div className="text-center mt-4">
                  <p className="text-xs" style={{ color: donationFormInputs.s_color || '#64748b' }}>
                     By making a donation, you agree to our Terms of Service and Privacy Policy
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display
