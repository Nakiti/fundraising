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
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Donation Amount Options</h3>
            <div className="space-y-3">
               {buttonConfigs.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-2">
                     <label className="text-sm font-medium text-gray-700">{item.label}</label>
                     <input
                        placeholder={`Enter a number`}
                        type="number"
                        className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        value={donationPageInputs[item.name]}
                        name={item.name}
                        onChange={handleDonationPageInputsChange}
                        min={1}
                     />
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default DonateSection