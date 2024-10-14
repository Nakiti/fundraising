import { useContext } from "react"
import { CampaignContext } from "@/app/context/campaignContext"

const AboutComponent = () => {

   const {aboutInputs, handleAboutInputsChange} = useContext(CampaignContext)

   return (
      <div className="w-full">
         <h1 className="text-3xl mb-2 font-light">About</h1>
         <h3 className="text-md text-gray-600 mb-8">Set up Campaign Details</h3>


         <div className="grid grid-cols-2 gap-8 w-5/6">
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">Campaign Name</label>
               <input
                  name="campaignName"
                  type="text"
                  placeholder="Enter a Name"
                  className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={aboutInputs.campaignName}
                  onChange={handleAboutInputsChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">Internal Campaign Name</label>
               <input
                  name="internalName"
                  type="text"
                  placeholder="Enter Internal Name"
                  className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={aboutInputs.internalName}
                  onChange={handleAboutInputsChange}
               />
            </div>
            <div className="flex flex-col">
               <label className="text-gray-500 text-sm font-bold mb-1">Fundraising Goal</label>
               <input
                  name="goal"
                  type="number"
                  min="1"
                  placeholder="Enter a Fundraising Goal"
                  className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={aboutInputs.goal}
                  onChange={handleAboutInputsChange}
               />
            </div>
            <div className="flex flex-col col-start-1 col-end-3">
               <label className="text-gray-500 text-sm font-bold mb-1">Short URL</label>
               <input
                  name="shortUrl"
                  type="text"
                  placeholder="Enter Short URL"
                  className="p-2 border border-gray-400 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={aboutInputs.shortUrl}
                  onChange={handleAboutInputsChange}
               />
            </div>
         </div>
      </div>
   )
}

export default AboutComponent