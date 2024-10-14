"use client";

import { CampaignContextProvider } from "@/app/context/campaignContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const CampaignLayout = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const params = useParams();
  const campaignId = params?.id;

  // Ensure this only runs on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Wait until it's safe to use client-side hooks

   return (
      <CampaignContextProvider campaignId={campaignId}>
         <div>
            {children}
         </div>
      </CampaignContextProvider>
   );
};

export default CampaignLayout;
