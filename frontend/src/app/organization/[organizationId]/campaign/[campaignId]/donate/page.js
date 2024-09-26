"use client"
import useFormInput from "@/app/hooks/useFormInput"
import { useState } from "react"
import CampaignInfo from "./campaignInfo"
import UserInfo from "./userInfo"
import Checkout from "./checkout"

const DonatePage = () => {
   const [gifts, setGifts] = useState([])
   const [campaignInfo, handleCampaignInfoChange, setCampaignInfo] = useFormInput({
      amount: 0,
      designation: 0
   })
   const [page, setPage] = useState(1)

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

   return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center mt-8">
         <div className="bg-white shadow-sm rounded-sm px-8 py-4 w-full max-w-6xl">
            <div className="bg-blue-500 h-2 w-1/2 mx-auto mt-4"/>

            <div className="w-full text-right mt-4">
               <h1 className="text-lg font-semibold">Total Gifts: {gifts.length}</h1>
            </div>

            {page == 1 && <CampaignInfo page={page} setPage={setPage} campaignInfo={campaignInfo} handleCampaignInfoChange={handleCampaignInfoChange}/>}
            {page == 2 && <UserInfo page={page} setPage={setPage} userInfo={userInfo} handleUserInfoChange={handleUserInfoChange}/>}
            {page == 3 && <Checkout page={page} setPage={setPage}/>}

         </div>
      </div>

   )
}

export default DonatePage