import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const MessageSection = () => {
   const {thankPageInputs, handleThankPageInputsChange} = useContext(CampaignContext)

   return (
      <div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter Headline <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a headline"
               name="headline"
               value={thankPageInputs.headline}
               onChange={handleThankPageInputsChange} 
            />
         </div>
         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter message <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a message"
               name="message"
               value={thankPageInputs.message}
               onChange={handleThankPageInputsChange} 
            />
         </div>
      </div>
   )
}

export default MessageSection