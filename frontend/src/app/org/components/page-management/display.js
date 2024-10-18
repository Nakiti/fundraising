"use client";
import { CgProfile } from "react-icons/cg";
import { useContext, useState } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";

const Display = () => {
   const {previewInputs, handlePreviewInputsChange, setPreviewInputs, amountInputs} = useContext(CampaignContext)
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
      <div className="w-full mb-4 max-w-6xl mx-auto bg-white rounded-sm shadow-md mt-6 overflow-y-auto">
         <div 
            className="text-lg font-bold text-start text-white px-4 py-2 bg-gray-800" 
            style={{backgroundColor: previewInputs.h_color || "#000"}}
            // onClick={(event) => handleClick("Heading", "h_color", event)}
         >
            <h1 
               className="px-2 py-1 "
               name="heading"
               style={{backgroundColor: previewInputs.h_color || "#000", color: previewInputs.ht_color}}
            >
               Header
            </h1>
         </div>

         <div 
            className="grid grid-cols-12 gap-2" 
            style={{backgroundColor: previewInputs.bg_color || "#FFF"}}
            // onClick={(event) => handleClick("Background", "bg_color", event)}
         >
            <div className="flex flex-col px-6 py-4 col-start-1 col-end-8">
               <h1 
                  className="text-2xl p-2 mb-2 font-semibold "
                  name="headline"
                  style={{backgroundColor: previewInputs.bg_color || "#FFF", color: previewInputs.p_color || "black"}}

               >
                  {previewInputs.headline || "Headline" }
               </h1>
               {previewInputs.image == "" ?
               <label className="w-full h-48 flex items-center justify-center border border-dashed border-gray-400 rounded-md bg-gray-50 cursor-pointer">
                  <span className="text-gray-500 p-4">Image</span>
                  {/* <input 
                     type="file"
                     className="hidden" 
                     name="image"
                     accept="image/*"
                     disabled
                     // onChange={handleImageUpload}
                  /> */}
               </label> :
               <img
                  src={previewInputs.image}
                  alt="image"
                  className="w-full h-48 object-cover rounded-md bg-gray-50"
               />
               
               }
               
               {/* <div className="flex flex-row items-center px-4 py-2 border-b text-xs">
                  <CgProfile className="h-4 w-4"/>
                  <p 
                     className="text-gray-600  ml-4" 
                     style={{color: previewInputs.s_color || "#000"}}
                     onClick={(event) => handleClick("Secondary Text", "s_color", event)}
                  >Created by John Doe</p>
               </div> */}
               <div className="py-4">
                  <p 
                     className="text-gray-500 text-sm w-full h-full p-2 "
                     name="description"
                     style={{color: previewInputs.p_color}}
                  >
                     {previewInputs.description || "This is the description"}
                  </p>
               </div> 
               {/* <p 
                  className="text-gray-400 text-sm px-4 py-2" 
                  style={{color: previewInputs.s_color || "#000"}}
                  onClick={(event) => handleClick("Secondary Text", "s_color", event)}

               >Created on September 16, 2024</p> */}
            </div>

            {/* Progress and Actions */}
            <div className="col-start-8 col-end-13 px-4 py-4">
               <div 
                  className="p-6 rounded-sm"
                  style={{backgroundColor: previewInputs.m_color}}

                  // onClick={(event) => handleClick("Modal", "m_color", event)}
               >
                  <p 
                     className="text-md mb-2" 
                     style={{color: previewInputs.p_color}}
                     // onClick={(event) => handleClick("Primary Text", "p_color", event)}

                  >X of 1000 raised</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                     <div className="bg-blue-600 h-2 rounded-full w-1/12"></div>
                  </div>

                  <p 
                     className="text-xs text-gray-600" 
                     style={{color: previewInputs.s_color}}
                     // onClick={(event) => handleClick("Secondary Text", "s_color", event)}

                  >X donations</p>

                  <div className="border-b border-blue-600 my-4"/>

                  <div className="">
                     <h3 className="text-sm text-gray-700 mb-2">I would like to give to:</h3>
                     <select 
                        className="w-full border border-gray-300 rounded-sm p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  <div 
                     className="mb-4"
                  >
                     <h3 className="text-sm text-gray-700 mb-2">I would like to give:</h3>
                     <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto px-4">
                           <button
                              key={0}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button1}
                           </button>
                           <button
                              key={1}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button2}
                           </button>
                           <button
                              key={2}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button3}
                           </button>
                           <button
                              key={3}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button4}
                           </button>
                           <button
                              key={4}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button5}
                           </button>
                           <button
                              key={5}
                              className="w-full text-xs py-1 bg-blue-700 text-white rounded-sm"
                              disabled
                              style={{backgroundColor: previewInputs.b3_color}}
                           >
                              {amountInputs.button6}
                           </button>
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

                  <div className="flex flex-row justify-center items-center space-x-4 text-sm">
                     <button 
                        className="w-5/12 px-4 py-2 rounded-md"
                        // onClick={(event) => handleClick("Share Button", "b2_color", event)}
                        style={{backgroundColor: previewInputs.b2_color, color: previewInputs.p_color}}

                        >
                        Share
                     </button>
                     <button 
                        className="w-5/12 px-4 py-2  text-white text-center rounded-md"
                        // onClick={(event) => handleClick("Donate Button", "b1_color", event)}
                        // onClick={handleDonate}
                        style={{backgroundColor: previewInputs.b1_color}}

                     >
                        Donate
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Display