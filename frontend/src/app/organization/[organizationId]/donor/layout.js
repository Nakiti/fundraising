"use client";
import { DonorProvider } from "@/app/context/donorContext";
import DonorSidebar from "@/app/components/DonorSidebar/donorSidebar";
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
            {isAuthPage ? (
                // For login/register pages, render without sidebar
                <div className="bg-gray-50" style={{ minHeight: "calc(100vh - 80px)" }}>
                    {isClient && children}
                </div>
            )} : (
                // For authenticated pages, render with sidebar
                <div className="flex bg-gray-50" style={{ minHeight: "calc(100vh - 80px)" }}>
                    {/* Sidebar */}
                    {isClient && <DonorSidebar organizationId={organizationId} />}

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto">
                        {isClient && children}
                    </div>
                </div>
            )}
        </DonorProvider>
    );
};

export default DonorLayout;
