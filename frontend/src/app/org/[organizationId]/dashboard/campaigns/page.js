"use client"
import Table from "./components/table"
import Summary from "./components/summary"
import Modal from "./components/modal"
import { useState, useEffect, useContext } from "react"
import Searchbar from "./components/searchbar"
import Filters from "./components/filters"
import { AuthContext } from "@/app/context/authContext"
import { getAllCampaigns } from "@/app/services/fetchService"

const Campaigns = ({params}) => {
   const organizationId = params.organizationId
   const [showModal, setShowModal] = useState(false)
   const [data, setData] = useState(null)

   useEffect(() => {

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
         <div className="bg-white rounded-xl max-w-full">
            <div className="max-w-full h-full rounded-xl p-4">
               <div className="flex flex-row p-6 w-full justify-between items-center">
                  <h1 className="text-4xl font-semibold">Campaigns</h1>
                  {/* <Link href="/org/campaign/new/details/about" >
                     <p className="bg-blue-700 py-3 px-8 rounded-md text-md text-white">Create New Campaign</p>
                  </Link> */}
                  <button className="bg-blue-800 font-semibold py-3 px-8 rounded-md text-md text-white" onClick={() => setShowModal(true)}>
                     Create New Campaign
                  </button>
               </div>
               <Summary />
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