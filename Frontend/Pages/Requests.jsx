"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Droplet,
    MapPin,
    Phone,
    Calendar,
    Search,
    Eye,
    Download,
    RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [urgencyFilter, setUrgencyFilter] = useState("all");
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Mock data for requests
    const mockRequests = [
        {
            id: "REQ001",
            patientName: "John Smith",
            bloodGroup: "O+",
            unitsRequired: 2,
            urgencyLevel: "critical",
            hospitalName: "City General Hospital",
            contactNumber: "+1 (555) 123-4567",
            location: {
                address: "123 Medical Center Dr",
                city: "New York",
            },
            medicalCondition: "Emergency surgery - car accident",
            status: "pending",
            timestamp: "2024-03-15T10:30:00Z",
            estimatedTime: "15 minutes",
            assignedTo: null,
        },
        {
            id: "REQ002",
            patientName: "Sarah Johnson",
            bloodGroup: "A-",
            unitsRequired: 1,
            urgencyLevel: "high",
            hospitalName: "Metropolitan Medical Center",
            contactNumber: "+1 (555) 234-5678",
            location: {
                address: "456 Health Plaza",
                city: "New York",
            },
            medicalCondition: "Scheduled surgery - organ transplant",
            status: "in_progress",
            timestamp: "2024-03-15T09:15:00Z",
            estimatedTime: "30 minutes",
            assignedTo: "Dr. Williams",
        },
        {
            id: "REQ003",
            patientName: "Michael Brown",
            bloodGroup: "B+",
            unitsRequired: 3,
            urgencyLevel: "medium",
            hospitalName: "Community Health Hospital",
            contactNumber: "+1 (555) 345-6789",
            location: {
                address: "789 Wellness Ave",
                city: "Brooklyn",
            },
            medicalCondition: "Chronic anemia treatment",
            status: "completed",
            timestamp: "2024-03-15T08:00:00Z",
            estimatedTime: "45 minutes",
            assignedTo: "Dr. Davis",
        },
        {
            id: "REQ004",
            patientName: "Emily Wilson",
            bloodGroup: "AB+",
            unitsRequired: 1,
            urgencyLevel: "high",
            hospitalName: "Regional Blood Center",
            contactNumber: "+1 (555) 456-7890",
            location: {
                address: "321 Donation St",
                city: "Queens",
            },
            medicalCondition: "Postpartum hemorrhage",
            status: "cancelled",
            timestamp: "2024-03-15T07:45:00Z",
            estimatedTime: "20 minutes",
            assignedTo: null,
        },
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setRequests(mockRequests);
            setFilteredRequests(mockRequests);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        // Filter requests based on search term and filters
        let filtered = requests;

        if (searchTerm) {
            filtered = filtered.filter(
                (request) =>
                    request.patientName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    request.id
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    request.hospitalName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (request) => request.status === statusFilter
            );
        }

        if (urgencyFilter !== "all") {
            filtered = filtered.filter(
                (request) => request.urgencyLevel === urgencyFilter
            );
        }

        setFilteredRequests(filtered);
    }, [searchTerm, statusFilter, urgencyFilter, requests]);

    const getStatusInfo = (status) => {
        switch (status) {
            case "pending":
                return {
                    icon: Clock,
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    label: "Pending",
                };
            case "in_progress":
                return {
                    icon: RefreshCw,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    label: "In Progress",
                };
            case "completed":
                return {
                    icon: CheckCircle,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    label: "Completed",
                };
            case "cancelled":
                return {
                    icon: XCircle,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    label: "Cancelled",
                };
            default:
                return {
                    icon: Clock,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    label: "Unknown",
                };
        }
    };

    const getUrgencyInfo = (urgency) => {
        switch (urgency) {
            case "critical":
                return {
                    color: "text-red-600",
                    bgColor: "bg-red-100",
                    label: "Critical",
                };
            case "high":
                return {
                    color: "text-orange-600",
                    bgColor: "bg-orange-100",
                    label: "High",
                };
            case "medium":
                return {
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-100",
                    label: "Medium",
                };
            default:
                return {
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                    label: "Low",
                };
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setRequests((prev) =>
                prev.map((req) =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                )
            );

            toast.success(
                `Request ${newStatus.replace("_", " ")} successfully!`
            );
        } catch (error) {
            toast.error("Failed to update request status");
        }
    };

    const exportRequests = () => {
        const csvContent = [
            [
                "ID",
                "Patient",
                "Blood Group",
                "Units",
                "Urgency",
                "Hospital",
                "Status",
                "Date",
            ].join(","),
            ...filteredRequests.map((req) =>
                [
                    req.id,
                    req.patientName,
                    req.bloodGroup,
                    req.unitsRequired,
                    req.urgencyLevel,
                    req.hospitalName,
                    req.status,
                    new Date(req.timestamp).toLocaleDateString(),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "blood_requests.csv";
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success("Requests exported successfully!");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 py-8 px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-8"
            >
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                Blood Requests Management
                            </h1>
                            <p className="text-red-100 text-lg">
                                Monitor and manage all blood requests in
                                real-time
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {requests.length}
                                </div>
                                <div className="text-sm text-red-200">
                                    Total Requests
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">
                                    {
                                        requests.filter(
                                            (r) => r.status === "pending"
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-red-200">
                                    Pending
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto">
                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 mb-8"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search
                                size={20}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search by patient name, request ID, or hospital..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <select
                                value={urgencyFilter}
                                onChange={(e) =>
                                    setUrgencyFilter(e.target.value)
                                }
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
                            >
                                <option value="all">All Urgency</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                            </select>

                            <button
                                onClick={exportRequests}
                                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                                <Download size={20} className="mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Requests List */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredRequests.map((request, index) => {
                            const statusInfo = getStatusInfo(request.status);
                            const urgencyInfo = getUrgencyInfo(
                                request.urgencyLevel
                            );
                            const StatusIcon = statusInfo.icon;

                            return (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                                                <div
                                                    className={`p-3 rounded-full ${statusInfo.bgColor}`}
                                                >
                                                    <StatusIcon
                                                        className={
                                                            statusInfo.color
                                                        }
                                                        size={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        {request.patientName}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        Request ID: {request.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${urgencyInfo.color} ${urgencyInfo.bgColor}`}
                                                >
                                                    {urgencyInfo.label} Priority
                                                </span>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
                                                >
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                            <div className="flex items-center">
                                                <Droplet
                                                    className="text-red-600 mr-3"
                                                    size={20}
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Blood Type
                                                    </p>
                                                    <p className="font-semibold text-gray-800">
                                                        {request.bloodGroup} (
                                                        {request.unitsRequired}{" "}
                                                        units)
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <MapPin
                                                    className="text-blue-600 mr-3"
                                                    size={20}
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Hospital
                                                    </p>
                                                    <p className="font-semibold text-gray-800">
                                                        {request.hospitalName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Phone
                                                    className="text-green-600 mr-3"
                                                    size={20}
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Contact
                                                    </p>
                                                    <p className="font-semibold text-gray-800">
                                                        {request.contactNumber}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Calendar
                                                    className="text-purple-600 mr-3"
                                                    size={20}
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Requested
                                                    </p>
                                                    <p className="font-semibold text-gray-800">
                                                        {new Date(
                                                            request.timestamp
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-2">
                                                Medical Condition
                                            </h4>
                                            <p className="text-gray-600">
                                                {request.medicalCondition}
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            {request.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request.id,
                                                                "in_progress"
                                                            )
                                                        }
                                                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <RefreshCw
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Start Processing
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                request.id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        <XCircle
                                                            size={16}
                                                            className="mr-2"
                                                        />
                                                        Cancel Request
                                                    </button>
                                                </>
                                            )}

                                            {request.status ===
                                                "in_progress" && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            request.id,
                                                            "completed"
                                                        )
                                                    }
                                                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <CheckCircle
                                                        size={16}
                                                        className="mr-2"
                                                    />
                                                    Mark Complete
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    setSelectedRequest(request)
                                                }
                                                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                            >
                                                <Eye
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                View Details
                                            </button>

                                            <button
                                                onClick={() =>
                                                    window.open(
                                                        `tel:${request.contactNumber}`
                                                    )
                                                }
                                                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Phone
                                                    size={16}
                                                    className="mr-2"
                                                />
                                                Call Hospital
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {filteredRequests.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <AlertTriangle
                                    size={48}
                                    className="mx-auto text-gray-400 mb-4"
                                />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                    No requests found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your search criteria or
                                    filters
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
