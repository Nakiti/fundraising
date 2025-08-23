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
               organizationName: "Organization",
               tagline: "",
               description: "",
               address: "",
               phone: "",
               email: "",
               businessHours: "",
               contactFormUrl: "",
               socialLinks: [],
               bgColor: "#1F2937",
               textColor: "#FFFFFF",
               fontSize: "14px",
               borderTop: true,
               borderColor: "#374151",
               shadow: false,
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
         <footer className="w-full bg-gray-800 text-white">
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
      backgroundColor: footerData.bgColor || footerData.bg_color || "#1F2937",
      color: footerData.textColor || footerData.text_color || "#FFFFFF",
      fontSize: footerData.fontSize || footerData.font_size || "14px",
      borderTop: (footerData.borderTop !== false && footerData.border_top !== false) ? `1px solid ${footerData.borderColor || footerData.border_color || "#374151"}` : "none",
      boxShadow: (footerData.shadow || footerData.shadow === 1) ? "0 -2px 4px rgba(0,0,0,0.1)" : "none"
   }

   // Parse social links
   const socialLinks = (() => {
      const links = footerData.socialLinks || footerData.social_links
      if (!links) return []
      
      // If it's already an array, use it directly
      if (Array.isArray(links)) {
         return links
      }
      
      // If it's a string, parse it
      if (typeof links === 'string') {
         return links.split('\n').filter(line => line.trim()).map(line => {
            const [platform, url, icon] = line.split('|')
            return { platform: platform?.trim(), url: url?.trim(), icon: icon?.trim() }
         })
      }
      
      return []
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
      if (socialLinks.length === 0) return null

      return (
         <div className="flex space-x-4 justify-center mb-4">
            {socialLinks.map((link, index) => (
               <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity duration-200"
                  style={{ color: footerData.textColor || footerData.text_color || "#FFFFFF" }}
               >
                  <div className="w-5 h-5">
                     {getSocialIcon(link.icon)}
                  </div>
               </a>
            ))}
         </div>
      )
   }

   const renderFooterContent = () => {
      return (
         <div className="text-center">
            {footerData.logo && (
               <img 
                  src={footerData.logo} 
                  alt="Footer Logo" 
                  className="h-8 object-contain mb-4"
               />
            )}
            <h3 className="font-semibold mb-2">{footerData.organizationName || footerData.organization_name || "Organization"}</h3>
            {(footerData.tagline) && (
               <p className="text-sm opacity-75 mb-4">{footerData.tagline}</p>
            )}
            {(footerData.description) && (
               <p className="mb-4">{footerData.description}</p>
            )}
            {/* Contact Information */}
            {(footerData.address || footerData.phone || footerData.email || footerData.businessHours || footerData.contactFormUrl || footerData.business_hours || footerData.contact_form_url) ? (
               <div className="mb-4">
                  {(footerData.address) && (
                     <div className="mb-2">
                        <strong>Address:</strong><br />
                        <span className="whitespace-pre-line">{footerData.address}</span>
                     </div>
                  )}
                  {(footerData.phone) && (
                     <div className="mb-2">
                        <strong>Phone:</strong> <a href={`tel:${footerData.phone}`} className="hover:underline">{footerData.phone}</a>
                     </div>
                  )}
                  {(footerData.email) && (
                     <div className="mb-2">
                        <strong>Email:</strong> <a href={`mailto:${footerData.email}`} className="hover:underline">{footerData.email}</a>
                     </div>
                  )}
                  {(footerData.businessHours || footerData.business_hours) && (
                     <div className="mb-2">
                        <strong>Hours:</strong><br />
                        <span className="whitespace-pre-line">{footerData.businessHours || footerData.business_hours}</span>
                     </div>
                  )}
                  {(footerData.contactFormUrl || footerData.contact_form_url) && (
                     <div className="mb-2">
                        <a href={footerData.contactFormUrl || footerData.contact_form_url} className="hover:underline">Contact Us</a>
                     </div>
                  )}
               </div>
            ) : null}
            {renderSocialIcons()}
         </div>
      )
   }

   return (
      <footer className="w-full" style={footerStyles}>
         <div className="max-w-7xl mx-auto px-4 py-8">
            {renderFooterContent()}
            <div className="mt-8 pt-4 border-t border-gray-600 text-center text-sm opacity-75">
               © {new Date().getFullYear()} {footerData.organizationName || footerData.organization_name || "Organization"}. All rights reserved.
            </div>
         </div>
      </footer>
   )
}

export default Footer