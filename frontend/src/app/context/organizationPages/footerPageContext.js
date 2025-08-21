import { createContext, useContext, useEffect, useState } from "react";
import ContentSection from "@/app/org/[organizationId]/page/footer/components/sections/contentSection";
import SocialSection from "@/app/org/[organizationId]/page/footer/components/sections/socialSection";
import { PageService } from "@/app/services/fetchService";
import useFormInput from "@/app/hooks/useFormInput";

export const FooterPageContext = createContext()

export const FooterPageContextProvider = ({organizationId, children}) => {
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "content", displayText: "Footer Content", active: true, required: true, dropdown: false, content: <ContentSection />},
      {name: "social", displayText: "Social Media", active: true, required: false, dropdown: false, content: <SocialSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await PageService.getFooterPage(organizationId)
            const footerPageId = response.id
            setInputs({
               id: response.id,
               logo: response.logo || "",
               organizationName: response.organizationName || "",
               tagline: response.tagline || "",
               showTagline: response.showTagline !== false,
               description: response.description || "",
               showDescription: response.showDescription !== false,
               contactInfo: response.contactInfo || "",
               showContactInfo: response.showContactInfo !== false,
               links: response.links || [],
               showLinks: response.showLinks !== false,
               socialLinks: response.socialLinks || [],
               showSocialLinks: response.showSocialLinks !== false,
               bgColor: response.bgColor || "#1F2937",
               textColor: response.textColor || "#FFFFFF",
               linkColor: response.linkColor || "#60A5FA",
               footerHeight: response.footerHeight || "auto",
               fontSize: response.fontSize || "14px",
               borderTop: response.borderTop !== false,
               borderColor: response.borderColor || "#374151",
               shadow: response.shadow !== false,
               footerLayout: response.footerLayout || "three-column",
               contentAlignment: response.contentAlignment || "left",
               socialPosition: response.socialPosition || "bottom",
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
