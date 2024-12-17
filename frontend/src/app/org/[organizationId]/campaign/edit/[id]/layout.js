"use client"
import Navbar from "@/app/org/[organizationId]/campaign/components/navbar"
import { createCampaignDesignation, createCustomQuestion, deleteCampaignDesignation, deleteCustomQuestion, updateCampaignDetails, updateDonationPage } from "@/app/services/campaignService"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"
import { updateDonationForm, updatePageSection, updatePeerFundraisingPage, updatePeerLandingPage, updateThankYouPage, updateTicketPage } from "@/app/services/updateServices"
import { getCampaignDesignations, getCampaignTickets, getCustomQuestions } from "@/app/services/fetchService"
import { deleteCampaignDesignationBatch, deleteCampaignQuestionsBatch, deleteCampaignTicketsBatch } from "@/app/services/deleteService"
import { createCampaignTicket } from "@/app/services/createServices"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const router = useRouter()
   const {campaignDetails, selectedDesignations, customQuestions, campaignType, tickets} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const {donationPageInputs, donationPageSections} = campaignType == "donation" && useContext(DonationPageContext) || {}
   const {ticketPageInputs, ticketPageSections} = campaignType == "ticket" && useContext(TicketPageContext)
   const {peerLandingPageInputs, peerLandingPageSections} = campaignType == "peer-to-peer" && useContext(PeerLandingPageContext)
   const {peerFundraisingPageInputs, peerFundraisingPageSections} = campaignType == "peer-to-peer" && useContext(PeerFundraisingPageContext)
   const {donationFormInputs, donationFormSections} = useContext(DonationFormContext)
   const {thankPageInputs, thankyouPageSections} = useContext(ThankYouPageContext)

   const detailsLink  = `/org/${organizationId}/campaign/edit/${campaignId}/details/about`
   
   const pageLinks = [
      campaignType == "ticketed-event" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/ticket-page/`, title: "Ticket Page", link: `/organization/${organizationId}/campaign/${campaignId}/ticket-page/`} : null,
      campaignType == "crowdfunding" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-page/`, title: "Landing Page", link: `/organization/${organizationId}/campaign/${campaignId}/donation-page/`} : null,
      campaignType == "peer-to-peer" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/peer-landing-page/`, title: "Landing Page", link: `/organization/${organizationId}/campaign/${campaignId}/peer-landing/`} : null,
      campaignType == "peer-to-peer" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/peer-fundraising-page/`, title: "Fundraising Page", link: `/organization/${organizationId}/campaign/${campaignId}/peer-fundraising/`} : null,
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-form/`, title: "Donation Form", link: `/organization/${organizationId}/campaign/${campaignId}/donation-form/`},
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/thank-you-page/`, title: "Thank You Page", link: `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`}
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
                  await updateTicketPage(campaignId, ticketPageInputs)
                  for (const section of ticketPageSections) {
                     await updatePageSection(section.id, section.active)
                  }
                  await updateCampaignTickets()
               } else if (campaignType == "peer-to-peer") {
                  await updatePeerLandingPage(campaignId, peerLandingPageInputs, currentUser.id)
                  await updatePeerFundraisingPage(campaignId, peerFundraisingPageInputs, currentUser.id)

                  for (const section of peerLandingPageSections) {
                     await updatePageSection(section.id, section.active)
                  }

                  for (const section of peerFundraisingPageSections) {
                     await updatePageSection(section.id, section.active)
                  }
               }

               await updateCustomQuestions()
               await updateThankYouPage(campaignId, thankPageInputs)
               for (const section of thankyouPageSections) {
                  await updatePageSection(section.id, section.active)
               }

               await updateDonationForm(campaignId, donationFormInputs, currentUser.id)
               for (const section of donationFormSections) {
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
            } else if (campaignType == "peer-to-peer") {
               await updatePeerLandingPage(campaignId, peerLandingPageInputs)
               await updatePeerFundraisingPage(campaignId, peerFundraisingPageInputs, currentUser.id)

               for (const section of peerLandingPageSections) {
                  await updatePageSection(section.id, section.active)
               }
               for (const section of peerFundraisingPageSections) {
                  await updatePageSection(section.id, section.active)
               }
            }
            
            await updateThankYouPage(campaignId, thankPageInputs)
            await updateCustomQuestions()
            for (const section of thankyouPageSections) {
               await updatePageSection(section.id, section.active)
            }

            await updateDonationForm(campaignId, donationFormInputs, currentUser.id)
            for (const section of donationFormSections) {
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