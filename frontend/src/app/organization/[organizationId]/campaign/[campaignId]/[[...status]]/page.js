"use client"
import { getCampaignDesignations, getCampaignDetails, getCampaignPreview, getDonationPage } from "@/app/services/fetchService"
import { useState, useEffect, useContext } from "react"
import { CgProfile } from "react-icons/cg"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useFormInput from "@/app/hooks/useFormInput"
import { DonationContext } from "@/app/context/donationContext"
import ErrorModal from "@/app/components/errorModal"
import { FaArrowLeft } from "react-icons/fa"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const status = params.status
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
         if (campaignResponse.status == "active") {
            setCampaign(campaignResponse)
            setDonationInfo(prev => ({
               ...prev,
               campaignTitle: campaignResponse.title
            }))
            const displayResponse = await getDonationPage(campaignId)
            console.log(displayResponse)
            setDisplay(displayResponse)
            setDonationInfo(prev => ({
               ...prev,
               campaignImage: displayResponse.image
            }))
            const designationResponse = await getCampaignDesignations(campaignId)
            setDesignations(designationResponse)
            console.log(designationResponse)
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
      <div className="w-full h-full mx-auto bg-white shadow-md overflow-y-auto">
         {error && <ErrorModal setError={setError} message={errorMessage}/>}
         {status == "preview" && <div className="py-4 px-8 bg-gray-700 flex flex-row justify-between">
            <Link href={`/org/${organizationId}/campaign/edit/${campaignId}/details/about`} className="flex flex-row space-x-2 items-center text-white">
               <FaArrowLeft />
               <p>Campaign Manager</p>
            </Link>
            <p className="text-md text-white">Your Campaign is in Draft Mode</p>
         </div>}

         {display && <div >
            <div className="relative w-full">
               <img
                  src={display.banner_image}
                  alt="image"
                  className="w-full h-80 object-cover bg-gray-50"
               />
            </div>

            <div className="w-3/4 mx-auto relative flex flex-row mb-8 border-t border-gray-200 pt-6">
               <div className="w-1/3">
                  <img 
                  src={display.small_image}
                  className="h-64 w-64 object-cover border-4 border-white shadow-lg -mt-16 rounded-md"
                  alt="image"
                  />
               </div>
               <div className="w-2/3 mt-4">
                  <div className="flex flex-row justify-between mb-8">
                     <div>
                        <p className="text-gray-500 text-sm">Fundraiser</p>
                        <h1 className="text-4xl font-semibold text-gray-800">{display.headline}</h1>
                     </div>
                     <button className="text-sm text-blue-600 hover:underline">Share</button>
                  </div>

                  <div className="mb-8">
                     <p className="text-md font-medium mb-1 text-gray-700">X of 1000 raised</p>
                     <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                        <div className="bg-blue-600 h-3 rounded-full w-1/12"></div>
                     </div>
                  </div>

                  <div className="space-y-4 py-12 border-t border-b border-gray-200">
                     <h2 className="text-2xl text-gray-800 font-semibold text-center">Our Story</h2>
                     <p className="text-md text-gray-600 leading-relaxed">
                        {display.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                     </p>
                  </div>

                  <div className="mt-6">
                     <h3 className="text-lg text-gray-700 font-semibold mb-4">I would like to give to:</h3>
                     <select 
                        className="w-full border border-gray-300 rounded-sm p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        defaultValue="Select"
                     >
                        <option value={"Select"} disabled>Select a Designation</option>
                        {designations && designations.map(item => (
                           <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                     </select>
                  </div>

                  <div className="mt-6">
                     <h3 className="text-lg text-gray-700 font-semibold mb-4">I would like to give:</h3>
                     <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                        {amounts.map((amount, index) => (
                           <button
                              key={index}
                              className="w-full text-sm py-2 bg-blue-700 text-white rounded-sm shadow-md hover:bg-blue-800 transition-colors duration-200"
                           >
                           {amount}
                           </button>
                        ))}
                        <input 
                           placeholder="Enter Custom Amount" 
                           type="number" 
                           className="col-span-3 text-sm rounded-sm py-2 px-4 bg-white border border-blue-600 text-gray-700 shadow focus:outline-none " 
                        /> 
                     </div>
                  </div>

                  {/* Donate Button */}
                  <div className="flex justify-center items-center mt-8">
                     <button 
                        className="w-1/4 py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     >
                        Donate
                     </button>
                  </div>
               </div>
            </div>
         </div>}
         {!campaign && !display && <p>Campaign not found/inactive</p>}
      </div>
   );
}



export default CampaignPage