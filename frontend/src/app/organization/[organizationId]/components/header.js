"use client"
import { useState, useEffect } from "react"
import { Services } from "@/app/services"
import { FaSearch, FaUser, FaHeart } from "react-icons/fa"
import { useRouter } from "next/navigation"

const Header = ({ organizationId }) => {
   const [headerData, setHeaderData] = useState(null)
   const [loading, setLoading] = useState(true)
   const router = useRouter()

   useEffect(() => {
      const fetchHeaderData = async () => {
         try {
            console.log('Fetching header data for organization:', organizationId)
            const response = await Services.Page.getHeaderPage(organizationId)
            console.log('Header data received:', response)
            setHeaderData(response)
         } catch (error) {
            console.error('Error fetching header data:', error)
            // Use default header if fetch fails
            setHeaderData({
               logo: "",
               organization_name: "Organization",
               tagline: "",
               show_tagline: false,
               show_navigation: true,
               navigation_items: "[]",
               show_search: true,
               show_login_button: true,
               show_donate_button: true,
               bg_color: "#FFFFFF",
               text_color: "#000000",
               accent_color: "#3B82F6",
               header_height: "80px",
               logo_size: "40px",
               font_size: "16px",
               font_weight: "500",
               border_bottom: true,
               border_color: "#E5E7EB",
               shadow: false,
               logo_position: "left",
               navigation_position: "center",
               button_position: "right",
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
         <header className="w-full bg-white border-b border-gray-200" style={{ height: "80px" }}>
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
               <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            </div>
         </header>
      )
   }

   // if (!headerData || !headerData.active) {
   //    // Return default header if no data or not active
   //    return (
   //       <header className="w-full bg-white border-b border-gray-200" style={{ height: "80px" }}>
   //          <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
   //             <div className="flex items-center space-x-3">
   //                <h1 className="font-semibold text-gray-900">Organization</h1>
   //             </div>
   //             <div className="flex items-center space-x-4">
   //                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
   //                   Login
   //                </button>
   //                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
   //                   Donate
   //                </button>
   //             </div>
   //          </div>
   //       </header>
   //    )
   // }

   // Apply dynamic styles based on header data
   console.log('Using header data:', headerData)
   
   // Ensure headerData is valid
   if (!headerData || typeof headerData !== 'object') {
      console.error('Invalid header data:', headerData)
      // Return default header if data is invalid
      return (
         <header className="w-full bg-white border-b border-gray-200" style={{ height: "80px" }}>
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <h1 className="font-semibold text-gray-900">Organization</h1>
               </div>
               <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                     Login
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                     Donate
                  </button>
               </div>
            </div>
         </header>
      )
   }
   
   // Map database field names to component field names
   const headerStyles = {
      backgroundColor: headerData.bg_color || headerData.bgColor || "#FFFFFF",
      color: headerData.text_color || headerData.textColor || "#000000",
      height: "60px",
      fontSize: headerData.font_size || headerData.fontSize || "16px",
      fontWeight: headerData.font_weight || headerData.fontWeight || "500",
      borderBottom: headerData.border_bottom !== false ? `1px solid ${headerData.border_color || headerData.borderColor || "#E5E7EB"}` : "none",
      boxShadow: headerData.shadow ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
   }

   const logoStyles = {
      width: headerData.logo_size || headerData.logoSize || "40px",
      height: headerData.logo_size || headerData.logoSize || "40px"
   }

   const navigationItems = (() => {
      try {
         if (headerData.navigation_items && headerData.navigation_items !== "[]") {
            return JSON.parse(headerData.navigation_items)
         }
         if (headerData.navigationItems && headerData.navigationItems !== "[]") {
            return JSON.parse(headerData.navigationItems)
         }
         return [
            { label: "Home", href: `/organization/${organizationId}` },
            { label: "About", href: `/organization/${organizationId}/about` },
            { label: "Campaigns", href: `/organization/${organizationId}/campaigns` },
         ]
      } catch (error) {
         console.error('Error parsing navigation items:', error)
         return [
            { label: "Home", href: `/organization/${organizationId}` },
            { label: "About", href: `/organization/${organizationId}/about` },
            { label: "Campaigns", href: `/organization/${organizationId}/campaigns` },
         ]
      }
   })()

   return (
      <header className="w-full" style={headerStyles}>
         <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
               {headerData.logo && (
                  <img 
                     src={headerData.logo} 
                     alt="Organization Logo" 
                     className="object-contain"
                     style={logoStyles}
                  />
               )}
               <div>
                  <h1 className="font-semibold" style={{ color: headerData.text_color || headerData.textColor || "#000000" }}>
                     {headerData.organization_name || headerData.organizationName || "Organization"}
                  </h1>
                  {(headerData.show_tagline !== false) && headerData.tagline && (
                     <p className="text-sm opacity-75" style={{ color: headerData.text_color || headerData.textColor || "#000000" }}>
                        {headerData.tagline}
                     </p>
                  )}
               </div>
            </div>

            {/* Navigation Section */}
            {(headerData.show_navigation !== false) && (
               <nav className="hidden md:flex items-center space-x-8">
                  {navigationItems.map((item, index) => (
                     <a 
                        key={index}
                        href={item.href}
                        className="hover:opacity-75 transition-opacity duration-200"
                        style={{ color: headerData.text_color || headerData.textColor || "#000000" }}
                     >
                        {item.label}
                     </a>
                  ))}
               </nav>
            )}

            {/* Right Section - Search, Login, Donate */}
            <div className="flex items-center space-x-4">
               
               {(headerData.show_login_button !== false) && (
                  <button 
                     className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                     style={{ color: headerData.text_color || headerData.textColor || "#000000" }}
                     onClick={() => router.push(`/organization/${organizationId}/donor/login`)}
                  >
                     <FaUser className="w-4 h-4" />
                     <span>Login</span>
                  </button>
               )}
               
            </div>
         </div>
      </header>
   )
}

export default Header
