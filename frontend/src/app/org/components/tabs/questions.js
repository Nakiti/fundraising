import { FaTrash } from "react-icons/fa"
import { useContext, useState } from "react"
import { CampaignContext } from "@/app/context/campaignContext"
import useFormInput from "@/app/hooks/useFormInput"

const QuestionsComponent = () => {
   const {questionInputs, handleQuestionInputsChange, customQuestions, setCustomQuestions} = useContext(CampaignContext)

   const [newQuestion, handleNewQuestionChange, setNewQuestion] = useFormInput({
      id: new Date(),
      title: "",
      type: ""
   })

   const handleAdd = () => {
      setCustomQuestions((prev) => [
         ...prev,
         newQuestion
      ])

      setNewQuestion({id: new Date(), title: "", type: ""})
      console.log(customQuestions)
   }

   const handleDelete = (id) => {
      setCustomQuestions(customQuestions.filter(item => item.id !== id))
   }


   return (
      <div className="w-full">
         <h1 className="text-4xl mb-4 font-light">Questions</h1>
         <h3 className="text-xl text-gray-600 mb-8">Create Questions to Ask Donors:</h3>

         <div className="w-full mb-12">
            <div className="flex flex-row justify-between">
               <h1 className="mb-1">Contact Information</h1>
               <h1 className="mb-1">Show ?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2 "/>

            <div className="text-gray-600 text-md space-y-4">
               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Phone</h2>
                  <input 
                     type="checkbox" 
                     className="w-5 h-5"
                     name="phoneNumber"
                     value={questionInputs.phoneNumber}
                     handleChange={handleQuestionInputsChange}
                  />
               </div>

               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Title</h2>
                  <input 
                     type="checkbox" 
                     className="w-5 h-5"
                     name="title"
                     value={questionInputs.title}
                     handleChange={handleQuestionInputsChange}
                  />
               </div>

               <div className="flex flex-row items-center justify-between p-2">
                  <h2>Suffix</h2>
                  <input 
                     type="checkbox" 
                     className="w-5 h-5"
                     name="suffix"
                     value={questionInputs.suffix}
                     handleChange={handleQuestionInputsChange}

                  />
               </div>
            </div>
         </div>

         <div className="w-full mb-12">
            <div className="flex flex-row justify-between">
               <h1 className="mb-1">Company/Organization Details</h1>
               <h1 className="mb-1">Show ?</h1>
            </div>
            <div className="border-b border-gray-600 mb-2 "/>

            <div className="text-gray-600 text-md space-y-4">
               <div className="flex flex-row justify-between p-2">
                  <h2>Company/Organization Name</h2>
                  <input 
                     type="checkbox" 
                     className="w-5 h-5"
                     name="companyName"
                     value={questionInputs.companyName}
                     handleChange={handleQuestionInputsChange}

                  />
               </div>

               <div className="flex flex-row justify-between p-2">
                  <h2>Website URL</h2>
                  <input 
                     type="checkbox" 
                     className="w-5 h-5"
                     name="websiteUrl"
                     value={questionInputs.websiteUrl}
                     handleChange={handleQuestionInputsChange}

                  />
               </div>
            </div>
         </div>

         <div className="w-full mb-12">
            <h1 className="mb-1">Add Custom Question</h1>
            <div className="border-b border-gray-600 mb-2"/>

            <div className="p-6 bg-gray-100">
               <div className="flex flex-row items-center w-full justify-between space-x-4 mb-4">
                  <div className="flex flex-col w-3/4">
                     <label className="text-sm mb-1">Question</label>
                     <input 
                        className="p-3 border border-gray-600 rounded-md"
                        placeholder="Enter Question Here"
                        name="title"
                        onChange={handleNewQuestionChange}
                        value={newQuestion.title}
                     />
                  </div>
                  <div className="flex flex-col w-1/4">
                     <label className="text-sm mb-1">Question Type</label>
                     <select 
                        default="" 
                        className="p-3 border border-gray-600 rounded-md"
                        name="type"
                        value={newQuestion.type}
                        onChange={handleNewQuestionChange}
                     >
                        <option value="">Select an Option</option>
                        <option value="checkbox">Yes/No</option>
                        <option value="input">Single Line Response</option>
                        <option value="textArea">Multi Line Response</option>
                     </select>
                  </div>
               </div>
               <button 
                  className="py-3 px-8 bg-blue-700 text-white rounded-md"
                  onClick={handleAdd}
               >
                  Add Question
               </button>
            </div>
         </div>

         <div>
            <h1 className="mb-1">Manage Custom Question(s)</h1>
            <div className="border-b border-gray-600 mb-2"/>

            <div>
               {customQuestions.map((item, index) => { 
                  return (
                     <div className="bg-gray-100" key={index}>
                        <div className="w-full flex flex-row justify-between mb-2 bg-gray-200 p-4">
                           <p>Question {index + 1}</p>
                           <button onClick={() => handleDelete(item.id)}>
                              <FaTrash className="flex-end"/>
                           </button>
                        </div>
                        
                        <div className="flex flex-row items-center w-full px-4 py-6 space-x-4">
                           <div className="flex flex-col w-3/4">
                              <label className="text-sm mb-1">Question</label>
                              <p className="p-3 border border-gray-300 rounded-md bg-white"> 
                                 {item.title}
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