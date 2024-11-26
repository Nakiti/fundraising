"use client"
import axios from "axios"
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "../hooks/useFormInput";
import { AuthContext } from "./authContext";
import { getActiveDesignations, getCampaignDesignations, getCampaignDetails, getCampaignPreview, getCustomQuestions, getDonationPage, getPageSections, getThankYouPage, getTicketPage } from "../services/fetchService.js";
import BannerSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/bannerSection";
import DescSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/descSection";
import DonateSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/donateSection";
import TitleSection from "../org/[organizationId]/campaign/components/previews/donationPage/sections/titleSection";
import BackgroundSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/backgroundSection";
import MessageSection from "../org/[organizationId]/campaign/components/previews/thankPage/sections/messageSection";
import LandingBanner from "../org/[organizationId]/campaign/components/previews/landingPage/sections/bannerSection";
import LandingAbout from "../org/[organizationId]/campaign/components/previews/landingPage/sections/aboutSection";
import PurchaseSection from "../org/[organizationId]/campaign/components/previews/landingPage/sections/purchaseSection";
import EventSection from "../org/[organizationId]/campaign/components/previews/landingPage/sections/eventSection";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children, campaignId, organizationId }) => {
   const {currentUser} = useContext(AuthContext)
   const organization_id = organizationId

   const [donationPageSections, setDonationPageSections] = useState([
      {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {id: 1, name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TitleSection />},
      {id: 2, name: "desc", displayText: "Description Section", active: true, required: false, dropdown: false, content: <DescSection />},
      {id: 3, name: "donate", displayText: "Donate Section", active: true, required: true, dropdown: false, content: <DonateSection />},
   ])

   const [campaignType, setCampaignType] = useState("")

   const [thankyouPageSections, setThankyouPageSections] = useState([
      {name: "message", displayText: "Message Section", active: true, required: true, dropdown: false, content: <MessageSection />},
      {name: "background", displayText: "Background Section", active: true, required: true, dropdown: false, content: <BackgroundSection />},
   ])

   const [ticketPageSections, setTicketPageSections] = useState([
      {id: 0, name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <LandingBanner />},
      {id: 1, name: "about", displayText: "About Section", active: true, required: true, dropdown: false, content: <LandingAbout />},
      {id: 1, name: "event", displayText: "Event Section", active: true, required: true, dropdown: false, content: <EventSection />},
      {id: 2, name: "purchase", displayText: "Purchase Section", active: true, required: true, dropdown: false, content: <PurchaseSection />},
   ])

   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs] = useFormInput({})
   const [thankPageInputs, handleThankPageInputsChange, setThankPageInputs] = useFormInput({})
   const [campaignDetails, handleCampaignDetailsChange, setCampaignDetails] = useFormInput({})
   const [ticketsPageInputs, handleTicketsPageInputs, setTicketsPageInputs] = useFormInput({})

   const [questionInputs, handleQuestionInputsChange, setQuestionInputs] = useFormInput({
      phoneNumber: false,
      title: false,
      suffix: false,
      companyName: false,
      websiteUrl: false
   })

   const [customQuestions, setCustomQuestions] = useState([])
   const [tickets, setTickets] = useState([
      {id: new Date(), title: "", quantity: 0, value: 0, descritpion: "", attendees: 0, maxPurchase: 0, dateStart: null, dateEnd: null}
   ])
   const [faqs, setFaqs] = useState([])
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [designations, setDesignations] = useState([])
   const [defaultDesignation, setDefaultDesignation] = useState(0)
   const [status, setStatus] = useState("inactive")

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (campaignId) {
               const settingsResponse = await getCampaignDetails(campaignId)
               console.log("asdfsdfsf", settingsResponse)
               setCampaignDetails({
                  campaignName: settingsResponse.external_name || "",
                  internalName: settingsResponse.internal_name || "",
                  goal: settingsResponse.goal || 0,
                  url: settingsResponse.url || "",
                  defaultDesignation: settingsResponse.default_designation || 0
               })

               setCampaignType(settingsResponse.type)
               setStatus(settingsResponse.status)

               if (settingsResponse.type == "donation") {
                  const donationResponse = await getDonationPage(campaignId)
                  const donationPageId = donationResponse.id
                  setDonationPageInputs({
                     headline: donationResponse.headline || "",
                     description: donationResponse.description || "",
                     banner_image: donationResponse.banner_image || "",
                     small_image: donationResponse.small_image || "",
                     bg_color: donationResponse.bg_color || "",
                     p_color: donationResponse.p_color || "",
                     s_color: donationResponse.s_color || "",
                     b1_color: donationResponse.b1_color || "", //button one color (donate)
                     b2_color: donationResponse.b2_color || "", //button two color (share)
                     b3_color: donationResponse.b3_color || "", //button three color (money)
                     button1: donationResponse.button1 || 0,
                     button2: donationResponse.button2 || 0,
                     button3: donationResponse.button3 || 0,
                     button4: donationResponse.button4 || 0,
                     button5: donationResponse.button5 || 0,
                     button6: donationResponse.button6 || 0,
                  })
   
                  console.log("donatonid", donationPageId)
                  const donationSections = await getPageSections(donationPageId)
                  setDonationPageSections((prevSections) => {
                     return prevSections.map(section => {
                        const match = donationSections.find((item) => item.name == section.name)
                        return {...section, id: match.id, active: match.active }
                     })
                  })

                  const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
                  setSelectedDesignations(selectedDesignationsResponse)

               } else if (settingsResponse.type == "ticketed-event") {
                  const ticketPageResponse = await getTicketPage(campaignId)
                  const ticketPageId = ticketPageResponse.id
                  setTicketsPageInputs({
                     title: ticketPageResponse.title || "",
                     date: ticketPageResponse.date || "",
                     address: ticketPageResponse.address || "",
                     bgImage: ticketPageResponse.bgImage || "",
                     aboutDescription: ticketPageResponse.aboutDescription || "",
                     venueName: ticketPageResponse.venueName || "",
                     instructions: ticketPageResponse.instructions || "",
                     bg_color: ticketPageResponse.bg_color || "",
                     bg_color2: ticketPageResponse.bg_color2 || "",
                     p_color: ticketPageResponse.p_color || "",
                     s_color: ticketPageResponse.s_color || "",
                     b1_color: ticketPageResponse.b1_color || ""
                  })

                  const ticketSections = await getPageSections(ticketPageId)
                  setTicketPageSections((prevSections) => {
                     return prevSections.map(section => {
                        const match = ticketSections.find((item) => item.name == section.name)
                        return {...section, id: match.id, active: match.active }
                     })
                  })
               }

               const thankyouPageResponse = await getThankYouPage(campaignId)
               const thankyouPageId = thankyouPageResponse.id
               setThankPageInputs({
                  headline: thankyouPageResponse.headline || "",
                  description: thankyouPageResponse.description || "",
                  bgImage: thankyouPageResponse.bgImage || "",
                  bg_color: thankyouPageResponse.bg_color || "",
                  p_color: thankyouPageResponse.p_color || "",
                  s_color: thankyouPageResponse.s_color || ""
               })
               const thankSections = await getPageSections(thankyouPageId)
               setThankyouPageSections((prevSections) => {
                  return prevSections.map(section => {
                     const match = thankSections.find((item) => item.name == section.name)
                     return { ...section, id: match.id, active: match.active }
                  })
               })

               const questionResponse = await getCustomQuestions(campaignId)
               setCustomQuestions(questionResponse)
            }
            const designationResponse = await getActiveDesignations(organization_id)
            setDesignations(designationResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, []);

   return (
      <CampaignContext.Provider value={{
         status, donationPageInputs, handleDonationPageInputsChange, selectedDesignations, setSelectedDesignations, 
         designations, customQuestions, setCustomQuestions, questionInputs, handleQuestionInputsChange, 
         defaultDesignation, setDefaultDesignation, donationPageSections, setDonationPageSections, thankyouPageSections, setThankyouPageSections,
         thankPageInputs, handleThankPageInputsChange, campaignType, ticketPageSections, setTicketPageSections, ticketsPageInputs,
         handleTicketsPageInputs, campaignDetails, handleCampaignDetailsChange, faqs, setFaqs, tickets, setTickets, campaignId
      }}>
         {children}
      </CampaignContext.Provider>
   );
};
