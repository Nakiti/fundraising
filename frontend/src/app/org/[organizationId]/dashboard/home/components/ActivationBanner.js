"use client"
import { FaExclamationTriangle } from "react-icons/fa"
import { BsArrowUpRight } from "react-icons/bs"
import Link from "next/link"

const ActivationBanner = ({ organizationStatus, organizationId }) => {
   if (organizationStatus?.organization?.status === 'active') {
      return null
   }

   return (
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
               <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-amber-600" />
               </div>
               <div>
                  <h3 className="text-sm font-medium text-amber-800">
                     Organization Not Activated
                  </h3>
                  <p className="text-sm text-amber-700 mt-1">
                     Complete the setup requirements to activate your organization and start accepting donations.
                  </p>
               </div>
            </div>
            <Link
               href={`/org/${organizationId}/dashboard/settings/activation`}
               className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 transition-colors duration-200"
            >
               <span>Complete Setup</span>
               <BsArrowUpRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
   )
}

export default ActivationBanner
