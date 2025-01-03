"use client"
import { useContext } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import SectionManager from "@/app/components/sectionManager"

const About = () => {
   const {sections, setSections} = useContext(AboutPageContext)

   return (
      <div className="w-full">
         {sections.map(section => (
            <SectionManager section={section} sections={sections} setSections={setSections}/>
         ))}
      </div>
   )
}

export default About