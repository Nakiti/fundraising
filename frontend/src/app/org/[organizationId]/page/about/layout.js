"use client"
import { AboutPageContextProvider } from "@/app/context/aboutPageContext"
import Navbar from "../components/navbar"
import AboutPageDisplay from "./components/aboutPageDisplay"

const EditAboutLayout = ({children}) => {
   const links = [
      "/org/page/about",
      "/org/page/about/design"      
   ]

   return (
      <AboutPageContextProvider>
         <div className="w-full">
            <Navbar links={links} title={"About Page"}/>
            <div className="flex flex-row space-x-4 w-11/12 mx-auto mt-8 p-6">
               <div className="w-1/3">
                  {children}
               </div>
               <div className="w-2/3">
                  <AboutPageDisplay />
               </div>
            </div>
         </div>
      </AboutPageContextProvider>
   )
}

export default EditAboutLayout