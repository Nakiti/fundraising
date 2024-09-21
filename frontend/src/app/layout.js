import "./globals.css";
import Header from "./components/header";
import { AuthContextProvider } from "./context/authContext";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {

   return (
      <html lang="en">
         <AuthContextProvider>
            <body className="bg-gray-50">
               <Header />
               <div style={{height: "90vh"}}>
                  {children}
               </div>
            </body>
         </AuthContextProvider>
      </html>
   );
}