"use client";
import { CgProfile } from "react-icons/cg";
import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import Display from "./display";
import ColorInputs from "./colors";

const Preview = () => {

   return (
      <div>
         <ColorInputs />
         <Display />
      </div>
   );
};

export default Preview;
