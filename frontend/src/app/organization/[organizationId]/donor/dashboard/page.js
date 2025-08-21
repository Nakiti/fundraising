"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import { FaDollarSign, FaChartLine, FaCalendarAlt, FaHeart, FaDownload, FaCog, FaUser } from "react-icons/fa";

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
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center bg-gray-50" style={{ minHeight: "calc(100vh - 80px)" }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!donor) {
        return null; // Will redirect to login via useEffect
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    footer {
                        display: none !important;
                    }
                `
            }} />

            <div className="bg-gray-50" style={{ minHeight: "calc(100vh - 80px)" }}>
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {donor.firstName}!
                        </h1>
                        <p className="text-gray-600 mt-1">Here's your donation overview and recent activity</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Donations</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {summary?.total_donations || 0}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Lifetime contributions</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaHeart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Amount</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(summary?.total_amount)}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Impact generated</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaDollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Last Donation</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {summary?.last_donation ? formatDate(summary.last_donation) : 'Never'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Most recent activity</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaCalendarAlt className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                    <FaUser className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="ml-4 text-left">
                                    <p className="text-sm font-medium text-gray-900">Update Profile</p>
                                    <p className="text-sm text-gray-500">Manage your information</p>
                                </div>
                            </button>

                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <FaCog className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="ml-4 text-left">
                                    <p className="text-sm font-medium text-gray-900">Preferences</p>
                                    <p className="text-sm text-gray-500">Communication settings</p>
                                </div>
                            </button>

                            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                                    <FaDownload className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="ml-4 text-left">
                                    <p className="text-sm font-medium text-gray-900">Download Receipts</p>
                                    <p className="text-sm text-gray-500">Tax documentation</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Donations</h3>
                    </div>
                    <div className="overflow-hidden">
                        {donations.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaHeart className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                                <p className="text-gray-500 mb-6">Start making a difference today!</p>
                                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Make Your First Donation
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Campaign
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Designation
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {donations.slice(0, 10).map((donation) => (
                                            <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(donation.donation_date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {donation.campaign_name || 'General'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {donation.designation_name || 'General'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {formatCurrency(donation.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                                        donation.payment_status === 'completed' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : donation.payment_status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {donation.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default DonorDashboard;
