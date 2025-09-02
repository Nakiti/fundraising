"use client"
import Navbar from "@/app/org/[organizationId]/campaign/components/navbar"
import { useRouter } from "next/navigation"
import { useContext, useState, useEffect } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import ErrorModal from "@/app/components/errorModal"
import { getCampaignService, getPageService, getDesignationService } from "@/app/services"
import { errorHandler } from "@/app/services/apiClient"
import { DonationPageContext, DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext"
import { TicketPageContext, TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext"
import { PeerLandingPageContext, PeerLandingPageContextProvider } from "@/app/context/campaignPages/peerLandingPageContext"
import { PeerFundraisingPageContext, PeerFundraisingPageContextProvider } from "@/app/context/campaignPages/peerFundraisingPageContext"
import { DonationFormContext, DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext"
import { ThankYouPageContext, ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext"
import { TicketPurchasePageContext, TicketPurchasePageContextProvider } from "@/app/context/campaignPages/ticketPurchasePageContext"
import { validateActiveSections } from "@/app/utils/pageValidation"

const EditLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const router = useRouter()
   const {campaignDetails, selectedDesignations, customQuestions, campaignType, tickets, faqs, loading, fetchCampaignData, campaignStatus, hasUnsavedChanges, markChangesAsSaved, checkForChanges} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   // Fetch campaign data when component mounts
   useEffect(() => {
      if (campaignId && organizationId && fetchCampaignData) {
         fetchCampaignData(campaignId, organizationId);
      }
   }, [campaignId, organizationId]);

   // Check for changes when data changes
   useEffect(() => {
      if (campaignDetails && checkForChanges) {
         checkForChanges();
      }
   }, [campaignDetails, selectedDesignations, customQuestions, tickets, faqs]);

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
      // Reset error state
      setError(false)
      setErrorMessage("")

      // Validate campaign details
      if (!campaignDetails || campaignDetails.campaignName === "" || campaignDetails.internalName === "" || 
         campaignDetails.goal === 0 || campaignDetails.shortUrl === "" || campaignDetails.designation === 0) {
         setErrorMessage("Please Fill All Required Campaign Fields")
         setError(true)
         return
      }

      // Validate all active page sections based on campaign type
      const validationErrors = []

      // Validate donation page sections (for crowdfunding campaigns)
      if (campaignType === "crowdfunding" && donationPageSections) {
         const donationValidation = validateActiveSections('donation', donationPageSections, donationPageInputs)
         if (!donationValidation.isValid) {
            validationErrors.push(...donationValidation.errors)
         }
      }

      // Validate ticket page sections (for ticketed events)
      if (campaignType === "ticketed-event" && ticketPageSections) {
         const ticketValidation = validateActiveSections('ticket', ticketPageSections, ticketPageInputs)
         if (!ticketValidation.isValid) {
            validationErrors.push(...ticketValidation.errors)
         }
      }

      // Validate peer landing page sections (for peer-to-peer campaigns)
      if (campaignType === "peer-to-peer" && peerLandingPageSections) {
         const peerLandingValidation = validateActiveSections('peerLanding', peerLandingPageSections, peerLandingPageInputs)
         if (!peerLandingValidation.isValid) {
            validationErrors.push(...peerLandingValidation.errors)
         }
      }

      // Validate peer fundraising page sections (for peer-to-peer campaigns)
      if (campaignType === "peer-to-peer" && peerFundraisingPageSections) {
         const peerFundraisingValidation = validateActiveSections('peerFundraising', peerFundraisingPageSections, peerFundraisingPageInputs)
         if (!peerFundraisingValidation.isValid) {
            validationErrors.push(...peerFundraisingValidation.errors)
         }
      }

      // Validate donation form sections (for all campaigns)
      if (donationFormSections) {
         const donationFormValidation = validateActiveSections('donationForm', donationFormSections, donationFormInputs)
         if (!donationFormValidation.isValid) {
            validationErrors.push(...donationFormValidation.errors)
         }
      }

      // Validate thank you page sections (for all campaigns)
      if (thankyouPageSections) {
         const thankYouValidation = validateActiveSections('thankYou', thankyouPageSections, thankPageInputs)
         if (!thankYouValidation.isValid) {
            validationErrors.push(...thankYouValidation.errors)
         }
      }

      // Validate ticket purchase sections (for ticketed events)
      if (campaignType === "ticketed-event" && ticketPurchaseSections) {
         const ticketPurchaseValidation = validateActiveSections('ticketPurchase', ticketPurchaseSections, ticketPurchaseInputs)
         if (!ticketPurchaseValidation.isValid) {
            validationErrors.push(...ticketPurchaseValidation.errors)
         }
      }

      // If there are validation errors, show them and return
      if (validationErrors.length > 0) {
         setErrorMessage(`Please fill in the following required fields to publish: ${validationErrors.join(", ")}`)
         setError(true)
         return
      }

      try {
         const campaignService = getCampaignService();
         const response = await campaignService.updateCampaign(campaignId, campaignDetails)
         if (response) {
            setError(true)
            setErrorMessage(response)
         } else {
            handleCampaignUpdates()
            markChangesAsSaved()
            router.push(`/org/${organizationId}/dashboard/campaigns`)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setError(true)
         setErrorMessage(handledError.message)
      }
   }

   const handleSave = async() => {
      if (!campaignDetails) {
         setErrorMessage("Campaign details not loaded")
         setError(true)
         return;
      }
      
      try {
         const campaignService = getCampaignService();
         const response = await campaignService.updateCampaign(campaignId, campaignDetails);
         if (response) {
            setError(true)
            setErrorMessage(response)
         } else {
            handleCampaignUpdates()
            markChangesAsSaved()
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
         const updatePromises = []
         const campaignService = getCampaignService();
         const pageService = getPageService();

         // Campaign type specific updates
         if (campaignType === "crowdfunding") {
            updatePromises.push(pageService.updateDonationPage(campaignId, donationPageInputs))
            
            if (donationPageSections) {
               updatePromises.push(...donationPageSections.map(section => 
                  pageService.updatePageSection(section.id, section.active)
               ))
            }
         } else if (campaignType === "ticketed-event") {
            updatePromises.push(
               pageService.updateTicketPage(campaignId, ticketPageInputs),
               pageService.updateTicketPurchasePage(campaignId, ticketPurchaseInputs, currentUser.id),
               updateCampaignTickets()
            )
            
            if (ticketPageSections) {
               updatePromises.push(...ticketPageSections.map(section => 
                  pageService.updatePageSection(section.id, section.active)
               ))
            }
         } else if (campaignType === "peer-to-peer") {
            updatePromises.push(
               pageService.updatePeerLandingPage(campaignId, peerLandingPageInputs),
               pageService.updatePeerFundraisingPage(campaignId, peerFundraisingPageInputs, currentUser.id)
            )
            
            if (peerLandingPageSections) {
               updatePromises.push(...peerLandingPageSections.map(section => 
                  pageService.updatePageSection(section.id, section.active)
               ))
            }
            if (peerFundraisingPageSections) {
               updatePromises.push(...peerFundraisingPageSections.map(section => 
                  pageService.updatePageSection(section.id, section.active)
               ))
            }
         }

         // Common updates that can run in parallel
         updatePromises.push(
            updateCustomQuestions(),
            updateCampaignDesignations(),
            pageService.updateThankYouPage(campaignId, thankPageInputs),
            pageService.updateDonationForm(campaignId, donationFormInputs, currentUser.id)
         )

         // Add section updates for thank you page and donation form
         if (thankyouPageSections) {
            updatePromises.push(...thankyouPageSections.map(section => 
               pageService.updatePageSection(section.id, section.active)
            ))
         }
         if (donationFormSections) {
            updatePromises.push(...donationFormSections.map(section => 
               pageService.updatePageSection(section.id, section.active)
            ))
         }

         // Execute all updates in parallel
         await Promise.all(updatePromises)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setError(true)
         setErrorMessage(handledError.message)
      }
   }

   const updateCampaignDesignations = async() => {
      try {
         const campaignService = getCampaignService();
         const designationService = getDesignationService();
         const existingRelations = await campaignService.getCampaignDesignations(campaignId)
         const relationsToAdd = selectedDesignations.filter(designation =>!existingRelations.includes(designation))
         const relationsToRemove = existingRelations.filter(designation =>!selectedDesignations.includes(designation))

         if (relationsToAdd.length > 0) {
            await designationService.addCampaignDesignation(campaignId, relationsToAdd)
         }
         if (relationsToRemove.length > 0) {
            await designationService.removeCampaignDesignation(relationsToRemove)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Error updating campaign designations:', handledError.message)
      }
   }

   const updateCustomQuestions = async() => {
      try {
         const campaignService = getCampaignService();
         const existingQuestions = await campaignService.getCustomQuestions(campaignId)
         const questionsToAdd = customQuestions.filter(item => !existingQuestions.includes(item))
         const questionsToRemove = existingQuestions.filter(item => !customQuestions.includes(item))

         if (questionsToAdd.length > 0) {
            await campaignService.addCampaignQuestion(campaignId, questionsToAdd)
         }
         if (questionsToRemove.length > 0) {
            await campaignService.removeCampaignQuestion(questionsToRemove)
         }
      } catch (err) {
         const handledError = errorHandler.handle(err)
         console.error('Error updating custom questions:', handledError.message)
      }
   }

   const updateCampaignTickets = async() => {
      try {
         const campaignService = getCampaignService();
         const existingTickets = await campaignService.getCampaignTickets(campaignId)
         const ticketsToAdd = tickets.filter(item => !existingTickets.includes(item))
         const ticketsToRemove = existingTickets.filter(item => !tickets.includes(item))

         if (ticketsToAdd.length > 0) {
            await campaignService.addCampaignTicket(campaignId, ticketsToAdd)
         }
         if (ticketsToRemove.length > 0) {
            await campaignService.removeCampaignTicket(ticketsToRemove)
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
         const campaignService = getCampaignService();
         await campaignService.deactivateCampaign(campaignId, currentUser.id);
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
            hasUnsavedChanges={hasUnsavedChanges}
         />
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="py-0">
            <DonationPageContextProvider campaignId={campaignId} organizationId={organizationId}>
               {/* <TicketPageContextProvider campaignId={campaignId}>
                  <PeerLandingPageContextProvider campaignId={campaignId}>
                     <PeerFundraisingPageContextProvider campaignId={campaignId}> */}
                        <DonationFormContextProvider campaignId={campaignId} organizationId={organizationId}>
                           <ThankYouPageContextProvider campaignId={campaignId} organizationId={organizationId}>
                              {/* <TicketPurchasePageContextProvider campaignId={campaignId}> */}
                                 {children}
                              {/* </TicketPurchasePageContextProvider> */}
                           </ThankYouPageContextProvider>
                        </DonationFormContextProvider>
                     {/* </PeerFundraisingPageContextProvider>
                  </PeerLandingPageContextProvider>
               </TicketPageContextProvider> */}
            </DonationPageContextProvider>
         </div>
      </div>
   )
}

export default EditLayout