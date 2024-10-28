"use client"
import { getCampaignDesignations, getCampaignDetails, getCampaignPreview } from "@/app/services/fetchService"
import { useState, useEffect, useContext } from "react"
import { CgProfile } from "react-icons/cg"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useFormInput from "@/app/hooks/useFormInput"
import { DonationContext } from "@/app/context/donationContext"
import ErrorModal from "@/app/components/errorModal"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const [campaign, setCampaign] = useState(null)
   const [display, setDisplay] = useState(null)
   const router = useRouter()
   const currentPath = router.asPath
   const [designations, setDesignations] = useState(null)
   const {donations, setDonations} = useContext(DonationContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("Please Fill All Donation Fields")


   const [donationInfo, handleDonationInfoChange, setDonationInfo] = useFormInput({
      id: new Date(),
      campaignId: campaignId,
      organizationId: organizationId,
      amount: 0,
      designationId: 0,
      designationTitle: "",
      campaignTitle: campaign ? campaign.title : "",
      campaignImage: display ? display.image : ""
   })

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)

         if (organizationId == campaignResponse.organization_id && campaignResponse.status == "active") {
            setCampaign(campaignResponse)
            setDonationInfo(prev => ({
               ...prev,
               campaignTitle: campaignResponse.title
            }))


            const displayResponse = await getCampaignPreview(campaignId)
            setDisplay(displayResponse)
            setDonationInfo(prev => ({
               ...prev,
               campaignImage: displayResponse.image
            }))

            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)
         }
      }

      fetchData()
   }, [])



   const handleDesignationChange = (e) => {
      setDonationInfo(prev => ({...prev, designationId: e.target.id, designationTitle: e.target.value}))
      console.log(donationInfo)
   }

   const handleAmount = (e) => {
      setDonationInfo(prev => ({...prev, amount: e.target.value}))
   }  

   const handleDonate = () => {
      if (donationInfo.designationTitle == "" || donationInfo.amount == 0 ) {
         setError(true)
      } else {
         setDonations((prev) => [...prev, donationInfo])
         router.push(`/organization/${organizationId}/cart`)
      }
   }

   const amounts = [10, 25, 50, 75, 100, 150];


   return (
      <div className="w-full h-full mx-auto bg-white rounded-lg shadow-md overflow-y-auto">
         {error && <ErrorModal setError={setError} message={errorMessage}/>}

         {campaign && display && <div className="grid grid-cols-11 gap-2 mx-8 mt-4">
            <div className="flex flex-col px-6 py-4 col-start-1 col-end-8">
 
               <h1 className="text-4xl p-2 rounded-md mb-2 font-semibold ">{display.headline}</h1>

               <img
                  src={display.image}
                  alt="image"
                  className="w-full h-96 object-contain border border-gray-400 shadow-md rounded-md bg-gray-50"
               />
               
               <div className="flex flex-row items-center px-4 py-4 border-b text-sm">
                  <CgProfile className="h-6 w-6"/>
                  <p className="text-gray-600 font-medium ml-4">Created by John Doe</p>
               </div>
               <div className="p-4 border-b">
                  <p 
                     className="text-gray-500 text-sm w-full h-full p-2 rounded-md"
                     name="description"
                  >
                     {display.description}
                  </p>
               </div>
               <p className="text-gray-400 text-sm px-4 py-2">Created on {new Date(campaign.created_at).toLocaleDateString("en-US")}</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-md shadow-md col-start-8 col-end-12 mt-12 mb-8">
               <p className="text-xl font-medium mb-2">{campaign.raised} of {campaign.goal} raised</p>

               <div className="w-full bg-gray-300 rounded-full h-2 mb-1">
                  <div className="bg-blue-600 h-2 rounded-full w-1/12"></div>
               </div>

               <p className="text-sm text-gray-600">{campaign.donations} donations</p>

               <div className="border-b border-blue-600 my-8"/>

               <div className="">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">I would like to give to:</h3>
                  <select 
                     className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     onChange={handleDesignationChange}
                     defaultValue=""
                  >
                     <option disabled value="">Select an option</option>
                     {designations && designations.map((item) => {
                        return <option key={item.id} id={item.id} value={item.title}>{item.title}</option>
                     })}
                  </select>
               </div>

               <div className="border-b border-blue-600 my-8"/>

               <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">I would like to give:</h3>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2 max-w-sm mx-auto px-4">
                     {amounts.map((amount, index) => (
                        <button
                           key={index}
                           className="w-full text-sm py-2 bg-blue-800 text-white rounded-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                           value={amount}
                           onClick={handleAmount}
                        >
                        ${amount}
                        </button>
                     ))}
                     <div className="col-start-1 col-end-3 mt-2">
                        <label className="text-sm font-semibold text-gray-600 mb-1">Enter Custom Amount</label>
                        <input 
                           placeholder="Enter Custom Amount" 
                           type="number" 
                           className="w-full  text-sm rounded-md  py-2 px-4 bg-white border border-blue-600 text-black shadow focus:outline-none focus:ring-2 focus:ring-blue-500" 
                           onChange={handleAmount}
                           value={donationInfo.amount}
                        />
                     </div>

                  </div>
               </div>

               <div className="border-b border-blue-600 my-8"/>

               <div className="flex flex-row justify-center items-center space-x-4">
                  <button className="w-5/12 px-4 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">
                     Share
                  </button>
                  <button 
                     className="w-5/12 px-4 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
                     onClick={handleDonate}
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>}
      </div>
   );
}



export default CampaignPage