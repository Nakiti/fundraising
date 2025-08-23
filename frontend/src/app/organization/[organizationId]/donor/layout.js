"use client";
import { DonorProvider } from "@/app/context/donorContext";
import { DonorSidebarProvider } from "@/app/context/donorSidebarContext";
import DonorSidebar from "@/app/components/DonorSidebar/donorSidebar";
import DonorHeader from "@/app/components/DonorHeader/donorHeader";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DonorLayout = ({ children, params }) => {
    const { organizationId } = params;
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

    // Ensure this only runs on the client-side
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Check if current page is login or register
    const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');

    return (
        <DonorProvider organizationId={organizationId}>
            <DonorSidebarProvider>
                {isAuthPage ? (
                    // For login/register pages, render without sidebar
                    <div className="bg-gray-50 min-h-full">
                        {isClient && children}
                    </div>
                ) : (
                    // For authenticated pages, render with sidebar and header
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        {isClient && <DonorHeader organizationId={organizationId} />}
                        
                        {/* Main Layout */}
                        <div className="flex flex-1 bg-gray-50 overflow-hidden">
                            {/* Sidebar */}
                            {isClient && <DonorSidebar organizationId={organizationId} />}

                            {/* Main Content */}
                            <div className="flex-1 overflow-y-auto min-h-0">
                                {isClient && children}
                            </div>
                        </div>
                    </div>
                )}
            </DonorSidebarProvider>
        </DonorProvider>
    );
};

export default DonorLayout;
