

const Checkout = ({page, setPage, gifts, setGifts}) => {

   const handleRemove = (id) => {
      setGifts(gifts.filter(item => item.id !== id))
   }
   

   return (
      <div className="w-1/2 mx-auto p-4 pb-16">
         <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center">Donation Details</h1>

         {gifts[0].designationTitle != "" ? <div className="space-y-4 min-h-36">
            {gifts.map(item => {
               return (
                  <div className="flex justify-between items-center border-b pb-4">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-700">{item.designationTitle}</h3>
                        <div className="flex flex-row w-full justify-between text-sm text-gray-600">
                           <button onClick={() => handleRemove(item.id)}>Remove</button>
                        </div>
                        
                     </div>
                     <p className="text-lg font-semibold text-gray-700">{item.amount}</p>
                  </div>
               )
            })}


         </div> : <div className="text-center ">No Gifts Added</div>}

         <div className="mt-6 pt-4 flex justify-end">
            <h3 className="text-xl font-semibold text-gray-800 mr-4">Subtotal:</h3>
            <p className="text-xl font-semibold text-gray-800">$225</p>
         </div>

         <div className="border-b-2 border-blue-300 my-2"/>

         <div className="mx-auto flex flex-col justify-between max-w-xs space-y-2 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-sm">Credit Card</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-sm">Pay Pal</button>
         </div>
      </div>

   )
}

export default Checkout