"use client"
import { FaTrash } from "react-icons/fa"
import { CampaignContext } from "@/app/context/campaignContext"
import { useState, useContext } from "react"
import useFormInput from "@/app/hooks/useFormInput"
import { getFaqs } from "@/app/services/fetchService"
import { createFaq } from "@/app/services/createServices"
import { deleteFaq, deleteFaqsBatch } from "@/app/services/deleteService"

const Faqs = () =>{
   const {faqs, setFaqsWithTracking, campaignId, loading, markChangesAsSaved, pageChanges, markPageChangesAsSaved} = useContext(CampaignContext)

   const [newFaq, handleNewFaqChange, setNewFaq] = useFormInput({
      id: new Date(),
      question: "",
      answer: ""
   })

   const handleAdd = () => {
      if (newFaq.question != "" && newFaq.answer != "") {
         setFaqsWithTracking((prev) => [...prev, newFaq])
         setNewFaq({id: new Date(), question: "", answer: ""})
         console.log(faqs)
      }
   }

   const handleDelete = (id) => {
      setFaqsWithTracking(faqs.filter(item => item.id !== id))
   }

   const handleSave = async () => {
      try {
         const existingFaqs = await getFaqs(campaignId)
         const relationsToAdd = faqs.filter(faq =>!existingFaqs.includes(faq))
         const relationsToRemove = existingFaqs.filter(faq =>!faqs.includes(faq))

         if (relationsToAdd.length > 0) {
            await createFaq(campaignId, relationsToAdd)
         }
                   if (relationsToRemove.length > 0) {
             await deleteFaqsBatch(relationsToRemove)
          }
          markChangesAsSaved()
          markPageChangesAsSaved('faqs')
      } catch (err) {
         console.log(err)
      }
   }

   // Show loading state while data is being fetched
   if (loading) {
      return (
         <div className="w-full max-w-4xl mx-auto py-8 px-6">
            <div className="animate-pulse">
               <div className="h-8 bg-gray-200 rounded mb-4"></div>
               <div className="h-4 bg-gray-200 rounded mb-8"></div>
               <div className="space-y-4">
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">FAQs</h1>
         <h3 className="text-md text-gray-600 mb-8">Answer frequently asked questions:</h3>
         <div className="w-full mb-12">
            <h1 className="text-sm text-gray-700 mb-1">Add FAQ</h1>
            <div className="border-b border-gray-600 mb-2"></div>

            <div className="p-6 bg-gray-100 rounded-lg">
               <div className="flex flex-col w-full justify-between mb-4 space-y-4">
                  <div className="flex flex-col">
                     <label className="text-sm font-semibold mb-1">Question</label>
                     <input
                        className="p-3 border border-gray-600 rounded-sm"
                        placeholder="Enter Question Here"
                        name="question"
                        onChange={handleNewFaqChange}
                        value={newFaq.question}
                     />
                  </div>
                  <div className="flex flex-col">
                     <label className="text-sm font-semibold mb-1">Answer</label>
                     <textarea
                        className="p-3 border border-gray-600 rounded-sm"
                        placeholder="Enter Answer Here"
                        name="answer"
                        onChange={handleNewFaqChange}
                        value={newFaq.answer}
                        rows={4}
                     />
                  </div>
               </div>
               <button
                  className="py-3 px-8 bg-blue-800 text-white rounded-md"
                  onClick={handleAdd}
               >
                  Add FAQ
               </button>
            </div>
         </div>

         <div>
            <h1 className="text-sm text-gray-700 mb-1">Manage FAQs</h1>
            <div className="border-b border-gray-600 mb-2" />
            {faqs && faqs.length > 0 ? <div>
               {faqs.map((item, index) => (
                  <div className="bg-gray-100 mb-2" key={index}>
                     <div className="w-full flex flex-row justify-between bg-gray-300 p-3">
                        <p>FAQ {index + 1}</p>
                        <button onClick={() => handleDelete(item.id)}>
                           <FaTrash className="text-gray-700" />
                        </button>
                     </div>

                     <div className="flex flex-col w-full px-4 py-4 space-y-4">
                        <div className="flex flex-col">
                           <label className="text-sm mb-1">Question</label>
                           <p className="p-3 border border-gray-300 rounded-md bg-white">
                              {item.question}
                           </p>
                        </div>
                        <div className="flex flex-col">
                           <label className="text-sm mb-1">Answer</label>
                           <p className="p-3 border border-gray-300 rounded-md bg-white">
                              {item.answer}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div> : <p className="text-gray-700 text-center p-6">No FAQs</p>}
         </div>
         <div className="w-full flex flex-row mt-6">
                         <button 
                className={`ml-auto ${!pageChanges.faqs ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} px-6 py-3 w-40 rounded-md shadow-sm text-md text-white`}
                onClick={handleSave}
                disabled={!pageChanges.faqs}
             >
                Save
             </button>
         </div>
      </div>
   )
}

export default Faqs;