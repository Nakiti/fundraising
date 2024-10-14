"use client"
import { useContext, useEffect, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { createCampaignDesignation, deleteCampaignDesignation, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import NewLayout from "../../new/layout"

const EditCampaign = ({params}) => {
   const [active, setActive] = useState("preview")
   const campaignId = params.id
   const {previewInputs, settingsInputs, selectedDesignations} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()
 
   const handleActiveChange = (tab) => {
      setActive(tab)
   }

   const handlePublish = async() => {
      try {
         await updateCampaign(campaignId, settingsInputs, "active", currentUser)
         await updatePreview(campaignId, previewInputs)
         await deleteCampaignDesignation(campaignId)
         await createCampaignDesignation(campaignId, selectedDesignations)

         router.push("/org/dashboard/campaigns")
      } catch (err) {
         console.log(err)
      }
   }

   const handleSave = async() => {
      try {
         await updateCampaign(campaignId, settingsInputs, 'inactive', currentUser);
         await updatePreview(campaignId, previewInputs);
         await deleteCampaignDesignation(campaignId)
         await createCampaignDesignation(campaignId, selectedDesignations)

         router.push("/org/dashboard/campaigns")

      } catch (err) {
         console.log(err)
      }
   }

   const handleDeactivate = async () => {
      try {
         await updateCampaign(campaignId, settingsInputs, 'inactive', currentUser);
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <NewLayout>
         {campaignId}
      </NewLayout>
      // <div className="w-full bg-gray-50">
      //    <Navbar active={active} title={"Edit Campaign"} handleActiveChange={handleActiveChange} handlePublish={handlePublish} handleSave={handleSave} handleDeactivate={handleDeactivate}/>

      //    {active == "settings" ?  <Settings /> : <Preview />}
      // </div>
   )
}

export default EditCampaign