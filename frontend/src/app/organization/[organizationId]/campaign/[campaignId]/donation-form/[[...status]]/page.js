"use client"
import { getCampaignService, getPageService, getDesignationService, getDonorService, getCustomQuestionResponseService } from "@/app/services"
import { useState, useEffect } from "react"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"
import { FaArrowLeft, FaSpinner } from "react-icons/fa"
import PostDonationAccountModal from "@/app/components/PostDonationAccountModal"
import { useSearchParams } from "next/navigation"
import FormHeader from "./components/FormHeader"
import FormErrorAlert from "./components/FormErrorAlert"
import CampaignIndicator from "./components/CampaignIndicator"
import AmountSection from "./components/AmountSection"
import FundSelection from "./components/FundSelection"
import AnonymousOption from "./components/AnonymousOption"
import PersonalInfo from "./components/PersonalInfo"
import CustomQuestions from "./components/CustomQuestions"
import SummarySection from "./components/SummarySection"
import PaymentMethods from "./components/PaymentMethods"
import StripeSection from "./components/StripeSection"
import SecurityNote from "./components/SecurityNote"
import FormFooter from "./components/FormFooter"
import { validateDonationForm } from "@/app/utils/pageValidation"
import { useRouter } from "next/navigation"

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
   const [questionResponseErrors, setQuestionResponseErrors] = useState({})
   const [responseValidation, setResponseValidation] = useState({})
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
   const router = useRouter()

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
      // Update the response
      setQuestionResponses(prev => ({
         ...prev,
         [questionId]: response
      }))

      // Clear any existing error for this question
      setQuestionResponseErrors(prev => {
         const newErrors = { ...prev }
         delete newErrors[questionId]
         return newErrors
      })

      // Validate the response
      validateQuestionResponse(questionId, response)
   }

   const validateQuestionResponse = (questionId, response) => {
      if (!questions) return

      const question = questions.find(q => q.id === questionId)
      if (!question) return

      const errors = []
      let isValid = true

      // Check if response is required and empty
      if (question.required && (!response || response.toString().trim() === '')) {
         errors.push('This field is required')
         isValid = false
      }

      // Validate response length for text fields
      if (response && (question.type === 'text' || question.type === 'textarea')) {
         const maxLength = question.max_length || (question.type === 'text' ? 255 : 1000)
         if (response.length > maxLength) {
            errors.push(`Response must be ${maxLength} characters or less`)
            isValid = false
         }
      }

      // Validate email format if question type is email
      if (question.type === 'email' && response && response.trim() !== '') {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
         if (!emailRegex.test(response)) {
            errors.push('Please enter a valid email address')
            isValid = false
         }
      }

      // Update validation state
      setResponseValidation(prev => ({
         ...prev,
         [questionId]: {
            isValid,
            errors,
            lastValidated: new Date().toISOString()
         }
      }))

      // Update error state
      if (errors.length > 0) {
         setQuestionResponseErrors(prev => ({
            ...prev,
            [questionId]: errors
         }))
      }
   }

   const validateAllQuestionResponses = () => {
      if (!questions) return true

      let allValid = true
      const allErrors = {}

      questions.forEach(question => {
         const response = questionResponses[question.id]
         validateQuestionResponse(question.id, response)
         
         // Check if this question has validation errors
         const validation = responseValidation[question.id]
         if (validation && !validation.isValid) {
            allErrors[question.id] = validation.errors
            allValid = false
         }
      })

      setQuestionResponseErrors(allErrors)
      return allValid
   }

   const validateForm = () => {
      const { isValid, error: validationError } = validateDonationForm({
         amount,
         isAnonymous,
         formData,
         designations,
         selectedFund
      })
      if (!isValid) {
         setError(validationError || 'Invalid form values')
         return false
      }

      // Validate custom question responses
      const questionsValid = validateAllQuestionResponses()
      if (!questionsValid) {
         setError('Please fix the errors in the custom questions section')
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
            redirectToThankYou(paymentData.transactionData?.transactionId)
         }, 2000)
      }
   }

   const redirectToThankYou = (transactionId) => {
      const baseUrl = status ?
         `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
         `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
      
      const url = transactionId ? `${baseUrl}?transactionId=${transactionId}` : baseUrl
      router.push(url)
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
         const result = await getDonorService().convertGuestToRegistered(organizationId, {
            ...donorData,
            linkDonorIds: [] // This will be empty for post-donation flow
         })
         
         if (result) {
            // Account created successfully, redirect to thank you page
            setTimeout(() => {
               redirectToThankYou(lastDonationData?.transactionData?.transactionId)
            }, 1000)
         }
      } catch (error) {
         console.error('Error creating account:', error)
         // Still redirect to thank you page even if account creation fails
         setTimeout(() => {
            redirectToThankYou(lastDonationData?.transactionData?.transactionId)
         }, 1000)
      } finally {
         setCreatingAccount(false)
         setShowAccountModal(false)
      }
   }

   const handleSkipAccount = () => {
      setShowAccountModal(false)
      setTimeout(() => {
         redirectToThankYou(lastDonationData?.transactionData?.transactionId)
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
            
            const campaignService = getCampaignService();
            const designationService = getDesignationService();
            const pageService = getPageService();
            
            // Fetch campaign details and organization designations concurrently
            const [campaignResponse, orgDesignationsResponse] = await Promise.all([
               campaignService.getCampaignDetails(campaignId),
               designationService.getDesignationsByOrganization(organizationId)
            ])
            
            if (campaignResponse.data.status == "active" || status == "preview") {
               setCampaignDetails(campaignResponse.data)
               console.log("Organization designations:", orgDesignationsResponse)
               setOrganizationDesignations(orgDesignationsResponse.data)

               if (orgDesignationsResponse && orgDesignationsResponse.data.length > 0) {
                  // Organization has designations, proceed with campaign setup
                  // Prepare concurrent requests
                  const concurrentRequests = [
                     pageService.getDonationForm(campaignId),
                     designationService.getDesignationsByCampaign(campaignId),
                     campaignService.getCustomQuestions(campaignId)
                  ]

                  // Add default designation request if needed
                  if (campaignResponse.data.default_designation != 0) {
                     concurrentRequests.push(designationService.getDefaultDesignation(campaignResponse.data.id))
                  }

                  // Execute all requests concurrently
                  const responses = await Promise.all(concurrentRequests)
                  
                  // Extract responses
                  const [displayResponse, designationResponse, questionsResponse, defaultDesignationResponse] = responses
                  
                  setDisplay(displayResponse.data)
                  setDesignations(designationResponse.data)
                  console.log("Questions:", questionsResponse)
                  setQuestions(questionsResponse)
                  
                  if (defaultDesignationResponse) {
                     console.log("Default designation:", defaultDesignationResponse)
                     setDefaultDesignation(defaultDesignationResponse.data)
                  }
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
         {display &&  <div className="px-4 py-8">
            <div className={`max-w-2xl mx-auto ${display.bg_image ? 'relative z-10' : ''}`}>


               {/* Header */}
               <FormHeader display={display} />

               {/* Error Display */}
               <FormErrorAlert error={error} />

                  {/* Main Form */}
                  <div 
                     className="bg-white border border-slate-200 p-8 shadow-sm"
                     style={{ borderRadius: display.cardRadius ? `${display.cardRadius}px` : '12px' }}
                  >
                     {/* Campaign Indicator */}
                     {campaignDetails && (
                        <CampaignIndicator campaignDetails={campaignDetails} display={display} />
                     )}
                  {/* Donation Amount Section */}
                  <AmountSection 
                    display={display}
                    selectedAmount={selectedAmount}
                    customAmount={customAmount}
                    onAmountClick={handleAmountChange}
                    onCustomAmountChange={handleCustomAmountChange}
                  />

                  {/* Fund Selection */}
                  <FundSelection 
                    display={display}
                    selectedFund={selectedFund}
                    designations={designations}
                    organizationDesignations={organizationDesignations}
                    defaultDesignation={defaultDesignation}
                    onChange={handleFundChange}
                  />

                  {/* Anonymous Donation Option */}
                  <AnonymousOption 
                    display={display}
                    isAnonymous={isAnonymous}
                    onChange={setIsAnonymous}
                  />

                  {/* Personal Information */}
                  <PersonalInfo 
                    display={display}
                    isAnonymous={isAnonymous}
                    formData={formData}
                    onChange={handleFormDataChange}
                  />

                  {/* Custom Questions */}
                  {questions && <CustomQuestions 
                    display={display}
                    questions={questions}
                    responses={questionResponses}
                    responseErrors={questionResponseErrors}
                    responseValidation={responseValidation}
                    onResponse={handleQuestionResponse}
                  />}

                  {/* Summary */}
                  <SummarySection 
                    display={display}
                    campaignDetails={campaignDetails}
                    amount={amount}
                    selectedFund={selectedFund}
                    designations={designations}
                    organizationDesignations={organizationDesignations}
                    defaultDesignation={defaultDesignation}
                  />

                  {/* Payment Methods or Stripe Checkout */}
                  {!showStripePayment ? (
                    <PaymentMethods display={display} onCreditCardClick={handleCreditCardClick} />
                  ) : (
                    <StripeSection 
                      display={display}
                      amount={amount}
                      campaignId={campaignId}
                      organizationId={organizationId}
                      formData={formData}
                      selectedFund={selectedFund}
                      designations={designations}
                      organizationDesignations={organizationDesignations}
                      defaultDesignation={defaultDesignation}
                      isAnonymous={isAnonymous}
                      questionResponses={questionResponses}
                      questions={questions}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onBack={() => setShowStripePayment(false)}
                    />
                  )}

                  {paymentSuccess && (
                     <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        ✅ Payment successful! Redirecting to thank you page...
                     </div>
                  )}

                  {/* Security Notice */}
                  <SecurityNote display={display} />
               </div>

               {/* Footer */}
               <FormFooter display={display} />
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

