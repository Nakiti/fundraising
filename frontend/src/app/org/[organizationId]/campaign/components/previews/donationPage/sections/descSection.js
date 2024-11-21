import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const DescSection = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(CampaignContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Description <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a Description"
               name="description"
               value={donationPageInputs.description}
               onChange={handleDonationPageInputsChange} 
            />
         </div>
      </div>
   )
}

export default DescSection