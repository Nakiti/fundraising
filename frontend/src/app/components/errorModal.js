/*
   Component: Error Modal
   Description: A component that appears on the screen to display an error message
   Props:
      - message: the error message
      - setError: to set the state of the display of the error modal
*/

const ErrorModal = ({message, setError}) => {
   return (
      <div id="errorModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div class="flex justify-between items-center">
               <h2 class="text-lg font-semibold text-red-600">Error</h2>
               <button id="closeModal" class="text-gray-500 hover:text-gray-700" onClick={() => setError(false)}>
               &times;
               </button>
            </div>
            <div class="mt-4">
               <p class="text-sm text-gray-700">
                  {message}
               </p>
            </div>
            <div class="mt-6 flex justify-end space-x-3">

               <button 
                  class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none" 
                  id="closeModal"
                  onClick={() => setError(false)}
               >
                  Close
               </button>
            </div>
         </div>
      </div>

   )
}

export default ErrorModal