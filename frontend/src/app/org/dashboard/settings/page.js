import Address from "./address"
import CampaignInfo from "./organizationInfo"
import Designations from "./designations"
import UserManagement from "./userManagement"
import Link from "next/link"


const Settings = () => {
   return (
      <div className="w-full h-full p-4" >
         <div className="w-full h-full flex flex-col p-8 overflow-y-auto rounded-sm">
            <h1 className="text-4xl mb-8">Settings</h1>

            <div className="grid grid-cols-2 gap-8 w-full">

               <Link href="/org/dashboard/settings/organization" className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Organization Information</p>
                  <p className="text-sm text-gray-700">Edit information regarding your organization</p>
               </Link>
               <Link href="/org/dashboard/settings/users" className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Users</p>
                  <p className="text-sm text-gray-700">Add and manage users that are a part of your organization</p>
               </Link>
               <Link href="/org/dashboard/settings/designations" className="w-full bg-white rounded-md shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Designations</p>
                  <p className="text-sm text-gray-700">Create and manage the designations that donors can donate to</p>
               </Link>
            </div>
            {/* <CampaignInfo />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <Address />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <UserManagement />
            <div className="border-b-2 border-gray-200 w-full my-4" />
            <Designations /> */}
         </div>
      </div>
   )
}

export default Settings