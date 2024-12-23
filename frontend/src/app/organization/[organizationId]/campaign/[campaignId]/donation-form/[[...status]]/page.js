"use client"
import { getCampaignDesignations, getCampaignDetails, getCustomQuestions, getDonationForm, getSingleDesignation } from "@/app/services/fetchService"
import { useState, useEffect } from "react"
import Link from "next/link"
import PreviewBar from "@/app/organization/[organizationId]/components/previewBar"

const DonationForm = ({params}) => {
   const [display, setDisplay] = useState(null)
   const [designations, setDesignations] = useState(null)
   const [campaignDetails, setCampaignDetails] = useState(null)
   const [defaultDesignation, setDefaultDesignation] = useState(null)
   const [selectedFund, setSelectedFund] = useState(null)
   const [customAmount, setCustomAmount] = useState(0)
   const [amount, setAmount] = useState(0)
   const [questions, setQuestions] = useState(null)

   const handleFundChange = (e) => {
      setSelectedFund(e.target.value)
      console.log(e.target.value)
      console.log(designations)
   }

   const handleAmountChange = (e) => {
      setAmount(e.target.value)
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
         className="w-full mb-4 mx-auto bg-gray-700 rounded-sm shadow-md overflow-y-auto" 
      >
         {status == "preview" && <PreviewBar organizationId={organizationId} campaignId={campaignId}/>}
         {display && <div className="px-6 py-4">
            <div className="bg-white p-6 rounded-sm w-2/3 mx-auto">
               <div className="text-gray-700">
                  <h1 className="text-2xl font-semibold mb-4">{display.headline || "This is the Heading"}</h1>
                  <p className="text-sm">{display.description || "This is the description"}</p>
               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div>
                  <h1 className="text-lg font-semibold mb-4">Giving Information</h1>
                  <div className="mt-2">
                     <h3 className="text-xs text-gray-700 font-semibold mb-2">I would like to give:</h3>
                     <div className="grid grid-cols-6 gap-2 w-full">
                        <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md" value={display.button1} onClick={handleAmountChange}>${display.button1}</button>
                        <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md" value={display.button2} onClick={handleAmountChange}>${display.button2}</button>
                        <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md" value={display.button3} onClick={handleAmountChange}>${display.button3}</button>
                        <button className="px-4 py-2 text-xs bg-gray-200 text-gray-700 rounded-md" value={display.button4} onClick={handleAmountChange}>${display.button4}</button>
                        <input className="px-4 py-2 col-span-2 text-xs border border-gray-200 text-gray-700 rounded-md" type="number" onChange={handleAmountChange} value={amount} placeholder="Enter Custom Amount"/>
                     </div>
                  </div>
                  <div className="mt-4">
                     <h3 className="text-xs text-gray-700 font-semibold mb-1">I would like to give to:</h3>
                     <select 
                        className="w-3/4 border text-sm border-gray-300 rounded-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
               <div>
                  <h1 className="text-lg font-semibold mb-4">Your Information</h1>
                  <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="First Name" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Last Name" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Email Address" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-4" placeholder="Street Address" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Zip Code" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="City" ></input>
                     <input className="p-2 text-xs border border-gray-300 bg-gray-50 col-span-2" placeholder="Phone Number" ></input>
                  </div>
               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div>
                  <h1 className="text-lg font-semibold mb-4">Campaign Questions</h1>
                  <div className="">
                  {questions &&
                     questions.map((item, index) => (
                        <div key={index} className="mb-4 flex flex-row items-center space-x-4">
                        <p className="text-sm text-gray-700">{item.question}</p>
                        {item.type === "checkbox" ? (
                           <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                           />
                        ) : item.type === "input" ? (
                           <input
                              type="text"
                              placeholder="Enter your response"
                              className="p-2 w-1/2 text-xs border border-gray-300 bg-gray-50"
                           />
                        ) : (
                           <textarea
                              rows={5}
                              placeholder="Enter your response"
                              className="w-3/4 border border-gray-300 text-xs py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           />
                        )}
                     </div>
                  ))}
               </div>

               </div>
               <div className="w-full border-gray-200 border my-6" />
               <div className="text-center flex flex-col mb-6">
                  <p className="text-lg">${amount}</p>
                  <p className="text-sm">
                     {designations && designations.length > 0  ? selectedFund && designations[selectedFund].title :
                        defaultDesignation && defaultDesignation.title
                     }
                  </p>
               </div>
               <div className="flex flex-col w-1/3 mx-auto space-y-2">
                  <button className="px-4 py-2 text-xs bg-yellow-400">Pay Pal</button>
                  <Link 
                     className="px-4 py-2 text-xs bg-blue-700 text-white text-center"
                     href={status ?
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/preview` :
                        `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`
                     }
                  >
                     Credit Card
                  </Link>
               </div>
            </div>
         </div>}
      </div>
   )
}

export default DonationForm

