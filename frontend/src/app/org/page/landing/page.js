"use client"
import { useContext, useState } from "react"
import { LandingPageContext } from "@/app/context/landingPageContext"
import SectionManager from "@/app/components/sectionManager";

const Landing = () => {
   const {sections, setSections} = useContext(LandingPageContext)

   return (
      <div className="w-full">
         {sections.map((section) => (
            <SectionManager section={section} sections={sections} setSections={setSections}/>
         ))}
      </div>
   )
}

export default Landing