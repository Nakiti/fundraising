"use client"
import { CampaignContextProvider, CampaignContext } from "@/app/context/campaignContext";
import { useParams } from "next/navigation";
import { useContext } from "react";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext";
import { PeerLandingPageContextProvider } from "@/app/context/campaignPages/peerLandingPageContext";
import { PeerFundraisingPageContextProvider } from "@/app/context/campaignPages/peerFundraisingPageContext";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { TicketPurchasePageContextProvider } from "@/app/context/campaignPages/ticketPurchasePageContext";

// Inner component that uses the campaign context
const CampaignLayoutInner = ({ children, campaignId }) => {
  const { campaignType } = useContext(CampaignContext);

  return (
    <>
      {/* Always load these providers (common to all campaign types) */}
      <DonationFormContextProvider campaignId={campaignId}>
        <ThankYouPageContextProvider campaignId={campaignId}>
          {/* Conditionally load campaign type specific providers */}
          {campaignType === "crowdfunding" && (
            <DonationPageContextProvider campaignId={campaignId}>
              {children}
            </DonationPageContextProvider>
          )}
          
          {campaignType === "peer-to-peer" && (
            <>
              <PeerLandingPageContextProvider campaignId={campaignId}>
                <PeerFundraisingPageContextProvider campaignId={campaignId}>
                  {children}
                </PeerFundraisingPageContextProvider>
              </PeerLandingPageContextProvider>
            </>
          )}
          
          {campaignType === "ticketed-event" && (
            <>
              <TicketPageContextProvider campaignId={campaignId}>
                <TicketPurchasePageContextProvider campaignId={campaignId}>
                  {children}
                </TicketPurchasePageContextProvider>
              </TicketPageContextProvider>
            </>
          )}
          
          {/* Fallback for when campaign type is not yet loaded */}
          {!campaignType && children}
        </ThankYouPageContextProvider>
      </DonationFormContextProvider>
    </>
  );
};

const CampaignLayout = ({ children }) => {
  const params = useParams();
  const campaignId = params?.id;
  const organizationId = params?.organizationId;

  return (
    <CampaignContextProvider campaignId={campaignId} organizationId={organizationId}>
      <CampaignLayoutInner campaignId={campaignId}>
        {children}
      </CampaignLayoutInner>
    </CampaignContextProvider>
  );
};

export default CampaignLayout;
