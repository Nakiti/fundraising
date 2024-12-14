"use client"
import { getCampaignDesignations, getCampaignDetails, getCampaignPreview, getCampaignTickets, getDonationPage, getTicketPage } from "@/app/services/fetchService"
import { useState, useEffect, useContext } from "react"
import { CgProfile } from "react-icons/cg"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useFormInput from "@/app/hooks/useFormInput"
import { DonationContext } from "@/app/context/donationContext"
import ErrorModal from "@/app/components/errorModal"
import { FaArrowLeft } from "react-icons/fa"
import DonationPage from "./pages/donationPage"
import TicketPage from "./pages/ticketPage"

const CampaignPage = ({params}) => {
   const campaignId = params.campaignId
   const organizationId = params.organizationId
   const status = params.status
   const [campaign, setCampaign] = useState(null)
   const [display, setDisplay] = useState(null)
   const router = useRouter()
   const currentPath = router.asPath
   const [designations, setDesignations] = useState(null)
   const {donations, setDonations} = useContext(DonationContext)
   const [error, setError] = useState(false)
   const [errorMessage, setErrorMessage] = useState("Please Fill All Donation Fields")
   const [campaignType, setCampaignType] = useState(null)
   const [tickets, setTickets] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         const campaignResponse = await getCampaignDetails(campaignId)
         if (campaignResponse.status == "active" || status == "preview") {
            setCampaign(campaignResponse)
            setCampaignType(campaignResponse.type)

            if (campaignResponse.type == "donation") {
               const displayResponse = await getDonationPage(campaignId)
               setDisplay(displayResponse)


               const designationResponse = await getCampaignDesignations(campaignId)
               setDesignations(designationResponse)
               console.log(designationResponse)
            } else if (campaignResponse.type == "ticketed-event") {
               const displayResponse = await getTicketPage(campaignId)
               setDisplay(displayResponse)

               const ticketResponse = await getCampaignTickets(campaignId)
               setTickets(ticketResponse)
            }

         }
      }

      fetchData()
   }, [])

   const amounts = [10, 25, 50, 75, 100, 150];

   return (
      <div className="w-full h-full overflow-y-auto">
         {error && <ErrorModal setError={setError} message={errorMessage} />}
         {status == "preview" && (
            <div className="fixed top-0 left-0 right-0 py-4 px-8 bg-gray-700 flex flex-row justify-between shadow-lg z-10">
               <Link
                  href={`/org/${organizationId}/campaign/edit/${campaignId}/donation-page`}
                  className="flex flex-row space-x-2 items-center text-white"
               >
                  <FaArrowLeft />
                  <p>Campaign Manager</p>
               </Link>
               <p className="text-md text-white">Your Campaign is in Draft Mode</p>
            </div>
         )}

         <div className={`pt-[56px]`}>
            {display && campaignType == "donation" ? (
               <DonationPage display={display} designations={designations} />
            ) : display && campaignType == "ticketed-event" ? (
               <TicketPage />
            ) : null}
         </div>
      </div>

   );
}



export default CampaignPage