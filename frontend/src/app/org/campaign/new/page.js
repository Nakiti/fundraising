"use client"
import Navbar from "../components/navbar"
import Preview from "../components/Preview/preview"
import Settings from "../components/Settings/settings"
import { useContext, useState, useEffect } from "react"
import { CampaignContext, CampaignContextProvider } from "@/app/context/campaignContext"
import { createCampaign, createCampaignDesignation, createPreview } from "@/app/services/campaignService"
import { AuthContext } from "@/app/context/authContext"
import { useRouter } from "next/navigation"
import ErrorModal from "../components/errorModal"

const NewCampaign = () => {
   const [active, setActive] = useState("settings")
   const {currentUser} = useContext(AuthContext)
   const {settingsInputs, previewInputs, selectedDesignations} = useContext(CampaignContext)
   const router = useRouter()
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("") 
   
   const handleActiveChange = (tab) => {
      setActive(tab)
   }

   const handlePublish = async() => {
      if (settingsInputs.title == "" || settingsInputs.goal == "" || settingsInputs.description == "" || settingsInputs.url == "") {
         setError(true)
         setErrorMessage("Please Fill All Fields")
      } else {

         try {
            const campaignId = await createCampaign("active", settingsInputs, currentUser)
            await createPreview(campaignId, previewInputs)
            await createCampaignDesignation(campaignId, selectedDesignations)

            router.push("/org/dashboard/campaigns")
         } catch (err) {
            setError(true)
            setErrorMessage(err)
            console.log(err)
         }
      }
   }

   const handleSave = async () => {
      console.log("o")

      try {
         const campaignId = await createCampaign("inactive", settingsInputs, currentUser)
         await createPreview(campaignId, previewInputs)
         await createCampaignDesignation(campaignId, selectedDesignations)

         router.push("/org/dashboard/campaigns")
      } catch (err) {
         console.log(err)
      }
   }


   return (
      
      <div className="w-full bg-gray-50">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <Navbar active={active} handleActiveChange={handleActiveChange} handlePublish={handlePublish} handleSave={handleSave}/>
         {active == "settings" ?  <Settings /> : <Preview />}
      </div>
   )
}

export default NewCampaign