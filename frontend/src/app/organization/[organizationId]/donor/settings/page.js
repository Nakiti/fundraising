"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import { FaUser, FaBell, FaShieldAlt, FaDownload, FaTrash } from "react-icons/fa";

const DonorSettings = ({ params }) => {
    const { organizationId } = params;
    const router = useRouter();
    const { donor, updateProfile, getPreferences, updatePreference, loading } = useDonor();
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [preferences, setPreferences] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!donor) {
            router.push(`/organization/${organizationId}/donor/login`);
            return;
        }

        loadSettings();
    }, [donor]);

    const loadSettings = async () => {
        try {
            setPageLoading(true);
            const preferencesData = await getPreferences();
            setPreferences(preferencesData);
            
            // Load profile data
            setFormData({
                firstName: donor?.firstName || "",
                lastName: donor?.lastName || "",
                phone: donor?.phone || "",
                address: donor?.address || "",
                city: donor?.city || "",
                state: donor?.state || "",
                zipCode: donor?.zipCode || ""
            });
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setPageLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePreferenceChange = async (key, value) => {
        try {
            await updatePreference(key, value);
            setPreferences(prev => ({
                ...prev,
                [key]: value
            }));
        } catch (error) {
            console.error('Error updating preference:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSaveLoading(true);
            const result = await updateProfile(formData);
            
            if (result.success) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        loadSettings(); // Reset to original data
    };

    if (loading || pageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    if (!donor) {
        return null;
    }

    return (
        <div className="h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Settings */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FaUser className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                                            <p className="text-sm text-gray-500">Update your personal details</p>
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={donor.email}
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 sm:text-sm"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Email address cannot be changed</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                            }`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                            }`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="bg-white text-gray-700 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saveLoading}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                            >
                                                {saveLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Preferences & Actions */}
                    <div className="space-y-6">
                        {/* Communication Preferences */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FaBell className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                        <p className="text-sm text-gray-500">Communication preferences</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email Updates</p>
                                        <p className="text-sm text-gray-500">Receive campaign updates</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.emailUpdates !== 'false'}
                                            onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked.toString())}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Event Invitations</p>
                                        <p className="text-sm text-gray-500">Get notified about events</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={preferences.eventInvitations !== 'false'}
                                            onChange={(e) => handlePreferenceChange('eventInvitations', e.target.checked.toString())}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <FaShieldAlt className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Account Actions</h3>
                                        <p className="text-sm text-gray-500">Manage your account</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-3">
                                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <FaDownload className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">Download Data</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <FaTrash className="w-4 h-4 text-red-400" />
                                        <span className="text-sm font-medium text-red-600">Delete Account</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonorSettings;
