"use client";
import { CgProfile } from "react-icons/cg";
import { useContext } from "react";
import { CampaignContext } from "@/app/context/campaignContext";
import { IoIosClose } from "react-icons/io";
import Display from "./display";
import ColorInputs from "./colors";

const Preview = () => {
   const {previewInputs, handlePreviewInputsChange, setPreviewInputs} = useContext(CampaignContext)

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            handlePreviewInputsChange({ target: { name: 'image', value: reader.result } });
         };
         reader.readAsDataURL(file); // Convert the file to base64
      }
   }

   const handleClose = () => {
      setPreviewInputs(inputs => ({...inputs, image: ""}))
   }

   return (
      <div>
         <ColorInputs />
         <Display />
      </div>
   );
};

export default Preview;
