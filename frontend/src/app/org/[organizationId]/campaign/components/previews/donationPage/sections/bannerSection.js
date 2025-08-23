import { useContext } from "react";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import ImageInputEdit from "@/app/components/imageInputEdit";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const BannerSection = () => {
   const {handleDonationPageInputsChange, donationPageInputs} = useContext(DonationPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"banner_image"} changeFunc={handleDonationPageInputsChange}/>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={donationPageInputs.headline} changeFunc={handleDonationPageInputsChange}/>
         <TextAreaInputEdit title={"Description"} rows={5} placeholder={"Enter a Description"} name={"description"} value={donationPageInputs.description} changeFunc={handleDonationPageInputsChange}/>
      </div>
   )
}

export default BannerSection