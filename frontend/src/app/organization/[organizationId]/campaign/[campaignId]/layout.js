"use client"

const CampaignLayout = ({ children }) => {
  // const params = useParams();
  // const campaignId = params?.campaignId;
  // const organizationId = params?.organizationId;

  return (
    // <CampaignContextProvider>
    //   <CampaignDataInitializer campaignId={campaignId} organizationId={organizationId}>
    //     <DonationFormContextProvider campaignId={campaignId}>
    //       <ThankYouPageContextProvider campaignId={campaignId} organizationId={organizationId}>
    //         <DonationPageContextProvider campaignId={campaignId}>
    //                   {children}
    //         </DonationPageContextProvider>
    //       </ThankYouPageContextProvider>
    //     </DonationFormContextProvider>
    //   </CampaignDataInitializer>
    // </CampaignContextProvider>
    <div>
      {children}
    </div>
  );
};

export default CampaignLayout;
