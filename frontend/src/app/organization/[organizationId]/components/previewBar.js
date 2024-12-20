import { FaArrowLeft } from "react-icons/fa"
import Link from "next/link"

const PreviewBar = ({organizationId, campaignId}) => {

   return (
      <div className="p-3 bg-gray-700 text-white flex flex-row border-b border-gray-400 shadow-md">
         <Link className="flex flex-row" href={`/org/${organizationId}/campaign/edit/${campaignId}/details/about`}>
            <button className="ml-4 mr-2"><FaArrowLeft /></button>
            <p>Campaign is in Preview mode</p>
         </Link>
      </div>
   )
}

export default PreviewBar