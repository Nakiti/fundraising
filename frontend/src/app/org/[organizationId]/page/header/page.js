"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import LogoSection from "./components/sections/logoSection"
import NavigationSection from "./components/sections/navigationSection"

const HeaderPage = () => {
   const { inputs, handleInputsChange, sections } = useContext(HeaderPageContext)

   return (
      <div className="space-y-6">
         {/* Logo Section */}
         <LogoSection />

         {/* Navigation Section */}
         <NavigationSection />
      </div>
   )
}

export default HeaderPage
