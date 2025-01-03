import { useContext } from "react";
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";
import ImageInputEdit from "@/app/components/imageInputEdit";

const PeerLandingBannerSection = () => {
   const {peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"banner_image"} changeFunc={handlePeerLandingPageInputsChange}/>
         <TextAreaInputEdit title={"Enter Headline"} rows={2} placeholder={"Enter a Headline"} name={"headline"} value={peerLandingPageInputs.headline} changeFunc={handlePeerLandingPageInputsChange}/>
      </div>
   )
}

export default PeerLandingBannerSection