"use client"
import axios from "axios"
import { createContext, useState, useEffect, useContext } from "react";
import useFormInput from "../hooks/useFormInput";
import { AuthContext } from "./authContext";
import { getActiveDesignations, getCampaignDesignations, getCampaignDetails, getCampaignPreview } from "../services/fetchService.js";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children, campaignId }) => {
   const {currentUser} = useContext(AuthContext)
   const organization_id = currentUser.organization_id

   const [previewInputs, handlePreviewInputsChange, setPreviewInputs] = useFormInput({
      title: '',
      message: '',
      image: '',
      heading: '',
      bg_color: '', //background color
      p_color: '', //primary text color
      s_color: '', //secondary text color
      h_color: '', //header background color
      ht_color: '', //header text color
      b1_color: '', //button one color (donate)
      b2_color: '', //button two color (share)
      b3_color: '', //button three color (money)
      m_color: '', //modal color
   })

   const [settingsInputs, handleSettingsInputsChange, setSettingsInputs] = useFormInput({
      title: '',
      description: '',
      goal: '',
      url: ''
   })

   const [amountInputs, handleAmountInputsChange, setAmountInputs] = useFormInput({
      button1: 0,
      button2: 0,
      button3: 0,
      button4: 0,
      button5: 0,
      button6: 0,
   })

   const [aboutInputs, handleAboutInputsChange, setAboutInputs] = useFormInput({
      campaignName: "",
      internalName: "",
      goal: "",
      shortUrl: ""
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
   const [status, setStatus] = useState("inactive")

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (campaignId) {
               const settingsResponse = await getCampaignDetails(campaignId)
               setSettingsInputs({
                  title: settingsResponse.title,
                  description: settingsResponse.description,
                  goal: settingsResponse.goal,
                  url: settingsResponse.url
               })

               setStatus(settingsResponse.status)

               const previewResponse = await getCampaignPreview(campaignId)
               setPreviewInputs({
                  title: previewResponse.title,
                  message: previewResponse.message,
                  image: previewResponse.image,
                  heading: previewResponse.heading,
                  bg_color: previewResponse.bg_color,
                  p_color: previewResponse.p_color,
                  s_color: previewResponse.s_color,
                  h_color: previewResponse.h_color,
                  ht_color: previewResponse.ht_color, //header text color
                  b1_color: previewResponse.b1_color, //button one color (donate)
                  b2_color: previewResponse.b2_color, //button two color (share)
                  b3_color: previewResponse.b3_color, //button three color (money)
                  m_color: previewResponse.m_color, //modal color
               })

               const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
               setSelectedDesignations(selectedDesignationsResponse)
               console.log(selectedDesignationsResponse)

               
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
         questionInputs, handleQuestionInputsChange, amountInputs, handleAmountInputsChange
      }}>
         {children}
      </CampaignContext.Provider>
   );
};
