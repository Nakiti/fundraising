import Link from "next/link"
import { MdOutlineCampaign } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { FaPeopleArrows } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import { usePathname } from "next/navigation";

const HeaderBar = ({organizationId, campaignType, campaign, campaignId}) => {
   const pathname = usePathname()
   const links = [
      {title: "Overview", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}`},
      {title: "Insights", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/insights`},
      {title: "Transactions", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/transactions`},
      {title: "Share", pathName: `/org/${organizationId}/dashboard/campaigns/${campaignId}/share`}
   ]

   return (
      <div className="bg-gray-800 border-b border-gray-700 shadow-sm">
         {/* Back Navigation */}
         <div className="px-6 py-3">
            <Link 
               href={`/org/${organizationId}/dashboard/campaigns`} 
               className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
               <FaArrowLeft className="w-4 h-4 mr-2" />
               <span className="font-medium">Back to Campaigns</span>
            </Link>
         </div>

         {/* Main Header */}
         <div className="px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
               <div className="flex items-center gap-4">
                  {/* Campaign Icon */}
                  <div className="flex-shrink-0">
                     {campaignType &&
                        campaignType == "crowdfunding" ? 
                           <div className="w-16 h-16 bg-blue-900 border border-blue-700 rounded-xl flex items-center justify-center">
                              <MdOutlineCampaign className="h-8 w-8 text-blue-300" />
                           </div> :
                        campaignType == "ticketed-event" ? 
                           <div className="w-16 h-16 bg-purple-900 border border-purple-700 rounded-xl flex items-center justify-center">
                              <IoTicketOutline className="h-8 w-8 text-purple-300" />
                           </div> :
                        campaignType == "peer-to-peer" ? 
                           <div className="w-16 h-16 bg-green-900 border border-green-700 rounded-xl flex items-center justify-center">
                              <FaPeopleArrows className="h-8 w-8 text-green-300" />
                           </div> :
                           <div className="w-16 h-16 bg-gray-700 border border-gray-600 rounded-xl flex items-center justify-center">
                              <IoDocumentTextOutline className="h-8 w-8 text-gray-300" />
                           </div>
                     }
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1">
                     <h1 className="text-2xl font-bold text-white mb-1">
                        {campaign && campaign.internal_name}
                     </h1>
                     <p className="text-sm text-gray-400 capitalize">
                        {campaign && campaign.type.replace('-', ' ')} Campaign
                     </p>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-3">
                  <Link 
                     href={`/org/${organizationId}/campaign/edit/${campaignId}/details/about`} 
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                     Edit Campaign
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-all duration-200">
                     <SlOptionsVertical className="h-5 w-5" />
                  </button>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="px-6">
            <nav className="flex space-x-8">
               {links.map((item, index) => (
                  <Link 
                     key={index} 
                     href={item.pathName} 
                     className={`px-1 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                        pathname === item.pathName 
                           ? "border-blue-500 text-blue-400" 
                           : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                     }`}
                  >
                     {item.title}
                  </Link>
               ))}
            </nav>
         </div>
      </div>
   )
}

export default HeaderBar