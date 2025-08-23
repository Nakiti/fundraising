import { createContext, useContext, useEffect, useState } from "react";
import SocialSection from "@/app/org/[organizationId]/page/footer/components/sections/socialSection";
import { PageService } from "@/app/services/fetchService";
import useFormInput from "@/app/hooks/useFormInput";
import ContactSection from "@/app/org/[organizationId]/page/footer/components/sections/contactSection";

export const FooterPageContext = createContext()

export const FooterPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "contact", displayText: "Footer Contact", active: true, required: true, dropdown: false, content: <ContactSection />},
      {name: "social", displayText: "Social Media", active: true, required: false, dropdown: false, content: <SocialSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getFooterPage(organizationId)
            const footerPageId = response.id
            setInputs({
               id: response.id,
               // Basic content
               logo: response.logo || "",
               organizationName: response.organizationName || "",
               tagline: response.tagline || "",
               description: response.description || "",
               // Contact section fields
               address: response.address || "",
               phone: response.phone || "",
               email: response.email || "",
               businessHours: response.businessHours || "",
               contactFormUrl: response.contactFormUrl || "",
               // Social section fields
               socialLinks: response.socialLinks || [],
               // Basic styling
               bgColor: response.bgColor || "#1F2937",
               textColor: response.textColor || "#FFFFFF",
               fontSize: response.fontSize || "14px",
               borderTop: response.borderTop !== false,
               borderColor: response.borderColor || "#374151",
               shadow: response.shadow !== false,
               active: response.active || false
            })

            const sectionsResponse = await PageService.getPageSectionsByPage(organizationId, 'footer', footerPageId)
            setSections((prevSections) => {
               return prevSections.map(section => {
                  const match = sectionsResponse.find((item) => item.name == section.name)
                  return match ? { ...section, id: match.id, active: match.active } : {...section}
               })
            })
         } catch (error) {
            console.error("Error fetching footer page data:", error)
         }
      }

      fetchData()
   }, [])

   return (
      <FooterPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </FooterPageContext.Provider>
   )
}
