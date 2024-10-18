"use client"
import Navbar from "@/app/org/components/navbar"
import { createCampaignDesignation, createCustomQuestion, deleteCampaignDesignation, deleteCustomQuestion, updateCampaign, updatePreview } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const router = useRouter()
   const {previewInputs, aboutInputs, selectedDesignations, customQuestions, amountInputs} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const links = [
      `/org/campaign/edit/${campaignId}/details/about`,
      `/org/campaign/edit/${campaignId}/donation-page/`
   ]

   const handlePublish = async() => {
      if (aboutInputs.campaignName == "" || aboutInputs.internalName == "" || 
         aboutInputs.goal == 0 || aboutInputs.shortUrl == "" || aboutInputs.designation == 0) {
         setErrorMessage("Please Fill All Required Fields in Campaign Details")
         setError(true)
      } else if (previewInputs.headline == "" || previewInputs.description == "" || previewInputs.image == "") {
         setErrorMessage("Please Fill All Required Fields in Campaign Pages")
         setError(true)
      } else {
         try {
            const response = await updateCampaign(campaignId, aboutInputs, "active", currentUser)
            if (response) {
               setError(true)
               setErrorMessage(response)
            } else {
               await updatePreview(campaignId, previewInputs, amountInputs)
               await deleteCampaignDesignation(campaignId)
               await createCampaignDesignation(campaignId, selectedDesignations)
               await deleteCustomQuestion(campaignId)
               await createCustomQuestion(campaignId, customQuestions)
               router.push("/org/dashboard/campaigns")
            }
         } catch (err) {
            console.log(err)
            setError(true)
            setErrorMessage(err)
         }
      }
   }

   const handleSave = async() => {
      try {
         const response = await updateCampaign(campaignId, aboutInputs, 'inactive', currentUser);
         if (response) {
            setError(true)
            setErrorMessage(response)
         } else {
            await updatePreview(campaignId, previewInputs);
            await deleteCampaignDesignation(campaignId)
            await createCampaignDesignation(campaignId, selectedDesignations)
            await deleteCustomQuestion(campaignId)
            await createCustomQuestion(campaignId, customQuestions)
            router.push("/org/dashboard/campaigns")
         }

      } catch (err) {
         console.log(err)
         setError(true)
         setErrorMessage(err.response.data)
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
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default EditLayout