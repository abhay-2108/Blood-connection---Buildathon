"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    Clock,
    Phone,
    AlertTriangle,
    Heart,
    Activity,
    Users,
    ArrowRight,
    Copy,
} from "lucide-react";
import { toast } from "react-hot-toast";

const EmergencySuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
    const [requestStatus, setRequestStatus] = useState("processing");

    const requestData = useMemo(
        () =>
            location.state || {
                requestId: "ER" + Date.now(),
                estimatedTime: "15-20 minutes",
                bloodGroup: "O+",
                patientName: "Patient",
            },
        [location.state]
    );

    // Countdown timer with useCallback to prevent re-renders
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Simulate status updates with useCallback
    useEffect(() => {
        const statusUpdates = [
            { status: "processing", delay: 0 },
            { status: "hospitals_notified", delay: 30000 }, // 30 seconds
            { status: "responses_received", delay: 120000 }, // 2 minutes
            { status: "match_found", delay: 300000 }, // 5 minutes
        ];

        const timers = statusUpdates.map(({ status, delay }) =>
            setTimeout(() => {
                setRequestStatus(status);
                if (status === "match_found") {
                    toast.success(
                        "Blood match found! Hospital will contact you shortly."
                    );
                }
            }, delay)
        );

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, []);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }, []);

    const copyRequestId = useCallback(() => {
        navigator.clipboard.writeText(requestData.requestId);
        toast.success("Request ID copied to clipboard!");
    }, [requestData.requestId]);

    const getStatusInfo = useCallback(() => {
        switch (requestStatus) {
            case "processing":
                return {
                    title: "Processing Request",
                    description: "Your emergency request is being processed...",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                };
            case "hospitals_notified":
                return {
                    title: "Hospitals Notified",
                    description:
                        "Nearby hospitals have been notified of your request",
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                };
            case "responses_received":
                return {
                    title: "Responses Received",
                    description: "Hospitals are checking blood availability",
                    color: "text-purple-600",
                    bgColor: "bg-purple-50",
                    borderColor: "border-purple-200",
                };
            case "match_found":
                return {
                    title: "Match Found!",
                    description:
                        "Blood match found! Hospital will contact you shortly",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                };
            default:
                return {
                    title: "Processing",
                    description: "Processing your request...",
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                };
        }
    }, [requestStatus]);

    const statusInfo = useMemo(() => getStatusInfo(), [getStatusInfo]);

    const processSteps = useMemo(
        () => [
            {
                step: 1,
                title: "Request Received",
                description: "Your emergency request has been logged",
                status: "completed",
                icon: CheckCircle,
            },
            {
                step: 2,
                title: "Hospitals Notified",
                description: "Nearby hospitals are being contacted",
                status: requestStatus === "processing" ? "active" : "completed",
                icon: Users,
            },
            {
                step: 3,
                title: "Blood Availability Check",
                description: "Hospitals checking blood inventory",
                status: ["responses_received", "match_found"].includes(
                    requestStatus
                )
                    ? "completed"
                    : requestStatus === "hospitals_notified"
                    ? "active"
                    : "pending",
                icon: Heart,
            },
            {
                step: 4,
                title: "Hospital Contact",
                description: "Hospital will contact you directly",
                status:
                    requestStatus === "match_found" ? "completed" : "pending",
                icon: Phone,
            },
        ],
        [requestStatus]
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4 mt-15">
            {/* Success Header */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-4xl mx-auto mb-8"
            >
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-2xl text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="mb-6"
                    >
                        <CheckCircle
                            size={80}
                            className="mx-auto text-green-200"
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl font-bold mb-4"
                    >
                        Emergency Request Submitted!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-xl text-green-100"
                    >
                        Request for {requestData.bloodGroup} blood for{" "}
                        {requestData.patientName} is being processed
                    </motion.p>
                </div>
            </motion.div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                {/* Request Details & Timer */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Countdown Timer */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-100">
                        <div className="text-center">
                            <Clock
                                size={32}
                                className="mx-auto text-green-600 mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Expected Response Time
                            </h3>
                            <motion.div
                                key={timeRemaining}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className="text-4xl font-bold text-green-600 mb-2"
                            >
                                {formatTime(timeRemaining)}
                            </motion.div>
                            <p className="text-gray-600 text-sm">
                                Hospital will contact you within this time
                            </p>
                        </div>
                    </div>

                    {/* Request ID */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Request Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    Request ID:
                                </span>
                                <div className="flex items-center">
                                    <span className="font-mono font-bold text-blue-600">
                                        {requestData.requestId}
                                    </span>
                                    <button
                                        onClick={copyRequestId}
                                        className="ml-2 p-1 hover:bg-gray-100 rounded"
                                        title="Copy Request ID"
                                    >
                                        <Copy
                                            size={16}
                                            className="text-gray-500"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">
                                    Blood Type:
                                </span>
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                    {requestData.bloodGroup}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Priority:</span>
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                    Emergency
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span
                                    className={`px-2 py-1 ${statusInfo.bgColor} ${statusInfo.color} rounded-full text-sm font-medium`}
                                >
                                    {statusInfo.title}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Stats */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-xl border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                            <Activity className="mr-2" size={20} />
                            Live Statistics
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-red-700">
                                    Active Requests
                                </span>
                                <span className="font-bold text-red-800">
                                    12
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-red-700">
                                    Hospitals Notified
                                </span>
                                <span className="font-bold text-red-800">
                                    8
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-red-700">
                                    Success Rate
                                </span>
                                <span className="font-bold text-green-600">
                                    94%
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Process Steps & Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Current Status */}
                    <div
                        className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-2xl p-6 shadow-xl`}
                    >
                        <div className="flex items-center mb-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                }}
                                className={`p-3 ${statusInfo.bgColor} rounded-full mr-4`}
                            >
                                <Activity
                                    className={`${statusInfo.color}`}
                                    size={24}
                                />
                            </motion.div>
                            <div>
                                <h3
                                    className={`text-xl font-bold ${statusInfo.color}`}
                                >
                                    {statusInfo.title}
                                </h3>
                                <p className={`${statusInfo.color} opacity-80`}>
                                    {statusInfo.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            Emergency Process Steps
                        </h3>

                        <div className="space-y-4">
                            {processSteps.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 1.2 + index * 0.1,
                                        }}
                                        className={`flex items-center p-4 rounded-xl border-2 ${
                                            item.status === "completed"
                                                ? "bg-green-50 border-green-200"
                                                : item.status === "active"
                                                ? "bg-blue-50 border-blue-200"
                                                : "bg-gray-50 border-gray-200"
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-full mr-4 ${
                                                item.status === "completed"
                                                    ? "bg-green-100"
                                                    : item.status === "active"
                                                    ? "bg-blue-100"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <Icon
                                                size={20}
                                                className={
                                                    item.status === "completed"
                                                        ? "text-green-600"
                                                        : item.status ===
                                                          "active"
                                                        ? "text-blue-600"
                                                        : "text-gray-400"
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4
                                                className={`font-semibold ${
                                                    item.status === "completed"
                                                        ? "text-green-800"
                                                        : item.status ===
                                                          "active"
                                                        ? "text-blue-800"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Step {item.step}: {item.title}
                                            </h4>
                                            <p
                                                className={`text-sm ${
                                                    item.status === "completed"
                                                        ? "text-green-600"
                                                        : item.status ===
                                                          "active"
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {item.description}
                                            </p>
                                        </div>
                                        {item.status === "active" && (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: "linear",
                                                }}
                                                className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                                            />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Important Instructions */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-xl border border-yellow-200">
                        <div className="flex items-start mb-4">
                            <AlertTriangle
                                size={24}
                                className="text-yellow-600 mr-3 mt-1"
                            />
                            <div>
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                                    Important Instructions
                                </h3>
                                <div className="space-y-2 text-yellow-700">
                                    <p>
                                        • Keep your phone available - hospital
                                        will call you directly
                                    </p>
                                    <p>
                                        • Have your Request ID ready:{" "}
                                        <strong>{requestData.requestId}</strong>
                                    </p>
                                    <p>
                                        • Prepare necessary documents (ID,
                                        medical records)
                                    </p>
                                    <p>
                                        • If no response in 20 minutes, call our
                                        emergency helpline
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowRight size={20} className="mr-2" />
                            Go to Dashboard
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.open("tel:+1234567890")}
                            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors"
                        >
                            <Phone size={20} className="mr-2" />
                            Emergency Helpline
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmergencySuccess;
