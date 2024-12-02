import Link from "next/link"

const Settings = ({params}) => {
   const organizationId = params.organizationId

   return (
      <div className="w-full h-full" >
         <div className="w-full h-full flex flex-col p-12 overflow-y-auto rounded-sm">
            <h1 className="text-4xl mb-8">Settings</h1>
            <div className="grid grid-cols-2 gap-8 w-full">
               <Link href={`/org/${organizationId}/dashboard/settings/organization`} className="w-full bg-white rounded-xl shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Organization Information</p>
                  <p className="text-sm text-gray-700">Edit information regarding your organization</p>
               </Link>
               <Link href={`/org/${organizationId}/dashboard/settings/users`} className="w-full bg-white rounded-xl shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Users</p>
                  <p className="text-sm text-gray-700">Add and manage users that are a part of your organization</p>
               </Link>
               <Link href={`/org/${organizationId}/dashboard/settings/designations`} className="w-full bg-white rounded-xl shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Designations</p>
                  <p className="text-sm text-gray-700">Create and manage the designations that donors can donate to</p>
               </Link>
               <Link href={`/org/${organizationId}/dashboard/settings/theme`} className="w-full bg-white rounded-xl shadow-md p-8 h-48 hover:bg-gray-100 cursor-pointer">
                  <p className="text-xl text-black mb-4">Theme</p>
                  <p className="text-sm text-gray-700">Manage themes that can be used for your organization's campaigns</p>
               </Link>
            </div>
         </div>
      </div>
   )
}

export default Settings