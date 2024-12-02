

const TicketPage = () => {

   return (
      <div 
         className="w-full mb-4 bg-white overflow-y-auto" 
      >
         <div class="relative w-full mb-12" style={{height: "80vh"}}>
            <img
               // src={ticketsPageInputs.bgImage}
               alt="Nature"
               class="w-full h-full object-cover"
            />
            <div 
               class="absolute inset-0 flex flex-col justify-center items-start py-6 px-12 bg-black bg-opacity-50 text-white"
               // style={{color: ticketsPageInputs.p_color}}
            >
               <h1 class="mb-2" style={{fontSize: "80px"}}>{"Title"}</h1>
               <h3 class="mb-2" style={{fontSize: "36px"}}>{"Date"}</h3>
               <p class="mb-8" style={{fontSize: "36px"}}>{"Address"}</p>
               <button class="px-8 py-4 bg-blue-800 hover:bg-yellow-600 rounded-sm text-xl">Get Tickets</button>
            </div>
         </div>

         <div 
            className="mb-12 pt-6"
            // style={{backgroundColor: ticketsPageInputs.bg_color}}
         >
            <div className="">
               <div className="space-y-6 w-1/2 mx-auto mb-16">
                  <h2 className="text-4xl font-semibold text-center">About the Event</h2>
                  <p className="text-xl leading-relaxed text-black">
                     {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </p>
               </div>

               <div className="mt-16 border-t border-white">
                  <div className="flex flex-row w-2/3 mx-auto justify-between items-center">
                     <div className="">
                        <p className="text-4xl mb-6">asdadad</p>
                        <p className="text-xl">asddad</p>
                     </div>
                     <div>
                        <img 
                           className="w-56 h-48 border"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div 
            className="bg-white w-2/3 mx-auto pb-12"
            // style={{backgroundColor: ticketsPageInputs.bg_color2}}
         >
            <div className="">
               <h2 className="text-4xl mb-4 text-gray-800 font-semibold text-center">Tickets</h2>
               <p className="text-xl mb-4 text-gray-600 text-center">
                  Purchase Your Tickets
               </p>
            </div>

            <div className="bg-gray-100 border p-4">

            </div>
         </div>
      </div>
   )
}

export default TicketPage