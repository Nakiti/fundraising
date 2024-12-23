import { FaTrash } from "react-icons/fa"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import useFormInput from "@/app/hooks/useFormInput"
import { getCustomQuestions } from "@/app/services/fetchService"
import { createCustomQuestion } from "@/app/services/campaignService"
import { deleteCampaignQuestionsBatch } from "@/app/services/deleteService"

const QuestionsComponent = () => {
   const {questionInputs, handleQuestionInputsChange, customQuestions, setCustomQuestions, campaignId} = useContext(CampaignContext)

   const [newQuestion, handleNewQuestionChange, setNewQuestion] = useFormInput({
      id: new Date(),
      question: "",
      type: ""
   })

   const handleAdd = () => {
      if (newQuestion.question != "" && newQuestion.type != "") {
         setCustomQuestions((prev) => [
            ...prev,
            newQuestion
         ])
   
         setNewQuestion({id: new Date(), question: "", type: ""})
         console.log(customQuestions)
      }
   }

   const handleDelete = (id) => {
      setCustomQuestions(customQuestions.filter(item => item.id !== id))
   }

   const handleSave = async () => {
      try {
         const existingQuestions = await getCustomQuestions(campaignId)
         const questionsToAdd = customQuestions.filter(item => !existingQuestions.includes(item))
         const questionsToRemove = existingQuestions.filter(item => !customQuestions.includes(item))

         console.log(questionsToAdd)
         console.log(questionsToRemove)

         if (questionsToAdd.length > 0) {
            await createCustomQuestion(campaignId, questionsToAdd)
         }
         if (questionsToRemove.length > 0) {
            await deleteCampaignQuestionsBatch(questionsToRemove)
         }
      } catch (err) {
         console.log(err)
      }
   }


   return (
      <div className="w-full max-w-4xl mx-auto py-8 px-6">
         <h1 className="text-4xl font-light text-gray-900 mb-4">Questions</h1>
         <h3 className="text-md text-gray-600 mb-8">Create Questions to Ask Donors:</h3>
         <div className="w-full mb-12">
            <div className="flex flex-row justify-between text-sm text-gray-700 mb-2">
               <h1 className="mb-1">Contact Information</h1>
               <h1 className="mb-1">Show?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2"></div>
            <div className="text-gray-600">
               {["Phone", "Title", "Suffix"].map((field, idx) => (
                  <div key={idx} className="flex flex-row items-center justify-between p-2">
                     <h2>{field}</h2>
                     <input
                        type="checkbox"
                        className="w-4 h-4"
                        name={field.toLowerCase()}
                        checked={questionInputs[field.toLowerCase()]}
                        onChange={handleQuestionInputsChange}
                     />
                  </div>
               ))}
            </div>
         </div>
         <div className="w-full mb-12">
            <div className="flex flex-row justify-between text-sm text-gray-700 mb-2">
               <h1 className="mb-1">Company/Organization Details</h1>
               <h1 className="mb-1">Show?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2"></div>
            <div className="text-gray-600">
               {["Company/Organization Name", "Website URL"].map((field, idx) => (
                  <div key={idx} className="flex flex-row justify-between p-2">
                     <h2>{field}</h2>
                     <input
                        type="checkbox"
                        className="w-4 h-4"
                        name={field.toLowerCase().replace(/\//g, '')}
                        checked={questionInputs[field.toLowerCase().replace(/\//g, '')]}
                        onChange={handleQuestionInputsChange}
                     />
                  </div>
               ))}
            </div>
         </div>
         <div className="w-full mb-12">
            <h1 className="text-sm text-gray-700 mb-1">Add Custom Question</h1>
            <div className="border-b border-gray-600 mb-2"></div>
            <div className="p-6 bg-gray-100 rounded-lg">
               <div className="flex flex-row items-center justify-between space-x-4 mb-4">
                  <div className="flex flex-col w-3/4">
                     <label className="text-sm font-semibold mb-1">Question</label>
                     <input
                        className="p-3 border border-gray-600 rounded-sm"
                        placeholder="Enter Question Here"
                        name="question"
                        onChange={handleNewQuestionChange}
                        value={newQuestion.question}
                     />
                  </div>
                  <div className="flex flex-col w-1/4">
                     <label className="text-sm font-semibold mb-1">Question Type</label>
                     <select
                        defaultValue=""
                        className="p-3 border border-gray-600 rounded-sm"
                        name="type"
                        value={newQuestion.type}
                        onChange={handleNewQuestionChange}
                     >
                        <option value="" disabled>Select an Option</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="input">Single Line Response</option>
                        <option value="textArea">Multi Line Response</option>
                     </select>
                  </div>
               </div>
               <button
                  className="py-3 px-8 bg-blue-800 text-white rounded-md"
                  onClick={handleAdd}
               >
                  Add Question
               </button>
            </div>
         </div>

         {/* Manage Custom Question(s) Section */}
         <div>
            <h1 className="text-sm text-gray-700 mb-1">Manage Custom Question(s)</h1>
            <div className="border-b border-gray-600 mb-2"></div>
            <div>
               {customQuestions.map((item, index) => (
                  <div className="bg-gray-100 mb-2" key={index}>
                     <div className="w-full flex flex-row justify-between bg-gray-300 p-3">
                        <p>Question {index + 1}</p>
                        <button onClick={() => handleDelete(item.id)}>
                           <FaTrash className="text-gray-700" />
                        </button>
                     </div>

                     <div className="flex flex-row items-center w-full px-6 py-8 space-x-4">
                        <div className="flex flex-col w-3/4">
                           <label className="text-sm mb-1">Question</label>
                           <p className="p-3 border border-gray-300 rounded-md bg-white">
                              {item.question}
                           </p>
                        </div>
                        <div className="flex flex-col w-1/4">
                           <label className="text-sm mb-1">Type</label>
                           <p className="text-sm bg-white p-3 border border-gray-300 rounded-md">
                              {item.type}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         <div className="w-full flex flex-row mt-6">
            <button 
               className="ml-auto bg-blue-600 px-6 py-3 w-40 rounded-md shadow-sm text-md text-white"
               onClick={handleSave}
            >
               Save
            </button>
         </div>
      </div>
   )
}

export default QuestionsComponent