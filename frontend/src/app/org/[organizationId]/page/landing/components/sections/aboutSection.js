import { useContext } from "react";
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext"
import { FaUpload, FaInfoCircle } from "react-icons/fa";

const AboutSection = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            handleInputsChange({ target: { name: e.target.name, value: reader.result } });
            console.log(reader.result)
         };
         reader.readAsDataURL(file); // Convert the file to base64
      }
   }

   return (
      <div className="space-y-6">

         {/* About Text Input */}
         <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
               About Text <span className="text-red-500">*</span>
            </label>
            <textarea 
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-colors duration-200"
               rows={5}
               placeholder="Tell visitors about your organization, mission, and values..."
               name="aboutText"
               value={inputs.aboutText}
               onChange={handleInputsChange} 
            />
            <p className="text-xs text-gray-500">This content will appear in the about section of your landing page</p>
         </div>

         {/* About Image Upload */}
         <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
               About Image <span className="text-red-500">*</span>
            </label>
            <div className="relative">
               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                     <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                     <p className="text-sm text-gray-500">
                        <span className="font-medium">Click to upload</span> or drag and drop
                     </p>
                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                     type="file"
                     className="hidden" 
                     name="aboutImage"
                     accept="image/*"
                     onChange={handleImageUpload}
                  />
               </label>
               {inputs.aboutImage && (
                  <div className="mt-3">
                     <img 
                        src={inputs.aboutImage} 
                        alt="About Preview" 
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}

export default AboutSection