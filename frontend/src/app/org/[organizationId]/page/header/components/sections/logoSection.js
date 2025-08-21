"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { FaUpload, FaTrash } from "react-icons/fa"

const LogoSection = () => {
   const { inputs, handleInputsChange } = useContext(HeaderPageContext)

   const handleLogoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
         // In a real implementation, you would upload the file to your server
         // and get back a URL. For now, we'll create a local URL
         const imageUrl = URL.createObjectURL(file)
         handleInputsChange({ target: { name: 'logo', value: imageUrl } })
      }
   }

   const removeLogo = () => {
      handleInputsChange({ target: { name: 'logo', value: '' } })
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Branding</h3>
         
         <div className="space-y-4">
            {/* Logo Upload */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Logo
               </label>
               <div className="flex items-center space-x-4">
                  {inputs.logo ? (
                     <div className="flex items-center space-x-3">
                        <img 
                           src={inputs.logo} 
                           alt="Logo preview" 
                           className="w-12 h-12 object-contain border border-gray-200 rounded"
                        />
                        <button
                           type="button"
                           onClick={removeLogo}
                           className="text-red-600 hover:text-red-800"
                        >
                           <FaTrash className="w-4 h-4" />
                        </button>
                     </div>
                  ) : (
                     <div className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg">
                        <FaUpload className="w-4 h-4 text-gray-400" />
                     </div>
                  )}
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleLogoUpload}
                     className="hidden"
                     id="logo-upload"
                  />
                  <label
                     htmlFor="logo-upload"
                     className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                     Upload Logo
                  </label>
               </div>
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
                  placeholder="Enter tagline (optional)"
               />
            </div>

            {/* Show Tagline Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Tagline
               </label>
               <input
                  type="checkbox"
                  name="showTagline"
                  checked={inputs.showTagline !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'showTagline', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>


         </div>
      </div>
   )
}

export default LogoSection
