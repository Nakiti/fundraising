"use client"
import { usePathname } from "next/navigation"
import PreviewNavbar from "../../../components/previews/previewNavbar"
import Display from "../../../components/previews/thankPage/display"

const PeerLandingPageLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const pathname = usePathname()

   const links = [
      `/org/${organizationId}/campaign/edit/${campaignId}/peer-landing-page`,
      `/org/${organizationId}/campaign/edit/${campaignId}/peer-landing-page/design`
   ]

   return (
      <div className="w-full">
         <PreviewNavbar heading={"Configure Landing You Page"} links={links}/>
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

export default PeerLandingPageLayout