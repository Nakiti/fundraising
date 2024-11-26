import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { updateCampaignDetails } from "@/app/services/campaignService"

const AboutComponent = () => {
   const {campaignDetails, handleCampaignDetailsChange, campaignId} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)

   const handleSave = async() => {
      try {
         await updateCampaignDetails(campaignId, campaignDetails, 'inactive', currentUser)
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">About</h1>
         <h3 className="text-md text-gray-600 mb-10">Set up Campaign Details</h3>
         
         {/* Form Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {/* Campaign Name */}
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Campaign Name <span className="text-red-500">*</span>
               </label>
               <input
                  name="campaignName"
                  type="text"
                  placeholder="Enter a Name"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails.campaignName}
                  onChange={handleCampaignDetailsChange}
               />
            </div>
            
            {/* Internal Campaign Name */}
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Internal Campaign Name <span className="text-red-500">*</span>
               </label>
               <input
                  name="internalName"
                  type="text"
                  placeholder="Enter Internal Name"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails.internalName}
                  onChange={handleCampaignDetailsChange}
               />
            </div>
            
            {/* Fundraising Goal */}
            <div className="flex flex-col">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Fundraising Goal <span className="text-red-500">*</span>
               </label>
               <input
                  name="goal"
                  type="number"
                  min="1"
                  placeholder="Enter a Fundraising Goal"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails.goal}
                  onChange={handleCampaignDetailsChange}
               />
            </div>
            
            {/* Short URL */}
            <div className="flex flex-col col-span-1 sm:col-span-2">
               <label className="text-gray-600 text-sm font-semibold mb-2">
                  Short URL <span className="text-red-500">*</span>
               </label>               
               <input
                  name="url"
                  type="text"
                  placeholder="Enter Short URL"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                  value={campaignDetails.url}
                  onChange={handleCampaignDetailsChange}
               />
            </div>
         </div>

         <div className="w-full flex flex-row mt-6">
            <button 
               className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default AboutComponent