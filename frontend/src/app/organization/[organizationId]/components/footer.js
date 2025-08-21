"use client"
import { useState, useEffect } from "react"
import { Services } from "@/app/services"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa"

const Footer = ({ organizationId }) => {
   const [footerData, setFooterData] = useState(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const fetchFooterData = async () => {
         try {
            console.log('Fetching footer data for organization:', organizationId)
            const response = await Services.Page.getFooterPage(organizationId)
            console.log('Footer data received:', response)
            setFooterData(response)
         } catch (error) {
            console.error('Error fetching footer data:', error)
            // Use default footer if fetch fails
            setFooterData({
               logo: "",
               organization_name: "Organization",
               tagline: "",
               show_tagline: false,
               description: "",
               show_description: false,
               contact_info: "",
               show_contact_info: false,
               links: "",
               show_links: false,
               social_links: "",
               show_social_links: false,
               bg_color: "#1F2937",
               text_color: "#FFFFFF",
               link_color: "#60A5FA",
               footer_height: "auto",
               font_size: "14px",
               border_top: true,
               border_color: "#374151",
               shadow: false,
               footer_layout: "three-column",
               content_alignment: "left",
               social_position: "bottom",
               social_icon_size: "medium",
               social_icon_color: "#FFFFFF",
               social_layout: "horizontal",
               social_spacing: "normal",
               active: false
            })
         } finally {
            setLoading(false)
         }
      }

      fetchFooterData()
   }, [organizationId])

   if (loading) {
      return (
         <footer className="w-full bg-gray-800 text-white" style={{ minHeight: "200px" }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
               <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-64"></div>
               </div>
            </div>
         </footer>
      )
   }

   // if (!footerData || !footerData.active) {
   //    // Return default footer if no data or not active
   //    return (
   //       <footer className="w-full bg-gray-800 text-white">
   //          <div className="max-w-7xl mx-auto px-4 py-8">
   //             <div className="text-center">
   //                <h3 className="font-semibold mb-2">Organization</h3>
   //                <p className="text-sm opacity-75">© 2024 Organization. All rights reserved.</p>
   //             </div>
   //          </div>
   //       </footer>
   //    )
   // }

   // Apply dynamic styles based on footer data
   console.log('Using footer data:', footerData)
   
   // Ensure footerData is valid
   if (!footerData || typeof footerData !== 'object') {
      console.error('Invalid footer data:', footerData)
      // Return default footer if data is invalid
      return (
         <footer className="w-full bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
               <div className="text-center">
                  <h3 className="font-semibold mb-2">Organization</h3>
                  <p className="text-sm opacity-75">© 2024 Organization. All rights reserved.</p>
               </div>
            </div>
         </footer>
      )
   }
   
   const footerStyles = {
      backgroundColor: footerData.bg_color || footerData.bgColor || "#1F2937",
      color: footerData.text_color || footerData.textColor || "#FFFFFF",
      fontSize: footerData.font_size || footerData.fontSize || "14px",
      borderTop: footerData.border_top !== false ? `1px solid ${footerData.border_color || footerData.borderColor || "#374151"}` : "none",
      boxShadow: footerData.shadow ? "0 -2px 4px rgba(0,0,0,0.1)" : "none",
      minHeight: footerData.footer_height || footerData.footerHeight || "auto"
   }

   const linkStyles = {
      color: footerData.link_color || footerData.linkColor || "#60A5FA"
   }

   const socialIconSize = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6"
   }

   const socialSpacing = {
      tight: "space-x-2",
      normal: "space-x-3",
      loose: "space-x-4"
   }

   // Parse footer links
   const footerLinks = (() => {
      try {
         if (!footerData.links) return []
         return footerData.links.split('\n').filter(line => line.trim()).map(line => {
            const [text, url] = line.split('|')
            return { text: text?.trim(), url: url?.trim() }
         })
      } catch (error) {
         console.error('Error parsing footer links:', error)
         return []
      }
   })()

   // Parse social links
   const socialLinks = (() => {
      try {
         if (!footerData.social_links) return []
         return footerData.social_links.split('\n').filter(line => line.trim()).map(line => {
            const [platform, url, icon] = line.split('|')
            return { platform: platform?.trim(), url: url?.trim(), icon: icon?.trim() }
         })
      } catch (error) {
         console.error('Error parsing social links:', error)
         return []
      }
   })()

   const getSocialIcon = (iconName) => {
      switch (iconName?.toLowerCase()) {
         case 'facebook': return <FaFacebook />
         case 'twitter': return <FaTwitter />
         case 'instagram': return <FaInstagram />
         case 'linkedin': return <FaLinkedin />
         case 'youtube': return <FaYoutube />
         case 'tiktok': return <FaTiktok />
         default: return <FaFacebook />
      }
   }

   const renderSocialIcons = () => {
      if ((footerData.show_social_links === false) || socialLinks.length === 0) return null

      return (
         <div className={`flex ${footerData.social_layout === 'vertical' ? 'flex-col space-y-2' : footerData.social_layout === 'grid' ? 'grid grid-cols-3 gap-2' : `flex-row ${socialSpacing[footerData.social_spacing] || socialSpacing.normal}`}`}>
            {socialLinks.map((link, index) => (
               <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity duration-200"
                  style={{ color: footerData.social_icon_color || "#FFFFFF" }}
               >
                  <div className={socialIconSize[footerData.social_icon_size] || socialIconSize.medium}>
                     {getSocialIcon(link.icon)}
                  </div>
               </a>
            ))}
         </div>
      )
   }

   const renderFooterContent = () => {
      const alignment = footerData.content_alignment || footerData.contentAlignment || "left"
      const layout = footerData.footer_layout || footerData.footerLayout || "three-column"

      if (layout === "simple") {
         return (
            <div className={`text-${alignment}`}>
               {footerData.logo && (
                  <img 
                     src={footerData.logo} 
                     alt="Footer Logo" 
                     className="h-8 object-contain mb-4"
                  />
               )}
               <h3 className="font-semibold mb-2">{footerData.organization_name || footerData.organizationName || "Organization"}</h3>
               {(footerData.show_tagline !== false) && footerData.tagline && (
                  <p className="text-sm opacity-75 mb-4">{footerData.tagline}</p>
               )}
               {(footerData.show_description !== false) && footerData.description && (
                  <p className="mb-4">{footerData.description}</p>
               )}
               {(footerData.show_contact_info !== false) && footerData.contact_info && (
                  <div className="mb-4 whitespace-pre-line">{footerData.contact_info}</div>
               )}
               {(footerData.show_links !== false) && footerLinks.length > 0 && (
                  <div className="mb-4">
                     {footerLinks.map((link, index) => (
                        <a key={index} href={link.url} className="block mb-1 hover:underline" style={linkStyles}>
                           {link.text}
                        </a>
                     ))}
                  </div>
               )}
               {renderSocialIcons()}
            </div>
         )
      }

      if (layout === "two-column") {
         return (
            <div className="grid grid-cols-2 gap-8">
               <div className={`text-${alignment}`}>
                  {footerData.logo && (
                     <img 
                        src={footerData.logo} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{footerData.organization_name || footerData.organizationName || "Organization"}</h3>
                  {(footerData.show_tagline !== false) && footerData.tagline && (
                     <p className="text-sm opacity-75 mb-4">{footerData.tagline}</p>
                  )}
                  {(footerData.show_description !== false) && footerData.description && (
                     <p className="mb-4">{footerData.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {(footerData.show_contact_info !== false) && footerData.contact_info && (
                     <div className="mb-4 whitespace-pre-line">{footerData.contact_info}</div>
                  )}
                  {(footerData.show_links !== false) && footerLinks.length > 0 && (
                     <div className="mb-4">
                        {footerLinks.map((link, index) => (
                           <a key={index} href={link.url} className="block mb-1 hover:underline" style={linkStyles}>
                              {link.text}
                           </a>
                        ))}
                     </div>
                  )}
                  {renderSocialIcons()}
               </div>
            </div>
         )
      }

      if (layout === "three-column") {
         return (
            <div className="grid grid-cols-3 gap-8">
               <div className={`text-${alignment}`}>
                  {footerData.logo && (
                     <img 
                        src={footerData.logo} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{footerData.organization_name || footerData.organizationName || "Organization"}</h3>
                  {(footerData.show_tagline !== false) && footerData.tagline && (
                     <p className="text-sm opacity-75 mb-4">{footerData.tagline}</p>
                  )}
                  {(footerData.show_description !== false) && footerData.description && (
                     <p className="mb-4">{footerData.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {(footerData.show_contact_info !== false) && footerData.contact_info && (
                     <div className="mb-4 whitespace-pre-line">{footerData.contact_info}</div>
                  )}
                  {(footerData.show_links !== false) && footerLinks.length > 0 && (
                     <div className="mb-4">
                        {footerLinks.map((link, index) => (
                           <a key={index} href={link.url} className="block mb-1 hover:underline" style={linkStyles}>
                              {link.text}
                           </a>
                        ))}
                     </div>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {renderSocialIcons()}
               </div>
            </div>
         )
      }

      if (layout === "four-column") {
         return (
            <div className="grid grid-cols-4 gap-6">
               <div className={`text-${alignment}`}>
                  {footerData.logo && (
                     <img 
                        src={footerData.logo} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{footerData.organization_name || footerData.organizationName || "Organization"}</h3>
                  {(footerData.show_tagline !== false) && footerData.tagline && (
                     <p className="text-sm opacity-75 mb-4">{footerData.tagline}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {(footerData.show_description !== false) && footerData.description && (
                     <p className="mb-4">{footerData.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {(footerData.show_contact_info !== false) && footerData.contact_info && (
                     <div className="mb-4 whitespace-pre-line">{footerData.contact_info}</div>
                  )}
                  {(footerData.show_links !== false) && footerLinks.length > 0 && (
                     <div className="mb-4">
                        {footerLinks.map((link, index) => (
                           <a key={index} href={link.url} className="block mb-1 hover:underline" style={linkStyles}>
                              {link.text}
                           </a>
                        ))}
                     </div>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {renderSocialIcons()}
               </div>
            </div>
         )
      }
   }

   return (
      <footer className="w-full" style={footerStyles}>
         <div className="max-w-7xl mx-auto px-4 py-8">
            {renderFooterContent()}
            <div className="mt-8 pt-4 border-t border-gray-600 text-center text-sm opacity-75">
               © {new Date().getFullYear()} {footerData.organization_name || footerData.organizationName || "Organization"}. All rights reserved.
            </div>
         </div>
      </footer>
   )
}

export default Footer