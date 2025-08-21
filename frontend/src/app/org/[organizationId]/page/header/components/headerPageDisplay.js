"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { FaSearch, FaUser, FaHeart } from "react-icons/fa"

const HeaderPageDisplay = () => {
   const { inputs, sections } = useContext(HeaderPageContext)

   // Apply dynamic styles based on customization settings
   const headerStyles = {
      backgroundColor: inputs.bgColor || "#FFFFFF",
      color: inputs.textColor || "#000000",
      height: inputs.headerHeight || "80px",
      fontSize: inputs.fontSize || "16px",
      fontWeight: inputs.fontWeight || "500",
      borderBottom: inputs.borderBottom ? `1px solid ${inputs.borderColor || "#E5E7EB"}` : "none",
      boxShadow: inputs.shadow ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
   }

   const logoStyles = {
      width: inputs.logoSize || "40px",
      height: inputs.logoSize || "40px"
   }

   const navigationItems = inputs.navigationItems || [
      { label: "Home", href: "#" },
      { label: "About", href: "#" },
      { label: "Programs", href: "#" },
      { label: "Contact", href: "#" }
   ]

   return (
      <header className="w-full" style={headerStyles}>
         <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
               {inputs.logo && (
                  <img 
                     src={inputs.logo} 
                     alt="Organization Logo" 
                     className="object-contain"
                     style={logoStyles}
                  />
               )}
               <div>
                  <h1 className="font-semibold" style={{ color: inputs.textColor || "#000000" }}>
                     {inputs.organizationName || "Organization Name"}
                  </h1>
                  {inputs.showTagline && inputs.tagline && (
                     <p className="text-sm opacity-75" style={{ color: inputs.textColor || "#000000" }}>
                        {inputs.tagline}
                     </p>
                  )}
               </div>
            </div>

            {/* Navigation Section */}
            {inputs.showNavigation && (
               <nav className="hidden md:flex items-center space-x-8">
                  {navigationItems.map((item, index) => (
                     <a 
                        key={index}
                        href={item.href}
                        className="hover:opacity-75 transition-opacity duration-200"
                        style={{ color: inputs.textColor || "#000000" }}
                     >
                        {item.label}
                     </a>
                  ))}
               </nav>
            )}

            {/* Right Section - Search, Login, Donate */}
            <div className="flex items-center space-x-4">
               {inputs.showSearch && (
                  <button 
                     className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                     style={{ color: inputs.textColor || "#000000" }}
                  >
                     <FaSearch className="w-4 h-4" />
                  </button>
               )}
               
               {inputs.showLoginButton && (
                  <button 
                     className="px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200 flex items-center space-x-2"
                     style={{ color: inputs.textColor || "#000000" }}
                  >
                     <FaUser className="w-4 h-4" />
                     <span>Login</span>
                  </button>
               )}
               
               {inputs.showDonateButton && (
                  <button 
                     className="px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                     style={{ 
                        backgroundColor: inputs.accentColor || "#3B82F6",
                        color: "#FFFFFF"
                     }}
                  >
                     <FaHeart className="w-4 h-4" />
                     <span>Donate</span>
                  </button>
               )}
            </div>
         </div>
      </header>
   )
}

export default HeaderPageDisplay
