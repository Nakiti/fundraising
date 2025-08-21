"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"

const SocialSection = () => {
   const { inputs, handleInputsChange } = useContext(FooterPageContext)

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
         <div className="space-y-4">
            {/* Social Media Links */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Links
               </label>
               <textarea
                  name="socialLinks"
                  value={inputs.socialLinks || ""}
                  onChange={handleInputsChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter social media links (one per line, format: Platform|URL|Icon)"
               />
               <p className="text-xs text-gray-500 mt-1">
                  Format: Platform|URL|Icon (one per line)<br/>
                  Example: Facebook|https://facebook.com/org|facebook<br/>
                  Available icons: facebook, twitter, instagram, linkedin, youtube, tiktok
               </p>
               <div className="flex items-center mt-2">
                  <input
                     type="checkbox"
                     name="showSocialLinks"
                     checked={inputs.showSocialLinks !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'showSocialLinks', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">Show social media links</label>
               </div>
            </div>

            {/* Social Media Icons Size */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Size
               </label>
               <select
                  name="socialIconSize"
                  value={inputs.socialIconSize || "medium"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="small">Small (16px)</option>
                  <option value="medium">Medium (20px)</option>
                  <option value="large">Large (24px)</option>
               </select>
            </div>

            {/* Social Media Icons Color */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Color
               </label>
               <div className="flex items-center space-x-3">
                  <input
                     type="color"
                     name="socialIconColor"
                     value={inputs.socialIconColor || "#FFFFFF"}
                     onChange={handleInputsChange}
                     className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                     type="text"
                     name="socialIconColor"
                     value={inputs.socialIconColor || "#FFFFFF"}
                     onChange={handleInputsChange}
                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     placeholder="#FFFFFF"
                  />
               </div>
            </div>

            {/* Social Media Layout */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media Layout
               </label>
               <select
                  name="socialLayout"
                  value={inputs.socialLayout || "horizontal"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="grid">Grid</option>
               </select>
            </div>

            {/* Social Media Spacing */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Spacing
               </label>
               <select
                  name="socialSpacing"
                  value={inputs.socialSpacing || "normal"}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                  <option value="tight">Tight (8px)</option>
                  <option value="normal">Normal (12px)</option>
                  <option value="loose">Loose (16px)</option>
               </select>
            </div>
         </div>
      </div>
   )
}

export default SocialSection
