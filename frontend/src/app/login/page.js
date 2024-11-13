"use client"

import { AuthContext } from "../context/authContext"
import useFormInput from "../hooks/useFormInput"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/header"

const Login = () => {
   const {login, currentUser} = useContext(AuthContext)
   const router = useRouter()

   const [inputs, handleInputsChange, setInputs] = useFormInput({
      email: "",
      password: ""
   })

   const handleSubmit = (e) => {
      e.preventDefault()
      login(inputs)
      router.push("/org/dashboard/home")
   }

   return (
      <div>
         <Header />
         <div className="flex items-start justify-center min-h-screen bg-gray-50">
            <div className="w-full mt-16 max-w-sm p-8 bg-white rounded-lg shadow-lg">
               <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
               <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                     <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        name="email"
                        value={inputs.email}
                        onChange={handleInputsChange}
                     />
                  </div>
                  <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                     <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        name="password"
                        value={inputs.password}
                        onChange={handleInputsChange}
                     />
                  </div>
                  <div className="flex items-center justify-between">
                     <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-700 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                     >
                        Login
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default Login