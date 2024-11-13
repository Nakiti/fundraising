"use client"
import axios from "axios"
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "../hooks/useFormInput";
import { AuthContext } from "./authContext";
import { getActiveDesignations, getCampaignDesignations, getCampaignDetails, getCampaignPreview, getCustomQuestions } from "../services/fetchService.js";
import BannerSection from "../org/campaign/components/previews/donationPage/sections/bannerSection";
import DescSection from "../org/campaign/components/previews/donationPage/sections/descSection";
import DonateSection from "../org/campaign/components/previews/donationPage/sections/donateSection";
import TitleSection from "../org/campaign/components/previews/donationPage/sections/titleSection";
import BackgroundSection from "../org/campaign/components/previews/thankPage/sections/backgroundSection";
import MessageSection from "../org/campaign/components/previews/thankPage/sections/messageSection";
import LandingBanner from "../org/campaign/components/previews/landingPage/sections/bannerSection";
import LandingAbout from "../org/campaign/components/previews/landingPage/sections/aboutSection";
import PurchaseSection from "../org/campaign/components/previews/landingPage/sections/purchaseSection";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children, campaignId }) => {
   const {currentUser} = useContext(AuthContext)
   const organization_id = currentUser.organization_id

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "title", displayText: "Title Section", active: true, required: true, dropdown: false, content: <TitleSection />},
      {name: "desc", displayText: "Description Section", active: true, required: true, dropdown: false, content: <DescSection />},
      {name: "donate", displayText: "Donate Section", active: true, required: true, dropdown: false, content: <DonateSection />},
   ])

   const [campaignType, setCampaignType] = useState("")

   const [designSections, setDesignSections] = useState([
      {name: "message", displayText: "Message Section", active: true, required: true, dropdown: false, content: <MessageSection />},
      {name: "background", displayText: "Background Section", active: true, required: true, dropdown: false, content: <BackgroundSection />},
   ])

   const [landingSections, setLandingSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <LandingBanner />},
      {name: "about", displayText: "About Section", active: true, required: true, dropdown: false, content: <LandingAbout />},
      {name: "purchase", displayText: "Purchase Section", active: true, required: true, dropdown: false, content: <PurchaseSection />},

   ])

   const [previewInputs, handlePreviewInputsChange, setPreviewInputs] = useFormInput({
      headline: '',
      description: '',
      image: '',
      // heading: '',
      bg_color: '#FFF', //background color
      p_color: '#000', //primary text color
      s_color: '#b3b3b3', //secondary text color
      h_color: '', //header background color
      ht_color: '', //header text color
      b1_color: '#045991', //button one color (donate)
      b2_color: '#989c9e', //button two color (share)
      b3_color: '#045991', //button three color (money)
      m_color: '#f9fafb', //modal color
   })

   const [thankInputs, handleThankInputsChange, setThankInputs] = useFormInput({
      backgroundImage: "",
      headline: "",
      description: ""
   })

   const [settingsInputs, handleSettingsInputsChange, setSettingsInputs] = useFormInput({
      title: '',
      description: '',
      goal: '',
      url: ''
   })

   const [amountInputs, handleAmountInputsChange, setAmountInputs] = useFormInput({
      button1: 10,
      button2: 25,
      button3: 50,
      button4: 75,
      button5: 100,
      button6: 200
   })

   const [aboutInputs, handleAboutInputsChange, setAboutInputs] = useFormInput({
      campaignName: "",
      internalName: "",
      goal: 0,
      shortUrl: "",
      defaultDesignation: 0,
   })

   const [questionInputs, handleQuestionInputsChange, setQuestionInputs] = useFormInput({
      phoneNumber: false,
      title: false,
      suffix: false,
      companyName: false,
      websiteUrl: false
   })

   const [customQuestions, setCustomQuestions] = useState([])

   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const [designations, setDesignations] = useState([])
   const [defaultDesignation, setDefaultDesignation] = useState(0)
   const [status, setStatus] = useState("inactive")

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (campaignId) {
               const settingsResponse = await getCampaignDetails(campaignId)
               setAboutInputs({
                  campaignName: settingsResponse.campaign_name,
                  internalName: settingsResponse.internal_name,
                  goal: settingsResponse.goal,
                  shortUrl: settingsResponse.url,
                  defaultDesignation: settingsResponse.default_designation
               })

               setCampaignType(settingsResponse.type)
               setStatus(settingsResponse.status)

               const previewResponse = await getCampaignPreview(campaignId)
               setPreviewInputs({
                  headline: previewResponse.headline,
                  description: previewResponse.description,
                  image: previewResponse.image,
                  // heading: previewResponse.heading,
                  bg_color: previewResponse.bg_color,
                  p_color: previewResponse.p_color,
                  s_color: previewResponse.s_color,
                  // h_color: previewResponse.h_color,
                  // ht_color: previewResponse.ht_color, //header text color
                  b1_color: previewResponse.b1_color, //button one color (donate)
                  b2_color: previewResponse.b2_color, //button two color (share)
                  b3_color: previewResponse.b3_color, //button three color (money)
                  // m_color: previewResponse.m_color, //modal color
               })

               setAmountInputs({
                  button1: previewResponse.button1,
                  button2: previewResponse.button2,
                  button3: previewResponse.button3,
                  button4: previewResponse.button4,
                  button5: previewResponse.button5,
                  button6: previewResponse.button6,
               })

               const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
               setSelectedDesignations(selectedDesignationsResponse)

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
         status, previewInputs, settingsInputs, handlePreviewInputsChange, 
         handleSettingsInputsChange, setPreviewInputs, selectedDesignations, setSelectedDesignations, 
         designations, customQuestions, setCustomQuestions, aboutInputs, handleAboutInputsChange,
         questionInputs, handleQuestionInputsChange, amountInputs, handleAmountInputsChange, 
         defaultDesignation, setDefaultDesignation, sections, setSections, designSections, setDesignSections,
         thankInputs, handleThankInputsChange, campaignType, landingSections, setLandingSections
      }}>
         {children}
      </CampaignContext.Provider>
   );
};
