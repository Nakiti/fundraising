"use client"
import Link from "next/link"
import Table from "./components/table"
import Modal from "./components/modal"
import { useState } from "react"

const Events = ({params}) => {
   const [showModal, setShowModal] = useState(false)
   const organizationId = params.organizationId
   const [data, setData] = useState(null)


   return (
      <div className="w-full h-full">
         {showModal && <Modal setShow={setShowModal} organizationId={organizationId}/>}
         <div className="w-full h-full bg-gray-100 rounded-md overflow-y-auto p-6">
            <div className="rounded-lg bg-white w-full h-full p-4">
               <div className="flex flex-row p-6 w-full justify-between">
                  <h1 className="text-4xl font-semibold">Events</h1>
                  <button onClick={() => setShowModal(true)} className="bg-blue-800 py-3 px-8 rounded-md text-white">
                     Create New Event
                  </button>
               </div>

               <Table />
            </div>
         </div>
      </div>
   )
}

export default Events