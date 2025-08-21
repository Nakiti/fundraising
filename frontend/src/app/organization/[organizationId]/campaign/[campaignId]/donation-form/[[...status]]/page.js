"use client"
import { getCampaignDesignations, getCampaignDetails, getCustomQuestions, getDonationForm, getSingleDesignation } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import { FaCreditCard, FaPaypal, FaLock, FaHeart, FaArrowLeft } from "react-icons/fa"

const DonationForm = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [defaultDesignation, setDefaultDesignation] = useState(null)
   const [selectedFund, setSelectedFund] = useState(null)
   const [customAmount, setCustomAmount] = useState("")
   const [amount, setAmount] = useState(0)
   const [questions, setQuestions] = useState(null)
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      zipCode: "",
      city: "",
      phone: ""
   })

   const handleFundChange = (e) => {
      setSelectedFund(e.target.value)
      console.log(e.target.value)
      console.log(designations)
   }

   const handleAmountChange = (value) => {
      setAmount(value)
      setCustomAmount("")
   }

   const handleCustomAmountChange = (e) => {
      const value = e.target.value
      setCustomAmount(value)
      setAmount(parseFloat(value) || 0)
   }

   const handleFormDataChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }))
   }

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaignDetails(campaignResponse)

            console.log(campaignResponse)

            if (campaignResponse.default_designation != 0) {
               const defaultDesignationResponse = await getSingleDesignation(campaignResponse.default_designation)
               setDefaultDesignation(defaultDesignationResponse)
               console.log(defaultDesignationResponse)
            }

            const displayResponse = await getDonationForm(campaignId)
            setDisplay(displayResponse)

            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)
            console.log(designationResponse)

            const questionsResponse = await getCustomQuestions(campaignId)
            setQuestions(questionsResponse)
            console.log(questionsResponse)
         }
      }

      fetchData()
   }, [])

   return (
      <div 
         className="w-full mb-4 mx-auto overflow-y-auto" 
         style={{ 
            backgroundColor: display?.bg_color || '#f8fafc',
            backgroundImage: display?.bg_image ? `url('${display.bg_image}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
         }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
         {display && <div className="px-4 py-8">
            <div className={`max-w-xl mx-auto ${display.bg_image ? 'relative z-10' : ''}`}>
               {/* Header */}
               <div className="text-center mb-6">
                  <h1 
                     className="font-bold mb-3 leading-tight"
                     style={{ 
                        color: display.p_color || '#1e293b',
                        fontSize: Math.min(parseInt(display.heroTitleSize) || 24, 28) + 'px'
                     }}
                  >
                     {display.headline || "Make a Donation"}
                  </h1>
                  <p 
                     className="leading-relaxed max-w-md mx-auto"
                     style={{ 
                        color: display.s_color || '#64748b',
                        fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                     }}
                  >
                     {display.description || "Your generous contribution helps us continue our mission and make a positive impact in our community."}
                  </p>
               </div>

               {/* Main Form */}
               <div 
                  className="bg-white border border-slate-200 p-6 shadow-sm"
                  style={{ borderRadius: display.cardRadius ? `${display.cardRadius}px` : '12px' }}
               >
                  {/* Donation Amount Section */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Choose Your Amount
                     </h2>
                     <div className="grid grid-cols-3 gap-2 mb-3">
                        {[display.button1, display.button2, display.button3, display.button4, display.button5].map((amount, index) => (
                           <button
                              key={index}
                              className={`p-3 border transition-all duration-200 text-center ${
                                 amount === display.button1 ? 'border-slate-300' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                              }`}
                              style={{ borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px' }}
                              onClick={() => handleAmountChange(amount)}
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
                           </button>
                        ))}
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-center text-sm"
                           placeholder="Custom"
                           type="number"
                           value={customAmount}
                           onChange={handleCustomAmountChange}
                           style={{ 
                              gridColumn: 'span 2',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                     </div>
                  </div>

                  {/* Fund Selection */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Select Fund
                     </h2>
                     <select 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 bg-white text-sm"
                        defaultValue="select"
                        onChange={handleFundChange}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     >
                        <option value="select" disabled>Choose a fund</option>
                        {designations && designations.length > 0 ?
                         designations.map((item, index) => {
                           return <option key={item.id} value={index}>{item.title}</option>
                        }) :
                        defaultDesignation && <option value={defaultDesignation.id}>{defaultDesignation.title}</option>
                        }
                     </select>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Your Information
                     </h2>
                     <div className="grid grid-cols-2 gap-3 mb-3">
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="First Name"
                           value={formData.firstName}
                           onChange={(e) => handleFormDataChange('firstName', e.target.value)}
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="Last Name"
                           value={formData.lastName}
                           onChange={(e) => handleFormDataChange('lastName', e.target.value)}
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-3 text-sm"
                        placeholder="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormDataChange('email', e.target.value)}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     />
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-3 text-sm"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={(e) => handleFormDataChange('address', e.target.value)}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     />
                     <div className="grid grid-cols-3 gap-3 mb-3">
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="City"
                           value={formData.city}
                           onChange={(e) => handleFormDataChange('city', e.target.value)}
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="State"
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                        <input 
                           className="p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                           placeholder="ZIP Code"
                           value={formData.zipCode}
                           onChange={(e) => handleFormDataChange('zipCode', e.target.value)}
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                     </div>
                     <input 
                        className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                        placeholder="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormDataChange('phone', e.target.value)}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     />
                  </div>

                  {/* Custom Questions */}
                  {questions && questions.length > 0 && (
                     <div className="mb-6">
                        <h2 
                           className="font-semibold mb-3"
                           style={{ 
                              color: display.p_color || '#1e293b',
                              fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                           }}
                        >
                           Additional Questions
                        </h2>
                        <div className="space-y-3">
                           {questions.map((item, index) => (
                              <div key={index}>
                                 <label 
                                    className="block text-sm font-medium mb-1"
                                    style={{ 
                                       color: display.p_color || '#1e293b',
                                       fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                    }}
                                 >
                                    {item.question}
                                 </label>
                                 {item.type === "checkbox" ? (
                                    <input
                                       type="checkbox"
                                       className="w-4 h-4 rounded focus:ring-2 focus:ring-slate-500"
                                       style={{ 
                                          accentColor: display.b1_color || '#475569'
                                       }}
                                    />
                                 ) : item.type === "input" ? (
                                    <input
                                       type="text"
                                       placeholder="Enter your response"
                                       className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                                       style={{ 
                                          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                                          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                       }}
                                    />
                                 ) : (
                                    <textarea
                                       rows={3}
                                       placeholder="Enter your response"
                                       className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 resize-none text-sm"
                                       style={{ 
                                          borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                                          fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                       }}
                                    />
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Summary */}
                  <div 
                     className="bg-slate-50 p-4 mb-6"
                     style={{ borderRadius: display.cardRadius ? `${display.cardRadius}px` : '8px' }}
                  >
                     <h3 
                        className="font-semibold mb-3 text-sm"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Donation Summary
                     </h3>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Amount:
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              ${amount.toFixed(2)}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span 
                              className="text-sm"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              Fund:
                           </span>
                           <span 
                              className="font-semibold text-sm"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              {designations && designations.length > 0  ? selectedFund && designations[selectedFund].title :
                                 defaultDesignation && defaultDesignation.title
                              }
                           </span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mt-3">
                           <div className="flex justify-between items-center">
                              <span 
                                 className="font-semibold text-sm"
                                 style={{ 
                                    color: display.p_color || '#1e293b',
                                    fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                 }}
                              >
                                 Total:
                              </span>
                              <span 
                                 className="font-bold text-base"
                                 style={{ 
                                    color: display.b1_color || '#475569',
                                    fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                 }}
                              >
                                 ${amount.toFixed(2)}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                     <h2 
                        className="font-semibold mb-3"
                        style={{ 
                           color: display.p_color || '#1e293b',
                           fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                        }}
                     >
                        Payment Method
                     </h2>
                     <div className="space-y-2">
                        <button 
                           className="w-full p-3 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
                           style={{ borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px' }}
                        >
                           <FaPaypal className="text-blue-600 w-4 h-4" />
                           <span 
                              className="font-semibold text-sm"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              PayPal
                           </span>
                        </button>
                        <Link 
                           href={status ?
                              `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
                              `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
                           }
                           className="w-full p-3 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              borderColor: display.b1_color || '#475569'
                           }}
                        >
                           <FaCreditCard className="w-4 h-4" style={{ color: display.b1_color || '#475569' }} />
                           <span 
                              className="font-semibold text-sm"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           >
                              Credit Card
                           </span>
                        </Link>
                     </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center space-x-2 mb-4">
                     <FaLock className="text-emerald-600 w-3 h-3" />
                     <span 
                        className="text-xs"
                        style={{ color: display.s_color || '#64748b' }}
                     >
                        Your payment information is secure and encrypted
                     </span>
                  </div>

                  {/* Submit Button */}
                  <Link 
                     href={status ?
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
                     }
                     className="w-full py-3 px-4 font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-md transform hover:-translate-y-0.5"
                     style={{ 
                        backgroundColor: display.b1_color || '#475569',
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                        fontSize: Math.min(parseInt(display.buttonTextSize) || 14, 16) + 'px'
                     }}
                  >
                     <FaHeart className="w-3 h-3" />
                     <span>Complete Donation</span>
                  </Link>
               </div>

               {/* Footer */}
               <div className="text-center mt-4">
                  <p 
                     className="text-xs"
                     style={{ color: display.s_color || '#64748b' }}
                  >
                     By making a donation, you agree to our Terms of Service and Privacy Policy
                  </p>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default DonationForm

