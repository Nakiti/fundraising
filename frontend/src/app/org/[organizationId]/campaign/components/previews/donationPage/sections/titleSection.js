import { useContext } from "react";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const TitleSection = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={donationPageInputs.headline} changeFunc={handleDonationPageInputsChange}/>
      </div>
   )
}

export default TitleSection