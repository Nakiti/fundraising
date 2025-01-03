import { useContext } from "react"
import { PeerFundraisingPageContext } from "@/app/context/campaignPages/peerFundraisingPageContext";
import TextAreaInputEdit from "@/app/components/textAreaInputEdit";

const PeerFundraisingDescritpionSection = () => {
   const {peerFundraisingPageInputs, handlePeerFundraisingPageInputsChange} = useContext(PeerFundraisingPageContext)

   return (
      <div>
         <TextAreaInputEdit title={"Description"} rows={5} placeholder={"Enter a Description"} name={"description"} value={peerFundraisingPageInputs.description} changeFunc={handlePeerFundraisingPageInputsChange}/>
      </div>
   )
}

export default PeerFundraisingDescritpionSection