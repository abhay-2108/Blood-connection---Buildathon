"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
    Heart,
    HandHelping,
    Users,
    ShieldCheck,
    Star,
    Target,
    Eye,
    Award,
    TrendingUp,
} from "lucide-react";
import { useRef } from "react";

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.2, 0.8, 1],
        [0, 1, 1, 0]
    );

    const AnimatedSection = ({ children, delay = 0 }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true, margin: "-100px" });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        );
    };

    const CounterCard = ({ icon: Icon, number, label, color, delay }) => {
        const ref = useRef(null);
        const isInView = useInView(ref, { once: true });

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                    isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                }
                transition={{ duration: 0.6, delay }}
                className="relative group"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                        className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                        <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 2, delay: delay + 0.5 }}
                        className="text-4xl font-bold text-white mb-2"
                    >
                        {number}
                    </motion.h3>
                    <p className="text-white/80 font-medium">{label}</p>
                </div>
            </motion.div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
        >
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
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
                            <Heart className="w-5 h-5 text-red-400 mr-2" />
                            <span className="text-white/90 font-medium">
                                About Our Mission
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Saving Lives
                            </span>
                            <br />
                            <motion.span
                                className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: [
                                        "0% 50%",
                                        "100% 50%",
                                        "0% 50%",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                Together
                            </motion.span>
                        </h1>

                        <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
                            We are dedicated to creating a world where no life
                            is lost due to blood shortage. Our platform connects
                            generous donors with those in critical need,
                            building a community of heroes who save lives every
                            day.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Stats Section */}
                <AnimatedSection delay={0.3}>
                    <div className="max-w-6xl mx-auto px-6 mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <CounterCard
                                icon={Users}
                                number="10,000+"
                                label="Lives Saved"
                                color="bg-gradient-to-r from-red-500 to-red-600"
                                delay={0.1}
                            />
                            <CounterCard
                                icon={Heart}
                                number="5,000+"
                                label="Active Donors"
                                color="bg-gradient-to-r from-pink-500 to-pink-600"
                                delay={0.2}
                            />
                            <CounterCard
                                icon={ShieldCheck}
                                number="200+"
                                label="Partner Hospitals"
                                color="bg-gradient-to-r from-emerald-500 to-emerald-600"
                                delay={0.3}
                            />
                            <CounterCard
                                icon={Award}
                                number="50+"
                                label="Cities Covered"
                                color="bg-gradient-to-r from-blue-500 to-blue-600"
                                delay={0.4}
                            />
                        </div>
                    </div>
                </AnimatedSection>

                {/* Mission & Vision */}
                <AnimatedSection delay={0.4}>
                    <div className="max-w-6xl mx-auto px-6 mb-20">
                        <div className="grid md:grid-cols-2 gap-12">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Our Mission
                                    </h2>
                                </div>
                                <p className="text-white/80 text-lg leading-relaxed">
                                    To create a reliable and accessible network
                                    for blood and organ donation, making the
                                    process easy, safe, and efficient for donors
                                    and recipients. We strive to eliminate blood
                                    shortages and save lives through technology
                                    and community engagement.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-500"
                            >
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Our Vision
                                    </h2>
                                </div>
                                <p className="text-white/80 text-lg leading-relaxed">
                                    To ensure no one suffers due to a lack of
                                    blood or organ availability by connecting
                                    heroes (donors) with those in need. We
                                    envision a world where every person has
                                    access to life-saving blood when they need
                                    it most.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>

                {/* How It Works */}
                <AnimatedSection delay={0.5}>
                    <div className="max-w-6xl mx-auto px-6 mb-20">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-white mb-6">
                                How It Works
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                                Our simple three-step process makes blood
                                donation accessible and efficient
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Heart,
                                    title: "Register as a Donor",
                                    description:
                                        "Sign up and choose to donate blood or organs. Your registration can help save lives.",
                                    color: "from-red-500 to-red-600",
                                    step: "01",
                                },
                                {
                                    icon: HandHelping,
                                    title: "Find a Match",
                                    description:
                                        "Our platform securely connects donors with those in need based on location and compatibility.",
                                    color: "from-blue-500 to-blue-600",
                                    step: "02",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Safe & Secure Donation",
                                    description:
                                        "We ensure a medically safe process, working with verified hospitals and professionals.",
                                    color: "from-emerald-500 to-emerald-600",
                                    step: "03",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.2,
                                    }}
                                    whileHover={{ scale: 1.05, y: -10 }}
                                    className="relative group"
                                >
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:bg-white/20 transition-all duration-500 h-full">
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {item.step}
                                        </div>

                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.8 }}
                                            className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                                        >
                                            <item.icon className="w-8 h-8 text-white" />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold text-white mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-white/80 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Why Choose Us */}
                <AnimatedSection delay={0.6}>
                    <div className="max-w-6xl mx-auto px-6 mb-20">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-bold text-white mb-6">
                                Why Choose Us?
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">
                                We're committed to excellence in every aspect of
                                our service
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: Users,
                                    title: "Trusted Community",
                                    description:
                                        "Thousands of donors and hospitals rely on us for lifesaving connections.",
                                    color: "from-blue-500 to-blue-600",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Secure & Verified",
                                    description:
                                        "We prioritize security, working only with accredited medical institutions.",
                                    color: "from-emerald-500 to-emerald-600",
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Life-Saving Impact",
                                    description:
                                        "Every donation has the power to save multiple lives.",
                                    color: "from-red-500 to-red-600",
                                },
                                {
                                    icon: Star,
                                    title: "User-Friendly Platform",
                                    description:
                                        "Our seamless interface makes donating and finding donors easy.",
                                    color: "from-purple-500 to-purple-600",
                                },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:bg-white/20 transition-all duration-500"
                                >
                                    <motion.div
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.8 }}
                                        className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                    >
                                        <item.icon className="w-7 h-7 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>

                {/* Call to Action */}
                <AnimatedSection delay={0.7}>
                    <div className="text-center px-6">
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
                                <Heart className="w-10 h-10 text-white" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Join Us & Save Lives Today!
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Become a donor or request a donation – together,
                                we can make a difference. Sign up and be part of
                                the change that truly matters.
                            </p>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <a
                                    href="/signup"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-red-500/25 transition-all duration-300 border border-red-400/50"
                                >
                                    <Heart className="w-5 h-5 mr-2" />
                                    Sign Up Now
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
    );
};

export default About;
