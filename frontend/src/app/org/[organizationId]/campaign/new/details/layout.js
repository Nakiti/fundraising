"use client"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

const DetailsLayout = ({children}) => {

   const pathName = usePathname()
   const searchParams = useSearchParams()
   const type = searchParams && searchParams.get("type")

   const links = [
      {title: "About", path: `/org/campaign/new/details/about?type=${type}`},
      type == "ticketed-event" ? {title: "Tickets", path: `/org/campaign/new/details/tickets?type=${type}`} : null,
      type == "donation" ? {title: "Designations", path: `/org/campaign/new/details/designations?type=${type}`} : null,
      {title: "Questions", path: `/org/campaign/new/details/questions?type=${type}`},
      {title: "Contact", path: `/org/campaign/new/details/contact?type=${type}`},
      {title: "Sharing", path: `/org/campaign/new/details/sharing?type=${type}`},
      {title: "FAQs", path: `/org/campaign/new/details/faqs?type=${type}`},
   ]

   return (
      <div className="bg-white rounded-sm shadow-sm w-11/12 mx-auto flex flex-row">
         <div className="flex flex-col border-r-4 border-gray-50 w-1/4 py-8 text-md text-gray-600">
            {links.filter(item => item != null).map((item, index) => {
               return (
                  <Link 
                     key={index} 
                     href={item.path} 
                     className={`p-4  border-l-4 hover:bg-gray-100 ${
                        pathName + `?type=${type}` == item.path ? "border-blue-700" : "border-transparent"}
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