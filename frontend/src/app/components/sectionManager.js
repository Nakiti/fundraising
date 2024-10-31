import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";


const SectionManager = ({setSections, sections, section}) => {


   const toggleSwitch = (sectionName) => {
      setSections(sections.map(item =>
        item.name === sectionName ? { ...item, active: !item.active } : item
      ));
   };
  
   const handleDropdown = (sectionName) => {
      setSections(sections.map(item =>
         item.name === sectionName ? { ...item, dropdown: !item.dropdown } : item
      ));
   };

   return (
      <div key={section.name} className="">
         <div className="flex flex-row justify-between py-4 items-center border-b border-gray-500">
            <h2 className="text-md font-bold text-gray-600">{section.displayText}</h2>
            <div className="flex flex-row space-x-4">
               <button
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
               </button>
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