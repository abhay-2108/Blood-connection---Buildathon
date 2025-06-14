"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, CheckCircle, AlertCircle } from "lucide-react"

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ message: "", type: "" }) // type: 'success' | 'error'
  const [errors, setErrors] = useState({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      // Clear feedback when user starts typing
      if (feedback.message) {
        setFeedback({ message: "", type: "" })
      }
    },
    [feedback.message],
  )

  const validate = useCallback(() => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.email.trim()) newErrors.email = "Email is required"
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid email"
    if (!form.message.trim()) newErrors.message = "Message is required"
    return newErrors
  }, [form])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setFeedback({ message: "", type: "" })

      const validationErrors = validate()
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setSubmitting(true)

      try {
        console.log("📤 Sending contact form data:", form)

        const response = await fetch("http://https://blood-donation-backend-b325.onrender.com/api/contact/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            subject: `Contact Form Message from ${form.name}`,
            type: "contact_form",
          }),
        })

        console.log("📡 Response status:", response.status)
        console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

        // Check if response is ok
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Contact service not found. Please try again later.")
          } else if (response.status === 500) {
            throw new Error("Server error. Please try again later.")
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }

        // Check if response is JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          console.error("❌ Invalid response format:", await response.text())
          throw new Error("Invalid response format from server")
        }

        const result = await response.json()
        console.log("✅ Success response:", result)

        if (result.success) {
          setFeedback({
            message: result.message || "Thank you for contacting us! We'll get back to you soon.",
            type: "success",
          })
          setForm({ name: "", email: "", message: "" })
        } else {
          throw new Error(result.message || "Failed to send message")
        }
      } catch (error) {
        console.error("❌ Contact form error:", error)

        let errorMessage = "Failed to send message. "

        if (error.message.includes("Failed to fetch")) {
          errorMessage += "Please check your internet connection and try again."
        } else if (error.message.includes("Contact service not found")) {
          errorMessage += "The contact service is currently unavailable."
        } else if (error.message.includes("Server error")) {
          errorMessage += "There was a server error. Please try again in a few minutes."
        } else {
          errorMessage += error.message || "Please try again."
        }

        setFeedback({
          message: errorMessage,
          type: "error",
        })
      } finally {
        setSubmitting(false)
      }
    },
    [form, validate],
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

  // Memoize contact info to prevent re-renders
  const contactInfo = useMemo(
    () => [
      {
        icon: MapPin,
        title: "Visit Us",
        details: "123 Donation Street, Chennai, TN",
        color: "from-blue-500 to-blue-600",
      },
      {
        icon: Mail,
        title: "Email Us",
        details: "support@bloodconnection.com",
        color: "from-red-500 to-red-600",
      },
      {
        icon: Phone,
        title: "Call Us",
        details: "+91 1234567890",
        color: "from-emerald-500 to-emerald-600",
      },
      {
        icon: Clock,
        title: "Available",
        details: "24/7 Emergency Support",
        color: "from-purple-500 to-purple-600",
      },
    ],
    [],
  )

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
              <MessageCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-white/90 font-medium">Get In Touch</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Contact
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
                Us
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Need help or have questions? We're here to assist you 24/7. Reach out to us and join our mission to save
              lives together.
            </p>
          </div>
        </SimpleAnimatedSection>

        {/* Contact Info Cards */}
        <SimpleAnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto px-6 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
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
                    className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <info.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                  <p className="text-white/80">{info.details}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </SimpleAnimatedSection>

        {/* Contact Form & Map Section */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form - NO AnimatedSection wrapper to prevent pop effect */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Send Message</h2>
              </div>

              {/* Form without AnimatedSection wrapper */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.name ? "border-red-400" : ""
                    }`}
                    placeholder="Enter your name"
                    disabled={submitting}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 ${
                      errors.email ? "border-red-400" : ""
                    }`}
                    placeholder="Enter your email"
                    disabled={submitting}
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Your Message</label>
                  <textarea
                    rows="5"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 resize-none ${
                      errors.message ? "border-red-400" : ""
                    }`}
                    placeholder="Type your message here..."
                    disabled={submitting}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.message}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02 }}
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {feedback.message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center flex items-center justify-center ${
                      feedback.type === "success" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {feedback.type === "success" ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    {feedback.message}
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Map & Additional Info */}
            <SimpleAnimatedSection delay={0.6}>
              <div className="space-y-8">
                {/* Map */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Find Us</h2>
                  </div>

                  <div className="w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                      className="w-full h-full"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093666!2d144.95373531590413!3d-37.81627974202102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf4c34d27541dc9ff!2sBloodConnection%20Blood%20Bank!5e0!3m2!1sen!2s!4v1646997748000!5m2!1sen!2s"
                      allowFullScreen=""
                      loading="lazy"
                      title="BloodConnection Location"
                    />
                  </div>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "Facebook",
                        href: "https://facebook.com/bloodconnection_bob",
                        color: "from-blue-600 to-blue-700",
                      },
                      {
                        name: "Twitter",
                        href: "https://twitter.com/bloodconnection_bob",
                        color: "from-sky-500 to-sky-600",
                      },
                      {
                        name: "Instagram",
                        href: "https://instagram.com/bloodconnection_bob",
                        color: "from-pink-500 to-pink-600",
                      },
                      {
                        name: "LinkedIn",
                        href: "https://linkedin.com/bloodconnection_bob",
                        color: "from-blue-700 to-blue-800",
                      },
                    ].map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gradient-to-r ${social.color} text-white px-4 py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-lg transition-all duration-300`}
                      >
                        {social.name}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </SimpleAnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
