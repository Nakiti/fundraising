import { AuthContextProvider } from "./context/authContext"
import { ToastProvider } from "./components/Toast"
import ErrorBoundary from "./components/ErrorBoundary"
import "./globals.css"

export const metadata = {
  title: "Fundraising Platform",
  description: "A comprehensive fundraising platform for organizations",
}

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <ErrorBoundary>
            <ToastProvider>
               <AuthContextProvider>
                  <body className="bg-gray-50 font-lato">
                     {children}
                  </body>
               </AuthContextProvider>
            </ToastProvider>
         </ErrorBoundary>
      </html>
   );
}