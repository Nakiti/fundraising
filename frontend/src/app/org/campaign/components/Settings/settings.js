"use client"
import { CampaignContext } from "@/app/context/campaignContext.js";
import { useContext } from "react";
import DesignationDropdown from "./designationDropdown";

const Settings = () => {
   const {settingsInputs, handleSettingsInputsChange} = useContext(CampaignContext)


   return (
      <div className="p-6 bg-white m-8">
         {/* Grid layout with two columns */}
         <h1 className="text-2xl font-bold mb-4">Campaign Settings</h1>
         <div className="h-full grid grid-cols-2 gap-4 grid-rows-3">
            <div className="flex flex-col mb-4 row-start-1 row-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">Title</label>
               <input
                  name="title"
                  type="text"
                  placeholder="Enter a Title"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settingsInputs.title}
                  onChange={handleSettingsInputsChange}
               />
            </div>
            <div className="flex flex-col mb-4 row-start-1 row-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">Description</label>
               <textarea
                  name="description"
                  type="text"
                  placeholder="Enter a Description"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  value={settingsInputs.description}
                  onChange={handleSettingsInputsChange}
               />
            </div>
            <div className="flex flex-col mb-4 row-start-2 row-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">Goal</label>
               <input
                  name="goal"
                  type="number"
                  placeholder="Enter a Goal"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settingsInputs.goal}
                  onChange={handleSettingsInputsChange}
               />
            </div>
            <div className="flex flex-col mb-4 row-start-3 row-end-4 col-start-2 col-end-3">
               <label className="text-gray-700 text-md font-medium mb-1">URL</label>
               <input
                  name="url"
                  type="text"
                  placeholder="Enter a URL"
                  className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={settingsInputs.url}
                  onChange={handleSettingsInputsChange}
               />
            </div>
            <div className="flex flex-col mb-4 row-start-3 row-end-4 col-start-1 col-end-2">
               <label className="text-gray-700 text-md font-medium mb-1">Designations</label>
               <DesignationDropdown />
            </div>
         </div>
      </div>
   )
}

export default Settings;
