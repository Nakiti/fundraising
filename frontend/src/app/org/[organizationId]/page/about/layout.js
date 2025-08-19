"use client"
import Navbar from "../components/navbar"
import AboutPageDisplay from "./components/aboutPageDisplay"
import { useContext, useState } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"
import { updateAboutPage, updatePageSection } from "@/app/services/updateServices"

const EditAboutLayout = ({params, children}) => {
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isSaving, setIsSaving] = useState(false)
   
   const organizationId = params.organizationId
   const links = [
      `/org/${organizationId}/page/about`,
      `/org/${organizationId}/page/about/design`      
   ]
   const {inputs, sections} = useContext(AboutPageContext)

   const handleSave = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsSaving(true)

      try {
         // Validate required fields
         const requiredFields = {
            headline: inputs.headline,
            aboutText: inputs.aboutText,
            bgImage: inputs.bgImage
         }

         const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key)

         if (missingFields.length > 0) {
            setError(true)
            setErrorMessage(`Please fill in the following required fields: ${missingFields.join(", ")}`)
            setIsSaving(false)
            return
         }

         // Get the about page ID from the context
         const aboutPageId = inputs.id

         // Update about page content and styling
         await updateAboutPage(aboutPageId, inputs)
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await updatePageSection(section.id, section.active)
            }
         }

         // Success feedback
         console.log("About page saved successfully!")
         setIsSaving(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error saving about page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to save about page. Please try again.")
         setIsSaving(false)
      }
   }

   return (
      <div className="w-full h-full bg-gray-50">
         <Navbar organizationId={organizationId} links={links} title={"About Page"} handleSave={handleSave} isSaving={isSaving} status={inputs.active ? 'active' : 'draft'}/>
         
         {/* Error Display */}
         {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
               <div className="flex">
                  <div className="flex-shrink-0">
                     <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                     </svg>
                  </div>
                  <div className="ml-3">
                     <h3 className="text-sm font-medium text-red-800">Error saving page</h3>
                     <div className="mt-2 text-sm text-red-700">
                        {errorMessage}
                     </div>
                  </div>
               </div>
            </div>
         )}
         
         <div className="p-4 space-y-4">
            <div className="flex flex-col xl:flex-row gap-4 h-[calc(100vh-120px)]">
               {/* Left Panel - Content Editor */}
               <div className="xl:w-1/4 lg:w-1/3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-full overflow-y-auto">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-white py-2">Content Editor</h2>
                     <div className="space-y-4">
                        {children}
                     </div>
                  </div>
               </div>
               
               {/* Right Panel - Preview */}
               <div className="xl:w-3/4 lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-white py-2">Live Preview</h2>
                     <div className="h-full overflow-y-auto">
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                           <AboutPageDisplay />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default EditAboutLayout