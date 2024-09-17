"use client"
import Navbar from "../components/navbar"
import Preview from "../components/preview"
import Settings from "../components/settings"
import { useState } from "react"
import { CampaignContextProvider } from "@/app/context/campaignContext"

const NewCampaign = () => {
   const [active, setActive] = useState("preview")
   
   const handleActiveChange = (tab) => {
      setActive(tab)
   }


   return (
      
      <div className="w-full bg-gray-50">
         <Navbar active={active} handleActiveChange={handleActiveChange}/>

         {active == "settings" ?  <Settings /> : <Preview />}
      </div>
   )
}

export default NewCampaign