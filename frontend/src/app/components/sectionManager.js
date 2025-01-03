//imports
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

/*
   Component: Section Manager
   Description: Component to manage the sections that contain fields to customize page displays
               - Has toggles to allow user to hide and show components on the display
   Props: 
      - setSections: Function to update the state of the sections array
      - sections: Array of sections
      - section: Individual section
*/
const SectionManager = ({setSections, sections, section}) => {

   /*
      Function: toggleSwitch
      Description: Toggles the active state of a section -- either showing or hiding it on the display
   */
   const toggleSwitch = (sectionName) => {
      setSections(sections.map(item =>
        item.name === sectionName ? { ...item, active: !item.active } : item
      ));
   };
  
   /* 
      Function: handleDropdown
      Description: Collapses and opens the input section for increased accesibility 
   */
   const handleDropdown = (sectionName) => {
      setSections(sections.map(item =>
         item.name === sectionName ? { ...item, dropdown: !item.dropdown } : item
      ));
   };

   return (
      <div key={section.name} className="">
         <div className="flex flex-row justify-between py-4 items-center border-b border-gray-500" >
            <h2 className="text-md font-bold text-gray-600">{section.displayText}</h2>
            <div className="flex flex-row space-x-4">
               {!section.required && <button
               onClick={() => toggleSwitch(section.name)}
               className={`w-12 h-6 flex items-center rounded-full cursor-pointer p-1 transition-colors ${
                  section.active ? 'bg-blue-800' : 'bg-gray-300'
               }`}
               >
               <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                     section.active ? 'translate-x-6' : 'translate-x-0'
                  }`}
               ></div>
               </button>}
               <button
                  onClick={() => handleDropdown(section.name)}
                  className={`ml-4 underline ${!section.active ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!section.active}
               >
               {section.dropdown ? <IoIosArrowUp /> : <IoIosArrowDown /> }
               </button>
            </div>
         </div>
         {section.dropdown && (
            section.content
         )}
      </div>
   )
}

export default SectionManager