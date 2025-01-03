import { useContext } from "react"
import { AboutPageContext } from "@/app/context/organizationPages/aboutPageContext"

const WhySection = () => {
   const {inputs, handleInputsChange} = useContext(AboutPageContext)

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
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Why Text <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter why text"
               name="whyText"
               value={inputs.whyText}
               onChange={handleInputsChange} 
            />
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               About Image Upload <span className="text-red-500">*</span>
            </p>
            <label className="w-full h-20 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
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
   )
}

export default WhySection