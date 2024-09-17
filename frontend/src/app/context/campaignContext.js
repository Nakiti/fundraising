"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react";
import useFormInput from "../hooks/useFormInput";

export const CampaignContext = createContext();

export const CampaignContextProvider = ({ children }) => {

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

   useEffect(() => {
      const fetchData = async () => {
         try {
            const settingsResponse = (await axios.get(`http://localhost:4000/api/campaign/get/${1}`)).data[0]
            setSettingsInputs({
               title: settingsResponse.title,
               description: settingsResponse.description,
               goal: settingsResponse.goal,
               url: settingsResponse.url
            })

            const previewResponse = (await axios.get(`http://localhost:4000/api/campaign/get/${1}`)).data[0]
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
 
         } catch (err) {
            console.log(err)
         }
      }

   }, []);

   return (
      <CampaignContext.Provider value={{previewInputs, settingsInputs, handlePreviewInputsChange, handleSettingsInputsChange, setPreviewInputs}}>
         {children}
      </CampaignContext.Provider>
   );
};
