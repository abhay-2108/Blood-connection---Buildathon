"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion, useInView } from "framer-motion"
import { Hospital, MapPin, Droplets, Save, TrendingUp, AlertCircle, CheckCircle, BarChart3 } from "lucide-react"

const HospitalDashboard = () => {
  const [inventory, setInventory] = useState({
    aPositive: 0,
    aNegative: 0,
    bPositive: 0,
    bNegative: 0,
    abPositive: 0,
    abNegative: 0,
    oPositive: 0,
    oNegative: 0,
  })
  const [loading, setLoading] = useState(true)
  const [updateStatus, setUpdateStatus] = useState({
    message: "",
    error: false,
  })
  const [hospital, setHospital] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    toast.success("Hospital logged in successfully!", {
      duration: 3000,
      style: {
        background: "linear-gradient(135deg, #10b981, #059669)",
        color: "white",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.2)",
      },
    })

    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/hospitals/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setInventory(response.data.inventory || {})
      setHospital(response.data || null)
      setLoading(false)
    } catch (err) {
      console.error("Profile fetch error:", err)
      setLoading(false)
    }
  }

  const handleUpdateInventory = async () => {
    try {
      setUpdating(true)
      setUpdateStatus({ message: "Updating inventory...", error: false })

      const response = await axios.put("http://localhost:5000/api/hospitals/inventory", inventory, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.inventory) {
        setInventory(response.data.inventory)
      }

      setUpdateStatus({
        message: "Inventory updated successfully!",
        error: false,
      })
      toast.success("Inventory updated successfully!", {
        style: {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "white",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      })

      setTimeout(() => {
        setUpdateStatus({ message: "", error: false })
      }, 3000)
    } catch (err) {
      console.error("Update error:", err)
      setUpdateStatus({
        message: err.response?.data?.message || "Failed to update inventory",
        error: true,
      })
      toast.error("Failed to update inventory", {
        style: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          color: "white",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.2)",
        },
      })
    } finally {
      setUpdating(false)
    }
  }

  const AnimatedSection = ({ children, delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    )
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return {
        status: "Out of Stock",
        color: "text-red-400",
        bgColor: "bg-red-500/20",
      }
    if (quantity < 10)
      return {
        status: "Critical",
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
      }
    if (quantity < 20)
      return {
        status: "Low",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
      }
    return {
      status: "Good",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
    }
  }

  const bloodTypeDisplayNames = {
    aPositive: "A+",
    aNegative: "A-",
    bPositive: "B+",
    bNegative: "B-",
    abPositive: "AB+",
    abNegative: "AB-",
    oPositive: "O+",
    oNegative: "O-",
  }

  const totalUnits = Object.values(inventory).reduce((sum, units) => sum + (Number.parseInt(units) || 0), 0)
  const criticalTypes = Object.entries(inventory).filter(([_, quantity]) => quantity < 10).length
  const outOfStock = Object.entries(inventory).filter(([_, quantity]) => quantity === 0).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(37,99,235,0.2),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-32 pb-20">
        {/* Hospital Header */}
        <AnimatedSection>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg"
                  >
                    <Hospital className="w-10 h-10 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {hospital?.hospitalName || "Hospital Dashboard"}
                    </h1>
                    <div className="flex items-center text-white/80 mb-4">
                      <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                      <span className="text-lg">
                        {hospital?.location?.city || "City"}, {hospital?.location?.state || "State"}
                      </span>
                    </div>
                    <motion.button
                      onClick={() => (window.location.href = "/blood-predictor")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center"
                    >
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Blood Donation Predictor
                    </motion.button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{totalUnits}</div>
                  <div className="text-white/70">Total Units</div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Stats Overview */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{totalUnits}</div>
                <div className="text-white/70">Total Blood Units</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{criticalTypes}</div>
                <div className="text-white/70">Critical Stock Types</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{outOfStock}</div>
                <div className="text-white/70">Out of Stock</div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Update Status */}
        {updateStatus.message && (
          <AnimatedSection>
            <div className="max-w-7xl mx-auto px-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl flex items-center ${
                  updateStatus.error
                    ? "bg-red-500/20 border border-red-400/30 text-red-400"
                    : "bg-emerald-500/20 border border-emerald-400/30 text-emerald-400"
                }`}
              >
                {updateStatus.error ? (
                  <AlertCircle className="w-5 h-5 mr-2" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2" />
                )}
                {updateStatus.message}
              </motion.div>
            </div>
          </AnimatedSection>
        )}

        {/* Blood Inventory Grid */}
        <AnimatedSection delay={0.4}>
          <div className="max-w-7xl mx-auto px-6 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Droplets className="w-8 h-8 text-red-400 mr-3" />
                Blood Inventory Management
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(inventory).map(([type, quantity], index) => {
                const stockInfo = getStockStatus(quantity)
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Droplets className="w-6 h-6 text-red-400 mr-2" />
                        <h3 className="text-xl font-bold text-white">{bloodTypeDisplayNames[type]}</h3>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${stockInfo.bgColor} ${stockInfo.color}`}
                      >
                        {stockInfo.status}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white mb-1">{quantity}</div>
                      <div className="text-white/70 text-sm">Units Available</div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white/90 text-sm font-medium">Update Quantity</label>
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={quantity}
                        onChange={(e) =>
                          setInventory({
                            ...inventory,
                            [type]: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                        disabled={updating}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Update Button */}
        <AnimatedSection delay={0.6}>
          <div className="max-w-7xl mx-auto px-6">
            <motion.button
              onClick={handleUpdateInventory}
              disabled={updating}
              whileHover={{ scale: updating ? 1 : 1.02 }}
              whileTap={{ scale: updating ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
            >
              {updating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                  />
                  Updating Inventory...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6 mr-3" />
                  Update Blood Inventory
                </>
              )}
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Blood Predictor Button */}
        <AnimatedSection delay={0.8}>
          <div className="max-w-7xl mx-auto px-6 mt-8">
            <motion.button
              onClick={() => (window.location.href = "/blood-predictor")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center text-lg"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Blood Donation Predictor
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default HospitalDashboard
