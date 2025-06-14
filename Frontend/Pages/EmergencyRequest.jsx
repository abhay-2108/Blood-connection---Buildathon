"use client";

import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    AlertTriangle,
    MapPin,
    Clock,
    Phone,
    User,
    Droplet,
    Activity,
    Shield,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const EmergencyRequest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientName: "",
        bloodGroup: "",
        unitsRequired: 1,
        hospitalName: "",
        contactNumber: "",
        urgencyLevel: "high",
        medicalCondition: "",
        location: {
            address: "",
            city: "",
            coordinates: null,
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // Memoize emergency stats to prevent re-renders
    const emergencyStats = useMemo(
        () => ({
            averageResponseTime: "15 minutes",
            successRate: "94%",
            activeRequests: 12,
        }),
        []
    );

    // Auto-detect location with useCallback to prevent re-renders
    const detectLocation = useCallback(() => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        // Reverse geocoding (you'd use a real service like Google Maps API)
                        const mockAddress =
                            "123 Emergency St, Medical District";
                        const mockCity = "Healthcare City";

                        setFormData((prev) => ({
                            ...prev,
                            location: {
                                address: mockAddress,
                                city: mockCity,
                                coordinates: { latitude, longitude },
                            },
                        }));
                        toast.success("Location detected successfully!");
                    } catch (error) {
                        toast.error("Failed to get address details");
                    }
                    setLocationLoading(false);
                },
                (error) => {
                    toast.error(
                        "Location access denied. Please enter manually."
                    );
                    setLocationLoading(false);
                }
            );
        } else {
            toast.error("Geolocation not supported by this browser");
            setLocationLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 2000));

                const requestId = "ER" + Date.now();
                toast.success("Emergency request submitted successfully!");

                // Navigate to success page with state
                navigate("/emergency/success", {
                    state: {
                        requestId,
                        estimatedTime: "15-20 minutes",
                        bloodGroup: formData.bloodGroup,
                        patientName: formData.patientName,
                    },
                });
            } catch (error) {
                console.error("Error submitting emergency request:", error);
                toast.error("Failed to submit request. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData.bloodGroup, formData.patientName, navigate]
    );

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    }, []);

    // Memoize blood groups to prevent re-renders
    const bloodGroups = useMemo(
        () => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        []
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 py-8 px-4 mt-15">
            {/* Emergency Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-8"
            >
                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white shadow-2xl">
                    <div className="flex items-center justify-center mb-4">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                        >
                            <AlertTriangle
                                size={48}
                                className="text-yellow-300"
                            />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl font-bold text-center mb-2">
                        Emergency Blood Request
                    </h1>
                    <p className="text-center text-red-100 text-lg">
                        Fast-track your urgent blood requirement
                    </p>
                </div>
            </motion.div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
                {/* Emergency Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-6"
                >
                    {/* Stats Cards */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-red-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Activity className="mr-2 text-red-600" size={20} />
                            Emergency Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Response Time
                                </span>
                                <span className="font-bold text-green-600">
                                    {emergencyStats.averageResponseTime}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Success Rate
                                </span>
                                <span className="font-bold text-green-600">
                                    {emergencyStats.successRate}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">
                                    Active Requests
                                </span>
                                <span className="font-bold text-orange-600">
                                    {emergencyStats.activeRequests}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Protocol */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 shadow-xl border border-red-200">
                        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                            <Shield className="mr-2" size={20} />
                            Emergency Protocol
                        </h3>
                        <div className="space-y-3 text-sm text-red-700">
                            <div className="flex items-start">
                                <CheckCircle
                                    size={16}
                                    className="mr-2 mt-0.5 text-red-600"
                                />
                                <span>Request processed within 5 minutes</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle
                                    size={16}
                                    className="mr-2 mt-0.5 text-red-600"
                                />
                                <span>
                                    Nearest hospitals notified immediately
                                </span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle
                                    size={16}
                                    className="mr-2 mt-0.5 text-red-600"
                                />
                                <span>Real-time status updates provided</span>
                            </div>
                            <div className="flex items-start">
                                <CheckCircle
                                    size={16}
                                    className="mr-2 mt-0.5 text-red-600"
                                />
                                <span>24/7 emergency support available</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Emergency Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2"
                >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                            <h2 className="text-2xl font-bold text-white">
                                Emergency Request Form
                            </h2>
                            <p className="text-red-100 mt-2">
                                Fill out all required information for fastest
                                processing
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Patient Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <User
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        Patient Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                        placeholder="Enter patient's full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <Droplet
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        Blood Group *
                                    </label>
                                    <select
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                    >
                                        <option value="">
                                            Select Blood Group
                                        </option>
                                        {bloodGroups.map((group) => (
                                            <option key={group} value={group}>
                                                {group}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Units Required *
                                    </label>
                                    <input
                                        type="number"
                                        name="unitsRequired"
                                        value={formData.unitsRequired}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="10"
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Urgency Level *
                                    </label>
                                    <select
                                        name="urgencyLevel"
                                        value={formData.urgencyLevel}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                    >
                                        <option value="critical">
                                            Critical (Life-threatening)
                                        </option>
                                        <option value="high">
                                            High (Surgery scheduled)
                                        </option>
                                        <option value="medium">
                                            Medium (Within 24 hours)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Hospital Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={formData.hospitalName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                        placeholder="Current hospital name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <Phone
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                        placeholder="Emergency contact number"
                                    />
                                </div>
                            </div>

                            {/* Location Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-gray-700 font-medium">
                                        <MapPin
                                            size={16}
                                            className="inline mr-2"
                                        />
                                        Location Information
                                    </label>
                                    <button
                                        type="button"
                                        onClick={detectLocation}
                                        disabled={locationLoading}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {locationLoading ? (
                                            <Loader2
                                                size={16}
                                                className="animate-spin mr-2"
                                            />
                                        ) : (
                                            <MapPin
                                                size={16}
                                                className="mr-2"
                                            />
                                        )}
                                        Detect Location
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="location.address"
                                        value={formData.location.address}
                                        onChange={handleInputChange}
                                        placeholder="Hospital address"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="location.city"
                                        value={formData.location.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Medical Condition */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Medical Condition/Reason
                                </label>
                                <textarea
                                    name="medicalCondition"
                                    value={formData.medicalCondition}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                                    placeholder="Brief description of medical condition or reason for blood requirement"
                                />
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2
                                            size={20}
                                            className="animate-spin mr-2"
                                        />
                                        Submitting Emergency Request...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <AlertTriangle
                                            size={20}
                                            className="mr-2"
                                        />
                                        Submit Emergency Request
                                    </div>
                                )}
                            </motion.button>

                            {/* Emergency Notice */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                                <div className="flex items-start">
                                    <Clock
                                        size={20}
                                        className="text-yellow-600 mr-3 mt-0.5"
                                    />
                                    <div>
                                        <p className="text-yellow-800 font-medium">
                                            Emergency Protocol Active
                                        </p>
                                        <p className="text-yellow-700 text-sm mt-1">
                                            Your request will be processed
                                            immediately. You'll receive
                                            confirmation within 5 minutes and
                                            hospital contact details within 15
                                            minutes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmergencyRequest;
