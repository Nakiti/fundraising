import { useContext, useState } from "react";
import { LandingPageContext } from "@/app/context/landingPageContext";

const LargeTextSection = () => {

   const {inputs, handleInputsChange} = useContext(LandingPageContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={3}
               placeholder="Enter about text"
               name="mainHeadline"
               value={inputs.mainHeadline}
               onChange={handleInputsChange} 
            />
         </div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Text <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={12}
               placeholder="Enter about text"
               name="mainText"
               value={inputs.mainText}
               onChange={handleInputsChange} 
            />
         </div>
      </div>
   )
}

export default LargeTextSection