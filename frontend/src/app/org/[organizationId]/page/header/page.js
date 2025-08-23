"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import SectionManager from "@/app/components/sectionManager"

const HeaderPage = () => {
   const { sections, setSections } = useContext(HeaderPageContext)

   return (
      <div className="w-full">
         {sections.map((section) => (
            <SectionManager key={section.name} section={section} sections={sections} setSections={setSections}/>
         ))}
      </div>
   )
}

export default HeaderPage
