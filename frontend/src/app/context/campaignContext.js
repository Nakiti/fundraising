"use client"
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "../hooks/useFormInput";
import { getActiveDesignations, getCampaignDetails, getCustomQuestions, getPageSections, getThankYouPage, getTicketPage } from "../services/fetchService.js";
import { initialThankyouPageSections } from "../constants/pageSectionsConfig";
import { getCampaignDesignations } from "../services/fetchService.js";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children, campaignId, organizationId }) => {
   const [thankyouPageSections, setThankyouPageSections] = useState(initialThankyouPageSections)
   const [campaignType, setCampaignType] = useState("")
   const [campaignStatus, setCampaignStatus] = useState("")
   const [thankPageInputs, handleThankPageInputsChange, setThankPageInputs] = useFormInput({})
   const [campaignDetails, handleCampaignDetailsChange, setCampaignDetails] = useFormInput({})
   
   const [questionInputs, handleQuestionInputsChange, setQuestionInputs] = useFormInput({
      phoneNumber: false,
      title: false,
      suffix: false,
      companyName: false,
      websiteUrl: false
   })

   const [customQuestions, setCustomQuestions] = useState([])
   const [faqs, setFaqs] = useState([])
   const [designations, setDesignations] = useState([])
   const [defaultDesignation, setDefaultDesignation] = useState(0)
   const [selectedDesignations, setSelectedDesignations] = useState([])

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (campaignId) {
               const settingsResponse = await getCampaignDetails(campaignId)
               setCampaignDetails({
                  campaignName: settingsResponse.external_name || "",
                  internalName: settingsResponse.internal_name || "",
                  goal: settingsResponse.goal || 0,
                  url: settingsResponse.url || "",
                  defaultDesignation: settingsResponse.default_designation || 0
               })

               setCampaignType(settingsResponse.type)
               setCampaignStatus(settingsResponse.status)

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

               const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
               setSelectedDesignations(selectedDesignationsResponse)
            }
            const designationResponse = await getActiveDesignations(organizationId)
            setDesignations(designationResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, []);

   return (
      <CampaignContext.Provider value={{
         campaignStatus, designations, customQuestions, setCustomQuestions, questionInputs, handleQuestionInputsChange, 
         defaultDesignation, setDefaultDesignation, thankyouPageSections, setThankyouPageSections,
         thankPageInputs, handleThankPageInputsChange, campaignType, campaignDetails, handleCampaignDetailsChange, faqs, setFaqs, campaignId,
         selectedDesignations, setSelectedDesignations
      }}>
         {children}
      </CampaignContext.Provider>
   );
};
