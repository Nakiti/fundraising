"use client"
import Display from "@/app/org/campaign/components/previews/donationPage/display"
import PreviewNavbar from "../../components/previews/previewNavbar"
import { useSearchParams } from "next/navigation"

const DonationPageLayout = ({children}) => {
   const searchParams = useSearchParams()
   const type = searchParams.get("type")

   const links = [
      `/org/campaign/new/donation-page?type=${type}`,
      `/org/campaign/new/donation-page/design?type=${type}`
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