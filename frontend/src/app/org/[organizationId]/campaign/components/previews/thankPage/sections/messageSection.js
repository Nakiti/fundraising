import { useContext } from "react"
import { ThankYouPageContext } from "@/app/context/campaignPages/thankYouPageContext"
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const MessageSection = () => {
   const {thankPageInputs, handleThankInputsChange} = useContext(ThankYouPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={thankPageInputs.headline} changeFunc={handleThankInputsChange}/>
         <TextAreaInputEdit title={"Enter Message"} rows={5} placeholder={"Enter a Message"} name={"description"} value={thankPageInputs.description} changeFunc={handleThankInputsChange}/>
      </div>
   )
}

export default MessageSection