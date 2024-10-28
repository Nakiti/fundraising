"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import LandingPageDisplay from "../../components/landingPageDisplay"
import { LandingPageContextProvider } from "@/app/context/landingPageContext"
import LandingPageNavbar from "../../components/landingPageNavbar"
import { useContext, useState } from "react"
import { LandingPageContext } from "@/app/context/landingPageContext"
import { updateLandingPage } from "@/app/services/updateServices"
import { AuthContext } from "@/app/context/authContext"

const EditLandingLayout = ({children}) => {
   const pathname = usePathname()
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   // const {inputs, setInputs} = useContext(LandingPageContext)
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser.organiztion_id

   const links = [
      "/org/page/landing",
      "/org/page/landing/design"
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
            <LandingPageNavbar />
            {/* <div className="border-b border-gray-400 py-6 w-11/12 mx-auto my-8 flex flex-row justify-between">
               <h1 className="text-3xl">Configure Donation Page</h1>
               <div className="space-x-4 text-lg">
                  <Link 
                     href={links[0]}
                     className={`px-8 py-4 border-b-2 ${
                        links[0] == pathname ? "border-blue-700" : "border-gray-600"}`}
                  >
                     Elements
                  </Link>
                  <Link 
                     href={links[1]}
                     className={`px-8 py-4 border-b-2 ${
                        links[1] == pathname ? "border-blue-700" : "border-gray-600"}`}               
                  >
                     Design
                  </Link>
               </div>
            </div> */}
            <div className="flex flex-row space-x-4 w-11/12 mx-auto mt-8">
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