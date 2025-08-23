"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { FaToggleOn, FaToggleOff, FaUpload, FaTrash } from "react-icons/fa"

const LogoSection = () => {
   const { inputs, handleInputsChange } = useContext(HeaderPageContext)

   const handleToggleChange = (name) => {
      handleInputsChange({
         target: {
            name,
            value: !(inputs[name] !== false)
         }
      })
   }

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
      <div className="space-y-3">
         {/* Logo Upload */}
         <div className="space-y-1 mt-4">
            <label className="block text-xs font-medium text-gray-700">
               Organization Logo
            </label>
            <div className="flex items-center space-x-3">
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
                  className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors duration-200"
               >
                  Upload Logo
               </label>
            </div>
         </div>

         {/* Organization Name */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Organization Name
            </label>
            <input
               type="text"
               name="organizationName"
               value={inputs.organizationName || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter organization name"
            />
         </div>

         {/* Tagline */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Tagline
            </label>
            <input
               type="text"
               name="tagline"
               value={inputs.tagline || ""}
               onChange={handleInputsChange}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter tagline"
            />
         </div>

         {/* Description */}
         <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
               Description
            </label>
            <textarea
               name="description"
               value={inputs.description || ""}
               onChange={handleInputsChange}
               rows={2}
               className="w-full px-2 py-1 text-xs border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter organization description"
            />
         </div>
      </div>
   )
}

export default LogoSection
