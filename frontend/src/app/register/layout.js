import Header from "../components/header"

const RegisterLayout = ({children}) => {

   return (
      <div>
         <Header />
         <div style={{height: "90vh"}}>
            {children}
         </div>
      </div>
   )

}

export default RegisterLayout