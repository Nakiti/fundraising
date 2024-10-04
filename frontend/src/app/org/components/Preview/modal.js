import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import { IoIosClose } from "react-icons/io";


const Modal = ({label, value, setModal, position}) => {
   const {previewInputs, handlePreviewInputsChange} = useContext(CampaignContext)

   return (
      <div 
         className="w-1/6 border border-gray-400 rounded-lg shadow-lg fixed flex items-center justify-center z-50 top-1/2 right-4 transform -translate-y-1/2"         // style={{top: `${position.top - 40}px`, left: `${position.left - 120}px`}}
      >

         <div className="relative bg-white max-w-sm rounded-lg w-full py-6 px-6 flex flex-col justify-center z-50">
            <button 
               className="absolute top-0 right-2 text-gray-600 font-medium transition duration-300"
               onClick={() => setModal(false)}
            >
               <IoIosClose className="text-md h-6 w-6"/>
            </button>
            <label className="text-md font-bold text-gray-800 mb-4">Style {label}:</label>

            <div className="relative flex flex-row items-center justify-between w-5/6 mx-auto">

               <label className="text-sm font-semibold text-gray-800">Color:</label>

               <div className="relative ml-2">
                  <input 
                     type="color" 
                     className="opacity-0 absolute inset-0 w-4 h-4 cursor-pointer"
                     name={value}
                     value={previewInputs[value]}
                     onChange={handlePreviewInputsChange}
                  />
                  <div 
                     className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer" 
                     style={{ backgroundColor: previewInputs[value] || '#ff0000' }} 
                  />
               </div>
            </div>
         </div>
      </div>

   )
}

export default Modal