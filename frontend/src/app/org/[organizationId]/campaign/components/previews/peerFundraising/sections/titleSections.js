import { useContext } from "react";
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";
import ImageInputEdit from "@/app/components/imageInputEdit";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const PeerFundraisingTitleSection = () => {
   const {peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange} = useContext(PeerFundraisingPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"person_image"} changeFunc={handlePeerFundraisingPageInputsChange}/>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={peerFundraisingPageInputs.headline} changeFunc={handlePeerFundraisingPageInputsChange}/>
      </div>
   )

}

export default PeerFundraisingTitleSection