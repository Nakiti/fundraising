import { createContext, useEffect, useState, useContext } from "react";
import useFormInput from "../../hooks/useFormInput";
import { getDonationPage, getPageSections, getCampaignDesignations } from "../../services/fetchService";
import { initialDonationPageSections } from "../../constants/pageSectionsConfig";

export const DonationPageContext = createContext()

export const DonationPageContextProvider = ({campaignId, campaignType, children}) => {
   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs] = useFormInput({})
   const [donationPageSections, setDonationPageSections] = useState(initialDonationPageSections)
   const [selectedDesignations, setSelectedDesignations] = useState([]);

   useEffect(() => {
      if (campaignType != "crowdfunding") return

      const fetchData = async() => {
         console.log("id", campaignId)
         try {
            const donationResponse = await getDonationPage(campaignId)
            console.log(donationResponse)
            const donationPageId = donationResponse.id
            setDonationPageInputs({
               headline: donationResponse.headline || "",
               description: donationResponse.description || "",
               banner_image: donationResponse.banner_image || "",
               small_image: donationResponse.small_image || "",
               bg_color: donationResponse.bg_color || "",
               p_color: donationResponse.p_color || "",
               s_color: donationResponse.s_color || "",
               b1_color: donationResponse.b1_color || "",
               b2_color: donationResponse.b2_color || "",
               b3_color: donationResponse.b3_color || "", 
               button1: donationResponse.button1 || 0,
               button2: donationResponse.button2 || 0,
               button3: donationResponse.button3 || 0,
               button4: donationResponse.button4 || 0,
               button5: donationResponse.button5 || 0,
               button6: donationResponse.button6 || 0,
               bt_color: donationResponse.bt_color || ""
            })

            const donationSections = await getPageSections(donationPageId)
            setDonationPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })

            const selectedDesignationsResponse = await getCampaignDesignations(campaignId)
            setSelectedDesignations(selectedDesignationsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])


   if (campaignType !== "crowdfunding") {
      return <>{children}</>
   }

   return (
      <DonationPageContext.Provider value={{donationPageInputs, handleDonationPageInputsChange, 
         donationPageSections, setDonationPageSections, campaignId, selectedDesignations, setSelectedDesignations}}
      >
         {children}
      </DonationPageContext.Provider>
   )
}