

const UserCard = ({userData, handleUserDataChange, setTab, handleRegister}) => {
   return (
      <div className="w-full max-w-2xl bg-white rounded-md shadow-md p-8">
         <h1 className="text-2xl font-bold">Register a User:</h1>

         <div className="w-full grid grid-cols-4 grid-rows-3 gap-x-4 mt-4">
            <div className="flex flex-col mb-4 col-start-1 col-end-3 row-start-1 row-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">First Name</label>
               <input
                  name="firstName"
                  type="text"
                  placeholder="Enter an Organization Name"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userData.firstName}
                  onChange={handleUserDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-3 col-end-5 row-start-1 row-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">Last Name</label>
               <input
                  name="lastName"
                  type="text"
                  placeholder="Enter Last Name"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userData.lastName}
                  onChange={handleUserDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-1 col-end-5 row-start-2 row-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">Email</label>
               <input
                  name="email"
                  type="text"
                  placeholder="Enter an Email"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userData.email}
                  onChange={handleUserDataChange}
               />
            </div>
            <div className="flex flex-col mb-4 col-start-1 col-end-5 row-start-3 row-end-4">
               <label className="text-gray-700 text-md font-medium mb-1">Password</label>
               <input
                  name="password"
                  type="password"
                  placeholder="Enter a Password"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userData.password}
                  onChange={handleUserDataChange}
               />
            </div>
         </div>
         <div className="w-full flex items-center justify-center mt-8 space-x-6">
            <button 
               className="p-2 bg-blue-600 hover:bg-blue-800 rounded-md text-white w-1/4"
               onClick={() => setTab(1)}
            >
               Previous
            </button>
            <button 
               className="p-2 bg-blue-600 hover:bg-blue-800 rounded-md text-white w-1/4"
               onClick={handleRegister}
            >Register</button>
         </div>
      </div>
   )
}

export default UserCard