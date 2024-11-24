import { CampaignContext } from "@/app/context/campaignContext"
import { useState, useContext } from "react"
import useFormInput from "@/app/hooks/useFormInput"

const FaqsComponent = () => {
   const {faqs, setFaqs} = useContext(CampaignContext)

   const [newFaq, handleNewFaqChange, setNewFaq] = useFormInput({
      id: new Date(),
      question: "",
      answer: ""
   })

   const handleAdd = () => {
      if (newFaq.question != "" && newFaq.answer != "") {
         setFaqs((prev) => [
            ...prev,
            newFaq
         ])
         setNewFaq({id: new Date(), question: "", answer: ""})
         console.log(customQuestions)
      }
   }

   const handleDelete = (id) => {
      setFaqs(faqs.filter(item => item.id !== id))
   }

   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">Faqs</h1>
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
                        name="question"
                        onChange={handleNewFaqChange}
                        value={newFaq.question}
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
            <h1 className="text-sm text-gray-700 mb-1">Manage Custom Question(s)</h1>
            <div className="border-b border-gray-600 mb-2" />
            {faqs.length > 0 ? <div>
               {faqs.map((item, index) => (
                  <div className="bg-gray-100 mb-2" key={index}>
                     <div className="w-full flex flex-row justify-between bg-gray-300 p-3">
                        <p>Question {index + 1}</p>
                        <button onClick={() => handleDelete(item.id)}>
                           <FaTrash className="text-gray-700" />
                        </button>
                     </div>

                     <div className="flex flex-row items-center w-full px-4 py-4 space-x-4">
                        <div className="flex flex-col w-3/4">
                           <label className="text-sm mb-1">Question</label>
                           <p className="p-3 border border-gray-300 rounded-md bg-white">
                              {item.question}
                           </p>
                        </div>
                        <div className="flex flex-col w-1/4">
                           <label className="text-sm mb-1">Type</label>
                           <p className="text-sm bg-white p-3 border border-gray-300 rounded-md">
                              {item.answer}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div> : <p className="text-gray-700 text-center p-6">No Faqs</p>}
         </div>
      </div>
   )
}

export default FaqsComponent