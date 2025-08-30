import Link from "next/link"
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaToggleOn, FaToggleOff } from "react-icons/fa"
import { BsArrowUpRight } from "react-icons/bs"

const ActivationChecklist = ({ organizationId, organizationStatus }) => {
   // Use real data from organizationStatus
   const checklistItems = [
      {
         id: 'stripe',
         title: 'Stripe Configuration',
         description: 'Payment processing setup complete',
         status: 'completed', // This will be checked against actual Stripe config
         link: `/org/${organizationId}/dashboard/settings/payments`
      },
      {
         id: 'landing',
         title: 'Landing Page',
         description: 'Public landing page configured',
         status: organizationStatus?.pages?.landing === 'active' ? 'completed' : 'pending',
         link: `/org/${organizationId}/page/landing/`
      },
      {
         id: 'about',
         title: 'About Page',
         description: 'Organization information page',
         status: organizationStatus?.pages?.about === 'active' ? 'completed' : 'pending',
         link: `/org/${organizationId}/page/about`
      },
      {
         id: 'footer',
         title: 'Footer Page',
         description: 'Footer content and links',
         status: organizationStatus?.pages?.footer === 'active' ? 'completed' : 'pending',
         link: `/org/${organizationId}/page/footer/`
      },
      {
         id: 'header',
         title: 'Header Page',
         description: 'Header navigation and branding',
         status: organizationStatus?.pages?.header === 'active' ? 'completed' : 'pending',
         link: `/org/${organizationId}/page/header/`
      }
   ]

   const completedCount = checklistItems.filter(item => item.status === 'completed').length
   const totalCount = checklistItems.length
   const isAllCompleted = completedCount === totalCount

   const getStatusIcon = (status) => {
      switch (status) {
         case 'completed':
            return <FaCheckCircle className="text-green-500" />
         case 'pending':
            return <FaExclamationTriangle className="text-yellow-500" />
         case 'failed':
            return <FaTimesCircle className="text-red-500" />
         default:
            return <FaExclamationTriangle className="text-gray-400" />
      }
   }

   const getStatusColor = (status) => {
      switch (status) {
         case 'completed':
            return 'text-green-600 bg-green-50 border-green-200'
         case 'pending':
            return 'text-yellow-600 bg-yellow-50 border-yellow-200'
         case 'failed':
            return 'text-red-600 bg-red-50 border-red-200'
         default:
            return 'text-gray-600 bg-gray-50 border-gray-200'
      }
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h3 className="text-lg font-semibold text-gray-900">Organization Activation</h3>
               <p className="text-sm text-gray-600 mt-1">
                  Complete these steps to activate your organization for public access
               </p>
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-600">
                  {completedCount} of {totalCount} completed
               </span>
               <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                     className="h-full bg-green-500 transition-all duration-300"
                     style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
               </div>
            </div>
         </div>

         <div className="space-y-3">
            {checklistItems.map((item) => (
               <div 
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(item.status)}`}
               >
                  <div className="flex items-center space-x-3">
                     {getStatusIcon(item.status)}
                     <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm opacity-75">{item.description}</p>
                     </div>
                  </div>
                  <Link 
                     href={item.link}
                     className="flex items-center space-x-1 text-sm font-medium hover:opacity-75 transition-opacity"
                  >
                     <span>Configure</span>
                     <BsArrowUpRight className="w-3 h-3" />
                  </Link>
               </div>
            ))}
         </div>

         {isAllCompleted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
               <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="font-medium text-green-800">
                     All requirements completed! Your organization is ready for activation.
                  </span>
               </div>
            </div>
         )}

         <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
               <div>
                  <h4 className="font-medium text-gray-900">Organization Status</h4>
                  <p className="text-sm text-gray-600">
                     {organizationStatus?.status === 'active' ? 'Active' : 'Inactive'}
                  </p>
                  {!isAllCompleted && (
                     <p className="text-xs text-gray-500 mt-1">
                        Complete all requirements above to activate your organization
                     </p>
                  )}
               </div>
               <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                     organizationStatus?.status === 'active'
                        ? isAllCompleted 
                           ? 'bg-red-100 text-red-700 hover:bg-red-200'
                           : 'bg-red-50 text-red-400 cursor-not-allowed'
                        : isAllCompleted
                           ? 'bg-green-100 text-green-700 hover:bg-green-200'
                           : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isAllCompleted}
               >
                  {organizationStatus?.status === 'active' ? (
                     <>
                        <FaToggleOff />
                        <span>Deactivate</span>
                     </>
                  ) : (
                     <>
                        <FaToggleOn />
                        <span>Activate</span>
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   )
}

export default ActivationChecklist
