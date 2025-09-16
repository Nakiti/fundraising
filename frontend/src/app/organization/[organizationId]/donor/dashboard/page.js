"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import LoadingSpinner from "./components/LoadingSpinner";
import WelcomeSection from "./components/WelcomeSection";
import SummaryCards from "./components/SummaryCards";
import RecentDonationsTable from "./components/RecentDonationsTable";

const DonorDashboard = ({ params }) => {
    const { organizationId } = params;
    const router = useRouter();
    const { donor, getDonations, getSummary, loading } = useDonor();
    
    const [donations, setDonations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [dashboardLoading, setDashboardLoading] = useState(true);

    useEffect(() => {
        // Only redirect if we're not loading and donor is explicitly null (not authenticated)
        if (!loading && donor === null) {
            router.push(`/organization/${organizationId}/donor/login`);
            return;
        }

        // Only load data if we have a donor and we're not loading
        if (!loading && donor) {
            loadDashboardData();
        }
    }, [donor, loading]);

    const loadDashboardData = async () => {
        try {
            setDashboardLoading(true);
            const [donationsData, summaryData] = await Promise.all([
                getDonations(),
                getSummary()
            ]);
            
            console.log("donationsData", donationsData)
            console.log("summaryData", summaryData)
            setDonations(donationsData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setDashboardLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading || dashboardLoading) {
        return (
            <LoadingSpinner 
                message={loading ? "Checking authentication..." : "Loading your dashboard..."} 
            />
        );
    }

    // Redirect to login if not authenticated
    if (!donor) {
        return null; // Will redirect to login via useEffect
    }

    return (
        <div className="bg-gray-50 h-full">
            <div className="p-6">
                <WelcomeSection 
                    donor={donor} 
                    hasLinkedDonations={donations.length > 0} 
                />
                <SummaryCards 
                    summary={summary} 
                    formatCurrency={formatCurrency} 
                    formatDate={formatDate} 
                />

                {/* Recent Donations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
                    </div>
                    <div className="overflow-hidden">
                        <RecentDonationsTable 
                            donations={donations}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                            onMakeDonation={() => {
                                // TODO: Add navigation to donation form
                                console.log('Navigate to donation form');
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;
