"use client"
import Table from "./components/table"
import Summary from "./components/summary"
import Link from "next/link"
import Modal from "./components/modal"
import { useState } from "react"

const Campaigns = () => {
   const [showModal, setShowModal] = useState(false)

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
            <Table />
         </div>
      </div>
   )
}

export default Campaigns