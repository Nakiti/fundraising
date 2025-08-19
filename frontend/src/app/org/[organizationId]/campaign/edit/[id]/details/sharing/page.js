"use client"
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { AuthContext } from "@/app/context/authContext";
import { CampaignUpdateService } from "@/app/services/updateServices";
import { errorHandler } from "@/app/services/apiClient";
import ErrorModal from "@/app/components/errorModal";

const Sharing = () => {
   const {campaignDetails, handleCampaignDetailsChange, campaignId, campaignStatus, loading, markChangesAsSaved, pageChanges, markPageChangesAsSaved} = useContext(CampaignContext);
   const {currentUser} = useContext(AuthContext);
   const [error, setError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const handleSave = async() => {
             try {
                    await CampaignUpdateService.updateCampaignDetails(campaignId, campaignDetails, campaignStatus, currentUser);
           markChangesAsSaved();
           markPageChangesAsSaved('sharing');
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
               <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <h1 className="text-4xl font-light text-gray-900 mb-4">Sharing</h1>
         <h3 className="text-md text-gray-600 mb-8">Configure sharing settings for your campaign</h3>
         
         <div className="space-y-6">
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Social Media Title
               </label>
               <input
                  name="socialTitle"
                  type="text"
                  placeholder="Enter social media title"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails?.socialTitle || ""}
                  onChange={handleChange}
               />
            </div>
            
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Social Media Description
               </label>
               <textarea
                  name="socialDescription"
                  placeholder="Enter social media description"
                  rows={4}
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails?.socialDescription || ""}
                  onChange={handleChange}
               />
            </div>
            
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Campaign URL
               </label>
               <input
                  name="campaignUrl"
                  type="url"
                  placeholder="Enter campaign URL"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails?.campaignUrl || ""}
                  onChange={handleChange}
               />
            </div>
         </div>

         <div className="w-full flex flex-row mt-6">
                         <button 
                className={`ml-auto ${!pageChanges.sharing ? "bg-gray-300" : "bg-blue-700 hover:bg-blue-600"} px-6 py-3 w-40 rounded-md shadow-sm text-md text-white`}
                onClick={handleSave}
                disabled={!pageChanges.sharing}
             >
                Save
             </button>
         </div>
      </div>
   )
}

export default Sharing