

const DonationPage = ({display, designations}) => {

   return (
      <div 
         className="w-full mb-4 bg-white overflow-y-auto" 
         // style={{ backgroundColor: donationPageInputs.bg_color }}
      >
         <div className="relative w-full">

            {/* First Image */}
            <img
               src={display.banner_image || "image1.jpg"}
               alt="image"
               className="w-full object-cover bg-gray-50"
               style={{height: "60vh"}}
            />
            {/* <div className="bg-gray-600" style={{height: "45vh"}}>

            </div> */}
         </div>

         <div className="w-5/6 mx-auto relative flex flex-row mb-8 space-x-6 pt-2">
            <div className="w-1/4">
               <img 
                  src={display.small_image || "image1.jpg"}
                  className="h-72 w-72 object-cover border-4 border-gray -mt-24 rounded-md"
                  alt="image"
               />
               {/* <div className="h-64 w-64 bg-blue-600 border-4 -mt-16 border-white">
                  <p>a</p>
               </div> */}
            </div>
            <div className="w-2/3 mt-4">
               <div className="flex flex-row justify-between mb-10 w-11/12">
                  <div>
                     <p className="text-gray-500 text-md">Fundraiser</p>
                     <h1 className="text-4xl font-semibold text-gray-800">{display.headline || "Headline"}</h1>
                  </div>
                  <button className="text-md text-blue-600 hover:underline">Share</button>
               </div>

               <div className="mb-12 flex flex-row w-full items-center space-x-8">
                  <div className="w-3/4">
                     <p className="text-2xl mb-3 text-gray-700" >X raised</p>
                     <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                        <div className="bg-blue-600 h-4 rounded-full w-1/12"></div>
                     </div>
                  </div>
                  <div className="w-1/12">
                     <button className="px-10 py-4 text-xl bg-blue-700 text-white">Donate</button>
                  </div>
               </div>

               <div className="space-y-4 py-4 mt-16">
                  <h2 className="text-4xl text-gray-800 text-center mb-6">About</h2>
                  <p className="text-lg text-gray-800 leading-relaxed">
                     {"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat"}
                  </p>
               </div>

               <div className="mt-6 flex flex-col items-center mb-12">
                  <h3 className="text-xl text-gray-700 font-semibold mb-4">I would like to give to:</h3>
                  <select 
                     className="w-1/2 border border-gray-300 rounded-sm p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                     defaultValue="default"
                  >
                     <option value="default" disabled>Select an Option</option>
                     {designations && designations.map((item, index) => (
                        <option key={index} value={item.id}>{item.title}</option>
                     ))}
                  </select>
               </div>

               <div className="mt-6 flex flex-row items-center justify-center">
                  <div>
                  <h3 className="text-xl text-center text-gray-700 font-semibold mb-4">I would like to give:</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-sm">
                     {[display.button1, display.button2, display.button3, display.button4, display.button5, display.button6].map((amount, index) => (
                        <button
                        key={index}
                        className="w-full text-xs py-2 bg-blue-700 text-white rounded-sm shadow-md hover:bg-blue-800 transition-colors duration-200"
                        disabled
                        style={{ backgroundColor: display.b3_color }}
                        >
                        {amount}
                        </button>
                     ))}
                     <input 
                        placeholder="Enter Custom Amount" 
                        type="number" 
                        disabled
                        className="col-span-2 text-sm rounded-sm py-2 px-4 bg-white border border-blue-600 text-gray-700 shadow focus:outline-none " 
                     /> 
                  </div>
                  </div>
               </div>

               <div className="flex justify-center items-center mt-6 mx-auto">
                  <button 
                     disabled
                     className="w-1/2 py-2 text-white rounded-sm bg-blue-700 shadow-md hover:bg-blue-800 transition-colors duration-200"
                     // style={{ backgroundColor: donationPageInputs.b1_color }}
                  >
                     Donate
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DonationPage