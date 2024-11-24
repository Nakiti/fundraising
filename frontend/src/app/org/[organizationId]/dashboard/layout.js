"use client";

import Sidebar from "@/app/components/Sidebar/sidebar.js";
import { useEffect, useState } from "react";

const DashboardLayout = ({params, children }) => {
  const [isClient, setIsClient] = useState(false);
  const organizationId = params.organizationId

  // Ensure this only runs on the client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex h-screen overflow-y-hidden" style={{ height: "92vh"}}>
      {/* Sidebar */}
      
        {isClient && <Sidebar organizationId={organizationId}/>} {/* Render a placeholder on the server */}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {isClient && children} {/* Placeholder for children on the server */}
      </div>
    </div>
  );
};

export default DashboardLayout;
