"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { FaUser, FaHeart } from "react-icons/fa"

const HeaderPageDisplay = () => {
   const { inputs, sections, isLoading } = useContext(HeaderPageContext)

   const headerStyles = {
      backgroundColor: inputs.bgColor || "#FFFFFF",
      color: inputs.textColor || "#000000",
      fontSize: inputs.fontSize || "16px",
      borderBottom: inputs.borderBottom ? `1px solid ${inputs.borderColor || "#E5E7EB"}` : "none",
      boxShadow: inputs.shadow ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
   }

   const linkStyles = {
      color: inputs.linkColor || "#3B82F6"
   }

   // Loading skeleton component
   const LoadingSkeleton = () => (
      <header className="w-full bg-white border-b border-gray-200 animate-pulse">
         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo Section skeleton */}
            <div className="flex items-center space-x-3">
               <div className="h-8 w-8 bg-gray-300 rounded"></div>
               <div>
                  <div className="h-6 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
               </div>
            </div>

            {/* Right Section skeleton */}
            <div className="flex items-center space-x-4">
               <div className="hidden lg:block">
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
               </div>
               <div className="h-10 bg-gray-300 rounded w-20"></div>
               <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
         </div>
      </header>
   )

   if (isLoading) {
      return <LoadingSkeleton />
   }

   return (
      <header className="w-full" style={headerStyles}>
         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
               {inputs.logo && (
                  <img 
                     src={inputs.logo} 
                     alt="Organization Logo" 
                     className="h-8 w-8 object-contain"
                  />
               )}
               <div>
                  <h1 className="font-semibold text-lg">
                     {inputs.organization_name || "Organization Name"}
                  </h1>
                  {inputs.tagline && (
                     <p className="text-sm opacity-75">
                        {inputs.tagline}
                     </p>
                  )}
               </div>
            </div>

            {/* Right Section - Description and Buttons */}
            <div className="flex items-center space-x-4">
               {inputs.description && (
                  <div className="hidden lg:block max-w-xs">
                     <p className="text-sm opacity-75">
                        {inputs.description}
                     </p>
                  </div>
               )}
               
               {/* Login Button */}
                  <button 
                     className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                     style={{ color: inputs.textColor || "#000000" }}
                  >
                     <FaUser className="w-4 h-4" />
                     <span>Login</span>
                  </button>
               
               {/* Donate Button */}
                  <button 
                     className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                     style={{ 
                        backgroundColor: inputs.linkColor || "#3B82F6",
                        color: "#FFFFFF"
                     }}
                  >
                     <FaHeart className="w-4 h-4" />
                     <span>Donate</span>
                  </button>
            </div>
         </div>
      </header>
   )
}

export default HeaderPageDisplay
