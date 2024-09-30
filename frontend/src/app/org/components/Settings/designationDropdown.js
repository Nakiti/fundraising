import { useState, useContext } from 'react';
import { CampaignContext } from '@/app/context/campaignContext';

const DesignationDropdown = () => {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const {designations, selectedDesignations, setSelectedDesignations } = useContext(CampaignContext);

   // Toggle selection of designations
      const handleCheckboxChange = (event, designation) => {
         const { checked } = event.target;

         if (checked) {
            setSelectedDesignations([...selectedDesignations, designation]);
         } else {
            setSelectedDesignations(
            selectedDesignations.filter((selected) => selected.id !== designation.id)
            );
         }
      };

   // Toggle dropdown visibility
   const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
   };

   return (
      <div className="relative flex flex-row justify-between w-full items-center">
         <div className="relative w-full">
         {/* Button to toggle dropdown */}
         <button
            type="button"
            className="w-full bg-white text-md border border-gray-300 rounded-md shadow-sm pl-3 pr-6 py-3 text-left cursor-pointer flex justify-between items-center focus:outline-none"
            onClick={toggleDropdown}
         >
            <span>
               {selectedDesignations.length > 0
               ? selectedDesignations.map((item) => item.title).join(', ')
               : 'Select Designation'}
            </span>

            <span className="ml-4">
               {isDropdownOpen ? '\u25B2' : '\u25BC'}
            </span>
         </button>

         {/* Dropdown menu */}
         {isDropdownOpen && (
            <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
               <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto sm:text-sm">
               {designations.map((designation) => (
                  <li key={designation.id} className="px-4 py-2">
                     <label className="flex items-center">
                     <input
                        type="checkbox"
                        value={designation.title}
                        checked={selectedDesignations.some((item) => item.id === designation.id)}
                        onChange={(event) => handleCheckboxChange(event, designation)}
                        className="mr-2"
                     />
                     {designation.title}
                     </label>
                  </li>
               ))}
               </ul>
            </div>
         )}
         </div>
      </div>
   );
};

export default DesignationDropdown;
