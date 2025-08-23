"use client"
import { useParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { CampaignContextProvider, CampaignContext } from "@/app/context/campaignContext";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";


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
                      {children}
            </DonationPageContextProvider>
          </ThankYouPageContextProvider>
        </DonationFormContextProvider>
      </CampaignDataInitializer>
    </CampaignContextProvider>
  );
};

export default CampaignLayout;
