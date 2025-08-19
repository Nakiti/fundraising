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
            backgroundColor: donationFormInputs.bg_color || '#ffffff',
            backgroundImage: donationFormInputs.bg_image ? `url('${donationFormInputs.bg_image}')` : 'none',
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
                  <p className="text-white text-sm font-medium">Donation Form Preview</p>
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
         <div>
            <div className={`max-w-xl mx-auto px-4 py-6 ${donationFormInputs.bg_image ? 'relative z-10' : ''}`}>
               {/* Header */}
               <div className="text-center mb-6">
                  <h1 
                     className="font-bold mb-3 leading-tight"
                     style={{ 
                        color: donationFormInputs.p_color || '#1f2937',
                        fontSize: Math.min(parseInt(donationFormInputs.heroTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {donationFormInputs.headline || "Make a Donation"}
                  </h1>
                  <p 
                     className="leading-relaxed text-sm"
                     style={{ 
                        color: donationFormInputs.s_color || '#6b7280',
                        fontSize: Math.min(parseInt(donationFormInputs.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {donationFormInputs.description || "Your generous contribution helps us continue our mission and make a positive impact in our community."}
                  </p>
               </div>

               {/* Main Form */}
               <div className="bg-white border border-gray-100 p-4" style={{ borderRadius: donationFormInputs.cardRadius || '4px' }}>
                  {/* Donation Amount Section */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1f2937',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Choose Your Amount
                     </h2>
                     <div className="grid grid-cols-3 gap-2 mb-3">
                        {[donationFormInputs.button1, donationFormInputs.button2, donationFormInputs.button3, donationFormInputs.button4, donationFormInputs.button5].map((amount, index) => (
                           <button
                              key={index}
                              className="p-3 border border-gray-200 hover:border-gray-300 transition-colors duration-200 text-center"
                              style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                           >
                              <div className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>${amount || '25'}</div>
                           </button>
                        ))}
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-center text-sm"
                           placeholder="Custom"
                           style={{ 
                              gridColumn: 'span 2',
                              borderRadius: donationFormInputs.buttonRadius || '4px'
                           }}
                        />
                     </div>
                  </div>

                  {/* Fund Selection */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1f2937',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Select Fund
                     </h2>
                     <select 
                        className="w-full p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 bg-white text-sm"
                        defaultValue=""
                        style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
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
                           color: donationFormInputs.p_color || '#1f2937',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Your Information
                     </h2>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                           placeholder="First Name"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        />
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                           placeholder="Last Name"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 mb-3 text-sm"
                        placeholder="Email Address"
                        type="email"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                     />
                     <input 
                        className="w-full p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 mb-3 text-sm"
                        placeholder="Street Address"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                     />
                     <div className="grid grid-cols-3 gap-3 mb-3">
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                           placeholder="City"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        />
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                           placeholder="State"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        />
                        <input 
                           className="p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                           placeholder="ZIP Code"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                        placeholder="Phone Number"
                        type="tel"
                        style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                     />
                  </div>

                  {/* Custom Questions */}
                  {customQuestions && customQuestions.length > 0 && (
                     <div className="mb-6">
                        <h2 
                           className="font-semibold mb-3"
                           style={{ 
                              color: donationFormInputs.p_color || '#1f2937',
                              fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                           }}
                        >
                           Additional Questions
                        </h2>
                        <div className="space-y-3">
                           {customQuestions.map((question, index) => (
                              <div key={index}>
                                 <label className="block text-xs font-medium mb-1" style={{ color: donationFormInputs.p_color || '#1f2937' }}>
                                    {question.text}
                                 </label>
                                 <input 
                                    className="w-full p-3 border border-gray-200 focus:border-gray-300 focus:outline-none transition-colors duration-200 text-sm"
                                    placeholder="Your answer"
                                    style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Summary */}
                  <div className="bg-gray-50 p-4 mb-6" style={{ borderRadius: donationFormInputs.cardRadius || '4px' }}>
                     <h3 className="font-semibold mb-3 text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>Donation Summary</h3>
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-xs" style={{ color: donationFormInputs.s_color || '#6b7280' }}>Amount:</span>
                        <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>$25.00</span>
                     </div>
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-xs" style={{ color: donationFormInputs.s_color || '#6b7280' }}>Fund:</span>
                        <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>General Fund</span>
                     </div>
                     <div className="border-t border-gray-200 pt-2 mt-3">
                        <div className="flex justify-between items-center">
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>Total:</span>
                           <span className="font-bold text-sm" style={{ color: donationFormInputs.b1_color || '#3b82f6' }}>$25.00</span>
                        </div>
                     </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: donationFormInputs.p_color || '#1f2937',
                           fontSize: Math.min(parseInt(donationFormInputs.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Payment Method
                     </h2>
                     <div className="space-y-2">
                        <button 
                           className="w-full p-3 border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2"
                           style={{ borderRadius: donationFormInputs.buttonRadius || '4px' }}
                        >
                           <FaPaypal className="text-blue-600 w-4 h-4" />
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>PayPal</span>
                        </button>
                        <button 
                           className="w-full p-3 border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2"
                           style={{ 
                              borderRadius: donationFormInputs.buttonRadius || '4px',
                              borderColor: donationFormInputs.b1_color || '#3b82f6'
                           }}
                        >
                           <FaCreditCard className="w-4 h-4" style={{ color: donationFormInputs.b1_color || '#3b82f6' }} />
                           <span className="font-semibold text-sm" style={{ color: donationFormInputs.p_color || '#1f2937' }}>Credit Card</span>
                        </button>
                     </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center space-x-2 text-xs mb-4" style={{ color: donationFormInputs.s_color || '#6b7280' }}>
                     <FaLock className="text-green-600 w-3 h-3" />
                     <span>Your payment information is secure and encrypted</span>
                  </div>

                  {/* Submit Button */}
                  <button 
                     className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2"
                     style={{ 
                        backgroundColor: donationFormInputs.b1_color || '#3b82f6',
                        borderRadius: donationFormInputs.buttonRadius || '4px',
                        fontSize: Math.min(parseInt(donationFormInputs.buttonTextSize) || 14, 16) + 'px'
                     }}
                  >
                     <FaHeart className="w-3 h-3" />
                     <span>Complete Donation</span>
                  </button>
               </div>

               {/* Footer */}
               <div className="text-center mt-4">
                  <p className="text-xs" style={{ color: donationFormInputs.s_color || '#6b7280' }}>
                     By making a donation, you agree to our Terms of Service and Privacy Policy
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display
