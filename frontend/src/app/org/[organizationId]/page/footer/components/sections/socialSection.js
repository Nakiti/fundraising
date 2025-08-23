"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"

const SocialSection = () => {
   const { inputs, handleInputsChange } = useContext(FooterPageContext)

   return (
      <div className="space-y-3">
         {/* Social Media Links */}
         <div className="space-y-1 mt-4">
            <label className="block text-xs font-medium text-gray-700">
               Social Media Links
            </label>
            <textarea
               name="socialLinks"
               value={inputs.socialLinks || ""}
               onChange={handleInputsChange}
               rows={4}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter social media links (one per line, format: Platform|URL|Icon)"
            />
            <p className="text-xs text-gray-400">
               Format: Platform|URL|Icon (one per line)<br/>
               Example: Facebook|https://facebook.com/org|facebook<br/>
               Available icons: facebook, twitter, instagram, linkedin, youtube, tiktok
            </p>
         </div>
      </div>
   )
}

export default SocialSection
