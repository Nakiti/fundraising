import { useContext } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";

const DonateSection = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)

   const buttonConfigs = [
      { name: "button1", label: "Button One Value" },
      { name: "button2", label: "Button Two Value" },
      { name: "button3", label: "Button Three Value" },
      { name: "button4", label: "Button Four Value" },
      { name: "button5", label: "Button Five Value" },
      { name: "button6", label: "Button Six Value" },
   ]

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Donation Amount Options</p>
            <div className="flex flex-row justify-between border-b border-gray-500 p-2">
               <p className="text-xs font-semibold text-gray-600">Amount</p>
               {/* <p className="text-xs font-semibold text-gray-600">Show on Page?</p> */}
            </div>
            {buttonConfigs.map((item, index) => (
               <div key={index} className="flex flex-row justify-between p-2 w-full items-center">
                  <label className="text-gray-600 text-xs font-bold">{item.label}</label>
                  <input
                     placeholder={`Enter a Value for ${item.label}`}
                     type="number"
                     className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                     value={donationPageInputs[item.name]}
                     name={item.name}
                     onChange={handleDonationPageInputsChange}
                  />
               </div>
            ))}
         </div>
      </div>
   )
}

export default DonateSection