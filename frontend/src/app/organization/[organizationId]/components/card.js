import Link from "next/link"

const Card = ({campaign_name, raised, goal, donations, date, id, organizationId}) => {

   return (
      <div className="shadow-lg rounded-md w-full h-full cursor pointer">
         <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
            className="object-cover w-full rounded-t-lg"
            style={{height: "150px"}}
         />
         <div className="px-6 py-4">
            <div className="flex flex-row justify-between items-center">
               <div className="flex flex-col">
                  <h1 className="text-xl mb-2">{campaign_name}</h1>
                  {/* <h3 className="text-sm">This is the descritpion of the cmaping. there are lots of words and other such tingsd fasdcsdc kj csdc xzcsd</h3> */}
               </div>
               <div className="w-full flex flex-col items-end space-y-4 h-full">
                  <Link 
                     href={`/organization/${organizationId}/campaign/${id}`}
                     className="px-4 w-28 py-2 bg-blue-600 rounded-sm text-white text-sm text-center" 
                  >Donate
                  </Link>
                  {/* <button className="px-4 w-28 py-2 bg-gray-200 rounded-sm text-sm">Share</button> */}
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