"use client"
import HeaderPageDisplay from "./components/headerPageDisplay"
import { useContext, useState } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { Services } from "@/app/services"
import { AuthContext } from "@/app/context/authContext"
import Navbar from "../components/navbar"

const HeaderLayout = ({params, children}) => {
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [isSaving, setIsSaving] = useState(false)
   const [isPublishing, setIsPublishing] = useState(false)
   const [isDeactivating, setIsDeactivating] = useState(false)
   const {currentUser} = useContext(AuthContext)
   const organizationId = params.organizationId
   const {inputs, sections, setInputs} = useContext(HeaderPageContext)

   const links = [
      `/org/${organizationId}/page/header`,
      `/org/${organizationId}/page/header/design`
   ]

   const handleSave = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsSaving(true)

      try {
         // Use the service to save header page
         const result = await Services.Update.HeaderPage.saveHeaderPage(inputs.id, inputs, sections)
         
         // Success feedback
         console.log(result.message)
         setIsSaving(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error saving header page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to save header page. Please try again.")
         setIsSaving(false)
      }
   }

   const handlePublish = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsPublishing(true)

      try {
         // Use the service to publish header page
         const result = await Services.Update.HeaderPage.publishHeaderPage(inputs.id, inputs, sections)
         
         // Update the context to reflect the new active status
         setInputs(prev => ({ ...prev, active: true }))

         // Success feedback
         console.log(result.message)
         setIsPublishing(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error publishing header page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to publish header page. Please try again.")
         setIsPublishing(false)
      }
   }

   const handleDeactivate = async() => {
      // Reset error state
      setError(false)
      setErrorMessage("")
      setIsDeactivating(true)

      try {
         // Use the service to deactivate header page
         const result = await Services.Update.HeaderPage.deactivateHeaderPage(inputs.id, inputs, sections)
         
         // Update the context to reflect the new inactive status
         setInputs(prev => ({ ...prev, active: false }))

         // Success feedback
         console.log(result.message)
         setIsDeactivating(false)
         
         // Optional: Show success message or toast notification
         // You can add a toast notification here if you have a notification system

      } catch (err) {
         console.error("Error deactivating header page:", err)
         setError(true)
         setErrorMessage(err.message || "Failed to deactivate header page. Please try again.")
         setIsDeactivating(false)
      }
   }

   return (
      <div className="w-full h-full bg-gray-50">
         <Navbar 
            organizationId={organizationId} 
            links={links} 
            title={"Header Design"} 
            handleSave={handleSave} 
            handlePublish={handlePublish} 
            handleDeactivate={handleDeactivate}
            isSaving={isSaving} 
            isPublishing={isPublishing}
            isDeactivating={isDeactivating}
            status={inputs.active ? 'active' : 'draft'}
            pageType="header"
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
                           <HeaderPageDisplay />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default HeaderLayout
