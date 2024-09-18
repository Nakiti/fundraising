import Sidebar from "@/app/components/Sidebar/sidebar.js";

const DashboardLayout = ({ children }) => {
   return (
      <div className="flex h-screen" style={{height: "90vh"}}>
         {/* Sidebar */}
         <Sidebar />

         {/* Main Content */}
         <div className="flex-1 p-4 bg-gray-100">
            {children}
         </div>
      </div>
   );
};

export default DashboardLayout;
