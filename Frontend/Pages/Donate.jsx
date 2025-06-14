"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { toast } from "react-hot-toast"
import { motion, useInView } from "framer-motion"
import { Heart, User, Mail, Phone, MapPin, Droplets, CheckCircle, Shield, Award } from "lucide-react"

const Donate = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    city: "",
    state: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = useCallback((e) => {
    const { name, value } = e.target

    let formattedValue = value

    // Format phone number (remove non-digits for validation, but keep original for display)
    if (name === "phone") {
      // Allow only numbers, spaces, hyphens, and parentheses
      formattedValue = value.replace(/[^\d\s\-$$$$]/g, "")
    }

    // Capitalize first letter of name, city, and state
    if (name === "name" || name === "city" || name === "state") {
      formattedValue = value.charAt(0).toUpperCase() + value.slice(1)
    }

    // Convert email to lowercase
    if (name === "email") {
      formattedValue = value.toLowerCase()
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      // Validate all required fields
      if (!form.name || !form.email || !form.phone || !form.bloodGroup || !form.city || !form.state) {
        toast.error("Please fill in all fields.", {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email)) {
        toast.error("Please enter a valid email address.", {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
        return
      }

      // Basic phone validation (at least 10 digits)
      const phoneRegex = /^\d{10,}$/
      if (!phoneRegex.test(form.phone.replace(/\D/g, ""))) {
        toast.error("Please enter a valid phone number (at least 10 digits).", {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        })
        return
      }

      setSubmitting(true)

      try {
        const response = await fetch("http://https://blood-donation-backend-b325.onrender.com/api/donate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // Success case
        toast.success(data.message || "Registration successful! Thank you for becoming a blood donor.", {
          style: {
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
          duration: 4000,
        })

        // Reset form on success
        setForm({
          name: "",
          email: "",
          phone: "",
          bloodGroup: "",
          city: "",
          state: "",
        })
      } catch (error) {
        console.error("Registration error:", error)

        // Handle different types of errors
        let errorMessage = "Registration failed. Please try again."

        if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and try again."
        } else if (error.message.includes("500")) {
          errorMessage = "Server error. Please try again later."
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid data. Please check your information and try again."
        }

        toast.error(errorMessage, {
          style: {
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.2)",
          },
          duration: 4000,
        })
      } finally {
        setSubmitting(false)
      }
    },
    [form],
  )

  // Simple animation component that doesn't re-trigger on form changes
  const SimpleAnimatedSection = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const benefits = useMemo(
    () => [
      {
        icon: Heart,
        title: "Save Lives",
        description: "One donation can save up to 3 lives",
        color: "from-red-500 to-red-600",
      },
      {
        icon: Shield,
        title: "Free Health Check",
        description: "Complete health screening at donation",
        color: "from-emerald-500 to-emerald-600",
      },
      {
        icon: Award,
        title: "Be a Hero",
        description: "Join our community of life-savers",
        color: "from-blue-500 to-blue-600",
      },
      {
        icon: CheckCircle,
        title: "Safe Process",
        description: "Medically supervised and secure",
        color: "from-purple-500 to-purple-600",
      },
    ],
    [],
  )

  const bloodGroups = useMemo(() => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
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
        {/* Hero Section */}
        <SimpleAnimatedSection>
          <div className="text-center px-6 max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            >
              <Droplets className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-white/90 font-medium">Become a Hero</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Donate
              </span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                Blood
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Join thousands of heroes who save lives every day. Your donation can make the difference between life and
              death for someone in need.
            </p>
          </div>
        </SimpleAnimatedSection>

        {/* Benefits Section */}
        <SimpleAnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Why Donate Blood?</h2>
              <p className="text-white/70 text-lg">Every donation makes a real difference</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/80 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>

        {/* Registration Form - No animation wrapper to prevent re-renders */}
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Register as Blood Donor</h2>
              <p className="text-white/70">Fill out the form below to join our donor community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <User className="w-4 h-4 mr-2 text-red-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter your full name"
                    disabled={submitting}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Mail className="w-4 h-4 mr-2 text-red-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter your email"
                    disabled={submitting}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Phone className="w-4 h-4 mr-2 text-red-400" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter your phone number"
                    disabled={submitting}
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <Droplets className="w-4 h-4 mr-2 text-red-400" />
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    disabled={submitting}
                  >
                    <option value="" className="bg-slate-800">
                      Select Blood Group
                    </option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group} className="bg-slate-800">
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-red-400" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter your city"
                    disabled={submitting}
                  />
                </div>

                {/* State */}
                <div>
                  <label className="flex items-center text-white/90 font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-red-400" />
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter your state"
                    disabled={submitting}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{
                  scale: submitting ? 1 : 1.02,
                }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Registering...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Register as Donor
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Donate
