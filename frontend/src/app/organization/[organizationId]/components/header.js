"use client"
import { useState, useEffect } from "react"
import { getPageService } from "@/app/services"
import { FaUser, FaHeart } from "react-icons/fa"
import { useRouter } from "next/navigation"
import CartIcon from "@/app/components/CartIcon"
import Link from "next/link"

const Header = ({ organizationId }) => {
   const [headerData, setHeaderData] = useState(null)
   const [loading, setLoading] = useState(true)
   const router = useRouter()

   // Get PageService instance
   const pageService = getPageService();

   useEffect(() => {
      const fetchHeaderData = async () => {
         try {
            console.log('Fetching header data for organization:', organizationId)
            const response = await pageService.getHeaderPage(organizationId)
            console.log('Header data received:', response)
            setHeaderData(response)
         } catch (error) {
            console.error('Error fetching header data:', error)
            // Use default header if fetch fails
            setHeaderData({
               logo: "",
               organizationName: "Organization",
               tagline: "",
               description: "",
               bgColor: "#FFFFFF",
               textColor: "#000000",
               fontSize: "16px",
               borderBottom: true,
               borderColor: "#E5E7EB",
               shadow: false,
               active: false
            })
         } finally {
            setLoading(false)
         }
      }

      fetchHeaderData()
   }, [organizationId])

   if (loading) {
      return (
         <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
               <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            </div>
         </header>
      )
   }

   // Apply dynamic styles based on header data
   console.log('Using header data:', headerData)
   
   // Ensure headerData is valid
   if (!headerData || typeof headerData !== 'object') {
      console.error('Invalid header data:', headerData)
      // Return default header if data is invalid
      return (
         <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <h1 className="font-semibold text-gray-900">Organization</h1>
               </div>
               <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                     Login
                  </button>

               </div>
            </div>
         </header>
      )
   }
   
   // Map database field names to component field names (handle both snake_case and camelCase)
   const headerStyles = {
      backgroundColor: headerData.bgColor || headerData.bg_color || "#FFFFFF",
      color: headerData.textColor || headerData.text_color || "#000000",
      fontSize: headerData.fontSize || headerData.font_size || "16px",
      borderBottom: (headerData.borderBottom !== false && headerData.border_bottom !== false) ? `1px solid ${headerData.borderColor || headerData.border_color || "#E5E7EB"}` : "none",
      boxShadow: (headerData.shadow || headerData.shadow === 1) ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
   }

   return (
      <header className="w-full" style={headerStyles}>
         <div className=" mx-auto px-8 py-2 flex items-center justify-between">
            {/* Logo Section */}
            <Link href={`/organization/${organizationId}`} className="flex items-center space-x-3 cursor-pointer">
               {headerData.logo && (
                  <img 
                     src={headerData.logo} 
                     alt="Organization Logo" 
                     className="h-8 w-8 object-contain"
                  />
               )}
               <div>
                  <h1 className="font-semibold text-md">
                     {headerData.organizationName || headerData.organization_name || "Organization Name"}
                  </h1>
                  {(headerData.tagline) && (
                     <p className="text-sm opacity-75">
                        {headerData.tagline}
                     </p>
                  )}
               </div>
            </Link>

            {/* Right Section - Description and Buttons */}
            <div className="flex items-center space-x-4">
               {(headerData.description) && (
                  <div className="hidden lg:block max-w-xs">
                     <p className="text-sm opacity-75">
                        {headerData.description}
                     </p>
                  </div>
               )}

               {/* Login Button */}
               <button 
                  className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  style={{ color: headerData.textColor || headerData.text_color || "#000000" }}
                  onClick={() => router.push(`/organization/${organizationId}/donor/login`)}
               >
                  <FaUser className="w-4 h-4" />
                  <span>Login</span>
               </button>
                              {/* Cart Icon */}
               <CartIcon 
                  organizationId={organizationId}
                  showLabel={false}
                  className="hover:bg-gray-100 hover:bg-opacity-20"
               />
            </div>
         </div>
      </header>
   )
}

export default Header
