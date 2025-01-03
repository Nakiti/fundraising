import { useContext } from "react"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";
import ImageInputEdit from "@/app/components/imageInputEdit";

const LandingBanner = () => {
   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(TicketPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"bgImage"} changeFunc={handleTicketsPageInputs}/>
         <TextAreaInputEdit title={"Enter Title"} rows={2} placeholder={"Enter a Title"} name={"title"} value={ticketsPageInputs.title} changeFunc={handleTicketsPageInputs}/>
         <TextAreaInputEdit title={"Enter Date"} rows={2} placeholder={"Enter a Date"} name={"date"} value={ticketsPageInputs.date} changeFunc={handleTicketsPageInputs}/>
         <TextAreaInputEdit title={"Enter Address"} rows={2} placeholder={"Enter Address"} name={"address"} value={ticketsPageInputs.address} changeFunc={handleTicketsPageInputs}/>
      </div>
   )
}

export default LandingBanner