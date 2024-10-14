"use client"
import Navbar from "@/app/org/components/navbar"
import { createCampaignDesignation, createCustomQuestion, deleteCampaignDesignation, deleteCustomQuestion, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const router = useRouter()
   const {previewInputs, aboutInputs, selectedDesignations, customQuestions} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)

   const links = [
      `/org/campaign/edit/${campaignId}/details/about`,
      `/org/campaign/edit/${campaignId}/donation-page/`
   ]

   const handlePublish = async() => {
      try {
         await updateCampaign(campaignId, aboutInputs, "active", currentUser)
         await updatePreview(campaignId, previewInputs)
         await deleteCampaignDesignation(campaignId)
         await createCampaignDesignation(campaignId, selectedDesignations)
         await deleteCustomQuestion(campaignId)
         await createCustomQuestion(campaignId, customQuestions)
         router.push("/org/dashboard/campaigns")
      } catch (err) {
         console.log(err)
      }
   }

   const handleSave = async() => {
      try {
         await updateCampaign(campaignId, aboutInputs, 'inactive', currentUser);
         await updatePreview(campaignId, previewInputs);
         await deleteCampaignDesignation(campaignId)
         await createCampaignDesignation(campaignId, selectedDesignations)
         await deleteCustomQuestion(campaignId)
         await createCustomQuestion(campaignId, customQuestions)
         router.push("/org/dashboard/campaigns")

      } catch (err) {
         console.log(err)
      }
   }

   const handleDeactivate = async() => {
      try {
         await updateCampaign(campaignId, aboutInputs, 'inactive', currentUser);
         router.push("/org/dashboard/campaigns")

      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div >
         <Navbar links={links} handlePublish={handlePublish} handleSave={handleSave} handleDeactivate={handleDeactivate}/>
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default EditLayout