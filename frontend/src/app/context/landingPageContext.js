import { createContext, useContext } from "react";
import { AuthContext } from "./authContext";
import useFormInput from "../hooks/useFormInput";

export const LandingPageContext = createContext()

export const LandingPageContextProvider = ({children}) => {

   const [inputs, handleInputsChange, setInputs] = useFormInput({
      title: "",
      description: "",
      bgImage: "",
      aboutImage: "",
      about: "",
      bg_color: "#FFFFFF",
      p_color: "#000000",
      s_color: "gray",
      c_color: "#FFFFFF",
      ct_color: "#000000",
      b_color: "blue",
      bt_color: "white"
   })

   return (
      <LandingPageContext.Provider value={{inputs, handleInputsChange}}>
         {children}
      </LandingPageContext.Provider>
   )
}