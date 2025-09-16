"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import LoadingSpinner from "../dashboard/components/LoadingSpinner";
import TransactionHeader from "./components/TransactionHeader";
import TransactionFilters from "./components/TransactionFilters";
import TransactionTable from "./components/TransactionTable";

const DonorTransactions = ({ params }) => {
    const { organizationId } = params;
    const router = useRouter();
    const { donor, getDonations, loading } = useDonor();
    
    const [donations, setDonations] = useState([]);
    const [filteredDonations, setFilteredDonations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("");
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!donor) {
            router.push(`/organization/${organizationId}/donor/login`);
            return;
        }

        loadTransactions();
    }, [donor]);

    useEffect(() => {
        filterTransactions();
    }, [donations, searchTerm, statusFilter, dateFilter]);

    const loadTransactions = async () => {
        try {
            setPageLoading(true);
            const donationsData = await getDonations();
            setDonations(donationsData);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setPageLoading(false);
        }
    };

    const filterTransactions = () => {
        let filtered = donations;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(donation => 
                donation.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.designation_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donation.notes?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(donation => donation.status === statusFilter);
        }

        // Date filter
        if (dateFilter) {
            filtered = filtered.filter(donation => {
                const donationDate = new Date(donation.date).toDateString();
                const filterDate = new Date(dateFilter).toDateString();
                return donationDate === filterDate;
            });
        }

        setFilteredDonations(filtered);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Export transactions:', filteredDonations);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading || pageLoading) {
        return <LoadingSpinner message="Loading transactions..." />;
    }

    if (!donor) {
        return null;
    }

    return (
        <div className="h-full bg-gray-50">
            <TransactionHeader onExport={handleExport} />

            <div className="p-6">
                <TransactionFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                />

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                            <p className="text-sm text-gray-500">
                                {filteredDonations.length} of {donations.length} transactions
                            </p>
                        </div>
                    </div>
                    
                    <div className="overflow-hidden">
                        <TransactionTable
                            donations={donations}
                            filteredDonations={filteredDonations}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                            getStatusColor={getStatusColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorTransactions;
