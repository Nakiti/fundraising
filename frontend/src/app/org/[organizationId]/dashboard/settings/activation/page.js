"use client"
import { getOrganizationService } from "@/app/services"
import { useState, useEffect } from "react"
import { errorHandler } from "@/app/services/apiClient";
import ErrorModal from "@/app/components/errorModal";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ActivationChecklist from "@/app/components/ActivationChecklist";

/*
   Component: Activation
   Description: Dedicated page for organization activation checklist
*/
const Activation = ({ params }) => {
   const organizationId = params.organizationId
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")
   const [organizationStatus, setOrganizationStatus] = useState(null)
   const [loading, setLoading] = useState(true)

   /*
      Function: fetchData
      Description: fetches organization status information
   */
   const fetchData = async () => {
      try {
         setLoading(true)
         const organizationService = getOrganizationService();
         const statusResponse = await organizationService.getOrganizationStatus(organizationId)
         setOrganizationStatus(statusResponse)
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchData()
   }, [organizationId])

   return (
      <div className="w-full h-full overflow-y-auto">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <div className="p-6 bg-gray-50">
            <div className="w-full h-full p-8 bg-white rounded-lg shadow-sm">
               <Link 
                  href={`/org/${organizationId}/dashboard/settings`}
                  className="text-gray-700 flex flex-row items-center space-x-2 mb-6"
               >
                  <FaArrowLeft className="text-gray-700"/>
                  <p>Settings</p>
               </Link>
               
               <div className="mb-8">
                  <h1 className="text-3xl font-semibold mb-4 text-gray-800">Organization Activation</h1>
                  <p className="text-gray-700">
                     Complete the setup requirements below to activate your organization for public access. 
                     Once all items are completed, you can activate your organization to start accepting donations.
                  </p>
               </div>

               {loading ? (
                  <div className="flex items-center justify-center py-12">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading activation status...</p>
                     </div>
                  </div>
               ) : (
                  <div className="max-w-4xl">
                     <ActivationChecklist 
                        organizationId={organizationId} 
                        organizationStatus={organizationStatus} 
                     />
                  </div>
               )}

               <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                     <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
                     <p className="text-blue-800 mb-4">
                        If you need assistance with any of these setup steps, our support team is here to help.
                     </p>
                     <div className="space-y-2">
                        <Link 
                           href={`/org/${organizationId}/dashboard/settings/payments`}
                           className="block text-blue-700 hover:text-blue-900 transition-colors"
                        >
                           → Configure Stripe Payment Processing
                        </Link>
                        <Link 
                           href={`/org/${organizationId}/page/landing/`}
                           className="block text-blue-700 hover:text-blue-900 transition-colors"
                        >
                           → Design Your Landing Page
                        </Link>
                        <Link 
                           href={`/org/${organizationId}/page/about/`}
                           className="block text-blue-700 hover:text-blue-900 transition-colors"
                        >
                           → Create Your About Page
                        </Link>
                        <Link 
                           href={`/org/${organizationId}/page/header/`}
                           className="block text-blue-700 hover:text-blue-900 transition-colors"
                        >
                           → Customize Header Navigation
                        </Link>
                        <Link 
                           href={`/org/${organizationId}/page/footer/`}
                           className="block text-blue-700 hover:text-blue-900 transition-colors"
                        >
                           → Set Up Footer Content
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Activation
