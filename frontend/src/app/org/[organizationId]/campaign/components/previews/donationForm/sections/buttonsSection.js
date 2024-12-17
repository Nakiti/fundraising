import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"

const DonationFormButtonsSection = () => {
   const {donationFormInputs, handleDonationFormInputsChange} = useContext(DonationFormContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Donation Amount Options</p>
            <div className="flex flex-row justify-between border-b border-gray-500 p-2">
               <p className="text-xs font-semibold text-gray-600">Amount</p>
               {/* <p className="text-xs font-semibold text-gray-600">Show on Page?</p> */}
            </div>

            
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button One Value</label>
               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button1}
                  name="button1"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Two Value</label>
               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button2}
                  name="button2"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Three Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button3}
                  name="button3"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Four Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button4}
                  name="button4"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Five Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button5}
                  name="button5"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Six Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                  value={donationFormInputs.button6}
                  name="button6"
                  onChange={handleDonationFormInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
         </div>
      </div>
   )
}

export default DonationFormButtonsSection