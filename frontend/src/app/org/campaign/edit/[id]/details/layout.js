"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const DetailsLayout = ({params, children}) => {
   const campaignId = params.id
   const pathName = usePathname()
   const {campaignType} = useContext(CampaignContext)

   const links = [
      {title: "About", path: `/org/campaign/edit/${campaignId}/details/about`},
      campaignType == "ticketed-event" ? {title: "Tickets", path: `/org/campaign/edit/${campaignId}/details/tickets`} : null,
      campaignType == "donation" ? {title: "Designations", path: `/org/campaign/edit/${campaignId}/details/designations`} : null,
      {title: "Questions", path: `/org/campaign/edit/${campaignId}/details/questions`},
      {title: "Contact", path: `/org/campaign/edit/${campaignId}/details/contact`},
      {title: "Sharing", path: `/org/campaign/edit/${campaignId}/details/sharing`},
      {title: "FAQs", path: `/org/campaign/edit/${campaignId}/details/faqs`},
   ]

   return (
      <div className="bg-white rounded-sm shadow-sm w-11/12 mx-auto flex flex-row">
         <div className="flex flex-col border-r-4 border-gray-100 w-1/4 py-8 text-md text-gray-600">
            {links.filter(item => item != null).map((item, index) => {
               return (
                  <Link 
                     key={index} 
                     href={item.path} 
                     className={`p-4 mb-4 border-l-4 hover:bg-gray-100 ${
                        pathName == item.path ? "border-blue-700 font-semibold text-black" : "border-transparent"}
                     `}
                  >
                     <p>{item.title}</p>
                  </Link>
               )
            })}
         </div>

         <div className="p-8 w-3/4">
            {children}
         </div>
      </div>
   )
}

export default DetailsLayout