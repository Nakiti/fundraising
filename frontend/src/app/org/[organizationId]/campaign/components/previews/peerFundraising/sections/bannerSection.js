import { useContext } from "react";
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";
import ImageInputEdit from "@/app/components/imageInputEdit";

const PeerFundraisingBannerSection = () => {
   const {handlePeerFundraisingPageInputsChange} = useContext(PeerFundraisingPageContext)

   return (
      <div>
         <ImageInputEdit title={"Image Upload"} name={"banner_image"} changeFunc={handlePeerFundraisingPageInputsChange}/>
      </div>
   )
}

export default PeerFundraisingBannerSection