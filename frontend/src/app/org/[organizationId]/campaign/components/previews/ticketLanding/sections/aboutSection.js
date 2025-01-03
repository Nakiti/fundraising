import { useContext } from "react"
import { TicketPageContext } from "@/app/context/campaignPages/ticketPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const LandingAbout = () => {

   const {ticketsPageInputs, handleTicketsPageInputs} = useContext(TicketPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Enter About Text"} rows={5} placeholder={"Enter a Message"} name={"aboutDescription"} value={ticketsPageInputs.description} changeFunc={handleTicketsPageInputs}/>
      </div>
   )
}

export default LandingAbout