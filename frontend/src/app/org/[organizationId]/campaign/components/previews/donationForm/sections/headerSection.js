import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import TextAreaInputEdit from "@/app/components/textAreaInputEdit"

const DonationFormHeaderSection = () => {
   const {donationFormInputs, handleDonationFormInputsChange} = useContext(DonationFormContext)

   return (
      <div>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={donationFormInputs.headline} changeFunc={handleDonationFormInputsChange}/>
         <TextAreaInputEdit title={"Enter Message"} rows={5} placeholder={"Enter a Message"} name={"description"} value={donationFormInputs.description} changeFunc={handleDonationFormInputsChange}/>
      </div>
   )
}

export default DonationFormHeaderSection