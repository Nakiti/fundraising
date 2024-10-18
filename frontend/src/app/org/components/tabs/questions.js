import { FaTrash } from "react-icons/fa"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import useFormInput from "@/app/hooks/useFormInput"

const QuestionsComponent = () => {
   const {questionInputs, handleQuestionInputsChange, customQuestions, setCustomQuestions} = useContext(CampaignContext)

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


   return (
      <div className="w-full">
         <h1 className="text-3xl mb-2">Questions</h1>
         <h3 className="text-md text-gray-600 mb-8">Create Questions to Ask Donors:</h3>

         <div className="w-full mb-12 ">
            <div className="flex flex-row justify-between text-sm text-gray-700">
               <h1 className="mb-1">Contact Information</h1>
               <h1 className="mb-1">Show?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2 "/>

            <div className="text-gray-600 text-md text-sm">
               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Phone</h2>
                  <input 
                     type="checkbox" 
                     className="w-4 h-4"
                     name="phoneNumber"
                     value={questionInputs.phoneNumber}
                     onChange={handleQuestionInputsChange}
                  />
               </div>

               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Title</h2>
                  <input 
                     type="checkbox" 
                     className="w-4 h-4"
                     name="title"
                     value={questionInputs.title}
                     onChange={handleQuestionInputsChange}
                  />
               </div>

               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Suffix</h2>
                  <input 
                     type="checkbox" 
                     className="w-4 h-4"
                     name="suffix"
                     value={questionInputs.suffix}
                     onChange={handleQuestionInputsChange}

                  />
               </div>
            </div>
         </div>

         <div className="w-full mb-12">
            <div className="flex flex-row justify-between text-sm text-gray-700">
               <h1 className="mb-1">Company/Organization Details</h1>
               <h1 className="mb-1">Show?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2 "/>

            <div className="text-gray-600 text-md text-sm">
               <div className="flex flex-row justify-between p-2">
                  <h2>Company/Organization Name</h2>
                  <input 
                     type="checkbox" 
                     className="w-4 h-4"
                     name="companyName"
                     value={questionInputs.companyName}
                     onChange={handleQuestionInputsChange}

                  />
               </div>

               <div className="flex flex-row justify-between p-2 ">
                  <h2>Website URL</h2>
                  <input 
                     type="checkbox" 
                     className="w-4 h-4"
                     name="websiteUrl"
                     value={questionInputs.websiteUrl}
                     onChange={handleQuestionInputsChange}

                  />
               </div>
            </div>
         </div>

         <div className="w-full mb-12">
            <h1 className="mb-1 text-sm text-gray-700">Add Custom Question</h1>
            <div className="border-b border-gray-600 mb-2"/>

            <div className="p-6 bg-gray-100">
               <div className="flex flex-row text-gray-700 items-center w-full justify-between space-x-4 mb-4">
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
                        default="" 
                        className="p-3 border border-gray-600 rounded-sm"
                        name="type"
                        value={newQuestion.type}
                        onChange={handleNewQuestionChange}
                     >
                        <option value="" disabled>Select an Option</option>
                        <option value="checkbox">Yes/No</option>
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

         <div>
            <h1 className="mb-1 text-sm text-gray-700">Manage Custom Question(s)</h1>
            <div className="border-b border-gray-600 mb-2"/>

            <div>
               {customQuestions.map((item, index) => { 
                  return (
                     <div className="bg-gray-100" key={index}>
                        <div className="w-full flex flex-row justify-between bg-gray-300 p-3">
                           <p>Question {index + 1}</p>
                           <button onClick={() => handleDelete(item.id)}>
                              <FaTrash className="flex-end"/>
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
                              <p className="text-sm bg-white p-3 border border-gray-300 rounded-md">{item.type}</p>
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>

      </div>
   )
}

export default QuestionsComponent