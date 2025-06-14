"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, HeartPulse, Sparkles, User, Shield } from "lucide-react";

// Memoized components to prevent re-renders
const MemoizedHeartPulse = React.memo(() => (
    <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8 }}
        className="relative will-change-transform"
    >
        <HeartPulse className="w-8 h-8 text-red-500 drop-shadow-lg" />
        <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
            }}
            className="absolute inset-0 bg-red-500/20 rounded-full blur-md will-change-transform"
        />
    </motion.div>
));

const MemoizedSparkles = React.memo(() => (
    <div className="flex items-center">
        <Sparkles className="w-3 h-3 text-yellow-400 mr-1" />
        <span className="text-xs text-white/70 font-medium">Saving Lives</span>
    </div>
));

// Memoized NavItem component
const NavItem = React.memo(({ to, label, icon: Icon, isActive, onClick }) => {
    const handleClick = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return (
        <Link to={to} onClick={handleClick} className="group relative">
            <motion.div
                className={`flex items-center px-5 py-3 rounded-xl font-semibold transition-all duration-300 min-h-[48px] ${
                    isActive
                        ? "text-white bg-red-500/20 backdrop-blur-sm border border-red-400/30 shadow-lg shadow-red-500/10"
                        : "text-white/90 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm hover:border hover:border-white/20"
                }`}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                {Icon && <Icon className="w-4 h-4 mr-2 flex-shrink-0" />}
                <span className="whitespace-nowrap">{label}</span>
                {isActive && (
                    <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-600/30 rounded-xl border border-red-400/40 shadow-inner"
                        initial={false}
                        transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                        }}
                    />
                )}
            </motion.div>
        </Link>
    );
});

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { pathname } = useLocation();

    // Memoized scroll handler to prevent re-renders
    const handleScroll = useCallback(() => {
        const isScrolled = window.scrollY > 50;
        if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
        }
    }, [scrolled]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Memoized close handler
    const closeMenu = useCallback(() => {
        setIsOpen(false);
    }, []);

    // Memoized toggle handler
    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Memoized navigation items
    const navigationItems = useMemo(
        () => [
            { to: "/user-dashboard", label: "Dashboard", icon: User },
            { to: "/about", label: "About", icon: null },
            { to: "/contact", label: "Contact", icon: null },
            { to: "/events", label: "Events", icon: null },
        ],
        []
    );

    // Memoized navbar classes
    const navbarClasses = useMemo(
        () =>
            `fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20"
                    : "bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-md"
            }`,
        [scrolled]
    );

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={navbarClasses}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">
                {/* Logo */}
                <Link to="/" className="group flex items-center z-10">
                    <MemoizedHeartPulse />
                    <div className="ml-3">
                        <motion.span
                            className="text-2xl font-bold bg-gradient-to-r from-white via-red-200 to-red-100 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.02 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                        >
                            BloodConnection
                        </motion.span>
                        <MemoizedSparkles />
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2">
                    {navigationItems.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            label={item.label}
                            icon={item.icon}
                            isActive={pathname === item.to}
                        />
                    ))}

                    {/* Find Donor Button */}
                    <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                        className="ml-4"
                    >
                        <Link
                            to="/find-donor"
                            className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/30 transition-all duration-300 border border-red-400/50 hover:border-red-300/70 min-h-[48px] flex items-center justify-center backdrop-blur-sm"
                        >
                            <Shield className="w-4 h-4 mr-2" />
                            Find Donor
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg"
                    onClick={toggleMenu}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-5 h-5 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu className="w-5 h-5 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10 shadow-2xl"
                    >
                        <div className="px-6 py-6 space-y-3">
                            {navigationItems.map((item) => (
                                <NavItem
                                    key={item.to}
                                    to={item.to}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={pathname === item.to}
                                    onClick={closeMenu}
                                />
                            ))}

                            {/* Mobile Find Donor Button */}
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                className="pt-3"
                            >
                                <Link
                                    to="/find-donor"
                                    onClick={closeMenu}
                                    className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white px-6 py-4 rounded-xl font-semibold text-center shadow-lg hover:shadow-red-500/30 transition-all duration-300 border border-red-400/50 min-h-[56px] flex items-center justify-center"
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Find Donor
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
