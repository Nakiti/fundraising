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
      bg_color: '',
      p_color: '',
      s_color: '',
      h_color: ''
   })

   const [settingsInputs, handleSettingsInputsChange, setSettingsInputs] = useFormInput({
      title: '',
      description: '',
      goal: '',
      url: ''
   })

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
                  h_color: previewResponse.h_color
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
      <CampaignContext.Provider value={{status, previewInputs, settingsInputs, handlePreviewInputsChange, handleSettingsInputsChange, setPreviewInputs, selectedDesignations, setSelectedDesignations, designations}}>
         {children}
      </CampaignContext.Provider>
   );
};
