import { createContext, useContext } from "react";
import { AuthContext } from "./authContext";

export const EventContext = createContext()

export const EventContextProvider = ({children, eventId}) => {
   const {currentUser} = useContext(AuthContext)
   const organizationId = currentUser?.organization_id

   return (
      <EventContext.Provider value={{ organizationId, eventId }}>
         {children}
      </EventContext.Provider>
   )
}