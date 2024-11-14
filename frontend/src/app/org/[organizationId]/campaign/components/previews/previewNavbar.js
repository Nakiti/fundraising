import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"

const PreviewNavbar = ({heading, links}) => {
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const type = searchParams.get("type")

   console.log(links, pathname, type)

   return (
<div className="border-b border-gray-400 py-6 w-11/12 mx-auto mb-8 flex flex-row justify-between items-center">
   <h1 className="text-3xl font-semibold text-gray-800">{heading}</h1>
   <div className="space-x-6 text-lg flex items-center">
      <Link 
         href={links[0]}
         className={`px-6 py-3 font-medium ${
            links[0] == pathname ? "border-b-2 border-blue-700 text-blue-700" : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
         } transition-all duration-300 ease-in-out`}
      >
         Elements
      </Link>
      <Link 
         href={links[1]}
         className={`px-6 py-3 font-medium ${
            links[1] == pathname ? "border-b-2 border-blue-700 text-blue-700" : "border-b-2 border-transparent text-gray-600 hover:text-gray-800"
         } transition-all duration-300 ease-in-out`}
      >
         Design
      </Link>
   </div>
</div>

   )
}

export default PreviewNavbar