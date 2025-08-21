import Link from "next/link"
import { IoMdArrowRoundBack } from "react-icons/io";
import { usePathname } from "next/navigation";

const Navbar = ({organizationId, links, title, handleSave, handlePublish, handleDeactivate, isSaving, isPublishing, isDeactivating, status, pageType = 'landing'}) => {
   const pathName = usePathname()
   
   const handlePreview = () => {
      // Open the donor-facing page in a new tab based on page type
      let previewUrl
      if (pageType === 'about') {
         previewUrl = `/organization/${organizationId}/page/about`
      } else if (pageType === 'header') {
         previewUrl = `/organization/${organizationId}`
      } else {
         previewUrl = `/organization/${organizationId}`
      }
      window.open(previewUrl, '_blank')
   }
   
   return (
      <div className="bg-gray-900 border-b border-gray-700 shadow-sm">
         {/* Top Bar with Back Button */}
         <div className="flex items-center justify-between px-6 py-3">
            <Link 
               href={`/org/${organizationId}/dashboard/pages`} 
               className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
               <IoMdArrowRoundBack className="w-5 h-5" />
               <span className="text-sm font-medium">Back to Pages</span>
            </Link>
            
                         <div className="flex items-center space-x-3">
                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full ${
                      status === 'active' || status === 'published' 
                         ? 'bg-green-400' 
                         : status === 'draft' 
                         ? 'bg-yellow-400' 
                         : status === 'inactive' 
                         ? 'bg-red-400' 
                         : 'bg-gray-400'
                   }`}></div>
                   <span className="text-xs text-gray-300 capitalize">
                      {status || 'draft'}
                   </span>
                </div>
                
                {/* Save Draft Button - Only show when page is not active */}
                {handleSave && status !== 'active' && (
                   <button 
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                         isSaving 
                            ? "bg-gray-500 cursor-not-allowed" 
                            : "bg-gray-600 hover:bg-gray-700"
                      } text-white`}
                      style={{borderRadius: "4px"}}
                      onClick={handleSave}
                      disabled={isSaving}
                   >
                      {isSaving ? "Saving..." : "Save Draft"}
                   </button>
                )}
                
                {/* Publish Button - Only show when page is not active */}
                {handlePublish && status !== 'active' && (
                   <button 
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                         isPublishing 
                            ? "bg-gray-500 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                      style={{borderRadius: "4px"}}
                      onClick={handlePublish}
                      disabled={isPublishing}
                   >
                      {isPublishing ? "Publishing..." : "Publish"}
                   </button>
                )}

                {/* Publish Button - Show when page is active (for republishing) */}
                {handlePublish && status === 'active' && (
                   <button 
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                         isPublishing 
                            ? "bg-gray-500 cursor-not-allowed" 
                            : "bg-blue-600 hover:bg-blue-700"
                      } text-white`}
                      style={{borderRadius: "4px"}}
                      onClick={handlePublish}
                      disabled={isPublishing}
                   >
                      {isPublishing ? "Publishing..." : "Publish"}
                   </button>
                )}

                {/* Deactivate Button - Only show when page is active */}
                {handleDeactivate && status === 'active' && (
                   <button 
                      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                         isDeactivating 
                            ? "bg-gray-500 cursor-not-allowed" 
                            : "bg-red-600 hover:bg-red-700"
                      } text-white`}
                      style={{borderRadius: "4px"}}
                      onClick={handleDeactivate}
                      disabled={isDeactivating}
                   >
                      {isDeactivating ? "Deactivating..." : "Deactivate"}
                   </button>
                )}

                {/* Preview Button - Always show */}
                <button 
                   className="px-4 py-2 text-sm font-medium transition-colors duration-200 bg-green-600 hover:bg-green-700 text-white"
                   style={{borderRadius: "4px"}}
                   onClick={handlePreview}
                >
                   Preview
                </button>
             </div>
         </div>

         {/* Main Header */}
         <div className="px-6 py-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-700 flex items-center justify-center" style={{borderRadius: "4px"}}>
                     <span className="text-gray-300 text-lg font-semibold">
                        {title?.charAt(0) || 'A'}
                     </span>
                  </div>
                  <div>
                     <h1 className="text-xl font-semibold text-white">{title}</h1>
                     <p className="text-sm text-gray-400">Configure your page settings and design</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="px-6">
            <div className="flex space-x-1">
               <Link
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                     pathName === links[0] 
                        ? "text-white border-b-2 border-blue-500 bg-gray-800" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  style={{borderRadius: "4px 4px 0 0"}}
                  href={links[0]}
               >
                  Content
               </Link> 
               
               <Link
                  className={`px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                     pathName === links[1] 
                        ? "text-white border-b-2 border-blue-500 bg-gray-800" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                  style={{borderRadius: "4px 4px 0 0"}}
                  href={links[1]}
               >
                  Design
               </Link> 
            </div>
         </div>
      </div>
   )
}

export default Navbar