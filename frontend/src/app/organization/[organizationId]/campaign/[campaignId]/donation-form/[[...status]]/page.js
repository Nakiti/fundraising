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

            const defaultDesignationResponse = await getSingleDesignation(campaignResponse.default_designation)
            setDefaultDesignation(defaultDesignationResponse)
            console.log(defaultDesignationResponse)

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
         style={{ backgroundColor: display?.bg_color || '#f3f4f6' }}
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
         {display && <div className="px-6 py-4">
            <div 
               className="p-6 mx-auto max-w-2xl"
               style={{ 
                  backgroundColor: display.bg_color || '#ffffff',
                  borderRadius: display.cardRadius ? `${display.cardRadius}px` : '4px'
               }}
            >
               {/* Header */}
               <div className="text-center mb-8">
                  <h1 
                     className="font-bold mb-4 leading-tight"
                     style={{ 
                        color: display.p_color || '#1f2937',
                        fontSize: display.heroTitleSize ? `${display.heroTitleSize}px` : '36px'
                     }}
                  >
                     {display.headline || "Make a Donation"}
                  </h1>
                  <p 
                     className="leading-relaxed"
                     style={{ 
                        color: display.s_color || '#6b7280',
                        fontSize: display.bodyTextSize ? `${display.bodyTextSize}px` : '16px'
                     }}
                  >
                     {display.description || "Your generous contribution helps us continue our mission and make a positive impact in our community."}
                  </p>
               </div>

               <div className="w-full border-gray-200 border my-6" />

               {/* Giving Information */}
               <div>
                  <h2 
                     className="text-lg font-semibold mb-4"
                     style={{ 
                        color: display.p_color || '#1f2937',
                        fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '20px'
                     }}
                  >
                     Giving Information
                  </h2>
                  <div className="mt-2">
                     <h3 
                        className="text-xs font-semibold mb-2"
                        style={{ color: display.s_color || '#6b7280' }}
                     >
                        I would like to give:
                     </h3>
                     <div className="grid grid-cols-6 gap-2 w-full">
                        <button 
                           className={`px-4 py-2 text-xs rounded-md transition-colors duration-200 ${
                              amount === display.button1 ? 'text-white' : 'text-gray-700'
                           }`}
                           style={{ 
                              backgroundColor: amount === display.button1 ? (display.b1_color || '#3b82f6') : '#f3f4f6',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           onClick={() => handleAmountChange(display.button1)}
                        >
                           ${display.button1}
                        </button>
                        <button 
                           className={`px-4 py-2 text-xs rounded-md transition-colors duration-200 ${
                              amount === display.button2 ? 'text-white' : 'text-gray-700'
                           }`}
                           style={{ 
                              backgroundColor: amount === display.button2 ? (display.b1_color || '#3b82f6') : '#f3f4f6',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           onClick={() => handleAmountChange(display.button2)}
                        >
                           ${display.button2}
                        </button>
                        <button 
                           className={`px-4 py-2 text-xs rounded-md transition-colors duration-200 ${
                              amount === display.button3 ? 'text-white' : 'text-gray-700'
                           }`}
                           style={{ 
                              backgroundColor: amount === display.button3 ? (display.b1_color || '#3b82f6') : '#f3f4f6',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           onClick={() => handleAmountChange(display.button3)}
                        >
                           ${display.button3}
                        </button>
                        <button 
                           className={`px-4 py-2 text-xs rounded-md transition-colors duration-200 ${
                              amount === display.button4 ? 'text-white' : 'text-gray-700'
                           }`}
                           style={{ 
                              backgroundColor: amount === display.button4 ? (display.b1_color || '#3b82f6') : '#f3f4f6',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           onClick={() => handleAmountChange(display.button4)}
                        >
                           ${display.button4}
                        </button>
                        <button 
                           className={`px-4 py-2 text-xs rounded-md transition-colors duration-200 ${
                              amount === display.button5 ? 'text-white' : 'text-gray-700'
                           }`}
                           style={{ 
                              backgroundColor: amount === display.button5 ? (display.b1_color || '#3b82f6') : '#f3f4f6',
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           onClick={() => handleAmountChange(display.button5)}
                        >
                           ${display.button5}
                        </button>
                        <input 
                           className="px-4 py-2 col-span-1 text-xs border border-gray-300 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                           style={{ 
                              borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                           }}
                           type="number" 
                           onChange={handleCustomAmountChange} 
                           value={customAmount} 
                           placeholder="Custom"
                        />
                     </div>
                  </div>
                  <div className="mt-4">
                     <h3 
                        className="text-xs font-semibold mb-1"
                        style={{ color: display.s_color || '#6b7280' }}
                     >
                        I would like to give to:
                     </h3>
                     <select 
                        className="w-3/4 border text-sm border-gray-300 rounded-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        defaultValue="select"
                        onChange={handleFundChange}
                     >
                        <option value="select" disabled>Select a Designation</option>
                        {designations && designations.length > 0 ?
                         designations.map((item, index) => {
                           return <option key={item.id} value={index}>{item.title}</option>
                        }) :
                        defaultDesignation && <option className="text-sm" value={defaultDesignation.id}>{defaultDesignation.title}</option>
                        }
                     </select>
                  </div>
               </div>

               <div className="w-full border-gray-200 border my-6" />

               {/* Your Information */}
               <div>
                  <h2 
                     className="text-lg font-semibold mb-4"
                     style={{ 
                        color: display.p_color || '#1f2937',
                        fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '20px'
                     }}
                  >
                     Your Information
                  </h2>
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleFormDataChange('firstName', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleFormDataChange('lastName', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => handleFormDataChange('email', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={(e) => handleFormDataChange('address', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="Zip Code"
                        value={formData.zipCode}
                        onChange={(e) => handleFormDataChange('zipCode', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleFormDataChange('city', e.target.value)}
                     />
                     <input 
                        className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ 
                           borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                        }}
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => handleFormDataChange('phone', e.target.value)}
                     />
                  </div>
               </div>

               {/* Campaign Questions */}
               {questions && questions.length > 0 && (
                  <>
                     <div className="w-full border-gray-200 border my-6" />
                     <div>
                        <h2 
                           className="text-lg font-semibold mb-4"
                           style={{ 
                              color: display.p_color || '#1f2937',
                              fontSize: display.sectionTitleSize ? `${display.sectionTitleSize}px` : '20px'
                           }}
                        >
                           Campaign Questions
                        </h2>
                        <div className="">
                        {questions.map((item, index) => (
                           <div key={index} className="mb-4 flex flex-row items-center space-x-4">
                           <p 
                              className="text-sm"
                              style={{ color: display.s_color || '#6b7280' }}
                           >
                              {item.question}
                           </p>
                           {item.type === "checkbox" ? (
                              <input
                                 type="checkbox"
                                 className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                 style={{ 
                                    accentColor: display.b1_color || '#3b82f6'
                                 }}
                              />
                           ) : item.type === "input" ? (
                              <input
                                 type="text"
                                 placeholder="Enter your response"
                                 className="p-2 w-1/2 text-xs border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 style={{ 
                                    borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                                 }}
                              />
                           ) : (
                              <textarea
                                 rows={5}
                                 placeholder="Enter your response"
                                 className="w-3/4 border border-gray-300 text-xs py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                 style={{ 
                                    borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                                 }}
                              />
                           )}
                        </div>
                     ))}
                  </div>
                  </div>
                  </>
               )}

               <div className="w-full border-gray-200 border my-6" />

               {/* Summary */}
               <div className="text-center flex flex-col mb-6">
                  <p 
                     className="text-lg font-semibold"
                     style={{ color: display.p_color || '#1f2937' }}
                  >
                     ${amount.toFixed(2)}
                  </p>
                  <p 
                     className="text-sm"
                     style={{ color: display.s_color || '#6b7280' }}
                  >
                     {designations && designations.length > 0  ? selectedFund && designations[selectedFund].title :
                        defaultDesignation && defaultDesignation.title
                     }
                  </p>
               </div>

               {/* Payment Buttons */}
               <div className="flex flex-col w-1/3 mx-auto space-y-2">
                  <button 
                     className="px-4 py-2 text-xs bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 rounded-md"
                     style={{ 
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                     }}
                  >
                     <FaPaypal className="inline mr-1" />
                     PayPal
                  </button>
                  <Link 
                     className="px-4 py-2 text-xs text-white text-center hover:opacity-90 transition-colors duration-200 rounded-md"
                     style={{ 
                        backgroundColor: display.b1_color || '#3b82f6',
                        borderRadius: display.buttonRadius ? `${display.buttonRadius}px` : '4px'
                     }}
                     href={status ?
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
                     }
                  >
                     <FaCreditCard className="inline mr-1" />
                     Credit Card
                  </Link>
               </div>

               {/* Security Notice */}
               <div className="text-center mt-4">
                  <p 
                     className="text-xs"
                     style={{ color: display.s_color || '#6b7280' }}
                  >
                     <FaLock className="inline mr-1" />
                     Your payment information is secure and encrypted
                  </p>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default DonationForm

