

const UserInfo = ({setPage, handleUserInfoChange, userInfo}) => {

   return (
      <div className="w-1/2 mx-auto bg-white p-4 pb-12">
         <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">Your Information</h1>

         <div className="space-y-6">
            <div className="space-y-2">
               <h3 className="text-lg font-semibold text-gray-700">Details:</h3>
               <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mt-2">
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="First Name"
                     name="firstName"
                     value={userInfo.firstName}
                     onChange={handleUserInfoChange}
                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="Last Name"
                     name="lastName"
                     value={userInfo.lastName}
                     onChange={handleUserInfoChange}

                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="Email"
                     name="email"
                     value={userInfo.email}
                     onChange={handleUserInfoChange}

                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="Phone Number"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
               </div>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="space-y-2">
               <h3 className="text-lg font-semibold text-gray-700">Address:</h3>
               <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mt-2">
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm col-start-1 col-end-4"
                     placeholder="Street Address"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="Apt/Suite"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm col-start-1 col-end-4"
                     placeholder="City"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="State"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
                  <input 
                     className="py-2 px-4 border border-gray-400 rounded-sm text-sm"
                     placeholder="Zip Code"
                     name="phoneNumber"
                     value={userInfo.phoneNumber}
                     onChange={handleUserInfoChange}
                  />
               </div>
            </div>

            <div className="border-b border-blue-600"/>

            <div className="flex justify-around mt-8 max-w-sm mx-auto">
               <button 
                  className="px-8 py-2 bg-blue-700 text-white rounded-sm shadow hover:bg-blue-800 transition-colors duration-200"
                  onClick={() => setPage(3)}
               >
                  Continue
               </button>
            </div>

         </div>

      </div>
   )
}

export default UserInfo