import Navbar from "../../components/navbar"


const NewLayout = ({children}) => {

   const links = [
      "/org/campaign/new/details/about",
      "/org/campaign/new/donation-page/"
   ]

   return (
      <div >
         <Navbar links={links}/>
         <div className="py-8">
            {children}
         </div>
      </div>
   )
}

export default NewLayout