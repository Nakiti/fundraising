"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const DetailsLayout = ({children}) => {

   const pathName = usePathname()

   const links = [
      {title: "About", path: "/org/campaign/new/details/about"},
      {title: "Designations", path: "/org/campaign/new/details/designations"},
      {title: "Questions", path: "/org/campaign/new/details/questions"},
   ]

   return (

      <div className="bg-white rounded-sm shadow-sm px-8 w-11/12 mx-auto flex flex-row">
         <div className="flex flex-col border-r-4 border-gray-100 w-1/4 py-8">
            {links.map((item, index) => {
               return (
                  <Link 
                     key={index} 
                     href={item.path} 
                     className={`p-4 border-l-4 ${
                        pathName == item.pathName ? "border-blue-700" : "border-transparent"}
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