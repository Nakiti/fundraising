import { useContext } from "react";
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext";

const DonationFormButtonsSection = () => {
   const { donationFormInputs, handleDonationFormInputsChange } = useContext(DonationFormContext);

   const buttonValues = [
      { label: "Button One Value", name: "button1" },
      { label: "Button Two Value", name: "button2" },
      { label: "Button Three Value", name: "button3" },
      { label: "Button Four Value", name: "button4" },
      { label: "Button Five Value", name: "button5" },
      // { label: "Button Six Value", name: "button6" },
   ];

   return (
      <div className="my-4">
         <p className="text-sm font-bold text-gray-600 mb-2">Donation Amount Options</p>
         <div className="flex flex-row justify-between border-b border-gray-500 p-2">
            <p className="text-xs font-semibold text-gray-600">Amount</p>
         </div>

         {buttonValues.map((button) => (
            <div key={button.name} className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">{button.label}</label>
               <div className="flex flex-row items-center space-x-2 ml-auto">
                  <input
                     placeholder={`Enter a Value for ${button.label}`}
                     type="number"
                     className="border border-gray-400 rounded-sm py-1 px-2 text-sm"
                     value={donationFormInputs[button.name]}
                     name={button.name}
                     onChange={handleDonationFormInputsChange}
                  />
                  <button
                     className="w-4 h-4 flex items-center justify-center bg-red-600 text-white rounded-full text-sm font-bold"
                  >
                     <p className="text-sm font-bold">-</p>
                  </button>
               </div>
            </div>

         ))}
      </div>
   );
};

export default DonationFormButtonsSection;
