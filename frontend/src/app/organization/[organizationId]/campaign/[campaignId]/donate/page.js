"use client"
import useFormInput from "@/app/hooks/useFormInput"
import { useState, useEffect } from "react"
import CampaignInfo from "./campaignInfo"
import UserInfo from "./userInfo"
import Checkout from "./checkout"
import { getCampaignDesignations } from "@/app/services/fetchService"

const DonatePage = ({params}) => {
   const [gifts, setGifts] = useState([])
   const campaignId = params.campaignId
   const [campaignInfo, handleCampaignInfoChange, setCampaignInfo] = useFormInput({
      id: new Date(),
      amount: 0,
      designationId: 0,
      designationTitle: ""
   })
   const [page, setPage] = useState(1)
   const [designations, setDesignations] = useState(null)

   const [userInfo, handleUserInfoChange, setUserInfo] = useFormInput({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      apt: "",
      city: "",
      state: "",
      zip: ""
   })

   useEffect(() => {
      const fetchData = async() => {
         const response = await getCampaignDesignations(campaignId)
         setDesignations(response)
         console.log(response)
      }

      fetchData()
   }, [])

   return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center mt-8">
         <div className=" shadow-sm rounded-sm px-8 py-4 w-full max-w-6xl">

         <div className="relative flex items-center justify-between w-3/4 mx-auto h-2 bg-gray-200 rounded-full mt-4">
   {/* Progress Bar */}
            <div
               className="absolute h-2 bg-blue-500 rounded-full transition-all duration-300"
               style={{ width: `${(page) * 33}%` }}
            />
               {[1, 2, 3].map((step, index) => (
                  <div
                     key={step}
                     className="relative flex flex-col items-center"
                     style={{ width: '33.33%' }} // Adjust width based on number of checkpoints
                  >
                     {/* Checkpoint Circle */}
                     <div
                        className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 rounded-full ${
                           page >= step ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                     />
                     {/* Checkpoint Label */}
                     <span className="mt-12 text-sm font-medium text-center">
                        {index === 0 && 'Campaign Info'}
                        {index === 1 && 'User Info'}
                        {index === 2 && 'Checkout'}
                     </span>
                  </div>
               ))}
            </div>


            <div className="w-full text-right mt-8 mb-8">
               <h1 className="text-lg font-semibold">Total Gifts: {gifts.length}</h1>
            </div>

            {page == 1 && <CampaignInfo designations={designations} campaignId={campaignId} page={page} setPage={setPage} campaignInfo={campaignInfo} setCampaignInfo={setCampaignInfo} handleCampaignInfoChange={handleCampaignInfoChange} setGifts={setGifts}/>}
            {page == 2 && <UserInfo page={page} setPage={setPage} userInfo={userInfo} handleUserInfoChange={handleUserInfoChange}/>}
            {page == 3 && <Checkout gifts={gifts} setGifts={setGifts} page={page} setPage={setPage}/>}

         </div>
      </div>

   )
}

export default DonatePage