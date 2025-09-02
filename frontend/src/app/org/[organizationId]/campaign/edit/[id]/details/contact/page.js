"use client"
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { AuthContext } from "@/app/context/authContext";
import { getCampaignService } from "@/app/services";
import { errorHandler } from "@/app/services/apiClient";
import ErrorModal from "@/app/components/errorModal";

const CampaignContact = () => {
   const {campaignDetails, handleCampaignDetailsChange, campaignId, campaignStatus, loading, markChangesAsSaved, pageChanges, markPageChangesAsSaved} = useContext(CampaignContext);
   const {currentUser} = useContext(AuthContext);
   const [error, setError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const handleSave = async() => {
             try {
                    const campaignService = getCampaignService();
                    await campaignService.updateCampaign(campaignId, campaignDetails);
           markChangesAsSaved();
           markPageChangesAsSaved('contact');
      } catch (err) {
         const handledError = errorHandler.handle(err);
         setErrorMessage(handledError.message);
         setError(true);
      }
   };

       const handleChange = (e) => {
       handleCampaignDetailsChange(e);
    };

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-8"></div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <h1 className="text-4xl mb-2 font-light">Contact</h1>
         <h3 className="text-md text-gray-600 mb-8">Provide contact information for donors with questions</h3>
         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Email <span className="text-red-500">*</span>
               </label>
               <input
                  name="contactEmail"
                  type="email"
                  placeholder="Enter Email Address"
                  className="p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={campaignDetails?.contactEmail || ""}
                  onChange={handleChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">
                  Phone Number <span className="text-red-500">*</span>
               </label>
               <input
                  name="contactPhone"
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="p-3 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={campaignDetails?.contactPhone || ""}
                  onChange={handleChange}
               />
            </div>
         </div>
         <div className="w-full flex flex-row mt-6">
                         <button 
                className={`ml-auto ${!pageChanges.contact ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} px-6 py-3 w-40 rounded-md shadow-sm text-md text-white`}
                onClick={handleSave}
                disabled={!pageChanges.contact}
             >
                Save
             </button>
         </div>
      </div>
   )
}

export default CampaignContact