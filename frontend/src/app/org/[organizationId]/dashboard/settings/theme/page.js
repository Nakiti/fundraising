"use client"
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import useImageUpload from "@/app/hooks/useImageUpload";
import useFormInput from "@/app/hooks/useFormInput";

const Theme = ({params}) => {
   const organizationId = params.organizationId
   const [inputs, handleInputsChange, setInputs] = useFormInput({
      image: "",
      h_color: "",
      p_color: "",
      s_color: ""
   })
   const {handleImageUpload, imagePreview} = useImageUpload()


   return (
      <div className="h-full w-full bg-gray-50 overflow-y-auto">
         <div className="p-6 bg-gray-50">
         <div className="w-full h-full p-8 bg-white rounded-lg overflow-y-auto">
            <Link 
               href={`/org/${organizationId}/dashboard/settings`}
               className="text-gray-700 flex flex-row items-center space-x-2"
            >
               <FaArrowLeft className="text-gray-700"/>
               <p>Settings</p>
            </Link>
            <div className="p-6">
               <h1 className="text-3xl font-semibold mb-4 text-gray-800">Theme</h1>
               <p className="text-gray-700">Manage core themes and components of your organization</p>
            </div>

            <div className="p-6 w-3/4">
               <p className="font-semibold text-lg mb-1">Main Logo</p>
               <p className="text-gray-700 mb-2">Upload a rectangular image that will be used as the primary logo for your organizaiton</p>
               {/* <p className="text-sm font-bold text-gray-600 mb-2 mt-4">
                  Image Upload <span className="text-red-500">*</span>
               </p> */}
               {!inputs.image ? <label className="w-1/2 h-32 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
                  <span className="text-gray-500  p-4">Click to upload an image</span>
                  <input 
                     type="file"
                     className="hidden " 
                     name="image"
                     accept="image/*"
                     onChange={(e) => handleImageUpload(e, handleInputsChange)}
                  />
               </label> :
               <div>             
                  <img
                     src={inputs.image}
                     alt="image"
                     className="w-1/2 h-32 object-cover border border-dashed border-gray-400 rounded-md bg-gray-50"
                  />
                  <label className="w-1/2 h-10 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
                     <span className="text-gray-500 text-sm p-3">Replace Image</span>
                     <input 
                        type="file"
                        className="hidden " 
                        name="image"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, handleInputsChange)}
                     />
                  </label> 
               </div> 
               }
            </div>

            <div className="p-6 w-3/4">
               <p className="font-semibold text-lg mb-1">Organization Colors</p>
               <p className="text-gray-700 mb-4">Select the colors that will be used in organization pages</p>
               <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">Header Color</p>
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                        name="h_color"
                        value={inputs.h_color}
                        onChange={handleInputsChange}
                        style={{ backgroundColor: inputs.h_color }}  
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer" 
                        style={{ backgroundColor: inputs.h_color }}  
                     />
                  </div>
               </div>
               <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">Primary Color</p>
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                        name="p_color"
                        value={inputs.p_color}
                        onChange={handleInputsChange}
                        style={{ backgroundColor: inputs.p_color }}  
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer" 
                        style={{ backgroundColor: inputs.p_color }}  
                     />
                  </div>
               </div>
               <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">Secondary Color</p>
                  <div className="relative">
                     <input 
                        type="color" 
                        className="opacity-0 absolute inset-0 w-6 h-6 cursor-pointer"
                        name="p_color"
                        value={inputs.s_color}
                        onChange={handleInputsChange}
                        style={{ backgroundColor: inputs.s_color }}  
                     />
                     <div 
                        className="w-6 h-6 rounded-full border border-gray-800 cursor-pointer" 
                        style={{ backgroundColor: inputs.s_color }}  
                     />
                  </div>
               </div>
            </div>
         </div>
         </div>
      </div>
   )
}

export default Theme