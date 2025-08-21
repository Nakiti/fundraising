"use client"
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { CampaignContextProvider, CampaignContext } from "@/app/context/campaignContext";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";
import { TicketPageContextProvider } from "@/app/context/campaignPages/ticketPageContext";
import { TicketPurchasePageContextProvider } from "@/app/context/campaignPages/ticketPurchasePageContext";
import { PeerLandingPageContextProvider } from "@/app/context/campaignPages/peerLandingPageContext";
import { PeerFundraisingPageContextProvider } from "@/app/context/campaignPages/peerFundraisingPageContext";

const CampaignDataInitializer = ({ campaignId, organizationId, children }) => {
  const { fetchCampaignData } = useContext(CampaignContext);

  useEffect(() => {
    if (campaignId && organizationId && fetchCampaignData) {
      fetchCampaignData(campaignId, organizationId);
    }
  }, [campaignId, organizationId, fetchCampaignData]);

  return children;
};

const CampaignLayout = ({ children }) => {
  const params = useParams();
  const campaignId = params?.campaignId;
  const organizationId = params?.organizationId;

  return (
    <CampaignContextProvider>
      <CampaignDataInitializer campaignId={campaignId} organizationId={organizationId}>
        <DonationFormContextProvider campaignId={campaignId}>
          <ThankYouPageContextProvider campaignId={campaignId}>
            <DonationPageContextProvider campaignId={campaignId}>
              <TicketPageContextProvider campaignId={campaignId}>
                <TicketPurchasePageContextProvider campaignId={campaignId}>
                  <PeerLandingPageContextProvider campaignId={campaignId}>
                    <PeerFundraisingPageContextProvider campaignId={campaignId}>
                      {children}
                    </PeerFundraisingPageContextProvider>
                  </PeerLandingPageContextProvider>
                </TicketPurchasePageContextProvider>
              </TicketPageContextProvider>
            </DonationPageContextProvider>
          </ThankYouPageContextProvider>
        </DonationFormContextProvider>
      </CampaignDataInitializer>
    </CampaignContextProvider>
  );
};

export default CampaignLayout;
