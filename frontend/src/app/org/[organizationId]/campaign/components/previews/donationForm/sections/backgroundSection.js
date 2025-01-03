import { useContext } from "react"
import { DonationFormContext } from "@/app/context/campaignPages/donationFormContext"
import ImageInputEdit from "@/app/components/imageInputEdit"

const DonationFormBackgroundSection = () => {
   const {handleDonationFormInputsChange} = useContext(DonationFormContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"bg_image"} changeFunc={handleDonationFormInputsChange}/>
      </div>
   )
}

export default DonationFormBackgroundSection