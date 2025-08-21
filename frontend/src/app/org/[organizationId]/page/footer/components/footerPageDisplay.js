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
      boxShadow: inputs.shadow ? "0 -2px 4px rgba(0,0,0,0.1)" : "none",
      minHeight: inputs.footerHeight || "auto"
   }

   const linkStyles = {
      color: inputs.linkColor || "#60A5FA"
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
   const footerLinks = inputs.links ? inputs.links.split('\n').filter(line => line.trim()).map(line => {
      const [text, url] = line.split('|')
      return { text: text?.trim(), url: url?.trim() }
   }) : []

   // Parse social links
   const socialLinks = inputs.socialLinks ? inputs.socialLinks.split('\n').filter(line => line.trim()).map(line => {
      const [platform, url, icon] = line.split('|')
      return { platform: platform?.trim(), url: url?.trim(), icon: icon?.trim() }
   }) : []

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
      if (!inputs.showSocialLinks || socialLinks.length === 0) return null

      return (
         <div className={`flex ${inputs.socialLayout === 'vertical' ? 'flex-col space-y-2' : inputs.socialLayout === 'grid' ? 'grid grid-cols-3 gap-2' : `flex-row ${socialSpacing[inputs.socialSpacing] || socialSpacing.normal}`}`}>
            {socialLinks.map((link, index) => (
               <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity duration-200"
                  style={{ color: inputs.socialIconColor || "#FFFFFF" }}
               >
                  <div className={socialIconSize[inputs.socialIconSize] || socialIconSize.medium}>
                     {getSocialIcon(link.icon)}
                  </div>
               </a>
            ))}
         </div>
      )
   }

   const renderFooterContent = () => {
      const alignment = inputs.contentAlignment || "left"
      const layout = inputs.footerLayout || "three-column"

      if (layout === "simple") {
         return (
            <div className={`text-${alignment}`}>
               {inputs.logo && (
                  <img 
                     src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                     alt="Footer Logo" 
                     className="h-8 object-contain mb-4"
                  />
               )}
               <h3 className="font-semibold mb-2">{inputs.organizationName || "Organization"}</h3>
               {inputs.showTagline && inputs.tagline && (
                  <p className="text-sm opacity-75 mb-4">{inputs.tagline}</p>
               )}
               {inputs.showDescription && inputs.description && (
                  <p className="mb-4">{inputs.description}</p>
               )}
               {inputs.showContactInfo && inputs.contactInfo && (
                  <div className="mb-4 whitespace-pre-line">{inputs.contactInfo}</div>
               )}
               {inputs.showLinks && footerLinks.length > 0 && (
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
                  {inputs.logo && (
                     <img 
                        src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{inputs.organizationName || "Organization"}</h3>
                  {inputs.showTagline && inputs.tagline && (
                     <p className="text-sm opacity-75 mb-4">{inputs.tagline}</p>
                  )}
                  {inputs.showDescription && inputs.description && (
                     <p className="mb-4">{inputs.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {inputs.showContactInfo && inputs.contactInfo && (
                     <div className="mb-4 whitespace-pre-line">{inputs.contactInfo}</div>
                  )}
                  {inputs.showLinks && footerLinks.length > 0 && (
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
                  {inputs.logo && (
                     <img 
                        src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{inputs.organizationName || "Organization"}</h3>
                  {inputs.showTagline && inputs.tagline && (
                     <p className="text-sm opacity-75 mb-4">{inputs.tagline}</p>
                  )}
                  {inputs.showDescription && inputs.description && (
                     <p className="mb-4">{inputs.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {inputs.showContactInfo && inputs.contactInfo && (
                     <div className="mb-4 whitespace-pre-line">{inputs.contactInfo}</div>
                  )}
                  {inputs.showLinks && footerLinks.length > 0 && (
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
                  {inputs.logo && (
                     <img 
                        src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                        alt="Footer Logo" 
                        className="h-8 object-contain mb-4"
                     />
                  )}
                  <h3 className="font-semibold mb-2">{inputs.organizationName || "Organization"}</h3>
                  {inputs.showTagline && inputs.tagline && (
                     <p className="text-sm opacity-75 mb-4">{inputs.tagline}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {inputs.showDescription && inputs.description && (
                     <p className="mb-4">{inputs.description}</p>
                  )}
               </div>
               <div className={`text-${alignment}`}>
                  {inputs.showContactInfo && inputs.contactInfo && (
                     <div className="mb-4 whitespace-pre-line">{inputs.contactInfo}</div>
                  )}
                  {inputs.showLinks && footerLinks.length > 0 && (
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
               © {new Date().getFullYear()} {inputs.organizationName || "Organization"}. All rights reserved.
            </div>
         </div>
      </footer>
   )
}

export default FooterPageDisplay
