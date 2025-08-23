"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"
import SectionManager from "@/app/components/sectionManager"

const FooterPage = () => {
   const { sections, setSections } = useContext(FooterPageContext)

   return (
      <div className="w-full">
         {sections.map((section) => (
            <SectionManager section={section} sections={sections} setSections={setSections}/>
         ))}      
      </div>
   )
}

export default FooterPage
