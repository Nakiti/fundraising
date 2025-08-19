import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"

const PreviewNavbar = ({heading, links}) => {
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const type = searchParams.get("type")

   return (
      <div className="bg-white border-b border-gray-200 shadow-sm">
         <div className="px-4 py-4">
            <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-900">{heading}</h2>
               <div className="flex space-x-1">
                  <Link 
                     href={links[0]}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        links[0] == pathname 
                           ? "bg-blue-50 text-blue-700 border border-blue-200" 
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                     }`}
                  >
                     Elements
                  </Link>
                  <Link 
                     href={links[1]}
                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        links[1] == pathname 
                           ? "bg-blue-50 text-blue-700 border border-blue-200" 
                           : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                     }`}
                  >
                     Design
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

export default PreviewNavbar