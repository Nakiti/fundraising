import { createContext, useEffect, useState, useContext } from "react";
import useFormInput from "../../hooks/useFormInput";
import { PageService, DesignationService } from "../../services/fetchService";
import { initialDonationPageSections } from "../../constants/pageSectionsConfig";
import { CampaignContext } from "../campaignContext";

export const DonationPageContext = createContext()

export const DonationPageContextProvider = ({campaignId, children}) => {
   const [donationPageInputs, handleDonationPageInputsChange, setDonationPageInputs] = useFormInput({})
   const [donationPageSections, setDonationPageSections] = useState(initialDonationPageSections)
   const [selectedDesignations, setSelectedDesignations] = useState([]);
   const {campaignType} = useContext(CampaignContext)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const donationResponse = await PageService.getDonationPage(campaignId)
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

            const donationSections = await PageService.getPageSections(donationPageId)
            setDonationPageSections((prevSections) => {
               return prevSections.map(section => {
                  const match = donationSections.find((item) => item.name == section.name)
                  return {...section, id: match.id, active: match.active }
               })
            })

            const selectedDesignationsResponse = await DesignationService.getCampaignDesignations(campaignId)
            setSelectedDesignations(selectedDesignationsResponse)
         } catch (err) {
            console.log(err)
         }
      }

      if (campaignType == "donation") {
         fetchData()
      }
   }, [])

   return (
      <DonationPageContext.Provider value={{donationPageInputs, handleDonationPageInputsChange, 
         donationPageSections, setDonationPageSections, campaignId, selectedDesignations, setSelectedDesignations}}
      >
         {children}
      </DonationPageContext.Provider>
   )
}