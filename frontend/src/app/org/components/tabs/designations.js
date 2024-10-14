import { FaTrash } from "react-icons/fa"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"


const DesignationsComponent = () => {
   const {designations, selectedDesignations, setSelectedDesignations} = useContext(CampaignContext)

   const handleChange= (designation, isChecked) => {
      setSelectedDesignations(prev => {
         const exists = prev.some(item => item.id === designation.id)

         if (isChecked) {
            if (!exists) {
               return [...prev, designation]
            }

         } else {
            return prev.filter((item) => item.id !== designation.id)
         }

         return prev
      })
   }

   const handleRemove = (id) => {
      setSelectedDesignations(selectedDesignations.filter(item => item.id !== id))
   }  

   return (
      <div className="w-full">
         <h1 className="text-4xl mb-4 font-light">Designations</h1>
         <h3 className="text-md text-gray-600 mb-8">Select the designations that users will be able to delegate their donation to:</h3>
      
         <div className="border-b border-gray-300 mb-2"/>

         <div className="flex flex-row py-4 w-full items-center px-2">
            <div className="flex flex-col w-1/3 py-4">
               <h1 className="text-xl mb-2">Default</h1>
               <p className="text-sm">Select the default desingation that users will donate to</p>
            </div>

            <div className="p-4 w-2/3">
               <select className="w-full h-1/2 p-3 border border-gray-600 rounded-md" default="">
                  <option value="" disabled>Select an Option</option>
                  {designations.map(item => {
                     return <option value={item.id}>{item.title}</option>
                  })}
               </select>
            </div>

         </div>

         <div className="border-b border-gray-300 mb-2"/>

         <div className="p-2">
            <h1 className="text-lg mb-2">Active Designations</h1>
            <p className="text-sm w-1/2 mb-4">These are the designations that users will be able to direct their donations towards for this campaign</p>
         
            {selectedDesignations.map((item, index) => {
               return (
                  <div key={index}>
                     <div className="w-full p-4 bg-gray-100 flex flex-row justify-between rounded-sm mb-2">
                        <p>{item.title}</p>
                        <button onClick={() => handleRemove(item.id)}><FaTrash /></button>
                     </div>
                  </div>
               )
            })}
         </div>

         <div className="border-b border-gray-300 mb-2"/>

         <div className="p-2">
            <h1 className="text-lg mb-2">All Designations</h1>
            <p className="text-sm w-1/2 mb-4">These are all active designations in your organization</p>

            <div className="px-6">
               <table className="min-w-full bg-white border-gray-300 rounded-md">
                  {/* Table Header */}
                  <thead className="border border-gray-300">
                     <tr>
                        <th key={0} className="px-4 py-2 text-left text-gray-600 text-sm font-semibold w-1/12 border border-gray-300">
                           <div className="">
                              Add
                           </div>
                        </th>
                        <th key={1} className="px-4 py-2 text-left text-gray-600 text-sm font-semibold">
                           <div className="">
                              Designation Title
                           </div>
                        </th>
                     </tr>
                  </thead>
                  
                  {/* Table Body */}
                  <tbody>
                     {designations.map((item, index) => {
                        return (
                           <tr className="border border-gray-300 hover:bg-gray-50" key={index}>
                              <td className="px-4 py-2 text-sm text-center border-r">
                                 <input type="checkbox" value={item.id} onChange={(e) => handleChange(item, e.target.checked)}/>
                              </td>
                              <td className="px-4 py-2 text-sm text-start">{item.title}</td>
                           </tr>
                        )
                     })}

                  </tbody>
               </table>
            </div>
         </div>

      </div>
   )
}

export default DesignationsComponent