"use client"
import { AuthContext } from "../context/authContext"
import { useToast } from "../components/Toast"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/header"
import Link from "next/link"

/*
   Components: Login
   Description: Handles login functionality into the dashboard
*/
const Login = () => {
   const { login, loading } = useContext(AuthContext)
   const { showError, showSuccess } = useToast()
   const router = useRouter()
   
   // Simple state for form values
   const [formData, setFormData] = useState({
      email: "",
      password: ""
   });

   /*
      Function: handleInputChange
      Description: Updates form values
   */
   const handleInputChange = (field, value) => {
      setFormData(prev => ({
         ...prev,
         [field]: value
      }));
   };

   /*
      Function: handleLogin
      Description: Logs user in and reroutes page
   */
   const handleLogin = async (e) => {
      e.preventDefault();
      
      // Simple validation - just check if fields are not empty
      if (!formData.email.trim() || !formData.password.trim()) {
         showError('Validation Error', 'Please fill in all fields');
         return;
      }

      try {
         const result = await login(formData)
         
         if (result.success) {
            showSuccess('Login Successful', 'Welcome back!')
            router.push("/profile")
         } else {
            showError('Login Failed', result.message || 'Invalid credentials')
         }
      } catch (err) {
         const errorMessage = err?.message || 'An unexpected error occurred during login'
         showError('Login Error', errorMessage)
      }
   }

   // Check if form should be valid - only check that both fields have values
   const isFormValid = formData.email.trim() && formData.password.trim();

   return (
      <div>
         <Header />
         <div className="flex items-start justify-center min-h-screen bg-gray-50">
            <div className="w-full mt-16 max-w-sm p-8 bg-white rounded-lg shadow-lg">
               <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
               
               <form className="space-y-6" onSubmit={handleLogin}>
                  <div>
                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                     </label>
                     <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        name="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={loading}
                     />
                  </div>
                  
                  <div>
                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                     </label>
                     <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={loading}
                     />
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className="w-full px-4 py-2 bg-blue-700 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                     >
                        {loading ? (
                           <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Logging in...
                           </div>
                        ) : (
                           'Login'
                        )}
                     </button>
                  </div>
               </form>
               
               <p className="text-sm text-center mt-4">
                  Don't Have an Account? 
                  <Link href="/register" className="text-blue-700 hover:underline ml-1">
                     Register
                  </Link>
               </p>
            </div>
         </div>
      </div>
   )
}

export default Login