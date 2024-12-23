"use client"
import PreviewNavbar from "../../../components/previews/previewNavbar"
import Display from "../../../components/previews/ticketPurchase/display"

const TicketPurchaseLayout = ({params, children}) => {

   const campaignId = params.id
   const organizationId = params.organizationId

   const links = [
      `/org/${organizationId}/campaign/edit/${campaignId}/ticket-purchase`,
      `/org/${organizationId}/campaign/edit/${campaignId}/ticket-purchase/design`
   ]

   return (
      <div className="w-full">
         <PreviewNavbar heading={"Configure Ticket Purchase Page"} links={links}/>
         <div className="flex flex-row space-x-4 w-11/12 mx-auto">
            <div className="w-1/3">
               {children}
            </div>
            <div className="w-2/3">
               <Display />
            </div>
         </div>
      </div>
   )
}

export default TicketPurchaseLayout