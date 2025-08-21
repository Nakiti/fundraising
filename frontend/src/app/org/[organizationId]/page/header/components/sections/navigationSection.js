"use client"
import { useContext } from "react"
import { HeaderPageContext } from "@/app/context/organizationPages/headerPageContext"
import { FaPlus, FaTrash, FaGripVertical } from "react-icons/fa"

const NavigationSection = () => {
   const { inputs, handleInputsChange } = useContext(HeaderPageContext)

   const addNavigationItem = () => {
      const newItem = { label: "New Item", href: "#" }
      const updatedItems = [...(inputs.navigationItems || []), newItem]
      handleInputsChange({ target: { name: 'navigationItems', value: updatedItems } })
   }

   const updateNavigationItem = (index, field, value) => {
      const updatedItems = [...(inputs.navigationItems || [])]
      updatedItems[index] = { ...updatedItems[index], [field]: value }
      handleInputsChange({ target: { name: 'navigationItems', value: updatedItems } })
   }

   const removeNavigationItem = (index) => {
      const updatedItems = (inputs.navigationItems || []).filter((_, i) => i !== index)
      handleInputsChange({ target: { name: 'navigationItems', value: updatedItems } })
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
         <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation Menu</h3>
         
         <div className="space-y-4">
            {/* Show Navigation Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Navigation Menu
               </label>
               <input
                  type="checkbox"
                  name="showNavigation"
                  checked={inputs.showNavigation !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'showNavigation', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>

            {/* Navigation Items */}
            {inputs.showNavigation !== false && (
               <div>
                  <div className="flex items-center justify-between mb-3">
                     <label className="text-sm font-medium text-gray-700">
                        Navigation Items
                     </label>
                     <button
                        type="button"
                        onClick={addNavigationItem}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                     >
                        <FaPlus className="w-3 h-3" />
                        <span>Add Item</span>
                     </button>
                  </div>
                  
                  <div className="space-y-3">
                     {(inputs.navigationItems || []).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                           <FaGripVertical className="w-4 h-4 text-gray-400" />
                           <div className="flex-1 grid grid-cols-2 gap-3">
                              <input
                                 type="text"
                                 value={item.label || ""}
                                 onChange={(e) => updateNavigationItem(index, 'label', e.target.value)}
                                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                 placeholder="Label"
                              />
                              <input
                                 type="text"
                                 value={item.href || ""}
                                 onChange={(e) => updateNavigationItem(index, 'href', e.target.value)}
                                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                 placeholder="URL"
                              />
                           </div>
                           <button
                              type="button"
                              onClick={() => removeNavigationItem(index)}
                              className="text-red-600 hover:text-red-800"
                           >
                              <FaTrash className="w-4 h-4" />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Show Search Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Search Icon
               </label>
               <input
                  type="checkbox"
                  name="showSearch"
                  checked={inputs.showSearch !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'showSearch', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>

            {/* Show Login Button Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Login Button
               </label>
               <input
                  type="checkbox"
                  name="showLoginButton"
                  checked={inputs.showLoginButton !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'showLoginButton', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>

            {/* Show Donate Button Toggle */}
            <div className="flex items-center justify-between">
               <label className="text-sm font-medium text-gray-700">
                  Show Donate Button
               </label>
               <input
                  type="checkbox"
                  name="showDonateButton"
                  checked={inputs.showDonateButton !== false}
                  onChange={(e) => handleInputsChange({ target: { name: 'showDonateButton', value: e.target.checked } })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
               />
            </div>
         </div>
      </div>
   )
}

export default NavigationSection
