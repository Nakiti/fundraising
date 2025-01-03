import { useContext } from "react";
import { DonationPageContext } from "@/app/context/campaignPages/donationPageContext";
import ImageInputEdit from "@/app/components/imageInputEdit";

const BannerSection = () => {
   const {handleDonationPageInputsChange} = useContext(DonationPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"banner_image"} changeFunc={handleDonationPageInputsChange}/>
      </div>
   )
}

export default BannerSection