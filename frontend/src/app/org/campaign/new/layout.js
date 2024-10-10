import Navbar from "../../components/navbar"


const NewLayout = ({children}) => {

   return (
      <div >
         <Navbar />
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default NewLayout