"use client"
import Table from "./components/table"
import Summary from "./components/summary"
import Modal from "./components/modal"
import { useState, useEffect, useContext } from "react"
import Searchbar from "./components/searchbar"
import Filters from "./components/filters"
import { getAllCampaigns } from "@/app/services/fetchService"

/*
   Component: Campaigns
   Description: renders campaigns page
*/
const Campaigns = ({params}) => {
   const organizationId = params.organizationId
   const [showModal, setShowModal] = useState(false)
   const [data, setData] = useState(null)

   useEffect(() => {
      /*
         Description: Fetches all organizations corresponding to the organization
      */
      const fetchData = async() => {
         try {
            const response = await getAllCampaigns(organizationId)
            setData(response)
            console.log(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [organizationId])

   return (
      <div className="w-full max-w-full overflow-x-hidden h-full overflow-y-auto bg-gray-100 p-6">
         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
         <div className="bg-white rounded-md max-w-full">
            <div className="max-w-full h-full rounded-lg p-4">
               <div className="flex flex-row p-6 w-full justify-between items-center">
                  <h1 className="text-4xl font-semibold">Campaigns</h1>
                  <button className="bg-blue-800 font-semibold py-3 px-8 rounded-md text-md text-white" onClick={() => setShowModal(true)}>
                     Create New Campaign
                  </button>
               </div>
               {data && <Summary data={data}/>}
               <div className="mb-4 flex flex-col px-6">
                  <Searchbar setData={setData} organizationId={organizationId}/>
                  <Filters setData={setData} organizationId={organizationId}/>
               </div>
               <div className="">
                  <Table setData={setData} data={data} organizationId={organizationId}/>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Campaigns