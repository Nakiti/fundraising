import { useContext } from "react"
import { PeerLandingPageContext } from "@/app/context/campaignPages/peerLandingPageContext"
import TextAreaInputEdit from "@/app/components/textAreaInputEdit"

const DescriptionSection = () => {
   const {peerLandingPageInputs, handlePeerLandingPageInputsChange} = useContext(PeerLandingPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Enter Tagline"} rows={5} placeholder={"Enter a Tagline"} name={"tagline"} value={peerLandingPageInputs.tagline} changeFunc={handlePeerLandingPageInputsChange}/>
         <TextAreaInputEdit title={"Description"} rows={5} placeholder={"Enter a Description"} name={"description"} value={peerLandingPageInputs.description} changeFunc={handlePeerLandingPageInputsChange}/>
      </div>
   )
}

export default DescriptionSection