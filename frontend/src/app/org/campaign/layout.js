import { CampaignContextProvider } from "@/app/context/campaignContext"

const CampaignLayout = ({children}) => {
   return (
      <CampaignContextProvider>
         <div>
            {children}
         </div>
      </CampaignContextProvider>
   )
}

export default CampaignLayout