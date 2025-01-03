import ImageInputEdit from "@/app/components/imageInputEdit"
import { CampaignContext } from "@/app/context/campaignContext"
import { useContext } from "react"

const BackgroundSection = () => {
   const {handleThankPageInputsChange} = useContext(CampaignContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"bg_image"} changeFunc={handleThankPageInputsChange}/>
      </div>
   )
}

export default BackgroundSection