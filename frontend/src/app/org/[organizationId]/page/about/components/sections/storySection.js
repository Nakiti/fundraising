"use client"
import { useContext } from "react";
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"

const StorySection = () => {
   const { inputs, handleInputsChange } = useContext(AboutPageContext);

   return (
      <div className="space-y-4">
         {/* Story Title */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               Story Title <span className="text-red-500">*</span>
            </label>
            <input 
               type="text"
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors duration-200"
               style={{borderRadius: "4px"}}
               placeholder="Enter the title for your story section..."
               name="storyTitle"
               value={inputs.storyTitle || ""}
               onChange={handleInputsChange}
            />
            {/* <p className="text-xs text-gray-400">This will be the heading for your story section</p> */}
         </div>

         {/* Story Text */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               Our Story <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-3 py-2 border border-gray-200 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none transition-colors duration-200"
               style={{borderRadius: "4px"}}
               rows={6}
               placeholder="Tell your organization's story, mission, and journey..."
               name="storyText"
               value={inputs.storyText || ""}
               onChange={handleInputsChange} 
            />
            {/* <p className="text-xs text-gray-400">Share your organization's story, mission, and the journey that brought you here</p> */}
         </div>

         {/* Story Image */}
         <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700">
               Story Image
            </label>
            <div className="relative">
               <label className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200" style={{borderRadius: "4px"}}>
                  <div className="flex flex-col items-center justify-center">
                     <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                     </svg>
                     <p className="text-xs text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                     </p>
                     <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                     type="file"
                     className="hidden" 
                     name="storyImage"
                     accept="image/*"
                     onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                                                   const reader = new FileReader();
                        reader.onload = (event) => {
                           // Store both the preview URL and the File object
                           handleInputsChange({
                              target: {
                                 name: e.target.name,
                                 value: event.target.result
                              }
                           });
                           handleInputsChange({
                              target: {
                                 name: e.target.name + 'File',
                                 value: file
                              }
                           });
                           console.log('Image preview:', event.target.result);
                           console.log('File object:', file);
                        };
                        reader.readAsDataURL(file);
                        }
                     }}
                  />
               </label>
               {inputs.storyImage && (
                  <div className="mt-2">
                     <img 
                        src={inputs.storyImage} 
                        alt="Story Preview" 
                        className="w-full h-16 object-cover border border-gray-200"
                        style={{borderRadius: "4px"}}
                     />
                  </div>
               )}
            </div>
            {/* <p className="text-xs text-gray-400">Optional image to accompany your story section</p> */}
         </div>
      </div>
   )
}

export default StorySection
