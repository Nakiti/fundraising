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
   ];

   return (
      <div className="my-4">
         <h3 className="text-sm font-semibold text-gray-900 mb-4">Donation Amount Options</h3>
         <div className="space-y-3">
            {buttonValues.map((button) => (
               <div key={button.name} className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">{button.label}</label>
                  <input
                     placeholder={`Enter a Value for ${button.label}`}
                     type="number"
                     className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                     value={donationFormInputs[button.name]}
                     name={button.name}
                     onChange={handleDonationFormInputsChange}
                  />
               </div>
            ))}
         </div>
      </div>
   );
};

export default DonationFormButtonsSection;
