"use client"

import React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Activity,
  Heart,
  Award,
  Clock,
  Navigation,
  Filter,
  Search,
  Star,
  AlertCircle,
  Eye,
  LogOut,
  Settings,
} from "lucide-react"
import axios from "axios"

// Memoized components to prevent re-renders
const StatCard = React.memo(({ title, value, icon: Icon, color, bgColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`${bgColor} rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${color} bg-white/20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-white/80">{title}</div>
        </div>
      </div>
    </div>
  </motion.div>
))

const ActivityItem = React.memo(({ activity, index }) => {
  const getActivityIcon = useCallback((type) => {
    switch (type) {
      case "donation":
        return Heart
      case "request":
        return AlertCircle
      case "appointment":
        return Calendar
      default:
        return Activity
    }
  }, [])

  const getActivityColor = useCallback((type) => {
    switch (type) {
      case "donation":
        return "text-red-400 bg-red-500/20"
      case "request":
        return "text-orange-400 bg-orange-500/20"
      case "appointment":
        return "text-blue-400 bg-blue-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }, [])

  const Icon = getActivityIcon(activity.type)
  const colorClass = getActivityColor(activity.type)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-lg ${colorClass} mr-3`}>
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{activity.description}</p>
          <p className="text-xs text-white/60 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
          <span
            className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
              activity.status === "completed"
                ? "bg-green-500/20 text-green-400"
                : activity.status === "fulfilled"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {activity.status}
          </span>
        </div>
      </div>
    </motion.div>
  )
})

const HospitalCard = React.memo(({ hospital, index, onViewHospital }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 + index * 0.1 }}
    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:border-red-400/50 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
          {hospital.name}
        </h3>
        <div className="flex items-center text-sm text-white/70 mb-2">
          <MapPin size={14} className="mr-2 text-red-400" />
          {hospital.distance} miles away
        </div>
        <div className="flex items-center text-sm text-white/70">
          <Star size={14} className="mr-2 text-yellow-400" />
          {hospital.rating}/5.0
        </div>
      </div>
      {hospital.emergencyServices && (
        <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-400/30">
          Emergency
        </span>
      )}
    </div>

    <div className="mb-4">
      <p className="text-sm text-white/70 mb-2">{hospital.address}</p>
      <p className="text-sm text-white/70">Available: {hospital.availability}</p>
    </div>

    <div className="mb-6">
      <p className="text-sm font-medium text-white/90 mb-2">Available Blood Types:</p>
      <div className="flex flex-wrap gap-2">
        {hospital.bloodTypes.map((type) => (
          <span
            key={type}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30"
          >
            {type}
          </span>
        ))}
      </div>
    </div>

    <div className="flex space-x-2">
      <button
        onClick={() => onViewHospital(hospital.id)}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center min-h-[48px] shadow-lg hover:shadow-xl"
      >
        <Eye size={16} className="mr-2" />
        View Details
      </button>
      <button
        onClick={() => window.open(`tel:${hospital.phone}`)}
        className="bg-green-500/20 text-green-400 py-3 px-4 rounded-xl font-medium hover:bg-green-500/30 transition-all duration-300 border border-green-400/30 min-h-[48px]"
      >
        <Phone size={16} />
      </button>
      <button
        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`)}
        className="bg-blue-500/20 text-blue-400 py-3 px-4 rounded-xl font-medium hover:bg-blue-500/30 transition-all duration-300 border border-blue-400/30 min-h-[48px]"
      >
        <Navigation size={16} />
      </button>
    </div>
  </motion.div>
))

const UserDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // User state
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Dashboard state
  const [hospitals, setHospitals] = useState([])
  const [filteredHospitals, setFilteredHospitals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDistance, setFilterDistance] = useState("all")

  // Memoized static data
  const userStats = useMemo(
    () => ({
      totalDonations: 5,
      livesImpacted: 15,
      nextEligibleDate: "2024-05-15",
      donationStreak: 3,
    }),
    [],
  )

  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        type: "donation",
        description: "Blood donation at City General Hospital",
        date: "2024-02-15",
        status: "completed",
      },
      {
        id: 2,
        type: "request",
        description: "Emergency blood request submitted",
        date: "2024-01-28",
        status: "fulfilled",
      },
      {
        id: 3,
        type: "appointment",
        description: "Donation appointment scheduled",
        date: "2024-01-20",
        status: "completed",
      },
    ],
    [],
  )

  const mockHospitals = useMemo(
    () => [
      {
        id: 1,
        name: "City General Hospital",
        address: "123 Medical Center Dr, New York, NY",
        phone: "+1 (555) 123-4567",
        rating: 4.8,
        distance: 2.3,
        bloodTypes: ["A+", "A-", "B+", "O+", "O-"],
        emergencyServices: true,
        availability: "24/7",
      },
      {
        id: 2,
        name: "Metropolitan Medical Center",
        address: "456 Health Plaza, New York, NY",
        phone: "+1 (555) 234-5678",
        rating: 4.6,
        distance: 3.7,
        bloodTypes: ["A+", "B+", "AB+", "O+"],
        emergencyServices: true,
        availability: "24/7",
      },
      {
        id: 3,
        name: "Community Health Hospital",
        address: "789 Wellness Ave, New York, NY",
        phone: "+1 (555) 345-6789",
        rating: 4.4,
        distance: 5.2,
        bloodTypes: ["A-", "B-", "AB-", "O-"],
        emergencyServices: false,
        availability: "6 AM - 10 PM",
      },
      {
        id: 4,
        name: "Regional Blood Center",
        address: "321 Donation St, New York, NY",
        phone: "+1 (555) 456-7890",
        rating: 4.9,
        distance: 1.8,
        bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        emergencyServices: true,
        availability: "24/7",
      },
    ],
    [],
  )

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userType = localStorage.getItem("userType")

      if (!token || userType !== "user") {
        navigate("/login", { replace: true })
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [navigate])

  useEffect(() => {
    if (token) {
      axios
        .get("http://https://blood-donation-backend-b325.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Error fetching user:", err)
          setUser(null)
          // If token is invalid, redirect to login
          if (err.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("userType")
            localStorage.removeItem("userName")
            navigate("/login", { replace: true })
          }
        })
    }
  }, [token, navigate])

  // Load hospitals
  useEffect(() => {
    if (!isAuthenticated) return

    const loadHospitals = () => {
      setTimeout(() => {
        setHospitals(mockHospitals)
        setFilteredHospitals(mockHospitals)
      }, 1000)
    }

    loadHospitals()
  }, [isAuthenticated, mockHospitals])

  // Filter hospitals
  useEffect(() => {
    let filtered = hospitals

    if (searchTerm) {
      filtered = filtered.filter(
        (hospital) =>
          hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hospital.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterDistance !== "all") {
      const maxDistance = Number.parseFloat(filterDistance)
      filtered = filtered.filter((hospital) => hospital.distance <= maxDistance)
    }

    setFilteredHospitals(filtered)
  }, [searchTerm, filterDistance, hospitals])

  // Memoized callbacks
  const handleEmergencyRequest = useCallback(() => {
    navigate("/emergency")
  }, [navigate])

  const handleViewHospital = useCallback(
    (hospitalId) => {
      navigate(`/hospital/${hospitalId}`)
    },
    [navigate],
  )

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    navigate("/login", { replace: true })
  }, [navigate])

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleFilterChange = useCallback((e) => {
    setFilterDistance(e.target.value)
  }, [])

  // Show loading while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white/70">Loading user profile...</p>
        </div>
      </div>
    )
  }

  // Add this right after the user state check, before the return statement
  if (!user || typeof user !== "object") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white/70">Loading user profile...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 mt-20"
      >
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-purple-700 rounded-2xl p-6 text-white shadow-2xl border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="text-red-100 text-lg">Thank you for being a life-saving hero</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{userStats.totalDonations}</div>
                <div className="text-sm text-red-200">Donations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{userStats.livesImpacted}</div>
                <div className="text-sm text-red-200">Lives Impacted</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
        {/* User Profile & Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">{user.name || "User"}</h3>
              <p className="text-red-300 font-medium">{user.bloodGroup || "Unknown"} Blood Type</p>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center text-white/80 p-3 bg-white/5 rounded-xl">
                <Mail size={16} className="mr-3 text-red-400" />
                {user.email || "Email not provided"}
              </div>
              <div className="flex items-center text-white/80 p-3 bg-white/5 rounded-xl">
                <Phone size={16} className="mr-3 text-red-400" />
                {user.phone || "Phone not provided"}
              </div>
              <div className="flex items-center text-white/80 p-3 bg-white/5 rounded-xl">
                <MapPin size={16} className="mr-3 text-red-400" />
                {typeof user.location === "string"
                  ? user.location
                  : user.location
                    ? `${user.location.city}, ${user.location.state}`
                    : "Location not provided"}
              </div>
              <div className="flex items-center text-white/80 p-3 bg-white/5 rounded-xl">
                <Heart size={16} className="mr-3 text-red-400" />
                Organ Donor: {user.organDonation ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <StatCard
              title="Donation Streak"
              value={userStats.donationStreak}
              icon={Award}
              color="text-yellow-400"
              bgColor="bg-gradient-to-br from-yellow-500/20 to-orange-500/20"
              delay={0.3}
            />
            <StatCard
              title="Next Eligible"
              value={new Date(userStats.nextEligibleDate).toLocaleDateString()}
              icon={Clock}
              color="text-green-400"
              bgColor="bg-gradient-to-br from-green-500/20 to-emerald-500/20"
              delay={0.4}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={handleEmergencyRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[56px] border border-red-500/50"
            >
              <AlertCircle size={20} className="mr-2" />
              Emergency Request
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-h-[56px] border border-blue-500/50"
            >
              <Settings size={20} className="mr-2" />
              Profile Settings
            </motion.button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-400" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hospital Directory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-purple-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Nearby Hospitals & Blood Centers
              </h2>
              <p className="text-red-100">Find hospitals and blood centers in your area</p>
            </div>

            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-red-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm min-h-[48px]"
                  />
                </div>
                <div className="relative">
                  <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <select
                    value={filterDistance}
                    onChange={handleFilterChange}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-red-400/50 focus:outline-none transition-all duration-300 appearance-none backdrop-blur-sm min-h-[48px]"
                  >
                    <option value="all" className="bg-slate-800">
                      All Distances
                    </option>
                    <option value="2" className="bg-slate-800">
                      Within 2 miles
                    </option>
                    <option value="5" className="bg-slate-800">
                      Within 5 miles
                    </option>
                    <option value="10" className="bg-slate-800">
                      Within 10 miles
                    </option>
                  </select>
                </div>
              </div>

              {/* Hospital List */}
              {hospitals.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full"
                  />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredHospitals.map((hospital, index) => (
                    <HospitalCard
                      key={hospital.id}
                      hospital={hospital}
                      index={index}
                      onViewHospital={handleViewHospital}
                    />
                  ))}
                </div>
              )}

              {hospitals.length > 0 && filteredHospitals.length === 0 && (
                <div className="text-center py-12">
                  <MapPin size={48} className="mx-auto text-white/40 mb-4" />
                  <h3 className="text-lg font-semibold text-white/70 mb-2">No hospitals found</h3>
                  <p className="text-white/50">Try adjusting your search criteria or distance filter</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserDashboard
