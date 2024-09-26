import Link from "next/link"
import Table from "./table"

const Events = () => {
   return (
      <div className="w-full h-full bg-white overflow-y-auto">
         <div className="flex flex-row p-6 w-full justify-between">
            <h1 className="text-3xl font-bold">Events</h1>
            <Link href="/org/campaign/new" className="bg-blue-700 p-2 px-4 rounded-md text-white">New Event</Link>
         </div>

         <Table />
      </div>
   )
}

export default Events