"use client"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { getCampaignService } from "@/app/services"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import TextInput from "@/app/components/inputs/TextInput"

const About = () => {
   const {campaignDetails, handleCampaignDetailsChange, campaignId, campaignStatus, loading, markChangesAsSaved, pageChanges, markPageChangesAsSaved} = useContext(CampaignContext)
   const {currentUser} = useContext(AuthContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("")

   const handleSave = async() => {
      try {
         console.log("campaignDetails", campaignDetails)
         const campaignService = getCampaignService();
         await campaignService.updateCampaign(campaignId, {
            ...campaignDetails,
            updated_by: currentUser.id
         })
         markChangesAsSaved()
         markPageChangesAsSaved('about')
      } catch (err) {
         const handledError = errorHandler.handle(err)
         setErrorMessage(handledError.message)
         setError(true)
      }
   }

   const handleChange = (e) => {
      handleCampaignDetailsChange(e)
   }

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-10"></div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded col-span-2"></div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         {error && <ErrorModal message={errorMessage} setError={setError} />}
         <h1 className="text-4xl font-light text-gray-900 mb-4">About</h1>
         <h3 className="text-md text-gray-600 mb-10">Set up Campaign Details</h3>
         
         {/* Form Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">

            <TextInput title="External Name" name="externalName" value={campaignDetails?.externalName} changeFunc={handleChange} placeholder="Enter a Name" />
            <TextInput title="Internal Campaign Name" name="internalName" value={campaignDetails?.internalName} changeFunc={handleChange} placeholder="Enter Internal Name" />
            <TextInput title="Fundraising Goal" name="goal" value={campaignDetails?.goal} changeFunc={handleChange} placeholder="Enter a Fundraising Goal" type="number" min="1" />
            <TextInput title="Short URL" name="url" value={campaignDetails?.url} changeFunc={handleChange} placeholder="Enter Short URL" />
         </div>

         <div className="w-full flex flex-row mt-6">
            <button 
                className={`ml-auto ${!pageChanges.about ? "bg-gray-300" : "bg-blue-700 hover:bg-blue-600"} px-6 py-3 w-40 rounded-md shadow-sm text-md text-white `}
                onClick={handleSave}
                disabled={!pageChanges.about}
             >
                Save
             </button>
         </div>
      </div>
   )
}

export default About