"use client"
import DesignationsComponent from "@/app/org/components/tabs/designations";
import { FaTrash } from "react-icons/fa"

const Designations = () => {

   const columns = [
      { id: 'title', label: 'Title'},
      { id: 'raised', label: 'Raised'},
   ];

   return (
      <DesignationsComponent />
   )
}

export default Designations