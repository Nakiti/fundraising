import { createContext, useEffect, useState } from "react";
import useFormInput from "@/app/hooks/useFormInput";
import { PageService } from "@/app/services/fetchService";

export const AboutPageContext = createContext()

export const AboutPageContextProvider = ({organizationId, children}) => {
   const [aboutPageInputs, handleAboutPageInputsChange, setAboutPageInputs] = useFormInput({})

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getAboutPage(organizationId)
            setAboutPageInputs({
               title: response.title || "",
               description: response.description || "",
               bgImage: response.bgImage || "",
               aboutText: response.aboutText || "",
               aboutImage: response.aboutImage || "",
               teamText: response.teamText || "",
               teamImage: response.teamImage || "",
               bg_color: response.bg_color || "#FFFFFF",
               p_color: response.p_color || "#000000",
               s_color: response.s_color || "gray",
            })
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <AboutPageContext.Provider value={{aboutPageInputs, handleAboutPageInputsChange, setAboutPageInputs}}>
         {children}
      </AboutPageContext.Provider>
   )
}