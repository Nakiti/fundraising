import { createContext, useContext, useEffect, useState } from "react";
import LogoSection from "@/app/org/[organizationId]/page/header/components/sections/logoSection";
import { PageService } from "@/app/services/fetchService";
import useFormInput from "@/app/hooks/useFormInput";

export const HeaderPageContext = createContext()

export const HeaderPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "logo", displayText: "Logo & Branding", active: true, required: true, dropdown: false, content: <LogoSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getHeaderPage(organizationId)
            const headerPageId = response.id
            setInputs({
               id: response.id,
               // Basic content
               logo: response.logo || "",
               organizationName: response.organizationName || "",
               tagline: response.tagline || "",
               description: response.description || "",
               // Basic styling
               bgColor: response.bgColor || "#FFFFFF",
               textColor: response.textColor || "#000000",
               linkColor: response.linkColor || "#3B82F6",
               fontSize: response.fontSize || "16px",
               borderBottom: response.borderBottom !== false,
               borderColor: response.borderColor || "#E5E7EB",
               shadow: response.shadow !== false,
               active: response.active || false
            })

            const sectionsResponse = await PageService.getPageSectionsByPage(organizationId, 'header', headerPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (error) {
            console.error("Error fetching header page data:", error)
         }
      }

      fetchData()
   }, [])

   return (
      <HeaderPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </HeaderPageContext.Provider>
   )
}
