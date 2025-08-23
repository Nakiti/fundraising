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
    <div className="flex h-full">
      {/* Sidebar */}
      {isClient && <Sidebar organizationId={organizationId}/>}

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-y-auto min-h-0">
        {isClient && children}
      </div>
    </div>
  );
};

export default DashboardLayout;
