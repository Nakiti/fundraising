import { useContext } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const DescSection = () => {
   const {donationPageInputs, handleDonationPageInputsChange} = useContext(DonationPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Description"} rows={5} placeholder={"Enter a Description"} name={"description"} value={donationPageInputs.description} changeFunc={handleDonationPageInputsChange}/>
      </div>
   )
}

export default DescSection