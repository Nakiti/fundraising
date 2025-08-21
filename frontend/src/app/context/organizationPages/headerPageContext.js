import { createContext, useContext, useEffect, useState } from "react";
import LogoSection from "@/app/org/[organizationId]/page/header/components/sections/logoSection";
import NavigationSection from "@/app/org/[organizationId]/page/header/components/sections/navigationSection";
import StylingSection from "@/app/org/[organizationId]/page/header/components/sections/stylingSection";
import { PageService } from "@/app/services/fetchService";
import useFormInput from "@/app/hooks/useFormInput";

export const HeaderPageContext = createContext()

export const HeaderPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "logo", displayText: "Logo & Branding", active: true, required: true, dropdown: false, content: <LogoSection />},
      {name: "navigation", displayText: "Navigation Menu", active: true, required: false, dropdown: false, content: <NavigationSection />},
      {name: "styling", displayText: "Header Styling", active: false, required: false, dropdown: false, content: <StylingSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getHeaderPage(organizationId)
            const headerPageId = response.id
            setInputs({
               // Page ID
               id: response.id,
               // Content fields
               logo: response.logo || "",
               organizationName: response.organizationName || "",
               tagline: response.tagline || "",
               showTagline: response.showTagline !== false,
               
               // Navigation
               showNavigation: response.showNavigation !== false,
               navigationItems: response.navigationItems || [],
               showSearch: response.showSearch !== false,
               showLoginButton: response.showLoginButton !== false,
               showDonateButton: response.showDonateButton !== false,
               
               // Styling
               bgColor: response.bgColor || "#FFFFFF",
               textColor: response.textColor || "#000000",
               accentColor: response.accentColor || "#3B82F6",
               headerHeight: response.headerHeight || "80px",
               logoSize: response.logoSize || "40px",
               fontSize: response.fontSize || "16px",
               fontWeight: response.fontWeight || "500",
               borderBottom: response.borderBottom !== false,
               borderColor: response.borderColor || "#E5E7EB",
               shadow: response.shadow !== false,
               
               // Layout
               logoPosition: response.logoPosition || "left",
               navigationPosition: response.navigationPosition || "center",
               buttonPosition: response.buttonPosition || "right",
               
               // Status
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
