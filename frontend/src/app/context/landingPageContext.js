import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import useFormInput from "../hooks/useFormInput";
import BannerSection from "../org/[organizationId]/page/landing/components/sections/bannerSection";
import AboutSection from "../org/[organizationId]/page/landing/components/sections/aboutSection";
import ImpactSection from "../org/[organizationId]/page/landing/components/sections/impactSection";
import LargeTextSection from "../org/[organizationId]/page/landing/components/sections/largeTextSection";
import TripleSection from "../org/[organizationId]/page/landing/components/sections/tripleSection";
import { getLandingPage, getPageSections } from "../services/fetchService";

export const LandingPageContext = createContext()

export const LandingPageContextProvider = ({organizationId, children}) => {
   // const {currentUser} = useContext(AuthContext)
   // const organizationId = currentUser.organization_id
 
   const [inputs, handleInputsChange, setInputs] = useFormInput({})

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "main", displayText: "Main Section", active: false, required: false, dropdown: false, content: <LargeTextSection />},
      {name: "about", displayText: "About Section", active: false, required: false, dropdown: false, content: <AboutSection />},
      {name: "impact", displayText: "Impact Section", active: false, required: false, dropdown: false, content: <ImpactSection />},
      {name: "featured", displayText: "Featured Campaign", active: false, required: false, dropdown: false, content: <ImpactSection />},
      {name: "triple", displayText: "Triple Section", active: false, required: false, dropdown: false, content: <TripleSection />}
   ])

   useEffect(() => {
      const fetchData = async() => {

         const response = await getLandingPage(organizationId)
         const landingPageId = response.id
         setInputs({
            title: response.title || "",
            description: response.description || "",
            bgImage: response.bgImage || "",
            aboutImage: response.aboutImage || "",
            about: response.about || "",
            bg_color: response.bg_color || "#FFFFFF",
            p_color: response.p_color || "#000000",
            s_color: response.s_color || "gray",
            c_color: response.c_color || "#FFFFFF",
            ct_color: response.ct_color || "#000000",
            b_color: response.b_color || "blue",
            bt_color: response.bt_color || "white",
            active: response.active || false
         })

         const sectionsResponse = await getPageSections(landingPageId)
         setSections((prevSections) => {
            return prevSections.map(section => {
               const match = sectionsResponse.find((item) => item.name == section.name)
               return match ? { ...section, id: match.id, active: match.active } : {...section}
            })
         })
      }

      fetchData()
   }, [])

   return (
      <LandingPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </LandingPageContext.Provider>
   )
}