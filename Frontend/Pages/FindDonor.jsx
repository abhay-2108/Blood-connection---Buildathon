"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Search, User, MapPin, Heart, Phone, Mail, Filter, Users, Target, X, Send, MessageSquare } from "lucide-react"

const FindDonor = () => {
  const [form, setForm] = useState({ bloodGroup: "", city: "", state: "" })
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  // Email modal state
  const [emailModal, setEmailModal] = useState({ isOpen: false, donor: null })
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    urgency: "normal",
  })
  const [emailSending, setEmailSending] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleEmailFormChange = (e) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setSearched(true)
    setLoading(true)

    try {
      const query = new URLSearchParams(form).toString()
      const response = await fetch(`http://https://blood-donation-backend-b325.onrender.com/api/donors/search?${query}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        console.error("Error:", data.message)
        setResults([])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneClick = (donor) => {
    // Display phone number and initiate call
    const phoneNumber = donor.phone || donor.phoneNumber
    if (phoneNumber) {
      const confirmCall = window.confirm(`Call ${donor.name} at ${phoneNumber}?`)
      if (confirmCall) {
        window.open(`tel:${phoneNumber}`)
      }
    } else {
      alert("Phone number not available for this donor.")
    }
  }

  const handleEmailClick = (donor) => {
    setEmailModal({ isOpen: true, donor })
    setEmailForm({
      subject: `Blood Donation Request - ${donor.bloodGroup} Blood Type`,
      message: `Dear ${donor.name},\n\nI hope this message finds you well. I am reaching out regarding a blood donation request for ${donor.bloodGroup} blood type.\n\nWould you be available to help with a blood donation? Please let me know your availability.\n\nThank you for your time and consideration.\n\nBest regards,`,
      senderName: "",
      senderEmail: "",
      senderPhone: "",
      urgency: "normal",
    })
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setEmailSending(true)

    try {
      const emailData = {
        to: emailModal.donor.email, // Donor's email address
        toName: emailModal.donor.name, // Donor's name
        from: emailForm.senderEmail, // Sender's email
        fromName: emailForm.senderName, // Sender's name
        subject: emailForm.subject,
        message: emailForm.message,
        senderPhone: emailForm.senderPhone,
        urgency: emailForm.urgency,
        donorBloodGroup: emailModal.donor.bloodGroup,
        donorLocation: `${emailModal.donor.city}, ${emailModal.donor.state}`,
      }

      const response = await fetch("http://https://blood-donation-backend-b325.onrender.com/api/donors/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      // Check if the response is ok
      if (!response.ok) {
        // Handle different HTTP status codes
        if (response.status === 404) {
          throw new Error("Email service not available. Please contact support.")
        } else if (response.status === 500) {
          throw new Error("Server error. Please try again later.")
        } else {
          throw new Error(`Request failed with status ${response.status}`)
        }
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format from server")
      }

      const result = await response.json()

      if (result.success) {
        alert(`Email sent successfully to ${emailModal.donor.name} at ${emailModal.donor.email}!`)
        setEmailModal({ isOpen: false, donor: null })
        setEmailForm({
          subject: "",
          message: "",
          senderName: "",
          senderEmail: "",
          senderPhone: "",
          urgency: "normal",
        })
      } else {
        throw new Error(result.message || "Failed to send email")
      }
    } catch (error) {
      console.error("Email send error:", error)

      // Provide user-friendly error messages
      let errorMessage = "Failed to send email. "

      if (error.message.includes("Failed to fetch")) {
        errorMessage += "Please check your internet connection and try again."
      } else if (error.message.includes("Email service not available")) {
        errorMessage += "The email service is currently unavailable. Please try contacting the donor directly."
      } else if (error.message.includes("Server error")) {
        errorMessage += "There was a server error. Please try again in a few minutes."
      } else {
        errorMessage += error.message || "Please try again."
      }

      alert(errorMessage)
    } finally {
      setEmailSending(false)
    }
  }

  const closeEmailModal = () => {
    setEmailModal({ isOpen: false, donor: null })
    setEmailForm({
      subject: "",
      message: "",
      senderName: "",
      senderEmail: "",
      senderPhone: "",
      urgency: "normal",
    })
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

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

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
        <AnimatedSection>
          <div className="text-center px-6 max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            >
              <Target className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-white/90 font-medium">Find Life Savers</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Find
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
                Donors
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Connect with generous blood donors in your area. Search by blood type and location to find the help you
              need quickly and efficiently.
            </p>
          </div>
        </AnimatedSection>

        {/* Search Form */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-4xl mx-auto px-6 mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Search Donors</h2>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Blood Group */}
                  <div>
                    <label className="flex items-center text-white/90 font-medium mb-2">
                      <Heart className="w-4 h-4 mr-2 text-red-400" />
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                      className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300"
                    >
                      <option value="" className="bg-slate-800">
                        Any Blood Group
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
                      placeholder="Enter city"
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
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
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
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Donors
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Results Section */}
        <AnimatedSection delay={0.4}>
          <div className="max-w-6xl mx-auto px-6">
            {searched && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 text-red-400 mr-2" />
                  Search Results ({results.length} donors found)
                </h3>

                {results.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4">No Donors Found</h4>
                    <p className="text-white/70 text-lg">
                      No donors match your search criteria. Try adjusting your filters or expanding your search area.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid gap-6">
                    {results.map((donor, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: idx * 0.1,
                        }}
                        whileHover={{
                          scale: 1.02,
                          y: -5,
                        }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-500"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <motion.div
                              whileHover={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 0.8,
                              }}
                              className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
                            >
                              <User className="w-8 h-8 text-white" />
                            </motion.div>

                            <div>
                              <h4 className="text-2xl font-bold text-white mb-2">{donor.name}</h4>
                              <div className="flex items-center space-x-4 text-white/80">
                                <div className="flex items-center">
                                  <Heart className="w-4 h-4 text-red-400 mr-1" />
                                  <span className="font-semibold">{donor.bloodGroup}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 text-blue-400 mr-1" />
                                  <span>
                                    {donor.city}, {donor.state}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              onClick={() => handlePhoneClick(donor)}
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </motion.button>
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                              }}
                              whileTap={{
                                scale: 0.95,
                              }}
                              onClick={() => handleEmailClick(donor)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Email
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {emailModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEmailModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Contact {emailModal.donor?.name}</h3>
                    <p className="text-white/70">
                      {emailModal.donor?.bloodGroup} Blood Type • {emailModal.donor?.city}, {emailModal.donor?.state}
                    </p>
                  </div>
                </div>
                <button onClick={closeEmailModal} className="text-white/70 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      name="senderName"
                      value={emailForm.senderName}
                      onChange={handleEmailFormChange}
                      required
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Your Email *</label>
                    <input
                      type="email"
                      name="senderEmail"
                      value={emailForm.senderEmail}
                      onChange={handleEmailFormChange}
                      required
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Your Phone</label>
                    <input
                      type="tel"
                      name="senderPhone"
                      value={emailForm.senderPhone}
                      onChange={handleEmailFormChange}
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Urgency Level</label>
                    <select
                      name="urgency"
                      value={emailForm.urgency}
                      onChange={handleEmailFormChange}
                      className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                    >
                      <option value="normal" className="bg-slate-800">
                        Normal
                      </option>
                      <option value="urgent" className="bg-slate-800">
                        Urgent
                      </option>
                      <option value="emergency" className="bg-slate-800">
                        Emergency
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={emailForm.subject}
                    onChange={handleEmailFormChange}
                    required
                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300"
                    placeholder="Enter email subject"
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={emailForm.message}
                    onChange={handleEmailFormChange}
                    required
                    rows={6}
                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:bg-white/20 transition-all duration-300 resize-none"
                    placeholder="Enter your message"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={closeEmailModal}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailSending}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {emailSending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FindDonor
