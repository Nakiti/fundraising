"use client";

import { CampaignContextProvider } from "@/app/context/campaignContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext";

const CampaignLayout = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const campaignId = params?.id;
  const organizationId = params?.organizationId

  // Ensure this only runs on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; 

   return (
      <CampaignContextProvider campaignId={campaignId} organizationId={organizationId}>
         <DonationPageContextProvider campaignId={campaignId}>
         <ThankYouPageContextProvider campaignId={campaignId}>
         <TicketPageContextProvider campaignId={campaignId}>
            {children}
         </TicketPageContextProvider>
         </ThankYouPageContextProvider>
         </DonationPageContextProvider>
      </CampaignContextProvider>
   );
};

export default CampaignLayout;
