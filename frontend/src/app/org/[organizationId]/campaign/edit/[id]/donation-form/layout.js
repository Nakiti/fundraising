"use client"
import { usePathname } from "next/navigation"
import PreviewNavbar from "../../../components/previews/previewNavbar"
import { useContext } from "react"
import Display from "../../../components/previews/donationForm/display"

const DonationPageLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId

   const links = [
      `/org/${organizationId}/campaign/edit/${campaignId}/donation-form`,
      `/org/${organizationId}/campaign/edit/${campaignId}/donation-form/design`
   ]

   return (
      <div className="w-full">
         <div>
            <PreviewNavbar heading={"Configure Donation Form"} links={links}/>
            <div className="flex flex-row space-x-4 w-11/12 mx-auto">
               <div className="w-1/3">
                  {children}
               </div>
               <div className="w-2/3">
                  <Display />
               </div>
            </div>
         </div>
      </div>
   )
}

export default DonationPageLayout