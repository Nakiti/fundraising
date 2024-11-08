

const Display = () => {

   return (
      <div 
         className="min-h-screen bg-cover bg-center" 
         style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80)' }}
      >
         <div className="bg-white py-4 px-8 w-full opacity-90">
            <h1>Title</h1>
         </div>

         <div className="w-5/6 mx-auto py-8">

            <div className="bg-white shadow-md rounded-sm">
               <div className="pt-10 px-10 pb-2">
                  <h1 className="text-2xl text-gray-800">Thank you</h1>

                  <p className="mt-4 text-xs text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore</p>

                  <div className="flex flex-row text-sm mt-6 text-gray-600 space-x-4">
                     <p>Share</p>
                     <button>a</button>
                  </div>
               </div>

               <div className="bg-gray-100 p-10">
                  <h1 className="text-xl text-gray-800 border-b border-gray-400 py-2">Donation Information</h1>

                  <div className="mt-2 w-1/2">
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>
                     <div className="flex flex-row justify-between text-sm text-gray-700 py-2">
                        <p>Amount</p>
                        <p>0</p>
                     </div>

                  </div>

               </div>

               <div className="px-10 py-10">
                  <h1 className="text-xl ">Questions/Comments?</h1>
                  <p className="text-sm text-gray-700 mt-4">Email us at ... </p>
               </div>
            </div>

         </div>

      </div>
   )
}

export default Display