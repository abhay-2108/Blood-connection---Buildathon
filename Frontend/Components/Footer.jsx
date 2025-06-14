"use client";

import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    HeartPulse,
    Send,
    Sparkles,
    ArrowRight,
    Users,
    Building2,
} from "lucide-react";

// Memoized components to prevent re-renders
const FloatingParticle = memo(({ index }) => {
    const particleStyle = useMemo(
        () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
        }),
        []
    );

    const animationProps = useMemo(
        () => ({
            y: [-10, -50, -10],
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.2, 0.8],
        }),
        []
    );

    const transitionProps = useMemo(
        () => ({
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
            ease: "easeInOut",
        }),
        []
    );

    return (
        <motion.div
            className="absolute w-1 h-1 bg-white/40 rounded-full will-change-transform"
            style={particleStyle}
            animate={animationProps}
            transition={transitionProps}
        />
    );
});

const StatCard = memo(({ stat, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="text-center bg-white/8 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:border-red-400/30 transition-all duration-300 cursor-pointer group"
    >
        <div className="text-2xl font-bold text-red-400 group-hover:text-red-300 transition-colors">
            {stat.number}
        </div>
        <div className="text-sm text-white/70 group-hover:text-white/80 transition-colors">
            {stat.label}
        </div>
        <div className="w-8 h-0.5 bg-gradient-to-r from-red-500/0 via-red-400 to-red-500/0 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
));

const QuickLink = memo(({ link, index }) => (
    <motion.li
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ x: 8 }}
        className="group"
    >
        <Link
            to={link.to}
            className="text-white/70 hover:text-red-400 transition-all duration-300 flex items-center py-2 px-3 rounded-lg hover:bg-white/5"
        >
            <motion.span
                className="w-2 h-2 bg-red-400/50 rounded-full mr-3 group-hover:bg-red-400 transition-all duration-300"
                whileHover={{ scale: 1.3 }}
            />
            <span className="font-medium">{link.label}</span>
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0" />
        </Link>
    </motion.li>
));

const ContactItem = memo(({ contact, index }) => (
    <motion.a
        key={index}
        href={contact.href}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ x: 8, scale: 1.02 }}
        className="flex items-center text-white/70 hover:text-red-400 transition-all duration-300 group p-3 rounded-xl hover:bg-white/5"
    >
        <div className="w-12 h-12 bg-white/8 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300 border border-white/10 group-hover:border-red-400/30">
            <contact.icon className="w-5 h-5 group-hover:text-red-300" />
        </div>
        <div>
            <span className="text-sm font-medium block group-hover:text-white transition-colors">
                {contact.text}
            </span>
            <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                {contact.label}
            </span>
        </div>
    </motion.a>
));

const SocialLink = memo(({ social, index }) => (
    <motion.a
        key={index}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit our ${social.label}`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ scale: 1.15, y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-white/8 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 group"
    >
        <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.a>
));

const Footer = () => {
    // Memoized form handler to prevent re-renders
    const handleSubscribe = useCallback((e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        alert("Thank you for subscribing!");
        e.target.reset();
    }, []);

    // Memoized static data
    const socialLinks = useMemo(
        () => [
            {
                icon: Facebook,
                href: "https://facebook.com/bloodconnection_bob",
                label: "Facebook",
            },
            {
                icon: Twitter,
                href: "https://twitter.com/bloodconnection_bob",
                label: "Twitter",
            },
            {
                icon: Instagram,
                href: "https://instagram.com/bloodconnection_bob",
                label: "Instagram",
            },
            {
                icon: Linkedin,
                href: "https://linkedin.com/bloodconnection_bob",
                label: "LinkedIn",
            },
        ],
        []
    );

    const quickLinks = useMemo(
        () => [
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/contact", label: "Contact Us" },
            { to: "/events", label: "Events" },
            { to: "/donate", label: "Donate" },
            { to: "/find-donor", label: "Find Donor" },
        ],
        []
    );

    const contactInfo = useMemo(
        () => [
            {
                icon: Mail,
                text: "support@mail.com",
                label: "Email Support",
                href: "mailto:support@bloodconnection.com",
            },
            {
                icon: Phone,
                text: "+91 1234567890",
                label: "24/7 Helpline",
                href: "tel:+911234567890",
            },
            {
                icon: MapPin,
                text: "123 Donation Street, Chennai",
                label: "Head Office",
                href: "#",
            },
        ],
        []
    );

    const stats = useMemo(
        () => [
            { number: "15K+", label: "Lives Saved", icon: Users },
            { number: "8K+", label: "Active Donors", icon: HeartPulse },
            { number: "350+", label: "Partner Hospitals", icon: Building2 },
        ],
        []
    );

    // Memoized floating particles
    const floatingParticles = useMemo(
        () =>
            [...Array(12)].map((_, i) => (
                <FloatingParticle key={i} index={i} />
            )),
        []
    );

    return (
        <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900/90 to-slate-900 text-white overflow-hidden">
            {/* Enhanced Background with better harmony */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,69,19,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.12),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.08),transparent_70%)]" />
                {/* Connecting gradient to hero section */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
            </div>

            {/* Optimized Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingParticles}
            </div>

            <div className="relative z-10 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Enhanced Logo & About Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <Link
                                to="/"
                                className="group flex items-center mb-8"
                            >
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative"
                                >
                                    <HeartPulse className="w-12 h-12 text-red-500 drop-shadow-lg" />
                                    <motion.div
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Number.POSITIVE_INFINITY,
                                        }}
                                        className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"
                                    />
                                </motion.div>
                                <div className="ml-4">
                                    <motion.span
                                        className="text-4xl font-bold bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        BloodConnection
                                    </motion.span>
                                    <div className="flex items-center mt-1">
                                        <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                                        <span className="text-sm text-white/70 font-medium">
                                            Saving Lives Together
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg">
                                Connecting heroes with those in need. Join our
                                mission to eliminate blood shortages and save
                                lives through technology, community engagement,
                                and compassionate care.
                            </p>

                            {/* Enhanced Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        stat={stat}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Enhanced Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                <ArrowRight className="w-6 h-6 text-red-400 mr-3" />
                                Quick Links
                            </h3>
                            <ul className="space-y-2">
                                {quickLinks.map((link, index) => (
                                    <QuickLink
                                        key={index}
                                        link={link}
                                        index={index}
                                    />
                                ))}
                            </ul>
                        </motion.div>

                        {/* Enhanced Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                <Phone className="w-6 h-6 text-red-400 mr-3" />
                                Contact Us
                            </h3>
                            <div className="space-y-3">
                                {contactInfo.map((contact, index) => (
                                    <ContactItem
                                        key={index}
                                        contact={contact}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-white/8 backdrop-blur-xl border border-white/20 rounded-3xl p-10 mb-16 relative overflow-hidden"
                    >
                        {/* Newsletter background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-purple-500/5" />

                        <div className="relative z-10">
                            <div className="text-center mb-8">
                                <motion.h2
                                    className="text-3xl font-bold text-white mb-3 flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Send className="w-7 h-7 text-red-400 mr-3" />
                                    Stay Connected
                                </motion.h2>
                                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                                    Get updates on blood drives, emergency
                                    alerts, and life-saving opportunities
                                    delivered to your inbox
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubscribe}
                                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                            >
                                <div className="flex-1 relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="w-full h-14 px-6 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-red-400/60 focus:bg-white/15 transition-all duration-300 text-lg group-hover:border-white/40"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 h-14 rounded-2xl font-semibold shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center border border-red-400/50 hover:border-red-300 min-w-[140px]"
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Subscribe
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Enhanced Bottom Section */}
                    <div className="border-t border-white/20 pt-10">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                            {/* Enhanced Social Media Links */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex space-x-4"
                            >
                                <span className="text-white/60 font-medium mr-4 flex items-center">
                                    Follow Us:
                                </span>
                                {socialLinks.map((social, index) => (
                                    <SocialLink
                                        key={index}
                                        social={social}
                                        index={index}
                                    />
                                ))}
                            </motion.div>

                            {/* Enhanced Copyright */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center lg:text-right"
                            >
                                <p className="text-white/70 text-base font-medium">
                                    &copy; {new Date().getFullYear()}{" "}
                                    BloodConnection. All Rights Reserved.
                                </p>
                                <p className="text-white/50 text-sm mt-1 flex items-center justify-center lg:justify-end">
                                    Made with{" "}
                                    <HeartPulse className="w-4 h-4 text-red-400 mx-1" />{" "}
                                    for saving lives
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);
