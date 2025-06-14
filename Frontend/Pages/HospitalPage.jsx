"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Phone,
    Star,
    Clock,
    Activity,
    Heart,
    Search,
    Filter,
    ChevronDown,
    Navigation,
    Award,
    Shield,
    Zap,
    Building2,
    CheckCircle,
    X,
} from "lucide-react";

const HospitalPage = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("all");
    const [selectedRating, setSelectedRating] = useState("all");
    const [sortBy, setSortBy] = useState("rating");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState(null);

    // Memoized mock data to prevent re-renders
    const mockHospitals = useMemo(
        () => [
            {
                id: 1,
                name: "City General Hospital",
                address: "123 Medical Center Dr, Downtown",
                city: "New York",
                state: "NY",
                phone: "+1 (555) 123-4567",
                rating: 4.8,
                reviews: 1247,
                distance: 2.3,
                bloodBank: true,
                emergency: true,
                verified: true,
                specialties: ["Cardiology", "Emergency Medicine", "Hematology"],
                bloodInventory: {
                    "A+": 45,
                    "A-": 23,
                    "B+": 38,
                    "B-": 15,
                    "AB+": 12,
                    "AB-": 8,
                    "O+": 67,
                    "O-": 34,
                },
                operatingHours: "24/7",
                lastUpdated: "2 hours ago",
                responseTime: "12 minutes",
                successRate: 96,
                totalDonations: 2847,
                image: "/placeholder.svg?height=200&width=300",
                description:
                    "Leading medical facility with state-of-the-art blood bank and emergency services.",
                facilities: [
                    "Blood Bank",
                    "Emergency Room",
                    "ICU",
                    "Laboratory",
                    "Pharmacy",
                ],
                certifications: [
                    "JCI Accredited",
                    "ISO 15189",
                    "AABB Certified",
                ],
            },
            {
                id: 2,
                name: "Metro Medical Center",
                address: "456 Healthcare Ave, Midtown",
                city: "Los Angeles",
                state: "CA",
                phone: "+1 (555) 987-6543",
                rating: 4.6,
                reviews: 892,
                distance: 4.7,
                bloodBank: true,
                emergency: true,
                verified: true,
                specialties: ["Oncology", "Trauma Surgery", "Blood Disorders"],
                bloodInventory: {
                    "A+": 32,
                    "A-": 18,
                    "B+": 29,
                    "B-": 11,
                    "AB+": 9,
                    "AB-": 5,
                    "O+": 54,
                    "O-": 28,
                },
                operatingHours: "24/7",
                lastUpdated: "1 hour ago",
                responseTime: "15 minutes",
                successRate: 94,
                totalDonations: 1923,
                image: "/placeholder.svg?height=200&width=300",
                description:
                    "Comprehensive medical center specializing in blood disorders and emergency care.",
                facilities: [
                    "Blood Bank",
                    "Cancer Center",
                    "Emergency Room",
                    "Surgery Center",
                ],
                certifications: ["AABB Certified", "CAP Accredited"],
            },
            {
                id: 3,
                name: "Regional Blood Center",
                address: "789 Donor Plaza, Medical District",
                city: "Chicago",
                state: "IL",
                phone: "+1 (555) 456-7890",
                rating: 4.9,
                reviews: 2156,
                distance: 1.8,
                bloodBank: true,
                emergency: false,
                verified: true,
                specialties: [
                    "Blood Banking",
                    "Donor Services",
                    "Transfusion Medicine",
                ],
                bloodInventory: {
                    "A+": 78,
                    "A-": 45,
                    "B+": 62,
                    "B-": 28,
                    "AB+": 21,
                    "AB-": 15,
                    "O+": 95,
                    "O-": 52,
                },
                operatingHours: "6:00 AM - 10:00 PM",
                lastUpdated: "30 minutes ago",
                responseTime: "8 minutes",
                successRate: 98,
                totalDonations: 4521,
                image: "/placeholder.svg?height=200&width=300",
                description:
                    "Premier blood center serving the region with the largest blood inventory.",
                facilities: [
                    "Blood Bank",
                    "Donor Center",
                    "Testing Laboratory",
                    "Mobile Units",
                ],
                certifications: [
                    "AABB Certified",
                    "FDA Registered",
                    "ISO 15189",
                ],
            },
            {
                id: 4,
                name: "University Medical Hospital",
                address: "321 Campus Dr, University District",
                city: "Boston",
                state: "MA",
                phone: "+1 (555) 234-5678",
                rating: 4.7,
                reviews: 1534,
                distance: 3.2,
                bloodBank: true,
                emergency: true,
                verified: true,
                specialties: [
                    "Research",
                    "Teaching Hospital",
                    "Rare Blood Types",
                ],
                bloodInventory: {
                    "A+": 41,
                    "A-": 26,
                    "B+": 35,
                    "B-": 19,
                    "AB+": 14,
                    "AB-": 10,
                    "O+": 58,
                    "O-": 31,
                },
                operatingHours: "24/7",
                lastUpdated: "45 minutes ago",
                responseTime: "10 minutes",
                successRate: 95,
                totalDonations: 3267,
                image: "/placeholder.svg?height=200&width=300",
                description:
                    "Academic medical center with cutting-edge research and comprehensive blood services.",
                facilities: [
                    "Blood Bank",
                    "Research Lab",
                    "Emergency Room",
                    "Teaching Facilities",
                ],
                certifications: [
                    "AABB Certified",
                    "AAHRPP Accredited",
                    "JCI Accredited",
                ],
            },
            {
                id: 5,
                name: "Community Health Center",
                address: "654 Community St, Suburbs",
                city: "Houston",
                state: "TX",
                phone: "+1 (555) 345-6789",
                rating: 4.4,
                reviews: 678,
                distance: 5.9,
                bloodBank: true,
                emergency: false,
                verified: true,
                specialties: [
                    "Community Care",
                    "Preventive Medicine",
                    "Blood Drives",
                ],
                bloodInventory: {
                    "A+": 28,
                    "A-": 15,
                    "B+": 22,
                    "B-": 8,
                    "AB+": 6,
                    "AB-": 4,
                    "O+": 39,
                    "O-": 21,
                },
                operatingHours: "7:00 AM - 9:00 PM",
                lastUpdated: "3 hours ago",
                responseTime: "18 minutes",
                successRate: 92,
                totalDonations: 1456,
                image: "/placeholder.svg?height=200&width=300",
                description:
                    "Community-focused healthcare provider with regular blood donation drives.",
                facilities: [
                    "Blood Bank",
                    "Outpatient Clinic",
                    "Community Programs",
                ],
                certifications: ["AABB Certified", "HRSA Certified"],
            },
        ],
        []
    );

    // Load hospitals data
    useEffect(() => {
        const loadHospitals = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setHospitals(mockHospitals);
            } catch (error) {
                console.error("Error loading hospitals:", error);
            } finally {
                setLoading(false);
            }
        };

        loadHospitals();
    }, [mockHospitals]);

    // Memoized filter and sort logic
    const filteredAndSortedHospitals = useMemo(() => {
        const filtered = hospitals.filter((hospital) => {
            const matchesSearch =
                hospital.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                hospital.city
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                hospital.specialties.some((spec) =>
                    spec.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesCity =
                selectedCity === "all" || hospital.city === selectedCity;
            const matchesRating =
                selectedRating === "all" ||
                hospital.rating >= Number.parseFloat(selectedRating);

            return matchesSearch && matchesCity && matchesRating;
        });

        // Sort hospitals
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating;
                case "distance":
                    return a.distance - b.distance;
                case "name":
                    return a.name.localeCompare(b.name);
                case "inventory":
                    const aTotal = Object.values(a.bloodInventory).reduce(
                        (sum, val) => sum + val,
                        0
                    );
                    const bTotal = Object.values(b.bloodInventory).reduce(
                        (sum, val) => sum + val,
                        0
                    );
                    return bTotal - aTotal;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [hospitals, searchTerm, selectedCity, selectedRating, sortBy]);

    // Get unique cities for filter
    const cities = useMemo(() => {
        const uniqueCities = [...new Set(hospitals.map((h) => h.city))];
        return uniqueCities.sort();
    }, [hospitals]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleCityChange = useCallback((e) => {
        setSelectedCity(e.target.value);
    }, []);

    const handleRatingChange = useCallback((e) => {
        setSelectedRating(e.target.value);
    }, []);

    const handleSortChange = useCallback((e) => {
        setSortBy(e.target.value);
    }, []);

    const toggleFilters = useCallback(() => {
        setShowFilters(!showFilters);
    }, [showFilters]);

    const getBloodStatusColor = useCallback((units) => {
        if (units === 0) return "text-red-600 bg-red-50";
        if (units < 10) return "text-orange-600 bg-orange-50";
        if (units < 20) return "text-yellow-600 bg-yellow-50";
        return "text-green-600 bg-green-50";
    }, []);

    const getBloodStatusText = useCallback((units) => {
        if (units === 0) return "Out of Stock";
        if (units < 10) return "Critical";
        if (units < 20) return "Low";
        return "Available";
    }, []);

    const renderStars = useCallback((rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={
                    i < Math.floor(rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                }
            />
        ));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Loading Hospitals
                    </h2>
                    <p className="text-gray-600">
                        Finding the best healthcare providers near you...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
            >
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="mb-6"
                    >
                        <Building2
                            size={64}
                            className="mx-auto text-blue-200"
                        />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl font-bold mb-4"
                    >
                        Hospital Network
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-blue-100 max-w-3xl mx-auto"
                    >
                        Find trusted healthcare providers with blood banking
                        services near you
                    </motion.p>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100"
                >
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search hospitals, cities, or specialties..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={toggleFilters}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <Filter size={18} />
                            <span>Filters</span>
                            <ChevronDown
                                size={18}
                                className={`transform transition-transform ${
                                    showFilters ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        <div className="text-gray-600">
                            {filteredAndSortedHospitals.length} hospital
                            {filteredAndSortedHospitals.length !== 1 ? "s" : ""}{" "}
                            found
                        </div>
                    </div>

                    {/* Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City
                                    </label>
                                    <select
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="all">All Cities</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Minimum Rating
                                    </label>
                                    <select
                                        value={selectedRating}
                                        onChange={handleRatingChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="all">All Ratings</option>
                                        <option value="4.5">4.5+ Stars</option>
                                        <option value="4.0">4.0+ Stars</option>
                                        <option value="3.5">3.5+ Stars</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="rating">
                                            Highest Rating
                                        </option>
                                        <option value="distance">
                                            Nearest First
                                        </option>
                                        <option value="name">Name (A-Z)</option>
                                        <option value="inventory">
                                            Blood Inventory
                                        </option>
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Hospital Grid */}
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredAndSortedHospitals.map((hospital, index) => (
                        <motion.div
                            key={hospital.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
                        >
                            {/* Hospital Image */}
                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                                <img
                                    src={hospital.image || "/placeholder.svg"}
                                    alt={hospital.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4 flex space-x-2">
                                    {hospital.verified && (
                                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                            <CheckCircle
                                                size={12}
                                                className="mr-1"
                                            />
                                            Verified
                                        </div>
                                    )}
                                    {hospital.emergency && (
                                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                            <Zap size={12} className="mr-1" />
                                            Emergency
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium flex items-center">
                                        <Navigation
                                            size={12}
                                            className="mr-1 text-blue-600"
                                        />
                                        {hospital.distance} km
                                    </div>
                                </div>
                            </div>

                            {/* Hospital Info */}
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                        {hospital.name}
                                    </h3>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(hospital.rating)}
                                        <span className="text-sm font-medium text-gray-600 ml-1">
                                            {hospital.rating} (
                                            {hospital.reviews})
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin
                                            size={16}
                                            className="mr-2 text-blue-500"
                                        />
                                        <span className="text-sm">
                                            {hospital.address}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone
                                            size={16}
                                            className="mr-2 text-green-500"
                                        />
                                        <span className="text-sm">
                                            {hospital.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock
                                            size={16}
                                            className="mr-2 text-orange-500"
                                        />
                                        <span className="text-sm">
                                            {hospital.operatingHours}
                                        </span>
                                    </div>
                                </div>

                                {/* Specialties */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                        {hospital.specialties
                                            .slice(0, 3)
                                            .map((specialty, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        {hospital.specialties.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                                                +
                                                {hospital.specialties.length -
                                                    3}{" "}
                                                more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Blood Inventory Preview */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        <Heart
                                            size={14}
                                            className="mr-1 text-red-500"
                                        />
                                        Blood Availability
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(hospital.bloodInventory)
                                            .slice(0, 4)
                                            .map(([type, units]) => (
                                                <div
                                                    key={type}
                                                    className={`text-center p-2 rounded-lg border ${getBloodStatusColor(
                                                        units
                                                    )}`}
                                                >
                                                    <div className="text-xs font-bold">
                                                        {type}
                                                    </div>
                                                    <div className="text-xs">
                                                        {units}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {hospital.successRate}%
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Success Rate
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-green-600">
                                            {hospital.responseTime}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Response Time
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-purple-600">
                                            {hospital.totalDonations}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Total Donations
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            setSelectedHospital(hospital)
                                        }
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all"
                                    >
                                        View Details
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            window.open(`tel:${hospital.phone}`)
                                        }
                                        className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        <Phone size={16} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredAndSortedHospitals.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <Building2
                            size={64}
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">
                            No Hospitals Found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Try adjusting your search criteria or filters
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCity("all");
                                setSelectedRating("all");
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Hospital Detail Modal */}
            <AnimatePresence>
                {selectedHospital && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedHospital(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {selectedHospital.name}
                                        </h2>
                                        <p className="text-blue-100">
                                            {selectedHospital.address}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSelectedHospital(null)
                                        }
                                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Hospital Image and Basic Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <img
                                            src={
                                                selectedHospital.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={selectedHospital.name}
                                            className="w-full h-64 object-cover rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                {renderStars(
                                                    selectedHospital.rating
                                                )}
                                                <span className="font-medium">
                                                    {selectedHospital.rating} (
                                                    {selectedHospital.reviews}{" "}
                                                    reviews)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin
                                                    size={18}
                                                    className="mr-3 text-blue-500"
                                                />
                                                <span>
                                                    {selectedHospital.address}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Phone
                                                    size={18}
                                                    className="mr-3 text-green-500"
                                                />
                                                <span>
                                                    {selectedHospital.phone}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock
                                                    size={18}
                                                    className="mr-3 text-orange-500"
                                                />
                                                <span>
                                                    {
                                                        selectedHospital.operatingHours
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Activity
                                                    size={18}
                                                    className="mr-3 text-purple-500"
                                                />
                                                <span>
                                                    Last updated:{" "}
                                                    {
                                                        selectedHospital.lastUpdated
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="bg-blue-50 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-blue-600">
                                                    {
                                                        selectedHospital.successRate
                                                    }
                                                    %
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Success Rate
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-green-600">
                                                    {
                                                        selectedHospital.responseTime
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Response Time
                                                </div>
                                            </div>
                                            <div className="bg-purple-50 p-3 rounded-lg">
                                                <div className="text-xl font-bold text-purple-600">
                                                    {
                                                        selectedHospital.totalDonations
                                                    }
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Donations
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        About
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedHospital.description}
                                    </p>
                                </div>

                                {/* Blood Inventory */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <Heart
                                            size={20}
                                            className="mr-2 text-red-500"
                                        />
                                        Blood Inventory
                                    </h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {Object.entries(
                                            selectedHospital.bloodInventory
                                        ).map(([type, units]) => (
                                            <div
                                                key={type}
                                                className={`text-center p-4 rounded-xl border-2 ${getBloodStatusColor(
                                                    units
                                                )}`}
                                            >
                                                <div className="text-lg font-bold">
                                                    {type}
                                                </div>
                                                <div className="text-2xl font-bold my-1">
                                                    {units}
                                                </div>
                                                <div className="text-xs font-medium">
                                                    {getBloodStatusText(units)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Specialties */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Specialties
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedHospital.specialties.map(
                                            (specialty, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                                                >
                                                    {specialty}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                        Facilities
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-2">
                                        {selectedHospital.facilities.map(
                                            (facility, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center text-gray-600"
                                                >
                                                    <CheckCircle
                                                        size={16}
                                                        className="mr-2 text-green-500"
                                                    />
                                                    <span>{facility}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                        <Award
                                            size={20}
                                            className="mr-2 text-yellow-500"
                                        />
                                        Certifications
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedHospital.certifications.map(
                                            (cert, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-medium flex items-center"
                                                >
                                                    <Shield
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {cert}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            window.open(
                                                `tel:${selectedHospital.phone}`
                                            )
                                        }
                                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                                    >
                                        <Phone size={20} />
                                        <span>Call Hospital</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            window.open(
                                                `https://maps.google.com/?q=${encodeURIComponent(
                                                    selectedHospital.address
                                                )}`
                                            )
                                        }
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                                    >
                                        <Navigation size={20} />
                                        <span>Get Directions</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HospitalPage;
