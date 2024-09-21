import { useRouter } from "next/navigation"

const Card = ({title, description, raised, goal, donations, date}) => {
   const router = useRouter()

   const handleClick = () => {
      router.push(`/`)
   }

   return (
      <div className="shadow-md rounded-lg w-full h-full cursor pointer" onClick={handleClick}>
         <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png"
            className="object-cover w-full"
            style={{height: "150px"}}
         />
         <div className="p-4">
            <h1 className="text-lg font-bold">{title}</h1>
            <h3 className="text-sm mt-2">{description}</h3>
            <div className="w-full flex flex-row justify-between items-center mt-2">
               <button className="px-4 py-1 bg-blue-600" onClick={handleClick}>Donate</button>
               <button className="px-4 py-1 bg-gray-200">Share</button>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-4">
               <p className="text-xs">Raised: {raised}</p>
               <p className="text-xs">Goal: {goal}</p>
               <p className="text-xs">Donations: {donations}</p>
            </div>

            <p className="text-xs self-end mt-2">Started: {date}</p>
         </div>
      </div>
   )
}

export default Card