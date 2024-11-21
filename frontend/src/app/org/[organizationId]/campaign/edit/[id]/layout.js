"use client"
import Navbar from "@/app/org/[organizationId]/campaign/components/navbar"
import { createCampaignDesignation, createCustomQuestion, deleteCampaignDesignation, deleteCustomQuestion, updateCampaignDetails, updateDonationPage } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"
import { updatePageSection, updateThankYouPage } from "@/app/services/updateServices"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const router = useRouter()
   const {donationPageInputs, campaignDetails, selectedDesignations, customQuestions, thankPageInputs, donationPageSections, thankyouPageSections} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const detailsLink  = `/org/${organizationId}/campaign/edit/${campaignId}/details/about`
   
   const pageLinks = [
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/landing-page/`, title: "Landing Page"},
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-page/`, title: "Donation Page"},
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/thank-you-page/`, title: "Thank You Page"}
   ]

   const handlePublish = async() => {
      if (campaignDetails.campaignName == "" || campaignDetails.internalName == "" || 
         campaignDetails.goal == 0 || campaignDetails.shortUrl == "" || campaignDetails.designation == 0) {
         setErrorMessage("Please Fill All Required Fields in Campaign Details")
         setError(true)
      } else if (donationPageInputs.headline == "" || donationPageInputs.description == "" || donationPageInputs.image == "") {
         setErrorMessage("Please Fill All Required Fields in Campaign Pages")
         setError(true)
      } else {
         try {
            const response = await updateCampaignDetails(campaignId, campaignDetails, "active", currentUser)
            console.log("asas", response)
            if (response) {
               setError(true)
               setErrorMessage(response)
            } else {
               await updateDonationPage(campaignId, donationPageInputs, amountInputs)
               await deleteCampaignDesignation(campaignId)
               await createCampaignDesignation(campaignId, selectedDesignations)
               await deleteCustomQuestion(campaignId)
               await createCustomQuestion(campaignId, customQuestions)

               console.log("success")
               router.push(`/org/${organizationId}/dashboard/campaigns`)
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
         const response = await updateCampaignDetails(campaignId, campaignDetails, 'inactive', currentUser);
         if (response) {
            setError(true)
            setErrorMessage(response)
         } else {
            await updateDonationPage(campaignId, donationPageInputs);
            await updateThankYouPage(campaignId, thankPageInputs)
            await deleteCampaignDesignation(campaignId)
            await createCampaignDesignation(campaignId, selectedDesignations)
            await deleteCustomQuestion(campaignId)
            await createCustomQuestion(campaignId, customQuestions)
            for (const section of donationPageSections) {
               await updatePageSection(section.id, section.active)
            }
            // for (const section of thankyouPageSections) {
            //    await updatePageSection(section.id, section.active)
            // }
            router.push(`/org/${organizationId}/dashboard/campaigns`)
         }
      } catch (err) {
         console.log(err)
         setError(true)
         setErrorMessage(err)
      }
   }

   const handleDeactivate = async() => {
      try {
         await updateCampaign(campaignId, campaignDetails, 'inactive', currentUser);
         router.push(`/org/${organizationId}/dashboard/campaigns`)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div >
         <Navbar campaignId={campaignId} organizationId={organizationId} detailsLink={detailsLink} pageLinks={pageLinks} handlePublish={handlePublish} handleSave={handleSave} handleDeactivate={handleDeactivate}/>
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default EditLayout