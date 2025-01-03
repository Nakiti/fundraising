

const PurchaseSection = () => {

   return (
      <div>
         <TextAreaInputEdit title={"Enter Message"} rows={5} placeholder={"Enter a Message"} name={"message"} value={ticketsPageInputs.instructions} changeFunc={handleTicketsPageInputs}/>

         <div className="my-4">
            <p className="text-sm font-bold text-gray-600 mb-2">
               Enter message <span className="text-red-500">*</span>
            </p>
            <textarea 
               className="text-black text-sm w-full h-full border border border-gray-400 p-2 rounded-sm resize-none"
               rows={5}
               placeholder="Enter a message"
               name="message"
               // value={thankInputs.message}
               // onChange={handleThankInputsChange} 
            />
         </div>
      </div>
   )
}

export default PurchaseSection