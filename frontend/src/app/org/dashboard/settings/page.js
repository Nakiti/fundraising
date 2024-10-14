import Address from "./address"
import CampaignInfo from "./organizationInfo"
import Designations from "./designations"
import UserManagement from "./userManagement"


const Settings = () => {
   return (
      <div className="w-full h-full p-4">
         <div className="bg-white w-full h-full bg-gray-50 flex flex-col p-8 overflow-y-auto rounded-sm">
            <h1 className="text-2xl font-bold mb-8">Settings</h1>

            <CampaignInfo />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <Address />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <UserManagement />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <Designations />
         </div>
      </div>
   )
}

export default Settings