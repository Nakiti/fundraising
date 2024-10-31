"use client"
import Display from "@/app/org/campaign/components/previews/donationPage/display"
import PreviewNavbar from "../../components/previews/previewNavbar"

const DonationPageLayout = ({children}) => {
   const links = [
      "/org/campaign/new/donation-page",
      "/org/campaign/new/donation-page/design"
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