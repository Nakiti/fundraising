"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import Modal from "./modal";

const Display = () => {
   const {previewInputs, handlePreviewInputsChange, setPreviewInputs} = useContext(CampaignContext)
   const [label, setLabel] = useState("")
   const [value, setValue] = useState("")
   const [showModal, setShowModal] = useState(false)
   const [modalPosition, setModalPosition] = useState({top: 0, left: 0})

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            handlePreviewInputsChange({ target: { name: 'image', value: reader.result } });
         };
         reader.readAsDataURL(file); // Convert the file to base64
      }
   }

   const handleClose = () => {
      setPreviewInputs(inputs => ({...inputs, image: ""}))
   }

   const handleClick = (label, value, event) => {
      event.stopPropagation()
      
      setLabel(label)
      setValue(value)

      const { clientX, clientY } = event;
      setModalPosition({ top: clientY, left: clientX });
      console.log(clientX, clientY)
      setShowModal(true)
   }

   const amounts = [10, 25, 50, 75, 100, 150];

   return (
      <div className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-lg shadow-md mt-6 overflow-y-auto">
         {showModal && <Modal label={label} value={value} setModal={setShowModal} position={modalPosition}/>}
         <div 
            className="text-xl font-bold text-start text-white px-4 py-2 bg-gray-800" 
            style={{backgroundColor: previewInputs.h_color || "#000"}}
            onClick={(event) => handleClick("Heading", "h_color", event)}
         >
            <input 
               placeholder="Enter a Heading"
               className="bg-gray-800 border border-white px-2 py-1 rounded-md border-dashed"
               name="heading"
               value={previewInputs.heading}
               onChange={handlePreviewInputsChange}
               style={{backgroundColor: previewInputs.h_color || "#000", color: previewInputs.ht_color}}
               onClick={(event) => handleClick("Heading Text", "ht_color", event)}
            />
         </div>

         <div 
            className="grid grid-cols-12 gap-4" 
            style={{backgroundColor: previewInputs.bg_color || "#FFF"}}
            onClick={(event) => handleClick("Background", "bg_color", event)}
         >
            <div className="flex flex-col px-6 py-4 col-start-1 col-end-8">
               <input 
                  placeholder="Enter a Title"
                  className="text-xl p-2 border border-gray-400 rounded-md mb-4 font-semibold border-dashed"
                  name="title"
                  value={previewInputs.title}
                  onChange={handlePreviewInputsChange}
                  style={{backgroundColor: previewInputs.bg_color || "#FFF", color: previewInputs.p_color || "black"}}
                  onClick={(event) => handleClick("Primary Text", "p_color", event)}

               />
               {!previewInputs.image ? 
                  <label className="w-full h-64 flex items-center justify-center border border-dashed border-gray-400 rounded-md bg-gray-50 cursor-pointer">
                     <span className="text-gray-500 p-4">Click to upload an image</span>
                     <input 
                        type="file"
                        className="hidden" 
                        name="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                     />
                  </label>
                  :
                  <div className="w-full h-64 relative">
                        <button
                           onClick={handleClose}
                           className="absolute top-2 right-2 text-gray-700 bg-gray-200 shadow-lg rounded-full w-6 h-6 hover:bg-gray-300 flex items-center justify-center focus:outline-none"
                        >
                           <IoIosClose className="text-md w-5 h-5"/>
                        </button>
                     <img
                        src={previewInputs.image}
                        alt="image"
                        className="w-full h-64 object-cover border border-dashed border-gray-400 rounded-md bg-gray-50"
                     />
                  </div>
               }
               <div className="flex flex-row items-center px-4 py-2 border-b text-sm">
                  <CgProfile className="h-6 w-6"/>
                  <p 
                     className="text-gray-600 font-medium ml-4" 
                     style={{color: previewInputs.s_color || "#000"}}
                     onClick={(event) => handleClick("Secondary Text", "s_color", event)}
                  >Created by John Doe</p>
               </div>
               <div className="p-4 border-b">
                  <textarea 
                     className="text-gray-500 text-sm w-full h-full border border-dashed border-gray-400 p-2 rounded-md"
                     rows={3}
                     placeholder="Enter a Description "
                     name="description"
                     value={previewInputs.description}
                     onChange={handlePreviewInputsChange}
                     style={{backgroundColor: previewInputs.bg_color || "#FFF", color: previewInputs.p_color || "#000"}}
                     onClick={(event) => handleClick("Primary Text", "p_color", event)}
                  />
               </div>
               <p 
                  className="text-gray-400 text-sm px-4 py-2" 
                  style={{color: previewInputs.s_color || "#000"}}
                  onClick={(event) => handleClick("Secondary Text", "s_color", event)}

               >Created on September 16, 2024</p>
            </div>

            {/* Progress and Actions */}
            <div 
               className="bg-gray-50 p-6 rounded-md shadow-md col-start-8 col-end-12 mt-6 mb-8"
               style={{backgroundColor: previewInputs.m_color || "#FFF"}}
               onClick={(event) => handleClick("Modal", "m_color", event)}

            >
               <p 
                  className="text-lg font-medium mb-2" 
                  style={{color: previewInputs.p_color || "#000"}}
                  onClick={(event) => handleClick("Primary Text", "p_color", event)}

               >X of 1000 raised</p>

               {/* Progress Bar */}
               <div className="w-full bg-gray-300 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full w-1/12"></div>
               </div>

               <p 
                  className="text-sm text-gray-600 mb-4" 
                  style={{color: previewInputs.s_color || "#000"}}
                  onClick={(event) => handleClick("Secondary Text", "s_color", event)}

               >X donations</p>

               <div className="border-b border-blue-600 my-4"/>

               <div className="">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">I would like to give to:</h3>
                  <select 
                     className="w-full border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                     // onChange={handleDesignationChange}
                     defaultValue="Select"
                     disabled
                  >
                     {/* <option disabled value="">Select an option</option>
                     {designations && designations.map((item) => {
                        return <option key={item.id} id={item.id} value={item.title}>{item.title}</option>
                     })} */}
                  </select>
               </div>

               <div className="border-b border-blue-600 my-4"/>

               <div className="mb-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">I would like to give:</h3>
                  <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto px-4">
                     {amounts.map((amount, index) => (
                        <button
                           key={index}
                           className="w-full text-sm py-2 bg-blue-600 text-white rounded-md shadow"
                           style={{backgroundColor: previewInputs.b3_color || "blue"}}
                           onClick={(event) => handleClick("Monetary Buttons", "b3_color", event)}

                           // value={amount}
                           // onClick={handleAmount}
                        >
                        ${amount}
                        </button>
                     ))}
                     {/* <input 
                        placeholder="Enter Custom Amount" 
                        type="number" 
                        className="w-full col-start-1 text-sm rounded-md col-end-3 py-1 px-4 bg-white border border-blue-600 text-black shadow " 
                        
                        // onChange={handleAmount}
                        // value={donationInfo.amount}
                     /> */}

                  </div>
               </div>

               <div className="border-b border-blue-600 my-4"/>

               <div className="flex flex-row justify-center items-center space-x-4">
                  <button 
                     className="w-5/12 px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                     style={{backgroundColor: previewInputs.b2_color || "blue"}}
                     onClick={(event) => handleClick("Share Button", "b2_color", event)}
                     >
                     Share
                  </button>
                  <button 
                     className="w-5/12 px-4 py-2 bg-blue-600 text-white text-center rounded-md"
                     style={{backgroundColor: previewInputs.b1_color || "blue"}}
                     onClick={(event) => handleClick("Donate Button", "b1_color", event)}
                     // onClick={handleDonate}
                  >
                     Donate
                  </button>
               </div>

               {/* Action Buttons */}
               {/* <div className="flex flex-col justify-center items-center">
                  <button 
                     className="w-3/4 px-4 py-3 mt-4 text-white rounded-md"
                     style={{backgroundColor: previewInputs.b1_color || "#000"}}
                     onClick={(event) => handleClick("Donate Button", "b1_color", event)}
                  >
                     Donate
                  </button>
                  <button 
                     className="w-3/4 px-4 py-3 mt-4 text-white rounded-md"
                     style={{backgroundColor: previewInputs.b2_color || "#000"}}
                     onClick={(event) => handleClick("Share Button", "b2_color", event)}                  
                  >
                     Share
                  </button>
               </div> */}
            </div>
         </div>
      </div>
   );
}

export default Display