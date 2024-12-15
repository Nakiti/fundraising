"use client"
import Navbar from "@/app/org/[organizationId]/campaign/components/navbar"
import { createCampaignDesignation, createCustomQuestion, deleteCampaignDesignation, deleteCustomQuestion, updateCampaignDetails, updateDonationPage } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"
import { updatePageSection, updateThankYouPage, updateTicketPage } from "@/app/services/updateServices"
import { getCampaignDesignations, getCampaignTickets, getCustomQuestions } from "@/app/services/fetchService"
import { deleteCampaignDesignationBatch, deleteCampaignQuestionsBatch, deleteCampaignTicketsBatch } from "@/app/services/deleteService"
import { createCampaignTicket } from "@/app/services/createServices"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const router = useRouter()
   const {campaignDetails, selectedDesignations, customQuestions, thankPageInputs, thankyouPageSections, campaignType, tickets} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const {donationPageInputs, donationPageSections} = useContext(DonationPageContext)
   const {ticketPageInputs, ticketPageSections} = useContext(TicketPageContext)

   const detailsLink  = `/org/${organizationId}/campaign/edit/${campaignId}/details/about`
   
   const pageLinks = [
      campaignType == "ticketed-event" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/ticket-page/`, title: "Ticket Page"} : null,
      campaignType == "donation" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-page/`, title: "Donation Page"} : null,
      campaignType == "peer-to-peer" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/peer-landing-page/`, title: "Landing Page"} : null,
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
            if (response) {
               setError(true)
               setErrorMessage(response)
            } else {

               if (campaignType == "donation") {
                  await updateDonationPage(campaignId, donationPageInputs)
                  for (const section of donationPageSections) {
                     await updatePageSection(section.id, section.active)
                  }
                  await updateCampaignDesignations()

               } else if (campaignType == "ticked-event") {
                  await updateTicketPage()
                  await updateCampaignTickets()
               }

               await updateCustomQuestions()
               await updateThankYouPage(campaignId, thankPageInputs)
               for (const section of thankyouPageSections) {
                  await updatePageSection(section.id, section.active)
               }
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
            if (campaignType == "donation") {
               await updateDonationPage(campaignId, donationPageInputs);
               await updateCampaignDesignations()

               for (const section of donationPageSections) {
                  await updatePageSection(section.id, section.active)
               }
            } else if (campaignType == "ticketed-event") {
               await updateTicketPage(campaignId, ticketPageInputs)
               await updateCampaignTickets()

               for (const section of ticketPageSections) {
                  await updatePageSection(section.id, section.active)
               }
            }
            
            await updateThankYouPage(campaignId, thankPageInputs)
            await updateCustomQuestions()
            for (const section of thankyouPageSections) {
               await updatePageSection(section.id, section.active)
            }
            router.push(`/org/${organizationId}/dashboard/campaigns`)
         }
      } catch (err) {
         console.log(err)
         setError(true)
         setErrorMessage(err)
      }
   }

   const updateCampaignDesignations = async() => {
      try {
         const existingRelations = await getCampaignDesignations(campaignId)
         const relationsToAdd = selectedDesignations.filter(designation =>!existingRelations.includes(designation))
         const relationsToRemove = existingRelations.filter(designation =>!selectedDesignations.includes(designation))

         if (relationsToAdd.length > 0) {
            await createCampaignDesignation(campaignId, relationsToAdd)
         }
         if (relationsToRemove.length > 0) {
            await deleteCampaignDesignationBatch(relationsToRemove)
         }
      } catch (err) {
         console.log(err)
      }
   }

   const updateCustomQuestions = async() => {
      try {
         const existingQuestions = await getCustomQuestions(campaignId)
         const questionsToAdd = customQuestions.filter(item => !existingQuestions.includes(item))
         const questionsToRemove = existingQuestions.filter(item => !customQuestions.includes(item))

         if (questionsToAdd.length > 0) {
            await createCustomQuestion(campaignId, questionsToAdd)
         }
         if (questionsToRemove.length > 0) {
            await deleteCampaignQuestionsBatch(questionsToRemove)
         }
      } catch (err) {
         console.log(err)
      }
   }

   const updateCampaignTickets = async() => {
      try {
         const existingTickets = await getCampaignTickets(campaignId)
         const ticketsToAdd = tickets.filter(item => !existingTickets.includes(item))
         const ticketsToRemove = existingTickets.filter(item => !tickets.includes(item))

         if (ticketsToAdd.length > 0) {
            await createCampaignTicket(campaignId, ticketsToAdd)
         }
         if (ticketsToRemove.length > 0) {
            await deleteCampaignTicketsBatch(ticketsToRemove)
         }
      } catch (err) {
         console.log(err)
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