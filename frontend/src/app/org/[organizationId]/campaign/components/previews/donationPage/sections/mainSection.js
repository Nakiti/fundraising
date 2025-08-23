import { useContext } from "react"
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext"
import TextAreaInputEdit from "@/app/components/textAreaInputEdit"

const MainSection = () => {
    const {handleDonationPageInputsChange, donationPageInputs} = useContext(DonationPageContext)

    return (
        <div>
            <TextAreaInputEdit title={"Enter Main Headline"} rows={2} placeholder={"Enter a Headline"} name={"mainHeadline"} value={donationPageInputs.mainHeadline} changeFunc={handleDonationPageInputsChange}/>
            <TextAreaInputEdit title={"Description"} rows={5} placeholder={"Enter a Description"} name={"mainText"} value={donationPageInputs.mainText} changeFunc={handleDonationPageInputsChange}/>
        </div>
    )
}

export default MainSection;