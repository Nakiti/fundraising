"use client"
import Display from "@/app/org/components/page-management/display"
import { usePathname } from "next/navigation"
import Link from "next/link"


const DonationPageLayout = ({params, children}) => {
   const campaignId = params.id
   const pathname = usePathname()

   const links = [
      `/org/campaign/edit/${campaignId}/donation-page`,
      `/org/campaign/edit/${campaignId}/donation-page/design`
   ]

   return (
      <div className="w-full">
         <div className="border-b border-gray-400 py-6 w-11/12 mx-auto mb-8 flex flex-row justify-between">
            <h1 className="text-3xl">Configure Donation Page</h1>
            <div className="space-x-4 text-lg">
            <Link 
                  href={links[0]}
                  className={`px-4 py-2 border-b-2 ${
                     links[0] == pathname ? "border-blue-700" : "border-gray-600"}`}
               >
                  Elements
               </Link>
               <Link 
                  href={links[1]}
                  className={`px-4 py-2 border-b-2 ${
                     links[1] == pathname ? "border-blue-700" : "border-gray-600"}`}               
               >
                  Design
               </Link>
            </div>
         </div>
         <div className="flex flex-row space-x-4 w-11/12 mx-auto">
            <div className="w-1/3">
               {children}
            </div>
            <div className="w-2/3">
               <Display />
            </div>
         </div>
      </div>
   )
}

export default DonationPageLayout