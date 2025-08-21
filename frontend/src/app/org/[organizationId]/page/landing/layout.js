"use client"
import LandingPageDisplay from "./components/landingPageDisplay"
import { useContext, useState } from "react"
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import { updateLandingPage, updatePageSection } from "@/app/services/updateServices"
import { AuthContext } from "@/app/context/authContext"
import Navbar from "../components/navbar"

const EditLandingLayout = ({params, children}) => {
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isSaving, setIsSaving] = useState(false)
   const [isPublishing, setIsPublishing] = useState(false)
   const [isDeactivating, setIsDeactivating] = useState(false)
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const {inputs, sections, setInputs} = useContext(LandingPageContext)

   const links = [
      `/org/${organizationId}/page/landing`,
      `/org/${organizationId}/page/landing/design`
   ]

   const handleSave = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsSaving(true)

      try {
         // Update landing page content and styling (no validation for save)
         await updateLandingPage(inputs.id, inputs)
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await updatePageSection(section.id, section.active)
            }
         }

         // Success feedback
         console.log("Landing page saved successfully!")
         setIsSaving(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error saving landing page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to save landing page. Please try again.")
         setIsSaving(false)
      }
   }

   const handlePublish = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsPublishing(true)

      try {
         // Validate required fields for publishing
         const requiredFields = {
            title: inputs.title,
            description: inputs.description,
            bgImage: inputs.bgImage
         }

         const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key)

         if (missingFields.length > 0) {
            setError(true)
            setErrorMessage(`Please fill in the following required fields to publish: ${missingFields.join(", ")}`)
            setIsPublishing(false)
            return
         }

         // Update landing page content and styling with active status
         const publishData = { ...inputs, active: true }
         await updateLandingPage(inputs.id, publishData)
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await updatePageSection(section.id, section.active)
            }
         }

         // Update the context to reflect the new active status
         setInputs(prev => ({ ...prev, active: true }))

         // Success feedback
         console.log("Landing page published successfully!")
         setIsPublishing(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error publishing landing page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to publish landing page. Please try again.")
         setIsPublishing(false)
      }
   }

   const handleDeactivate = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsDeactivating(true)

      try {
         // Update landing page content and styling with inactive status
         const deactivateData = { ...inputs, active: false }
         await updateLandingPage(inputs.id, deactivateData)
         
         // Update section visibility states
         for (const section of sections) {
            if (section.id) {
               await updatePageSection(section.id, section.active)
            }
         }

         // Update the context to reflect the new inactive status
         setInputs(prev => ({ ...prev, active: false }))

         // Success feedback
         console.log("Landing page deactivated successfully!")
         setIsDeactivating(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error deactivating landing page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to deactivate landing page. Please try again.")
         setIsDeactivating(false)
      }
   }

   return (
      <div className="w-full h-full bg-gray-50">
         <Navbar 
            organizationId={organizationId} 
            links={links} 
            title={"Landing Page"} 
            handleSave={handleSave} 
            handlePublish={handlePublish} 
            handleDeactivate={handleDeactivate}
            isSaving={isSaving} 
            isPublishing={isPublishing}
            isDeactivating={isDeactivating}
            status={inputs.active ? 'active' : 'draft'}
            pageType="landing"
         />
         
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
                           <LandingPageDisplay />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default EditLandingLayout