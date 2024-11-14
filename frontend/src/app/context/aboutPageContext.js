import { createContext, useContext, useState } from "react";
import useFormInput from "../hooks/useFormInput";
import BannerSection from "../org/[organizationId]/page/about/components/sections/bannerSection";
import WhatSection from "../org/[organizationId]/page/about/components/sections/whatSection";
import WhySection from "../org/[organizationId]/page/about/components/sections/whySection";
import TeamSection from "../org/[organizationId]/page/about/components/sections/teamSection";
export const AboutPageContext = createContext()


export const AboutPageContextProvider = ({children}) => {

   const [inputs, handleInputsChange, setInputs] = useFormInput({
      headline: "",
      bannerImage: "",
      whatText: "",
      whyText: "",
      bg_color: "",
      p_color: "",
      s_color: ""
   })

   const [sections, setSections] = useState([
      {name: "banner", displayText: "Banner Section", active: true, required: true, dropdown: false, content: <BannerSection />},
      {name: "what", displayText: "What Section", active: true, required: true, dropdown: false, content: <WhatSection />},
      {name: "why", displayText: "Why Section", active: true, required: true, dropdown: false, content: <WhySection />},
      {name: "team", displayText: "Team Section", active: true, required: true, dropdown: false, content: <TeamSection />},
   ])

   return (
      <AboutPageContext.Provider value={{sections, setSections, inputs, handleInputsChange, setInputs}}>
         {children}
      </AboutPageContext.Provider>
   )
}