import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import useFormInput from "../hooks/useFormInput";
import { getLandingPage } from "../services/fetchService";
import BannerSection from "../org/page/landing/components/sections/bannerSection";
import AboutSection from "../org/page/landing/components/sections/aboutSection";
import ImpactSection from "../org/page/landing/components/sections/impactSection";

export const LandingPageContext = createContext()

export const LandingPageContextProvider = ({children}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organization_id
 
   const [inputs, handleInputsChange, setInputs] = useFormInput({
      title: "",
      description: "",
      bgImage: "",
      aboutImage: "",
      about: "",
      bg_color: "#FFFFFF",
      p_color: "#000000",
      s_color: "gray",
      c_color: "#FFFFFF",
      ct_color: "#000000",
      b_color: "blue",
      bt_color: "white",
      active: false
   })

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, dropdown: false, content: <BannerSection />},
      {name: "about", displayText: "About Section", active: false, dropdown: false, content: <AboutSection />},
      {name: "impact", displayText: "Impact Section", active: false, dropdown: false, content: <ImpactSection />},
      {name: "featured", displayText: "Featured Campaign", active: false, dropdown: false, content: <ImpactSection />}

   ])

   // useEffect(() => {
   //    const fetchData = async() => {

   //       const response = await getLandingPage(organizationId)
   //       setInputs({
   //          title: response.title || "",
   //          description: response.description || "",
   //          bgImage: response.bgImage || "",
   //          aboutImage: response.aboutImage || "",
   //          about: response.about || "",
   //          bg_color: response.bg_color || "#FFFFFF",
   //          p_color: response.p_color || "#000000",
   //          s_color: response.s_color || "gray",
   //          c_color: response.c_color || "#FFFFFF",
   //          ct_color: response.ct_color || "#000000",
   //          b_color: response.b_color || "blue",
   //          bt_color: response.bt_color || "white",
   //          active: response.active || false
   //       })
   //    }

   //    fetchData()
   // }, [])

   return (
      <LandingPageContext.Provider value={{inputs, handleInputsChange, setInputs, sections, setSections}}>
         {children}
      </LandingPageContext.Provider>
   )
}