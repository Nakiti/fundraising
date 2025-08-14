"use client"
import Navbar from "@/app/org/[organizationId]/campaign/components/navbar"
import { useRouter } from "next/navigation"
import { useContext, useState, useEffect } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"
import { CampaignUpdateService, PageUpdateService } from "@/app/services/updateServices"
import { CampaignService } from "@/app/services/fetchService"
import { CampaignCreateService } from "@/app/services/createServices"
import { errorHandler } from "@/app/services/apiClient"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import { TicketPurchasePageContext } from "@/app/context/campaignPages/ticketPurchasePageContext"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const router = useRouter()
   const {campaignDetails, selectedDesignations, customQuestions, campaignType, tickets, loading, fetchCampaignData, campaignStatus} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   // Fetch campaign data when component mounts
   useEffect(() => {
      if (campaignId && fetchCampaignData) {
         fetchCampaignData(campaignId);
      }
   }, [campaignId, fetchCampaignData]);

   const {donationPageInputs, donationPageSections} = campaignType === "crowdfunding" ? useContext(DonationPageContext) : {}
   const {ticketPageInputs, ticketPageSections} = campaignType === "ticketed-event" ? useContext(TicketPageContext) : {}
   const {peerLandingPageInputs, peerLandingPageSections} = campaignType === "peer-to-peer" ? useContext(PeerLandingPageContext) : {}
   const {peerFundraisingPageInputs, peerFundraisingPageSections} = campaignType === "peer-to-peer" ? useContext(PeerFundraisingPageContext) : {}
   const {donationFormInputs, donationFormSections} = useContext(DonationFormContext)
   const {thankPageInputs, thankyouPageSections} = useContext(ThankYouPageContext)
   const {ticketPurchaseInputs, ticketPurchaseSections} = campaignType === "ticketed-event" ? useContext(TicketPurchasePageContext) : {}

   const detailsLink  = `/org/${organizationId}/campaign/edit/${campaignId}/details/about`
   
   const pageLinks = [
      campaignType === "ticketed-event" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/ticket-page/`, title: "Landing Page", link: `/organization/${organizationId}/campaign/${campaignId}/ticket-page/`} : null,
      campaignType === "ticketed-event" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/ticket-purchase/`, title: "Purchase Page", link: `/organization/${organizationId}/campaign/${campaignId}/ticket-purchase/`} : null,

      campaignType === "crowdfunding" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-page/`, title: "Landing Page", link: `/organization/${organizationId}/campaign/${campaignId}/donation-page/`} : null,
      campaignType === "peer-to-peer" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/peer-landing-page/`, title: "Landing Page", link: `/organization/${organizationId}/campaign/${campaignId}/peer-landing/`} : null,
      campaignType === "peer-to-peer" ? {path: `/org/${organizationId}/campaign/edit/${campaignId}/peer-fundraising-page/`, title: "Fundraising Page", link: `/organization/${organizationId}/campaign/${campaignId}/peer-fundraising/`} : null,
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/donation-form/`, title: "Donation Form", link: `/organization/${organizationId}/campaign/${campaignId}/donation-form/`},
      {path: `/org/${organizationId}/campaign/edit/${campaignId}/thank-you-page/`, title: "Thank You Page", link: `/organization/${organizationId}/campaign/${campaignId}/thank-you-page/`}
   ].filter(Boolean)

   const handlePublish = async() => {
      if (!campaignDetails || campaignDetails.campaignName === "" || campaignDetails.internalName === "" || 
         campaignDetails.goal === 0 || campaignDetails.shortUrl === "" || campaignDetails.designation === 0) {
         setErrorMessage("Please Fill All Required Fields")
         setError(true)
      } else {
         try {
            const response = await CampaignUpdateService.updateCampaignDetails(campaignId, campaignDetails, "active", currentUser)
            if (response) {
               setError(true)
               setErrorMessage(response)
            } else {
               handleCampaignUpdates()
               router.push(`/org/${organizationId}/dashboard/campaigns`)
            }
         } catch (err) {
            const handledError = errorHandler.handle(err)
            setError(true)
            setErrorMessage(handledError.message)
         }
      }
   }

   const handleSave = async() => {
      if (!campaignDetails) {
         setErrorMessage("Campaign details not loaded")
         setError(true)
         return;
      }
      
      try {
         const response = await CampaignUpdateService.updateCampaignDetails(campaignId, campaignDetails, 'inactive', currentUser);
         if (response) {
            setError(true)
            setErrorMessage(response)
         } else {
            handleCampaignUpdates()
            router.push(`/org/${organizationId}/dashboard/campaigns`)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setError(true)
         setErrorMessage(handledError.message)
      }
   }

   const handleCampaignUpdates = async() => {
      try {
         if (campaignType === "crowdfunding") {
            await CampaignUpdateService.updateDonationPage(campaignId, donationPageInputs);

            for (const section of donationPageSections || []) {
               await CampaignUpdateService.updatePageSection(section.id, section.active)
            }
         } else if (campaignType === "ticketed-event") {
            await CampaignUpdateService.updateTicketPage(campaignId, ticketPageInputs)
            await CampaignUpdateService.updateTicketPurchasePage(campaignId, ticketPurchaseInputs, currentUser.id)
            await updateCampaignTickets()

            for (const section of ticketPageSections || []) {
               await CampaignUpdateService.updatePageSection(section.id, section.active)
            }
         } else if (campaignType === "peer-to-peer") {
            await CampaignUpdateService.updatePeerLandingPage(campaignId, peerLandingPageInputs)
            await CampaignUpdateService.updatePeerFundraisingPage(campaignId, peerFundraisingPageInputs, currentUser.id)

            for (const section of peerLandingPageSections || []) {
               await CampaignUpdateService.updatePageSection(section.id, section.active)
            }
            for (const section of peerFundraisingPageSections || []) {
               await CampaignUpdateService.updatePageSection(section.id, section.active)
            }
         }
         await updateCustomQuestions()
         await updateCampaignDesignations()

         await CampaignUpdateService.updateThankYouPage(campaignId, thankPageInputs)
         for (const section of thankyouPageSections || []) {
            await CampaignUpdateService.updatePageSection(section.id, section.active)
         }

         await CampaignUpdateService.updateDonationForm(campaignId, donationFormInputs, currentUser.id)
         for (const section of donationFormSections || []) {
            await CampaignUpdateService.updatePageSection(section.id, section.active)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setError(true)
         setErrorMessage(handledError.message)
      }
   }

   const updateCampaignDesignations = async() => {
      try {
         const existingRelations = await CampaignService.getCampaignDesignations(campaignId)
         const relationsToAdd = selectedDesignations.filter(designation =>!existingRelations.includes(designation))
         const relationsToRemove = existingRelations.filter(designation =>!selectedDesignations.includes(designation))

         if (relationsToAdd.length > 0) {
            await CampaignCreateService.createCampaignDesignation(campaignId, relationsToAdd)
         }
         if (relationsToRemove.length > 0) {
            await CampaignService.deleteCampaignDesignationBatch(relationsToRemove)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Error updating campaign designations:', handledError.message)
      }
   }

   const updateCustomQuestions = async() => {
      try {
         const existingQuestions = await CampaignService.getCustomQuestions(campaignId)
         const questionsToAdd = customQuestions.filter(item => !existingQuestions.includes(item))
         const questionsToRemove = existingQuestions.filter(item => !customQuestions.includes(item))

         if (questionsToAdd.length > 0) {
            await CampaignCreateService.createCustomQuestion(campaignId, questionsToAdd)
         }
         if (questionsToRemove.length > 0) {
            await CampaignService.deleteCampaignQuestionsBatch(questionsToRemove)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Error updating custom questions:', handledError.message)
      }
   }

   const updateCampaignTickets = async() => {
      try {
         const existingTickets = await CampaignService.getCampaignTickets(campaignId)
         const ticketsToAdd = tickets.filter(item => !existingTickets.includes(item))
         const ticketsToRemove = existingTickets.filter(item => !tickets.includes(item))

         if (ticketsToAdd.length > 0) {
            await CampaignCreateService.createCampaignTicket(campaignId, ticketsToAdd)
         }
         if (ticketsToRemove.length > 0) {
            await CampaignService.deleteCampaignTicketsBatch(ticketsToRemove)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Error updating campaign tickets:', handledError.message)
      }
   }

   const handleDeactivate = async() => {
      if (!currentUser) {
         setErrorMessage("User not authenticated")
         setError(true)
         return;
      }
      
      try {
         await CampaignUpdateService.deactivateCampaign(campaignId, currentUser.id);
         router.push(`/org/${organizationId}/dashboard/campaigns`)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setError(true)
         setErrorMessage(handledError.message)
      }
   }

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="min-h-screen bg-gray-50">
            <div className="animate-pulse">
               <div className="h-16 bg-gray-200"></div>
               <div className="py-8">
                  <div className="w-full max-w-4xl mx-auto px-6">
                     <div className="h-8 bg-gray-200 rounded mb-4"></div>
                     <div className="h-4 bg-gray-200 rounded mb-8"></div>
                     <div className="space-y-4">
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div >
         <Navbar 
            campaignId={campaignId} 
            organizationId={organizationId} 
            detailsLink={detailsLink} 
            pageLinks={pageLinks} 
            handlePublish={handlePublish} 
            handleSave={handleSave} 
            handleDeactivate={handleDeactivate}
            status={campaignStatus}
         />
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default EditLayout