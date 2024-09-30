import Header from "../components/header"

const LoginLayout = ({children}) => {

   return (
      <div>
         <Header />
         <div style={{height: "90vh"}}>
            {children}
         </div>
      </div>
   )
}

export default LoginLayout