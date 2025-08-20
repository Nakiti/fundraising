//imports
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

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
        item.name === sectionName ? { 
          ...item, 
          active: !item.active,
          dropdown: item.active ? false : item.dropdown // Collapse dropdown when turning off
        } : item
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
      <div key={section.name} className="bg-white border border-gray-100 mb-3" style={{borderRadius: "4px"}}>
         <div className="flex flex-row justify-between py-3 px-4 items-center hover:bg-gray-50 transition-colors duration-200" style={{borderRadius: "4px"}}>
            <div className="flex items-center space-x-3">
               <h2 className="text-sm font-medium text-gray-900">{section.displayText}</h2>
               {section.required && (
                  <span className="text-xs text-red-500 font-medium">Required</span>
               )}
            </div>
            <div className="flex flex-row items-center space-x-3">
               {!section.required && (
                  <button
                     onClick={() => toggleSwitch(section.name)}
                     className="p-1 hover:bg-gray-100 transition-colors duration-200"
                     style={{borderRadius: "4px"}}
                  >
                     {section.active ? (
                        <FaToggleOn className="w-4 h-4 text-green-500" />
                     ) : (
                        <FaToggleOff className="w-4 h-4 text-gray-400" />
                     )}
                  </button>
               )}
               <button
                  onClick={() => handleDropdown(section.name)}
                  className={`p-1 hover:bg-gray-100 transition-colors duration-200 ${!section.active ? 'cursor-not-allowed opacity-50' : ''}`}
                  style={{borderRadius: "4px"}}
                  disabled={!section.active}
               >
                  {section.dropdown ? (
                     <IoIosArrowUp className="w-3 h-3 text-gray-600" />
                  ) : (
                     <IoIosArrowDown className="w-3 h-3 text-gray-600" />
                  )}
               </button>
            </div>
         </div>
         {section.dropdown && (
            <div className="px-4 pb-4 border-t border-gray-100">
               {section.content}
            </div>
         )}
      </div>
   )
}

export default SectionManager