"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar, Clock, MapPin, Info, Users, Sparkles, AlertCircle, Activity, Heart } from "lucide-react"

const API_KEY = "AIzaSyD9wYUNE67azqMmYCUKQQ2ATfOopW8JFNk"
const CALENDAR_ID = "singh0810.akash@gmail.com"

// Dummy events data
const dummyEvents = [
  {
    id: "event-1",
    summary: "Community Blood Drive - City Hospital",
    description:
      "Join us for our monthly community blood drive! We're partnering with City Hospital to collect blood donations for patients in need. All blood types are welcome, and every donation can save up to 3 lives. Free health screening, refreshments, and donation certificates provided.",
    start: {
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    },
    location: "City Hospital, 123 Medical Center Drive, Downtown",
    status: "upcoming",
    organizer: "City Hospital Blood Bank",
    expectedDonors: 150,
    bloodTypesNeeded: ["O+", "O-", "A+", "B+"],
  },
  {
    id: "event-2",
    summary: "Emergency Blood Drive - Trauma Center",
    description:
      "URGENT: We're experiencing a critical shortage of O-negative blood. This emergency drive aims to replenish our emergency reserves. O-negative donors are especially needed, but all blood types are welcome. Walk-ins accepted.",
    start: {
      dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    },
    location: "Metro Trauma Center, 456 Emergency Boulevard, Medical District",
    status: "urgent",
    organizer: "Metro Trauma Center",
    expectedDonors: 200,
    bloodTypesNeeded: ["O-", "O+", "A-", "B-"],
  },
  {
    id: "event-3",
    summary: "University Blood Drive - Student Health Center",
    description:
      "Students, faculty, and staff are invited to participate in our semester blood drive. Special incentives for student donors including priority parking passes and meal vouchers. Pre-registration recommended but walk-ins welcome.",
    start: {
      dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    },
    location: "University Student Health Center, 789 Campus Drive, University District",
    status: "upcoming",
    organizer: "University Health Services",
    expectedDonors: 300,
    bloodTypesNeeded: ["A+", "B+", "AB+", "O+"],
  },
  {
    id: "event-4",
    summary: "Corporate Blood Drive - Tech Park",
    description:
      "Annual corporate blood drive featuring multiple companies in the tech park. Employees from participating companies get time off for donation. Professional medical staff on-site, comfortable donation environment with Wi-Fi and entertainment.",
    start: {
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    },
    location: "Tech Park Community Center, 321 Innovation Way, Tech District",
    status: "upcoming",
    organizer: "Tech Park Association",
    expectedDonors: 250,
    bloodTypesNeeded: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  {
    id: "event-5",
    summary: "Weekend Blood Drive - Community Center",
    description:
      "Family-friendly weekend blood drive with activities for children while parents donate. Free health screenings, blood pressure checks, and cholesterol testing. Refreshments and thank-you gifts for all donors.",
    start: {
      dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    },
    location: "Riverside Community Center, 654 River Road, Riverside",
    status: "upcoming",
    organizer: "Riverside Community Association",
    expectedDonors: 180,
    bloodTypesNeeded: ["O+", "A+", "B+", "AB+"],
  },
  {
    id: "event-6",
    summary: "Mobile Blood Drive - Shopping Mall",
    description:
      "Convenient mobile blood drive at the popular Westfield Shopping Mall. Donors can shop and donate in the same trip! Located near the main entrance for easy access. Extended hours to accommodate busy schedules.",
    start: {
      dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    },
    location: "Westfield Shopping Mall, 987 Retail Plaza, Shopping District",
    status: "upcoming",
    organizer: "Mobile Blood Services",
    expectedDonors: 120,
    bloodTypesNeeded: ["A+", "O+", "B+"],
  },
]

// Ongoing events (currently happening)
const ongoingEvents = [
  {
    id: "ongoing-1",
    summary: "24-Hour Blood Drive Marathon - Central Hospital",
    description:
      "ONGOING: 24-hour continuous blood drive to support our regional blood bank. Medical staff available around the clock. Night shift donors receive special recognition and premium refreshments. Every hour counts!",
    start: {
      dateTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Started 6 hours ago
    },
    end: {
      dateTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // Ends in 18 hours
    },
    location: "Central Hospital, 111 Healthcare Avenue, Medical Center",
    status: "ongoing",
    organizer: "Regional Blood Bank",
    expectedDonors: 500,
    bloodTypesNeeded: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    currentDonors: 287,
  },
  {
    id: "ongoing-2",
    summary: "Weekend Blood Drive - Sports Complex",
    description:
      "ONGOING: Multi-day blood drive at the sports complex during the championship games. Sports fans can donate between games. Special sports-themed thank-you gifts and team merchandise for donors.",
    start: {
      dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Started 2 days ago
    },
    end: {
      dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Ends tomorrow
    },
    location: "Metro Sports Complex, 555 Athletic Drive, Sports District",
    status: "ongoing",
    organizer: "Sports Complex Management",
    expectedDonors: 400,
    bloodTypesNeeded: ["O+", "A+", "B+"],
    currentDonors: 156,
  },
]

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulate API loading time
    const loadEvents = async () => {
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Combine ongoing and upcoming events, sort by date
        const allEvents = [...ongoingEvents, ...dummyEvents].sort((a, b) => {
          const dateA = new Date(a.start.dateTime)
          const dateB = new Date(b.start.dateTime)
          return dateA - dateB
        })

        setEvents(allEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

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

  const getEventStatusBadge = (event) => {
    if (event.status === "ongoing") {
      return (
        <div className="flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-400/30">
          <Activity className="w-3 h-3 mr-1 animate-pulse" />
          LIVE NOW
        </div>
      )
    } else if (event.status === "urgent") {
      return (
        <div className="flex items-center px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-400/30">
          <AlertCircle className="w-3 h-3 mr-1 animate-pulse" />
          URGENT
        </div>
      )
    } else {
      return (
        <div className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-400/30">
          <Calendar className="w-3 h-3 mr-1" />
          UPCOMING
        </div>
      )
    }
  }

  const formatEventTime = (event) => {
    const startDate = new Date(event.start.dateTime)
    const now = new Date()

    if (event.status === "ongoing") {
      const endDate = new Date(event.end.dateTime)
      const hoursLeft = Math.ceil((endDate - now) / (1000 * 60 * 60))
      return `${hoursLeft} hours remaining`
    } else {
      return startDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-white/20 border-t-red-500 rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl">Loading events...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Events</h2>
          <p className="text-white/70">{error}</p>
        </motion.div>
      </div>
    )
  }

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
              <Calendar className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-white/90 font-medium">Blood Drive Events</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                Blood Drive
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
                Events
              </motion.span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Join our blood donation events and help save lives in your community. Every event is an opportunity to
              make a real difference.
            </p>
          </div>
        </AnimatedSection>

        {/* Events List */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-6xl mx-auto px-6">
            {events.length > 0 ? (
              <div className="space-y-8">
                {events.map((event, index) => {
                  return (
                    <motion.div
                      key={event.id}
                      initial={{
                        opacity: 0,
                        x: index % 2 === 0 ? -50 : 50,
                      }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                      }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`backdrop-blur-xl border rounded-3xl p-8 hover:bg-white/20 transition-all duration-500 shadow-2xl ${
                        event.status === "ongoing"
                          ? "bg-green-500/10 border-green-400/30"
                          : event.status === "urgent"
                            ? "bg-red-500/10 border-red-400/30"
                            : "bg-white/10 border-white/20"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-grow">
                          <div className="flex items-start mb-6">
                            <motion.div
                              whileHover={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 0.8,
                              }}
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 shadow-lg flex-shrink-0 ${
                                event.status === "ongoing"
                                  ? "bg-gradient-to-r from-green-500 to-green-600"
                                  : event.status === "urgent"
                                    ? "bg-gradient-to-r from-red-500 to-red-600"
                                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                              }`}
                            >
                              {event.status === "ongoing" ? (
                                <Activity className="w-8 h-8 text-white" />
                              ) : (
                                <Calendar className="w-8 h-8 text-white" />
                              )}
                            </motion.div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-3xl font-bold text-white">{event.summary}</h3>
                                {getEventStatusBadge(event)}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="flex items-center text-white/80">
                                  <Calendar className="w-5 h-5 text-red-400 mr-3" />
                                  <span className="font-medium">
                                    {new Date(event.start.dateTime).toLocaleDateString("en-US", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center text-white/80">
                                  <Clock className="w-5 h-5 text-blue-400 mr-3" />
                                  <span className="font-medium">{formatEventTime(event)}</span>
                                </div>

                                <div className="flex items-center text-white/80 md:col-span-2">
                                  <MapPin className="w-5 h-5 text-emerald-400 mr-3" />
                                  <span className="font-medium">{event.location}</span>
                                </div>
                              </div>

                              {/* Event Stats */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <div className="text-lg font-bold text-white">
                                    {event.currentDonors || 0}/{event.expectedDonors}
                                  </div>
                                  <div className="text-xs text-white/70">Donors</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                  <div className="text-lg font-bold text-white">{event.bloodTypesNeeded.length}</div>
                                  <div className="text-xs text-white/70">Blood Types</div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center md:col-span-2">
                                  <div className="text-sm font-medium text-white mb-1">Needed Types</div>
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {event.bloodTypesNeeded.map((type) => (
                                      <span
                                        key={type}
                                        className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-400/30"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center mb-3">
                              <Info className="w-5 h-5 text-yellow-400 mr-2" />
                              <h4 className="text-lg font-semibold text-white">Event Details</h4>
                            </div>
                            <p className="text-white/70 leading-relaxed mb-3">{event.description}</p>
                            <div className="text-sm text-white/60">
                              <strong>Organizer:</strong> {event.organizer}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                            }}
                            whileTap={{
                              scale: 0.95,
                            }}
                            className={`w-full lg:w-auto text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center ${
                              event.status === "ongoing"
                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                : event.status === "urgent"
                                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            }`}
                          >
                            {event.status === "ongoing" ? (
                              <>
                                <Heart className="w-5 h-5 mr-2" />
                                Donate Now
                              </>
                            ) : (
                              <>
                                <Users className="w-5 h-5 mr-2" />
                                Register
                              </>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Calendar className="w-10 h-10 text-white" />
                </motion.div>
                <h4 className="text-3xl font-bold text-white mb-4">No Upcoming Events</h4>
                <p className="text-white/70 text-lg">
                  Stay tuned for upcoming blood donation events in your area. Follow us on social media for updates!
                </p>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection delay={0.4}>
          <div className="text-center px-6 mt-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-red-500/20 via-purple-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Want to Host an Event?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                Partner with us to organize blood donation drives in your community. Together, we can save more lives
                and make a bigger impact.
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-400/50"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Contact Us
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="ml-2"
                  >
                    →
                  </motion.div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}

export default Events
