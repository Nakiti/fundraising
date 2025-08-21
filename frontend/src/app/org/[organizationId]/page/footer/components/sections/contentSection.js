"use client"
import { useContext } from "react"
import { FooterPageContext } from "@/app/context/organizationPages/footerPageContext"

const ContentSection = () => {
   const { inputs, handleInputsChange } = useContext(FooterPageContext)

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Content</h3>
         <div className="space-y-4">
            {/* Logo */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
               </label>
               <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  onChange={(e) => {
                     const file = e.target.files[0]
                     if (file) {
                        handleInputsChange({ target: { name: 'logo', value: file } })
                     }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               />
               {inputs.logo && (
                  <div className="mt-2">
                     <img 
                        src={typeof inputs.logo === 'string' ? inputs.logo : URL.createObjectURL(inputs.logo)} 
                        alt="Footer Logo" 
                        className="h-8 object-contain"
                     />
                  </div>
               )}
            </div>

            {/* Organization Name */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
               </label>
               <input
                  type="text"
                  name="organizationName"
                  value={inputs.organizationName || ""}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization name"
               />
            </div>

            {/* Tagline */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
               </label>
               <input
                  type="text"
                  name="tagline"
                  value={inputs.tagline || ""}
                  onChange={handleInputsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tagline"
               />
               <div className="flex items-center mt-2">
                  <input
                     type="checkbox"
                     name="showTagline"
                     checked={inputs.showTagline !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'showTagline', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">Show tagline</label>
               </div>
            </div>

            {/* Description */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
               </label>
               <textarea
                  name="description"
                  value={inputs.description || ""}
                  onChange={handleInputsChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter organization description"
               />
               <div className="flex items-center mt-2">
                  <input
                     type="checkbox"
                     name="showDescription"
                     checked={inputs.showDescription !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'showDescription', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">Show description</label>
               </div>
            </div>

            {/* Contact Information */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
               </label>
               <textarea
                  name="contactInfo"
                  value={inputs.contactInfo || ""}
                  onChange={handleInputsChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact information (address, phone, email)"
               />
               <div className="flex items-center mt-2">
                  <input
                     type="checkbox"
                     name="showContactInfo"
                     checked={inputs.showContactInfo !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'showContactInfo', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">Show contact information</label>
               </div>
            </div>

            {/* Footer Links */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Links
               </label>
               <textarea
                  name="links"
                  value={inputs.links || ""}
                  onChange={handleInputsChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter footer links (one per line, format: Link Text|URL)"
               />
               <p className="text-xs text-gray-500 mt-1">Format: Link Text|URL (one per line)</p>
               <div className="flex items-center mt-2">
                  <input
                     type="checkbox"
                     name="showLinks"
                     checked={inputs.showLinks !== false}
                     onChange={(e) => handleInputsChange({ target: { name: 'showLinks', value: e.target.checked } })}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-600">Show footer links</label>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ContentSection
