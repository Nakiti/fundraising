"use client"
import { createCampaign, createCampaignDesignation, createCustomQuestion, createPreview } from "@/app/services/campaignService"
import Navbar from "../../components/navbar"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { useRouter } from "next/navigation"

const NewLayout = ({children}) => {

   const {aboutInputs, previewInputs, amountInputs, selectedDesignations, customQuestions} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()

   const links = [
      "/org/campaign/new/details/about",
      "/org/campaign/new/donation-page/"
   ]

   const handlePublish = async() => {
      try {
         const campaignId = await createCampaign("active", aboutInputs, currentUser)
         await createPreview(campaignId, previewInputs, amountInputs)
         await createCampaignDesignation(campaignId, selectedDesignations)
         await createCustomQuestion(campaignId, customQuestions)
         router.push("/org/dashboard/campaigns")

      } catch (err) {
         console.log(err)
      }

   }

   const handleSave = async() => {
      try {
         const campaignId = await createCampaign("inactive", aboutInputs, currentUser)
         await createPreview(campaignId, previewInputs, amountInputs)
         await createCampaignDesignation(campaignId, selectedDesignations)
         await createCustomQuestion(campaignId, customQuestions)
         router.push("/org/dashboard/campaigns")

      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div >
         <Navbar links={links} handlePublish={handlePublish} handleSave={handleSave}/>
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default NewLayout