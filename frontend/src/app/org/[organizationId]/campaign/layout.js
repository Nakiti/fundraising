"use client";

import { CampaignContextProvider } from "@/app/context/campaignContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext";
import { PeerLandingPageContextProvider } from "@/app/context/campaignPages/peerLandingPageContext";
import { PeerFundraisingPageContextProvider } from "@/app/context/campaignPages/peerFundraisingPageContext";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { getCampaignDetails } from "@/app/services/fetchService";

const CampaignLayout = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const campaignId = params?.id;
  const organizationId = params?.organizationId
  const [campaignType, setCampaignType] = useState(null)

  // Ensure this only runs on the client-side
   useEffect(() => {
      setIsClient(true);
      
      const fetchData = async() => {
         try {
            const response = await getCampaignDetails(campaignId)
            setCampaignType(response.type)
         } catch (err) {
            console.log(err)
         }

      }

      fetchData()
   }, []);

  if (!isClient) return null; 

   return (
      <CampaignContextProvider campaignId={campaignId} organizationId={organizationId}>
         {campaignType && 
            <>
            <DonationPageContextProvider campaignId={campaignId} campaignType={campaignType}>
            <ThankYouPageContextProvider campaignId={campaignId} campaignType={campaignType}>
            <TicketPageContextProvider campaignId={campaignId} campaignType={campaignType}>
            <PeerLandingPageContextProvider campaignId={campaignId} campaignType={campaignType}>
            <PeerFundraisingPageContextProvider campaignId={campaignId} campaignType={campaignType}>
            <DonationFormContextProvider campaignId={campaignId} campaignType={campaignType}>
               {children}
            </DonationFormContextProvider>
            </PeerFundraisingPageContextProvider>
            </PeerLandingPageContextProvider>
            </TicketPageContextProvider>
            </ThankYouPageContextProvider>
            </DonationPageContextProvider>
         </>
         }
      </CampaignContextProvider>
   );
};

export default CampaignLayout;
