"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"
import ContentSection from "./components/sections/contentSection"
import SocialSection from "./components/sections/socialSection"

const FooterPage = () => {
   const { inputs, handleInputsChange, sections } = useContext(FooterPageContext)

   return (
      <div className="space-y-6">
         {/* Content Section */}
         <ContentSection />

         {/* Social Media Section */}
         <SocialSection />
      </div>
   )
}

export default FooterPage
