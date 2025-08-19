"use client"
import { usePathname } from "next/navigation"
import PreviewNavbar from "../../../components/previews/previewNavbar"
import Display from "../../../components/previews/thankPage/display"

const ThankYouPageLayout = ({params, children}) => {
   const campaignId = params.id
   const organizationId = params.organizationId
   const pathname = usePathname()

   const links = [
      `/org/${organizationId}/campaign/edit/${campaignId}/thank-you-page`,
      `/org/${organizationId}/campaign/edit/${campaignId}/thank-you-page/design`
   ]

   return (
      <div className="w-full h-full bg-gray-50">
         <PreviewNavbar heading={"Configure Thank You Page"} links={links}/>
         <div className="p-4 space-y-4">
            <div className="flex flex-col xl:flex-row gap-4 h-[calc(100vh-120px)]">
               {/* Left Panel - Content Editor */}
               <div className="xl:w-1/4 lg:w-1/3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 h-full overflow-y-auto">
                     <h2 className="text-lg font-semibold text-gray-900 mb-4 sticky top-0 bg-white py-2">Content Editor</h2>
                     <div className="space-y-4">
                        {children}
                     </div>
                  </div>
               </div>
               
               {/* Right Panel - Preview */}
               <div className="xl:w-3/4 lg:w-2/3">
                  <div className="bg-white rounded-xl shadow-sm h-full">
                     <div className="h-full overflow-y-auto">
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-inner">
                           <Display />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ThankYouPageLayout