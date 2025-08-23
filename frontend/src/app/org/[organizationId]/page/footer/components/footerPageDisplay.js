"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa"

const FooterPageDisplay = () => {
   const { inputs, sections } = useContext(FooterPageContext)

   const footerStyles = {
      backgroundColor: inputs.bgColor || "#1F2937",
      color: inputs.textColor || "#FFFFFF",
      fontSize: inputs.fontSize || "14px",
      borderTop: inputs.borderTop ? `1px solid ${inputs.borderColor || "#374151"}` : "none",
      boxShadow: inputs.shadow ? "0 -2px 4px rgba(0,0,0,0.1)" : "none"
   }

   // Parse social links
   const socialLinks = (() => {
      if (!inputs.socialLinks) return []
      
      // If it's already an array, use it directly
      if (Array.isArray(inputs.socialLinks)) {
         return inputs.socialLinks
      }
      
      // If it's a string, parse it
      if (typeof inputs.socialLinks === 'string') {
         return inputs.socialLinks.split('\n').filter(line => line.trim()).map(line => {
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
      // Check if social section is active
      const socialSection = sections.find(section => section.name === 'social')
      if (!socialSection || !socialSection.active || socialLinks.length === 0) return null

      return (
         <div className="flex space-x-4 justify-center mb-4">
            {socialLinks.map((link, index) => (
               <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity duration-200"
                  style={{ color: inputs.textColor || "#FFFFFF" }}
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
            {inputs.logo && (
               <img 
                  src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                  alt="Footer Logo" 
                  className="h-8 object-contain mb-4"
               />
            )}
            <h3 className="font-semibold mb-2">{inputs.organizationName || "Organization"}</h3>
            {inputs.tagline && (
               <p className="text-sm opacity-75 mb-4">{inputs.tagline}</p>
            )}
            {inputs.description && (
               <p className="mb-4">{inputs.description}</p>
            )}
            {/* Contact Information */}
            {inputs.address || inputs.phone || inputs.email || inputs.businessHours || inputs.contactFormUrl ? (
               <div className="mb-4">
                  {inputs.address && (
                     <div className="mb-2">
                        <strong>Address:</strong><br />
                        <span className="whitespace-pre-line">{inputs.address}</span>
                     </div>
                  )}
                  {inputs.phone && (
                     <div className="mb-2">
                        <strong>Phone:</strong> <a href={`tel:${inputs.phone}`} className="hover:underline">{inputs.phone}</a>
                     </div>
                  )}
                  {inputs.email && (
                     <div className="mb-2">
                        <strong>Email:</strong> <a href={`mailto:${inputs.email}`} className="hover:underline">{inputs.email}</a>
                     </div>
                  )}
                  {inputs.businessHours && (
                     <div className="mb-2">
                        <strong>Hours:</strong><br />
                        <span className="whitespace-pre-line">{inputs.businessHours}</span>
                     </div>
                  )}
                  {inputs.contactFormUrl && (
                     <div className="mb-2">
                        <a href={inputs.contactFormUrl} className="hover:underline">Contact Us</a>
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
               © {new Date().getFullYear()} {inputs.organizationName || "Organization"}. All rights reserved.
            </div>
         </div>
      </footer>
   )
}

export default FooterPageDisplay
