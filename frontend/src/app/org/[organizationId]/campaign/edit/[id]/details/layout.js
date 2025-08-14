"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const DetailsLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const pathName = usePathname()
   const {campaignType, loading} = useContext(CampaignContext)

   const links = [
      {title: "About", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/about`},
      campaignType == "ticketed-event" ? {title: "Tickets", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/tickets`} : null,
      {title: "Designations", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/designations`},
      {title: "Questions", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/questions`},
      {title: "Contact", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/contact`},
      {title: "Sharing", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/sharing`},
      {title: "FAQs", path: `/org/${organizationId}/campaign/edit/${campaignId}/details/faqs`},
   ]

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="bg-white rounded-lg shadow-sm w-11/12 mx-auto flex flex-row">
            <div className="animate-pulse">
               <div className="flex flex-col border-r-4 border-gray-100 w-1/4 py-8">
                  <div className="h-12 bg-gray-200 rounded mx-4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded mx-4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded mx-4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded mx-4 mb-4"></div>
               </div>
               <div className="p-8 w-3/4">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-8"></div>
                  <div className="space-y-4">
                     <div className="h-32 bg-gray-200 rounded"></div>
                     <div className="h-32 bg-gray-200 rounded"></div>
                     <div className="h-32 bg-gray-200 rounded"></div>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="bg-white rounded-lg shadow-sm w-11/12 mx-auto flex flex-row">
         {/* Side Navigation */}
         <div className="flex flex-col border-r-4 border-gray-100 w-1/4 py-8 text-md text-gray-600">
            {links.filter(item => item != null).map((item, index) => (
               <Link 
                  key={index} 
                  href={item.path} 
                  className={`p-4 mb-4 pl-6 flex items-center hover:bg-gray-100 transition duration-200 ${
                     pathName === item.path ? "border-l-4 border-blue-600 font-semibold text-black" : "border-l-4 border-transparent text-gray-600"
                  }`}
               >
                  <p>{item.title}</p>
               </Link>
            ))}
         </div>

         {/* Main Content Area */}
         <div className="p-8 w-3/4 rounded-lg">
            {children}
         </div>
      </div>

   )
}

export default DetailsLayout