"use client"
import { CampaignContextProvider } from "@/app/context/campaignContext";
import { useParams } from "next/navigation";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext";
import { PeerLandingPageContextProvider } from "@/app/context/campaignPages/peerLandingPageContext";
import { PeerFundraisingPageContextProvider } from "@/app/context/campaignPages/peerFundraisingPageContext";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { TicketPurchasePageContextProvider } from "@/app/context/campaignPages/ticketPurchasePageContext";

const CampaignLayout = ({ children }) => {
  const params = useParams();
  const campaignId = params?.id;
  const organizationId = params?.organizationId

   return (
      <CampaignContextProvider campaignId={campaignId} organizationId={organizationId}>
         <>
            <DonationPageContextProvider campaignId={campaignId}>
            <ThankYouPageContextProvider campaignId={campaignId}>
            <TicketPageContextProvider campaignId={campaignId}>
            <PeerLandingPageContextProvider campaignId={campaignId}>
            <PeerFundraisingPageContextProvider campaignId={campaignId}>
            <DonationFormContextProvider campaignId={campaignId}>
            <TicketPurchasePageContextProvider campaignId={campaignId}>
               {children}
            </TicketPurchasePageContextProvider>
            </DonationFormContextProvider>
            </PeerFundraisingPageContextProvider>
            </PeerLandingPageContextProvider>
            </TicketPageContextProvider>
            </ThankYouPageContextProvider>
            </DonationPageContextProvider>
         </>
      </CampaignContextProvider>
   );
};

export default CampaignLayout;
