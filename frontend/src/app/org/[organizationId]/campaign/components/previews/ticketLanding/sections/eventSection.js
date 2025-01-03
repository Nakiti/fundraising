import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import useImageUpload from "@/app/hooks/useImageUpload"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const EventSection = () => {
   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(TicketPageContext)
   const {handleImageUpload} = useImageUpload()

   return (
      <div>
         {/* <div className="my-4">
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
         </div> */}
         <TextAreaInputEdit title={"Location Name"} rows={2} placeholder={"Enter Location Name"} name={"venue"} value={ticketsPageInputs.venue} changeFunc={handleTicketsPageInputs}/>
         <TextAreaInputEdit title={"Instructions"} rows={5} placeholder={"Enter Instructions For Guests"} name={"venue"} value={ticketsPageInputs.instructions} changeFunc={handleTicketsPageInputs}/>
      </div>
   )
}

export default EventSection