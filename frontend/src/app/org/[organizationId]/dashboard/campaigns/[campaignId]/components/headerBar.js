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
      <div className="bg-gray-800 w-full px-4 pt-2 text-white">
         <Link href={`/org/${organizationId}/dashboard/campaigns`} className="flex flex-row px-4 py-2 items-center cursor-pointer hover:text-gray-200">
            <FaArrowLeft className="text-sm" />
            <p className="ml-2 text-sm font-semibold">Campaigns</p>
         </Link>
         <div className="flex flex-row px-6 py-4 w-full justify-between">
            <div className="flex flex-row items-center">
               {campaignType &&
                  campaignType == "crowdfunding" ? <MdOutlineCampaign className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  campaignType == "ticketed-event" ? <IoTicketOutline className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  campaignType == "peer-to-peer" ? <FaPeopleArrows className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/> :
                  <IoDocumentTextOutline className="h-16 w-16 p-1 border-2 border-white rounded-sm mr-4"/>
               }
               <div className="flex flex-col text-gray-100">
                  <h1 className="text-2xl font-semibold">{campaign && campaign.internal_name}</h1>
                  <p className="text-sm mt-1 text-gray-400">{campaign && campaign.type}</p>
               </div>
            </div>
            <div className="w-1/5 flex flex-row justify-between h-1/2">
               <Link 
                  href={`/org/${organizationId}/campaign/edit/${campaignId}/details/about`} 
                  className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-md text-md font-semibold transition duration-200"
               >
                  Edit Campaign
               </Link>
               <button className="text-gray-200 hover:text-gray-100">
                  <SlOptionsVertical className="h-6 w-6" />
               </button>
            </div>
         </div>
         <div className="w-1/3 px-6 space-x-4 flex flex-row justify-between">
            {links.map((item, index) => (
               <Link 
                  key={index} 
                  href={item.pathName} 
                  className={`px-8 py-2 text-md font-medium border-b-4 ${
                     pathname === item.pathName ? "border-blue-600 text-white" : "border-transparent text-gray-400"
                  } hover:border-blue-600 hover:text-white transition-all duration-200`}
               >
                  {item.title}
               </Link>
            ))}
         </div>
      </div>
   )
}

export default HeaderBar