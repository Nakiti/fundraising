import { IoMdOpen } from "react-icons/io";
import Link from "next/link";

const Pages = ({params}) => {
   const organizationId = params.organizationId

   return (
      <div className="w-full h-full">
         <div className="w-full h-full overflow-y-auto rounded-md p-12">
            <div className="flex flex-row w-full justify-between mb-8">
               <h1 className="text-4xl">Manage Organization Pages</h1>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8 w-full">
               <Link href={`/org/${organizationId}/page/landing`} className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Landing Page</p>
                  <p className="text-sm text-gray-700">Edit the landing page for your organization</p>
               </Link>

               <Link href={`/org/${organizationId}/page/landing`} className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Cart Page (todo)</p>
                  <p className="text-sm text-gray-700">Edit the cart page for your organization</p>
               </Link>

               <Link href={`/org/${organizationId}/page/about`} className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">About Page</p>
                  <p className="text-sm text-gray-700">Edit the about page for your organization</p>
               </Link>

               <Link href={`/org/${organizationId}/page/landing`} className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Impact Page (todo)</p>
                  <p className="text-sm text-gray-700">Edit the impact page for your organization</p>
               </Link>
            </div>


         </div>
      </div>
   )
}

export default Pages