import Link from "next/link"

const Card = ({title, description, raised, goal, donations, date, id, organizationId}) => {

   return (
      <div className="shadow-sm rounded-sm w-full h-full cursor pointer">
         <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
            className="object-cover w-full"
            style={{height: "150px"}}
         />
         <div className="p-4">
            <div className="flex flex-row justify-between">
               <div className="flex flex-col">
                  <h1 className="text-lg font-bold">{title}</h1>
                  <h3 className="text-sm">{description}</h3>
               </div>
               <div className="w-full flex flex-col items-end space-y-2">
                  <Link 
                     href={`/organization/${organizationId}/campaign/${id}`}
                     className="px-2 w-20 py-1 bg-blue-600 rounded-sm text-white text-sm text-center" 
                  >Donate
                  </Link>
                  <button className="px-4 w-20 py-1 bg-gray-200 rounded-sm text-sm">Share</button>
               </div>
            </div>
            {/* <div className="w-full flex flex-row justify-between items-center mt-4">
               <p className="text-xs">Raised: {raised}</p>
               <p className="text-xs">Goal: {goal}</p>
               <p className="text-xs">Donations: {donations}</p>
            </div> */}

            {/* <p className="text-xs self-end">Started: {date}</p> */}
         </div>
      </div>
   )
}

export default Card