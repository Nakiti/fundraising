

const OrganzationCard = ({orgData, handleOrgDataChange, setTab}) => {

   return (
      <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-8">
         <h1 className="text-2xl font-bold">Register an Organization:</h1>

         <div className="w-full grid grid-cols-4 grid-rows-3 gap-x-4 mt-4">
            <div className="flex flex-col mb-4 col-start-1 col-end-3 row-start-1 row-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">Organization Name</label>
               <input
                  name="name"
                  type="text"
                  placeholder="Enter an Organization Name"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.name}
                  onChange={handleOrgDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-3 col-end-5 row-start-1 row-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">Organization Email</label>
               <input
                  name="email"
                  type="text"
                  placeholder="Enter an Organization Email"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.email}
                  onChange={handleOrgDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-1 col-end-4 row-start-2 row-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">Street Address</label>
               <input
                  name="address"
                  type="text"
                  placeholder="Enter Street Address"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.address}
                  onChange={handleOrgDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-4 col-end-5 row-start-2 row-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">City</label>
               <input
                  name="city"
                  type="text"
                  placeholder="Enter City"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.city}
                  onChange={handleOrgDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-1 col-end-3 row-start-3 row-end-4">
               <label className="text-gray-700 text-md font-medium mb-1">Country</label>
               <input
                  name="contry"
                  type="text"
                  placeholder="Enter Country"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.country}
                  onChange={handleOrgDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-3 col-end-5 row-start-3 row-end-4">
               <label className="text-gray-700 text-md font-medium mb-1">Zipcode</label>
               <input
                  name="zip"
                  type="text"
                  placeholder="Enter Zipcode"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={orgData.zip}
                  onChange={handleOrgDataChange}
               />
            </div>
         </div>
         <div className="w-full flex items-center justify-center mt-8">
            <button 
               className="p-2 bg-blue-700 rounded-md text-white w-1/4"
               onClick={() => setTab(2)}
            >
               Next
            </button>
         </div>
      </div>
   )

}

export default OrganzationCard