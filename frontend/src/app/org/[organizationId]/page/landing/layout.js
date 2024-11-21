"use client"
import { usePathname } from "next/navigation"
import LandingPageDisplay from "./components/landingPageDisplay"
import { LandingPageContextProvider } from "@/app/context/landingPageContext"
import { useContext, useState } from "react"
import { LandingPageContext } from "@/app/context/landingPageContext"
import { updateLandingPage } from "@/app/services/updateServices"
import { AuthContext } from "@/app/context/authContext"
import Navbar from "../components/navbar"

const EditLandingLayout = ({params, children}) => {
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   // const {inputs, setInputs} = useContext(LandingPageContext)
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId

   const links = [
      `/org/${organizationId}/page/landing`,
      `/org/${organizationId}/page/landing/design`
   ]

   // const handleSave = async() => {
   //    if (inputs.title == "" || inputs.description == "" || inputs.bgImage == "" || inputs.aboutImage == "" || inputs.about == "") {

   //    }

   //    try {
   //       await updateLandingPage(organizationId, inputs)

   //    } catch (err) {
   //       console.log(err)
   //    }
   // }

   return (
      <LandingPageContextProvider>
         <div className="w-full">
            <Navbar organizationId={organizationId} links={links} title={"Landing Page"}/>
            <div className="flex flex-row space-x-4 w-11/12 mx-auto mt-8 p-4">
               <div className="w-1/3">
                  {children}
               </div>
               <div className="w-2/3">
                  <LandingPageDisplay />
               </div>
            </div>
         </div>
      </LandingPageContextProvider>
   )
}

export default EditLandingLayout