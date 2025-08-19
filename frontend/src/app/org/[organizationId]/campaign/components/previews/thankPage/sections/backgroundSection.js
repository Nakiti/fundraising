import ImageInputEdit from "@/app/components/imageInputEdit"
import { useContext } from "react"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"

const BackgroundSection = () => {
   const {handleThankInputsChange} = useContext(ThankYouPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"bg_image"}  changeFunc={handleThankInputsChange}/>
      </div>
   )
}

export default BackgroundSection