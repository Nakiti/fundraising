"use client"
import { getCampaignDesignations, getCampaignDetails, getCustomQuestions, getDonationForm, getSingleDesignation, DesignationService } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import { FaCreditCard, FaPaypal, FaLock, FaHeart, FaArrowLeft, FaSpinner } from "react-icons/fa"
import StripeCheckout from "@/app/components/StripeCheckout"
import PostDonationAccountModal from "@/app/components/PostDonationAccountModal"
import { useSearchParams } from "next/navigation"
import { DonorCreateService } from "@/app/services/donorServices"

const DonationForm = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [defaultDesignation, setDefaultDesignation] = useState(null)
   const [selectedFund, setSelectedFund] = useState(null)
   const [organizationDesignations, setOrganizationDesignations] = useState(null)
   const [noDesignationsError, setNoDesignationsError] = useState(false)
   const [selectedAmount, setSelectedAmount] = useState(null)
   const [customAmount, setCustomAmount] = useState("")
   const [amount, setAmount] = useState(0)
   const [questions, setQuestions] = useState(null)
   const [questionResponses, setQuestionResponses] = useState({})
   const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      zipCode: "",
      city: "",
      phone: ""
   })
   const [isAnonymous, setIsAnonymous] = useState(false)
   const [showStripePayment, setShowStripePayment] = useState(false)
   const [paymentSuccess, setPaymentSuccess] = useState(false)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState("")
   const searchParams = useSearchParams()
   const [showAccountModal, setShowAccountModal] = useState(false)
   const [creatingAccount, setCreatingAccount] = useState(false)
   const [lastDonationData, setLastDonationData] = useState(null)

   const handleFundChange = (e) => {
      const value = e.target.value
      if (value === "select") {
         setSelectedFund(null)
      } else {
         setSelectedFund(parseInt(value))
      }
   }

   const handleAmountChange = (value) => {
      setSelectedAmount(value)
      setAmount(parseFloat(value) || 0)
      setCustomAmount("")
   }

   const handleCustomAmountChange = (e) => {
      const value = e.target.value
      setCustomAmount(value)
      setSelectedAmount(null)
      setAmount(parseFloat(value) || 0)
   }

   const handleFormDataChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }))
   }

   const handleQuestionResponse = (questionId, response) => {
      setQuestionResponses(prev => ({
         ...prev,
         [questionId]: response
      }))
   }

   const validateForm = () => {
      if (amount <= 0) {
         setError('Please select a donation amount')
         return false
      }
      
      // If not anonymous, require donor information
      if (!isAnonymous) {
         if (!formData.firstName.trim()) {
            setError('Please enter your first name')
            return false
         }
         
         if (!formData.lastName.trim()) {
            setError('Please enter your last name')
            return false
         }
         
         if (!formData.email.trim()) {
            setError('Please enter your email address')
            return false
         }
         
         // Basic email validation
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
         if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return false
         }
      } else {
         // For anonymous donations, only require email for receipt
         if (!formData.email.trim()) {
            setError('Please enter your email address for donation receipt')
            return false
         }
         
         // Basic email validation
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
         if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address')
            return false
         }
      }

      // Check if fund selection is required and selected
      if (designations && designations.length > 0 && selectedFund === null) {
         setError('Please select a fund')
         return false
      }

      setError("")
      return true
   }

   const handlePaymentSuccess = (paymentData) => {
      setPaymentSuccess(true)
      setLastDonationData(paymentData)
      console.log('Payment successful:', paymentData)
      
      // Show account creation modal for non-anonymous donations
      if (!isAnonymous && formData.email) {
         setTimeout(() => {
            setShowAccountModal(true)
         }, 1500)
      } else {
         // Redirect directly to thank you page for anonymous donations
         setTimeout(() => {
            redirectToThankYou()
         }, 2000)
      }
   }

   const redirectToThankYou = () => {
      window.location.href = status ?
         `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
         `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
   }

   const handleCreateAccount = async (password) => {
      try {
         setCreatingAccount(true)
         
         const donorData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: password,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
         }
         
         // Try to convert guest donor (will handle both guest conversion and new registration)
         const result = await DonorCreateService.convertGuestToRegistered(organizationId, {
            ...donorData,
            linkDonorIds: [] // This will be empty for post-donation flow
         })
         
         if (result) {
            // Account created successfully, redirect to thank you page
            setTimeout(() => {
               redirectToThankYou()
            }, 1000)
         }
      } catch (error) {
         console.error('Error creating account:', error)
         // Still redirect to thank you page even if account creation fails
         setTimeout(() => {
            redirectToThankYou()
         }, 1000)
      } finally {
         setCreatingAccount(false)
         setShowAccountModal(false)
      }
   }

   const handleSkipAccount = () => {
      setShowAccountModal(false)
      setTimeout(() => {
         redirectToThankYou()
      }, 500)
   }

   const handlePaymentError = (error) => {
      console.error('Payment failed:', error)
      setShowStripePayment(false)
      setError('Payment failed. Please try again.')
   }

   const handleCreditCardClick = () => {
      if (!validateForm()) {
         return
      }
      setShowStripePayment(true)
   }

   const status = params.status
   const campaignId = params.campaignId
   const organizationId = params.organizationId

   useEffect(() => {
      const fetchData = async() => {
         try {
            setLoading(true)
            setError("")
            setNoDesignationsError(false)
            
            const campaignResponse = await getCampaignDetails(campaignId)
            
            if (campaignResponse.status == "active" || status == "preview") {
               setCampaignDetails(campaignResponse)

               // First, check if organization has any designations
               const orgDesignationsResponse = await DesignationService.getAllDesignations(organizationId)
               setOrganizationDesignations(orgDesignationsResponse)

               if (orgDesignationsResponse && orgDesignationsResponse.length > 0) {
                  // Organization has designations, proceed with campaign setup
                  if (campaignResponse.default_designation != 0) {
                     const defaultDesignationResponse = await getSingleDesignation(campaignResponse.default_designation)
                     setDefaultDesignation(defaultDesignationResponse)
                  }

                  const displayResponse = await getDonationForm(campaignId)
                  setDisplay(displayResponse)

                  const designationResponse = await getCampaignDesignations(campaignId)
                  setDesignations(designationResponse)

                  const questionsResponse = await getCustomQuestions(campaignId)
                  setQuestions(questionsResponse)
               } else {
                  // No organization designations exist
                  setNoDesignationsError(true)
               }
            } else {
               setError("This campaign is not active")
            }
         } catch (err) {
            console.error('Error fetching donation form data:', err)
            setError('Failed to load donation form. Please try again.')
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [campaignId, status, organizationId])

   // Handle URL parameter for pre-selecting amount
   useEffect(() => {
      const amountParam = searchParams.get('amount')
      if (amountParam && display) {
         const paramAmount = parseInt(amountParam)
         if (paramAmount > 0) {
            // Check if the amount matches one of the preset buttons
            const presetAmounts = [display.button1, display.button2, display.button3, display.button4, display.button5]
            if (presetAmounts.includes(paramAmount)) {
               // Pre-select the matching button
               setSelectedAmount(paramAmount)
               setAmount(paramAmount)
               setCustomAmount("")
            } else {
               // Set as custom amount
               setSelectedAmount(null)
               setCustomAmount(paramAmount.toString())
               setAmount(paramAmount)
            }
         }
      }
   }, [searchParams, display])

   if (loading) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center">
               <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
               <p className="text-gray-600">Loading donation form...</p>
            </div>
         </div>
      )
   }

   if (error && !display) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
               <div className="text-red-600 text-6xl mb-4">⚠️</div>
               <h2 className="text-xl font-semibold mb-2">Unable to Load Form</h2>
               <p className="text-gray-600 mb-4">{error}</p>
               <Link 
                  href={`/organization/${organizationId}/campaigns`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
               >
                  <FaArrowLeft className="mr-2" />
                  Back to Campaigns
               </Link>
            </div>
         </div>
      )
   }

   if (noDesignationsError) {
      return (
         <div className="w-full min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
               <div className="text-blue-600 text-6xl mb-4">📋</div>
               <h2 className="text-xl font-semibold mb-2">Designations Required</h2>
               <p className="text-gray-600 mb-4">
                  This campaign requires designations to be set up before donations can be accepted. 
                  Please create at least one designation for your organization.
               </p>
               <div className="space-y-3">
                  <Link 
                     href={`/org/${organizationId}/dashboard/settings/designations`}
                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                     Manage Available Designations
                  </Link>
                  <div>
                     <Link 
                        href={`/organization/${organizationId}/campaigns`}
                        className="text-sm text-gray-500 hover:text-gray-700"
                     >
                        ← Back to Campaigns
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      )
   }

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
            <div className={`max-w-2xl mx-auto ${display.bg_image ? 'relative z-10' : ''}`}>
               {/* Campaign Banner */}
               {/* {campaignDetails && (
                  <div 
                     className="mb-6 p-4 rounded-lg border"
                     style={{ 
                        backgroundColor: display.c_color || '#ffffff',
                        borderColor: display.b1_color || '#475569',
                        borderRadius: display.cardRadius ? `${display.cardRadius}px` : '8px'
                     }}
                  >
                     <div className="text-center">
                        <h2 
                           className="font-semibold mb-1"
                           style={{ 
                              color: display.p_color || '#1e293b',
                              fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                           }}
                        >
                           {campaignDetails.external_name || 'Campaign'}
                        </h2>
                        {campaignDetails.organization_name && (
                           <p 
                              className="text-sm"
                              style={{ color: display.s_color || '#64748b' }}
                           >
                              {campaignDetails.organization_name}
                           </p>
                        )}
                     </div>
                  </div>
               )} */}

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

               {/* Error Display */}
               {error && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                     {error}
                  </div>
               )}

                                 {/* Main Form */}
                  <div 
                     className="bg-white border border-slate-200 p-8 shadow-sm"
                     style={{ borderRadius: display.cardRadius ? `${display.cardRadius}px` : '12px' }}
                  >
                     {/* Campaign Indicator */}
                     {campaignDetails && (
                        <div className="mb-4 pb-3 border-b border-slate-100">
                           <div className="flex items-center justify-center space-x-2">
                              <div 
                                 className="w-2 h-2 rounded-full"
                                 style={{ backgroundColor: display.b1_color || '#475569' }}
                              ></div>
                              <span 
                                 className="text-xs font-medium"
                                 style={{ color: display.s_color || '#64748b' }}
                              >
                                 Donating to: {campaignDetails.external_name || 'Campaign'}
                              </span>
                              <div 
                                 className="w-2 h-2 rounded-full"
                                 style={{ backgroundColor: display.b1_color || '#475569' }}
                              ></div>
                           </div>
                        </div>
                     )}
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
                     <div className="grid grid-cols-3 gap-3 mb-4">
                        {[display.button1, display.button2, display.button3, display.button4, display.button5, display.button6].map((buttonAmount, index) => {
                           const isSelected = selectedAmount === buttonAmount
                           return (
                              <button
                                 key={index}
                                 className={`p-4 border transition-all duration-200 text-center ${
                                    isSelected ? 'border-2' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                 }`}
                                 style={{ 
                                    borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                                    borderColor: isSelected ? (display.b1_color || '#475569') : undefined,
                                    backgroundColor: isSelected ? `${display.b1_color || '#475569'}15` : undefined
                                 }}
                                 onClick={() => handleAmountChange(buttonAmount)}
                              >
                                 <div 
                                    className="font-semibold text-lg"
                                    style={{ 
                                       color: isSelected ? (display.b1_color || '#475569') : (display.p_color || '#1e293b'),
                                       fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px'
                                    }}
                                 >
                                    ${buttonAmount || '25'}
                                 </div>
                              </button>
                           )
                        })}
                        <input 
                           className={`p-4 border focus:outline-none transition-all duration-200 text-center text-lg ${
                              customAmount ? 'border-2' : 'border-slate-200 focus:border-slate-300'
                           }`}
                           placeholder="Custom Amount"
                           type="number"
                           min="1"
                           step="0.01"
                           value={customAmount}
                           onChange={handleCustomAmountChange}
                           style={{ 
                              gridColumn: 'span 3',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 16, 18) + 'px',
                              borderColor: customAmount ? (display.b1_color || '#475569') : undefined,
                              backgroundColor: customAmount ? `${display.b1_color || '#475569'}15` : undefined,
                              color: customAmount ? (display.b1_color || '#475569') : undefined
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
                        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 bg-white text-base"
                        value={selectedFund !== null ? selectedFund : "select"}
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
                        organizationDesignations && organizationDesignations.length > 0 ?
                         organizationDesignations.map((item, index) => {
                           return <option key={item.id} value={index}>{item.title}</option>
                        }) :
                        defaultDesignation && <option value={defaultDesignation.id}>{defaultDesignation.title}</option>
                        }
                     </select>
                  </div>

                  {/* Anonymous Donation Option */}
                  <div className="mb-6">
                     <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                        <input
                           type="checkbox"
                           id="anonymous"
                           checked={isAnonymous}
                           onChange={(e) => setIsAnonymous(e.target.checked)}
                           className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
                           style={{ 
                              accentColor: display.b1_color || '#475569'
                           }}
                        />
                        <label 
                           htmlFor="anonymous"
                           className="text-sm font-medium cursor-pointer"
                           style={{ 
                              color: display.p_color || '#1e293b',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        >
                           Make this donation anonymous
                        </label>
                     </div>
                     {isAnonymous && (
                        <p 
                           className="text-xs mt-2"
                           style={{ color: display.s_color || '#64748b' }}
                        >
                           Your donation will appear as "Anonymous Donor" on public pages, but your information will still be available to the organization for tax receipts and records.
                        </p>
                     )}
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
                        {isAnonymous ? 'Contact Information (for receipt)' : 'Your Information'}
                     </h2>
                     {!isAnonymous && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <input 
                              className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
                              placeholder="First Name *"
                              value={formData.firstName}
                              onChange={(e) => handleFormDataChange('firstName', e.target.value)}
                              style={{ 
                                 borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           />
                           <input 
                              className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
                              placeholder="Last Name *"
                              value={formData.lastName}
                              onChange={(e) => handleFormDataChange('lastName', e.target.value)}
                              style={{ 
                                 borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                                 fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                              }}
                           />
                        </div>
                     )}
                     <input 
                        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-4 text-base"
                        placeholder={isAnonymous ? "Email Address (for receipt) *" : "Email Address *"}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFormDataChange('email', e.target.value)}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     />
                     <input 
                        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 mb-4 text-base"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={(e) => handleFormDataChange('address', e.target.value)}
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                           fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                        }}
                     />
                     <div className="grid grid-cols-3 gap-4 mb-4">
                        <input 
                           className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
                           placeholder="City"
                           value={formData.city}
                           onChange={(e) => handleFormDataChange('city', e.target.value)}
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                        <input 
                           className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
                           placeholder="State"
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px',
                              fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                           }}
                        />
                        <input 
                           className="p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
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
                        className="w-full p-4 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-base"
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
                                       checked={questionResponses[item.id] || false}
                                       onChange={(e) => handleQuestionResponse(item.id, e.target.checked)}
                                       style={{ 
                                          accentColor: display.b1_color || '#475569'
                                       }}
                                    />
                                 ) : item.type === "input" ? (
                                    <input
                                       type="text"
                                       placeholder="Enter your response"
                                       className="w-full p-3 border border-slate-200 focus:border-slate-300 focus:outline-none transition-all duration-200 text-sm"
                                       value={questionResponses[item.id] || ""}
                                       onChange={(e) => handleQuestionResponse(item.id, e.target.value)}
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
                                       value={questionResponses[item.id] || ""}
                                       onChange={(e) => handleQuestionResponse(item.id, e.target.value)}
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
                        {campaignDetails && (
                           <div className="flex justify-between items-center">
                              <span 
                                 className="text-sm"
                                 style={{ color: display.s_color || '#64748b' }}
                              >
                                 Campaign:
                              </span>
                              <span 
                                 className="font-semibold text-sm text-right"
                                 style={{ 
                                    color: display.p_color || '#1e293b',
                                    fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                 }}
                              >
                                 {campaignDetails.external_name || 'Campaign'}
                              </span>
                           </div>
                        )}
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
                              {designations && designations.length > 0  ? 
                                 (selectedFund !== null ? designations[selectedFund]?.title : 'Please select a fund') :
                                 organizationDesignations && organizationDesignations.length > 0 ?
                                 (selectedFund !== null ? organizationDesignations[selectedFund]?.title : 'Please select a fund') :
                                 (defaultDesignation ? defaultDesignation.title : 'General Fund')
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

                  {/* Payment Methods or Stripe Checkout */}
                  {!showStripePayment ? (
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
                        <div className="space-y-3">
                           <button 
                              className="w-full p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2 opacity-50 cursor-not-allowed"
                              style={{ borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '6px' }}
                              disabled
                           >
                              <FaPaypal className="text-blue-600 w-4 h-4" />
                              <span 
                                 className="font-semibold text-sm"
                                 style={{ 
                                    color: display.p_color || '#1e293b',
                                    fontSize: Math.min(parseInt(display.bodyTextSize) || 14, 16) + 'px'
                                 }}
                              >
                                 PayPal (Coming Soon)
                              </span>
                           </button>
                           <button 
                              onClick={handleCreditCardClick}
                              className="w-full p-4 border border-slate-200 hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
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
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                           <h2 
                              className="font-semibold"
                              style={{ 
                                 color: display.p_color || '#1e293b',
                                 fontSize: Math.min(parseInt(display.sectionTitleSize) || 16, 18) + 'px'
                              }}
                           >
                              Payment Information
                           </h2>
                           <button
                              onClick={() => setShowStripePayment(false)}
                              className="text-sm text-gray-600 hover:text-gray-800"
                           >
                              ← Back to payment methods
                           </button>
                        </div>
                        <StripeCheckout
                           amount={amount}
                           campaignId={campaignId}
                           organizationId={organizationId}
                           donorData={formData}
                           designationId={selectedFund !== null ? 
                              (designations && designations.length > 0 ? designations[selectedFund]?.id : 
                               organizationDesignations && organizationDesignations.length > 0 ? organizationDesignations[selectedFund]?.id : null) : 
                              defaultDesignation?.id}
                           isAnonymous={isAnonymous}
                           onSuccess={handlePaymentSuccess}
                           onError={handlePaymentError}
                        />
                     </div>
                  )}

                  {paymentSuccess && (
                     <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        ✅ Payment successful! Redirecting to thank you page...
                     </div>
                  )}

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

         {/* Post-donation account creation modal */}
         <PostDonationAccountModal
            isOpen={showAccountModal}
            onClose={handleSkipAccount}
            donorEmail={formData.email}
            donorName={`${formData.firstName} ${formData.lastName}`}
            donationAmount={amount}
            organizationId={organizationId}
            onCreateAccount={handleCreateAccount}
            loading={creatingAccount}
         />
      </div>
   )
}

export default DonationForm

