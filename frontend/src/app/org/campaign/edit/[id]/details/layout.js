"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const DetailsLayout = ({params, children}) => {
   const campaignId = params.id
   const pathName = usePathname()

   console.log(pathName)

   const links = [
      {title: "About", path: `/org/campaign/edit/${campaignId}/details/about`},
      {title: "Designations", path: `/org/campaign/edit/${campaignId}/details/designations`},
      {title: "Questions", path: `/org/campaign/edit/${campaignId}/details/questions`},
   ]

   return (
      <div className="bg-white rounded-sm shadow-sm px-8 w-11/12 mx-auto flex flex-row">
         <div className="flex flex-col border-r-4 border-gray-100 w-1/4 p-8 text-lg text-gray-600">
            {links.map((item, index) => {
               return (
                  <Link 
                     key={index} 
                     href={item.path} 
                     className={`p-4 mb-8 border-b-2 hover:bg-gray-100 ${
                        pathName == item.path ? "border-blue-700" : "border-gray-300"}
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