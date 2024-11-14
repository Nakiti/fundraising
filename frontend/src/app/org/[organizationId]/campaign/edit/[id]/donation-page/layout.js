"use client"
import Display from "@/app/org/[organizationId]/campaign/components/previews/donationPage/display"
import { usePathname } from "next/navigation"
import Link from "next/link"
import PreviewNavbar from "../../../components/previews/previewNavbar"


const DonationPageLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const pathname = usePathname()

   const links = [
      `/org/${organizationId}/campaign/edit/${campaignId}/donation-page`,
      `/org/${organizationId}/campaign/edit/${campaignId}/donation-page/design`
   ]

   return (
      <div className="w-full">
         <PreviewNavbar heading={"Configure Donation Page"} links={links}/>
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