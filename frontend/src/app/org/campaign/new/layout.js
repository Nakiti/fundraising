"use client"
import { createCampaign, createCampaignDesignation, createCustomQuestion, createPreview } from "@/app/services/campaignService"
import Navbar from "../components/navbar"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { useRouter, useSearchParams } from "next/navigation"
import ErrorModal from "@/app/components/errorModal"

const NewLayout = ({children}) => {

   const {aboutInputs, previewInputs, amountInputs, selectedDesignations, customQuestions} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const router = useRouter()
   const searchParams = useSearchParams()
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const type = searchParams.get("type")

   const detailsLink = `/org/campaign/new/details/about?type=${type}`

   const pageLinks = [
      {path: `/org/campaign/new/landing-page?type=${type}`, title: "Landing Page"},
      {path: `/org/campaign/new/donation-page?type=${type}`, title: "Donation Page"},
      {path: `/org/campaign/new/thank-you-page?type=${type}`, title: "Thank You Page"}
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
            const campaignId = await createCampaign("active", aboutInputs, currentUser)
            
            if (campaignId.id) {
               await createPreview(campaignId.id, previewInputs, amountInputs)

               if (selectedDesignations.length > 0) {
                  await createCampaignDesignation(campaignId.id, selectedDesignations)
               }
               if (customQuestions.length > 0) {
                  await createCustomQuestion(campaignId.id, customQuestions)
               }
            } else {
               setError(true)
               setErrorMessage(campaignId.error)
            }
            router.push("/org/dashboard/campaigns")
         } catch (err) {
            console.log(err)
            setError(true)
            setErrorMessage(err.response.data)
         }
      }

   }

   const handleSave = async() => {
      try {
         const campaignId = await createCampaign("inactive", aboutInputs, currentUser)
         if (campaignId.id) {
            await createPreview(campaignId.id, previewInputs, amountInputs)
            if (selectedDesignations.length > 0) {
               await createCampaignDesignation(campaignId.id, selectedDesignations)
            }
            if (customQuestions.length > 0) {
               await createCustomQuestion(campaignId.id, customQuestions)
            }

            router.push("/org/dashboard/campaigns")
         } else {
            setError(true)
            setErrorMessage(campaignId.error)
         }

      } catch (err) {
         console.log(err.response.data)
         setError(true)
         setErrorMessage(err.response.data)
      }
   }

   return (
      <div >
         <Navbar pageLinks={pageLinks} detailsLink={detailsLink} handlePublish={handlePublish} handleSave={handleSave} mode={"new"}/>
         {error && <ErrorModal setError={setError} message={errorMessage}/>}
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default NewLayout