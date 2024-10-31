import Link from "next/link"
import { usePathname } from "next/navigation"

const PreviewNavbar = ({heading, links}) => {
   const pathname = usePathname()

   return (
      <div className="border-b border-gray-400 py-6 w-11/12 mx-auto mb-8 flex flex-row justify-between">
         <h1 className="text-3xl">{heading}</h1>
         <div className="space-x-4 text-lg">
            <Link 
               href={links[0]}
               className={`px-8 py-4 border-b-2 ${
                  links[0] == pathname ? "border-blue-700" : "border-gray-600"}`}
            >
               Elements
            </Link>
            <Link 
               href={links[1]}
               className={`px-8 py-4 border-b-2 ${
                  links[1] == pathname ? "border-blue-700" : "border-gray-600"}`}               
            >
               Design
            </Link>
         </div>
      </div>
   )
}

export default PreviewNavbar