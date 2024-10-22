"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import LandingPageDisplay from "../../components/landingPageDisplay"
import { LandingPageContextProvider } from "@/app/context/landingPageContext"
import LandingPageNavbar from "../../components/landingPageNavbar"

const EditLandingLayout = ({children}) => {
   const pathname = usePathname()
   const links = [
      "/org/page/landing",
      "/org/page/landing/design"
   ]

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