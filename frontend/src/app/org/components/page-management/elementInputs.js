"use client"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"


const ElementInputs = () => {

   const {previewInputs, handlePreviewInputsChange, amountInputs, handleAmountInputsChange} = useContext(CampaignContext)

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            handlePreviewInputsChange({ target: { name: 'image', value: reader.result } });
            console.log(reader.result)
         };
         reader.readAsDataURL(file); // Convert the file to base64
      }

   }

   return (
      <div className="w-full">
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Image Upload</p>
            <label className="w-full h-20 flex items-center justify-center border border-dashed border-gray-400 rounded-md bg-white cursor-pointer">
               <span className="text-gray-500 p-4">Click to upload an image</span>
               <input 
                  type="file"
                  className="hidden" 
                  name="image"
                  accept="image/*"
                  onChange={handleImageUpload}
               />
            </label>                  
            {/* <img
               src=''
               alt="image"
               className="w-full h-36 object-cover border border-dashed border-gray-400 rounded-md bg-gray-50"
            /> */}
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Enter Heading</p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-md resize-none"
               rows={2}
               placeholder="Enter a Headline "
               name="heading"
               value={previewInputs.heading}
               onChange={handlePreviewInputsChange}
            />
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Enter Description</p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-md resize-none"
               rows={5}
               placeholder="Enter a Description "
               name="description"
               value={previewInputs.description}
               onChange={handlePreviewInputsChange}
            />
         </div>

         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Donation Amount Options</p>
            <div className="flex flex-row justify-between border-b border-gray-500 p-2">
               <p className="text-xs font-semibold text-gray-600">Amount</p>
               {/* <p className="text-xs font-semibold text-gray-600">Show on Page?</p> */}
            </div>

            
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button One Value</label>
               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button1}
                  name="button1"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Two Value</label>
               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button2}
                  name="button2"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Three Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button3}
                  name="button3"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Four Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button4}
                  name="button4"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Five Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button5}
                  name="button5"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
            <div className="flex flex-row justify-between p-2 w-full items-center">
               <label className="text-gray-600 text-xs font-bold">Button Six Value</label>

               <input 
                  placeholder="Enter a Value for Button One"
                  type="number"
                  className="border border-gray-400 rounded-md py-1 px-2 text-sm"
                  value={amountInputs.button6}
                  name="button6"
                  onChange={handleAmountInputsChange}
               />
               {/* <input 
                  className="h-5 w-5" 
                  type="checkbox"
               /> */}
            </div>
         </div>
      </div>
   )
}

export default ElementInputs