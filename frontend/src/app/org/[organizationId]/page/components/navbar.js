import Link from "next/link"
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname } from "next/navigation";

const Navbar = ({organizationId , links, title, handleSave}) => {
   const pathName = usePathname()
   
   return (
      <div className="border-b border-gray-100 bg-gray-800 shadow-sm text-black">
         <div className="flex flex-row py-2">
            <Link href={`/org/${organizationId}/dashboard/pages`} className="px-4 flex items-center"> <IoMdArrowRoundBack className="text-xl text-white"/></Link>
            {/* <div className="border-r h-8 border-gray-300"/> */}
         </div>
         <div className="flex items-center justify-between w-11/12 mx-auto py-4">
            <div className="flex flex-row items-center">
               <img 
                  src="404image"
                  className="h-16 w-16 mr-4"
               />
               <div className="flex flex-col text-gray-100">
                  <p className="text-sm">{title}</p>
                  <h1 className="text-3xl font-bold ">Configure {title}</h1>
               </div>
            </div>

            <div className="flex space-x-4 text-md">
               <button 
                  className="bg-blue-800 hover:bg-blue-600 py-2 px-10 rounded-md text-gray-100"
                  // onClick={handleSave}
               >
                  Save
               </button> 
            </div>
         </div>

         <div className="flex flex-row space-x-8 w-11/12 mx-auto mt-4 text-white">
            <Link
               className={`cursor-pointer text-md border-b-4 py-1 px-8 ${pathName == links[0] ? "border-blue-800" : "border-transparent"}`}
               href={links[0]}
            >
               Elements
            </Link> 
            
            <Link
               className={`cursor-pointer text-md border-b-4 py-1 px-8 ${pathName == links[1] ? "border-blue-800" : "border-transparent"}`}
               href={links[1]}
            >
               Design
            </Link> 
         </div>
      </div>
   )
}

export default Navbar