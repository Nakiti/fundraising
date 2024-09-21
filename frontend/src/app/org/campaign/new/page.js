"use client"
import Navbar from "../components/navbar"
import Preview from "../components/Preview/preview"
import Settings from "../components/Settings/settings"
import { useContext, useState, useEffect } from "react"
import { CampaignContext, CampaignContextProvider } from "@/app/context/campaignContext"
import { createCampaign, createCampaignDesignation, createPreview } from "@/app/services/campaignService"
import { AuthContext } from "@/app/context/authContext"

const NewCampaign = () => {
   const [active, setActive] = useState("settings")
   const {currentUser} = useContext(AuthContext)
   const {settingsInputs, previewInputs, selectedDesignations} = useContext(CampaignContext)
   
   const handleActiveChange = (tab) => {
      setActive(tab)
   }

   const handlePublish = async() => {
      try {
         const campaignId = await createCampaign("active", settingsInputs, currentUser)
         await createPreview(campaignId, previewInputs)
         await createCampaignDesignation(campaignId, selectedDesignations)

      } catch (err) {
         console.log(err)
      }
   }

   const handleSave = async () => {
      try {
         const campaignId = await createCampaign("inactive", settingsInputs, currentUser)
         await createPreview(campaignId, previewInputs)
         await createCampaignDesignation(campaignId, selectedDesignations)
      } catch (err) {
         console.log(err)
      }
   }


   return (
      
      <div className="w-full bg-gray-50">
         <Navbar active={active} handleActiveChange={handleActiveChange} handlePublish={handlePublish} handleSave={handleSave}/>
         {active == "settings" ?  <Settings /> : <Preview />}
      </div>
   )
}

export default NewCampaign