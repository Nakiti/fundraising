"use client"
import Table from "./components/table"
import Summary from "./components/summary"
import Modal from "./components/modal"
import { useState, useEffect, useContext } from "react"
import Searchbar from "./components/searchbar"
import Filters from "./components/filters"
import { AuthContext } from "@/app/context/authContext"
import { getAllCampaigns } from "@/app/services/fetchService"

const Campaigns = () => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser && currentUser.organization_id
   const [showModal, setShowModal] = useState(false)
   const [data, setData] = useState(null)

   useEffect(() => {
      const fetchData = async() => {
         try {
            const response = await getAllCampaigns(organizationId)
            setData(response)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [])

   return (
      <div className="w-full h-full p-4">
         {showModal && <Modal setShow={setShowModal}/>}
         <div className="w-full h-full bg-white overflow-y-auto rounded-md p-4">
            <div className="flex flex-row p-6 w-full justify-between items-center">
               <h1 className="text-4xl">Campaigns</h1>
               {/* <Link href="/org/campaign/new/details/about" >
                  <p className="bg-blue-700 py-3 px-8 rounded-md text-md text-white">Create New Campaign</p>
               </Link> */}
               <button className="bg-blue-700 font-semibold py-3 px-8 rounded-md text-md text-white" onClick={() => setShowModal(true)}>
                  Create New Campaign
               </button>
            </div>
            <Summary />
            <div className="mb-4 flex flex-col px-6">
               <Searchbar setData={setData} organizationId={organizationId}/>
               <Filters setData={setData} organizationId={organizationId}/>
            </div>
            <Table setData={setData} data={data}/>
         </div>
      </div>
   )
}

export default Campaigns