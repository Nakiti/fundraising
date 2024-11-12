import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";


const Contact = () => {

   return (
      <div className="w-full">
         <h1 className="text-3xl mb-2 font-light">Contact</h1>
         <h3 className="text-md text-gray-600 mb-8">Provide contact information for donors with questions</h3>


         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Email <span className="text-red-500">*</span>
               </label>
               <input
                  name="campaignName"
                  type="text"
                  placeholder="Enter Email Address"
                  className="p-3 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // value={aboutInputs.campaignName}
                  // onChange={handleAboutInputsChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Phone Number <span className="text-red-500">*</span>
               </label>
               <input
                  name="internalName"
                  type="text"
                  placeholder="Enter Phone Number"
                  className="p-3 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  // value={aboutInputs.internalName}
                  // onChange={handleAboutInputsChange}
               />
            </div>
         </div>
      </div>
   )
}

export default Contact