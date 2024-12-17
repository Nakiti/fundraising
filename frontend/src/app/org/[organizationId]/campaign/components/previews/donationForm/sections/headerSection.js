import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"

const DonationFormHeaderSection = () => {
   const {donationFormInputs, handleDonationFormInputsChange} = useContext(DonationFormContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter a Headline "
               name="headline"
               value={donationFormInputs.headline}
               onChange={handleDonationFormInputsChange}
            />
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Message <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-md w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={6}
               placeholder="Enter a Message "
               name="description"
               value={donationFormInputs.description}
               onChange={handleDonationFormInputsChange}
            />
         </div>
      </div>
   )
}

export default DonationFormHeaderSection