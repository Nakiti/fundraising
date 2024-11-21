import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/landingPageContext";
import useImageUpload from "@/app/hooks/useImageUpload";

const TripleSection = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)
   const {handleImageUpload} = useImageUpload()

   return (
      <div>
         <div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Headline One <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={2}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Description One <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={6}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="mb-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Upload Image One <span className="text-red-500">*</span>
               </p>
               <label className="w-full h-16 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
                  <span className="text-gray-500 p-4">Click to upload an image</span>
                  <input 
                     type="file"
                     className="hidden" 
                     name="aboutImage"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>                  
            </div>
         </div>
         <div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Headline Two <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={2}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Description Two <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={6}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="mb-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Upload Image Two <span className="text-red-500">*</span>
               </p>
               <label className="w-full h-16 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
                  <span className="text-gray-500 p-4">Click to upload an image</span>
                  <input 
                     type="file"
                     className="hidden" 
                     name="aboutImage"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>                  
            </div>
         </div>
         <div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Headline Three <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={2}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="my-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Enter Description Three <span className="text-red-500">*</span>
               </p>
               <textarea 
                  className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
                  rows={6}
                  placeholder="Enter about text"
                  name="aboutText"
                  value={inputs.aboutText}
                  onChange={handleInputsChange} 
               />
            </div>
            <div className="mb-4">
               <p className="text-sm font-bold text-gray-600 mb-2">
                  Upload Image Three <span className="text-red-500">*</span>
               </p>
               <label className="w-full h-16 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
                  <span className="text-gray-500 p-4">Click to upload an image</span>
                  <input 
                     type="file"
                     className="hidden" 
                     name="aboutImage"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>                  
            </div>
         </div>
      </div>
   )
}

export default TripleSection