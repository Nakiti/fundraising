import Link from "next/link"
import { FaBuilding, FaUsers, FaTags, FaPalette, FaCreditCard } from "react-icons/fa"

/*
   Component: Settings
   Description: renders the settings page
*/
const Settings = ({params}) => {
   const organizationId = params.organizationId

   const settingsCards = [
      {
         title: "Organization Information",
         description: "Edit information regarding your organization",
         href: `/org/${organizationId}/dashboard/settings/organization`,
         icon: <FaBuilding className="w-6 h-6 text-blue-600" />
      },
      {
         title: "Users",
         description: "Add and manage users that are a part of your organization",
         href: `/org/${organizationId}/dashboard/settings/users`,
         icon: <FaUsers className="w-6 h-6 text-green-600" />
      },
      {
         title: "Designations",
         description: "Create and manage the designations that donors can donate to",
         href: `/org/${organizationId}/dashboard/settings/designations`,
         icon: <FaTags className="w-6 h-6 text-purple-600" />
      },
      {
         title: "Theme",
         description: "Manage themes that can be used for your organization's campaigns",
         href: `/org/${organizationId}/dashboard/settings/theme`,
         icon: <FaPalette className="w-6 h-6 text-orange-600" />
      },
      {
         title: "Payment Settings",
         description: "Configure Stripe payments and manage your organization's payment processing",
         href: `/org/${organizationId}/dashboard/settings/payments`,
         icon: <FaCreditCard className="w-6 h-6 text-indigo-600" />
      }
   ]

   return (
      <div className="w-full bg-gray-50">
         <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                  <p className="text-gray-600 mt-1">Manage your organization's configuration and preferences</p>
               </div>
            </div>

            {/* Settings Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Organization Settings</h2>
                  <p className="text-gray-600 mt-1">Configure various aspects of your organization</p>
               </div>
               
               <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {settingsCards.map((card, index) => (
                        <Link 
                           key={index} 
                           href={card.href} 
                           className="group bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                           <div className="flex items-start space-x-4">
                              <div className="p-3 bg-white rounded-lg group-hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                                 {card.icon}
                              </div>
                              <div className="flex-1">
                                 <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                                    {card.title}
                                 </h3>
                                 <p className="text-sm text-gray-600 leading-relaxed">
                                    {card.description}
                                 </p>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Settings