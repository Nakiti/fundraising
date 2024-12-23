

const Ticket = () => {

   return (
      <div className="w-full bg-white shadow-sm rounded-sm p-6 relative border border-gray-200">
         <div className="flex flex-row w-full mb-4">
            <div className="w-5/6">
               <h1 className="text-xl font-bold mb-2">Concert Ticket</h1>
               <p className="text-sm text-gray-600 mb-4">Enjoy an unforgettable evening of live music and entertainment!</p>
            </div>
            <div className="flex items-center w-1/5">
               <div className="flex flex-col items-center">
               <p className="text-sm text-gray-600 mb-2">Quantity</p>
               <input
                  className="border border-gray-300 rounded-md py-1 px-2 w-full text-sm focus:ring-2 focus:ring-blue-400"
                  type="number"
                  min={0}
                  placeholder="Max: 5"
               />
               </div>
            </div>
         </div>
         <div className="border-t-2 border-dashed border-gray-300 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">$45.00</span>
            <p className="text-xs text-gray-500">Available Until: 12/31/2024</p>
         </div>
      </div>
   )
}

export default Ticket