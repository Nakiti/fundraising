"use client"
import { useParams } from "next/navigation";
import { DonationFormContextProvider } from "@/app/context/campaignPages/donationFormContext";
import { ThankYouPageContextProvider } from "@/app/context/campaignPages/thankYouPageContext";
import { DonationPageContextProvider } from "@/app/context/campaignPages/donationPageContext";

const CampaignLayout = ({ children }) => {
  const params = useParams();
  const campaignId = params?.campaignId;
  const organizationId = params?.organizationId;

  return (
    <DonationFormContextProvider campaignId={campaignId}>
      <ThankYouPageContextProvider campaignId={campaignId}>
        <DonationPageContextProvider campaignId={campaignId}>
          {children}
        </DonationPageContextProvider>
      </ThankYouPageContextProvider>
    </DonationFormContextProvider>
  );
};

export default CampaignLayout;
