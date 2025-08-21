"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDonor } from "@/app/context/donorContext";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaTicketAlt } from "react-icons/fa";

const DonorEvents = ({ params }) => {
    const { organizationId } = params;
    const router = useRouter();
    const { donor, loading } = useDonor();
    
    const [events, setEvents] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!donor) {
            router.push(`/organization/${organizationId}/donor/login`);
            return;
        }

        loadEvents();
    }, [donor]);

    const loadEvents = async () => {
        try {
            setPageLoading(true);
            // Mock events data - in real app, this would come from an API
            const mockEvents = [
                {
                    id: 1,
                    title: "Annual Fundraising Gala",
                    description: "Join us for an evening of celebration and giving at our annual fundraising gala.",
                    date: "2024-03-15",
                    time: "18:00",
                    location: "Grand Hotel Ballroom",
                    attendees: 150,
                    maxAttendees: 200,
                    type: "gala",
                    status: "upcoming"
                },
                {
                    id: 2,
                    title: "Community Service Day",
                    description: "A day dedicated to serving our community through various volunteer activities.",
                    date: "2024-02-28",
                    time: "09:00",
                    location: "Community Center",
                    attendees: 75,
                    maxAttendees: 100,
                    type: "volunteer",
                    status: "upcoming"
                },
                {
                    id: 3,
                    title: "Donor Appreciation Luncheon",
                    description: "A special luncheon to thank our valued donors and share our impact stories.",
                    date: "2024-01-20",
                    time: "12:00",
                    location: "Riverside Restaurant",
                    attendees: 45,
                    maxAttendees: 50,
                    type: "appreciation",
                    status: "past"
                }
            ];
            setEvents(mockEvents);
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setPageLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'gala':
                return 'bg-purple-100 text-purple-800';
            case 'volunteer':
                return 'bg-green-100 text-green-800';
            case 'appreciation':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEventTypeIcon = (type) => {
        switch (type) {
            case 'gala':
                return '🎉';
            case 'volunteer':
                return '🤝';
            case 'appreciation':
                return '💝';
            default:
                return '📅';
        }
    };

    const upcomingEvents = events.filter(event => event.status === 'upcoming');
    const pastEvents = events.filter(event => event.status === 'past');

    if (loading || pageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading events...</p>
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
                        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                        <p className="text-gray-600 mt-1">Discover and join upcoming events</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>View Calendar</span>
                    </button>
                </div>
            </div>

            <div className="p-6">
                {/* Upcoming Events */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                    {upcomingEvents.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaCalendarAlt className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                            <p className="text-gray-500">Check back soon for new events and opportunities to get involved.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                                                <p className="text-sm text-gray-500">{formatTime(event.time)}</p>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaUsers className="w-4 h-4 mr-2" />
                                                <span>{event.attendees}/{event.maxAttendees} attendees</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                                                ></div>
                                            </div>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Events */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
                    {pastEvents.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTicketAlt className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No past events</h3>
                            <p className="text-gray-500">You haven't attended any events yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastEvents.map((event) => (
                                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden opacity-75">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event.type)}`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{formatDate(event.date)}</p>
                                                <p className="text-sm text-gray-500">{formatTime(event.time)}</p>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                                        
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaUsers className="w-4 h-4 mr-2" />
                                                <span>{event.attendees} attendees</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Event completed</span>
                                            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                                                Completed
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonorEvents;
