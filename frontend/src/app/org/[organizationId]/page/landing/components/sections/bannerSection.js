import { useContext } from "react";
import { LandingPageContext } from "@/app/context/organizationPages/landingPageContext";
import ImageInputEdit from "@/app/components/inputs/imageInputEdit";
import TextAreaInputEdit from "@/app/components/inputs/textAreaInputEdit";

const BannerSection = () => {
   const {inputs, handleInputsChange} = useContext(LandingPageContext)

   return (
      <div>
         <ImageInputEdit title={"Background Image Upload"} name={"bg_image"} changeFunc={handleInputsChange}/>
         <TextAreaInputEdit title={"Page Title"} rows={2} placeholder={"Enter your main headline or title"} name={"title"} value={inputs.title} changeFunc={handleInputsChange}/>
         <TextAreaInputEdit title={"Description"} rows={3} placeholder={"Enter a compelling description for your organization"} name={"description"} value={inputs.description} changeFunc={handleInputsChange}/>
      </div>
   )
}

export default BannerSection