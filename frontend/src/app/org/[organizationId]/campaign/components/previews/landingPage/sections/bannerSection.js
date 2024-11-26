import useImageUpload from "@/app/hooks/useImageUpload"
import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const LandingBanner = () => {
   const {handleImageUpload} = useImageUpload()
   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(CampaignContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Image Upload <span className="text-red-500">*</span>
            </p>
            <label className="w-full h-20 flex items-center justify-center border border-dashed border-gray-400 rounded-sm bg-white cursor-pointer">
               <span className="text-gray-500 p-4">Click to upload an image</span>
               <input 
                  type="file"
                  className="hidden" 
                  name="bgImage"
                  accept="image/*"
                  onChange={(e) =>handleImageUpload(e, handleTicketsPageInputs)}
               />
            </label>                  
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Title <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter a Headline "
               name="title"
               value={ticketsPageInputs.title}
               onChange={handleTicketsPageInputs}
            />
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Date <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter a Date"
               name="date"
               value={ticketsPageInputs.date}
               onChange={handleTicketsPageInputs}
            />
         </div>
         <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Address <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-xl w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={2}
               placeholder="Enter Address "
               name="address"
               value={ticketsPageInputs.address}
               onChange={handleTicketsPageInputs}
            />
         </div>
      </div>
   )
}

export default LandingBanner