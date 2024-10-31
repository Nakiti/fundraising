"use client"
import { usePathname } from "next/navigation"
import PreviewNavbar from "../../../components/previews/previewNavbar"
import Display from "../../../components/previews/thankPage/display"

const ThankYouPageLayout = ({params, children}) => {
   const campaignId = params.id
   const pathname = usePathname()

   const links = [
      `/org/campaign/edit/${campaignId}/thank-you-page`,
      `/org/campaign/edit/${campaignId}/thank-you-page/design`
   ]

   return (
      <div className="w-full">
         <PreviewNavbar heading={"Configure Thank You Page"} links={links}/>
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

export default ThankYouPageLayout