"use client"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { AuthContext } from "@/app/context/authContext"
import { getCampaignService } from "@/app/services"
import { errorHandler } from "@/app/services/apiClient"
import ErrorModal from "@/app/components/errorModal"
import CheckboxInput from "@/app/components/inputs/CheckboxInput"

const Settings = () => {
    const {campaignDetails, handleCampaignDetailsChange, setCampaignDetails, campaignId, campaignStatus, loading, markChangesAsSaved, pageChanges, markPageChangesAsSaved, checkForChanges} = useContext(CampaignContext)
    const {currentUser} = useContext(AuthContext)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSave = async() => {
        try {
            console.log("campaignDetails", campaignDetails)
            const campaignService = getCampaignService();
            await campaignService.updateCampaign(campaignId, {
                ...campaignDetails,
                updatedBy: currentUser.id
            })
            markChangesAsSaved()
            markPageChangesAsSaved('settings')
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
            <h1 className="text-4xl font-light text-gray-900 mb-4">Settings</h1>
            <h3 className="text-md text-gray-600 mb-10">Configure campaign settings</h3>
            

            {/* Campaign Settings Section */}
            <CheckboxInput title="Show Leaderboard" name="showLeaderboard" value={campaignDetails?.showLeaderboard || false} changeFunc={handleChange} description="When enabled, the leaderboard will be shown on the campaign page" />
            <CheckboxInput title="Allow Anonymous Donations" name="allowAnonymousDonations" value={campaignDetails?.allowAnonymousDonations || false} changeFunc={handleChange} description="When enabled, donors can choose to make their donation anonymous on public pages" />
            <CheckboxInput title="Anonymize All Donations" name="anonymizeAllDonations" value={campaignDetails?.anonymizeAllDonations || false} changeFunc={handleChange} description="When enabled, all donations will be anonymized on public pages" />


            <div className="w-full flex flex-row mt-6">
                <button 
                    className={`ml-auto ${!pageChanges.settings ? "bg-gray-300" : "bg-blue-700 hover:bg-blue-600"} px-6 py-3 w-40 rounded-md shadow-sm text-md text-white `}
                    onClick={handleSave}
                    disabled={!pageChanges.settings}
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default Settings