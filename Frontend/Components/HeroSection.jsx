"use client";

import {
    motion,
    useScroll,
    useTransform,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
    LogIn,
    UserPlus,
    AlertCircle,
    Heart,
    ArrowRight,
    Sparkles,
    Shield,
    Users,
} from "lucide-react";
import { useEffect, useRef, useCallback, useMemo, memo } from "react";

// Memoized floating particles to prevent re-renders
const FloatingParticles = memo(() => {
    const particles = useMemo(
        () =>
            Array.from({ length: 25 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                duration: 2.5 + Math.random() * 3,
                delay: Math.random() * 3,
                size: Math.random() > 0.7 ? "w-2 h-2" : "w-1.5 h-1.5",
                opacity: Math.random() > 0.5 ? "bg-white/30" : "bg-white/20",
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className={`absolute ${particle.size} ${particle.opacity} rounded-full`}
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [-30, -120, -30],
                        x: [-10, 10, -10],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: particle.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
});

// Memoized animated text component
const AnimatedText = memo(({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
));

// Memoized floating element
const FloatingElement = memo(({ children, delay = 0, duration = 3 }) => (
    <motion.div
        animate={{
            y: [-8, 8, -8],
            rotate: [-1, 1, -1],
        }}
        transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay,
        }}
    >
        {children}
    </motion.div>
));

// Memoized stats card component
const StatsCard = memo(({ icon: Icon, label, value, color, delay }) => (
    <FloatingElement delay={delay}>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className="text-white/70 text-xs mb-1">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
        </div>
    </FloatingElement>
));

// Memoized action button component
const ActionButton = memo(
    ({ to, variant = "primary", children, icon: Icon, className = "" }) => {
        const baseClasses =
            "group relative overflow-hidden font-semibold transition-all duration-300 rounded-xl flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] text-sm sm:text-base";

        const variants = {
            primary:
                "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98]",
            secondary:
                "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]",
            success:
                "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]",
            emergency:
                "bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-400/50 hover:shadow-lg hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]",
        };

        return (
            <Link
                to={to}
                className={`${baseClasses} ${variants[variant]} ${className}`}
            >
                {variant === "primary" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-xl" />
                )}
                <div className="relative flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span>{children}</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
            </Link>
        );
    }
);

// Memoized emergency button with pulsing animation
const EmergencyButton = memo(() => (
    <motion.div
        animate={{
            scale: [1, 1.02, 1],
            boxShadow: [
                "0 0 0 0 rgba(239, 68, 68, 0.4)",
                "0 0 0 8px rgba(239, 68, 68, 0)",
                "0 0 0 0 rgba(239, 68, 68, 0)",
            ],
        }}
        transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
        }}
        className="inline-block"
    >
        <ActionButton
            to="/emergency"
            variant="emergency"
            icon={AlertCircle}
            className="animate-pulse"
        >
            Emergency Blood Request
        </ActionButton>
    </motion.div>
));

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -30]);
    const y2 = useTransform(scrollY, [0, 300], [0, -60]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

    // Optimized mouse tracking with reduced sensitivity
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    const heroRef = useRef(null);

    // Throttled mouse move handler to prevent excessive re-renders
    const handleMouseMove = useCallback(
        (() => {
            let timeoutId = null;
            return (e) => {
                if (timeoutId) return;

                timeoutId = setTimeout(() => {
                    if (!heroRef.current) {
                        timeoutId = null;
                        return;
                    }

                    const rect = heroRef.current.getBoundingClientRect();
                    const x = (e.clientX - rect.left) * 0.5; // Reduced sensitivity
                    const y = (e.clientY - rect.top) * 0.5;

                    mouseX.set(x);
                    mouseY.set(y);
                    timeoutId = null;
                }, 16); // ~60fps throttling
            };
        })(),
        [mouseX, mouseY]
    );

    useEffect(() => {
        const heroElement = heroRef.current;
        if (!heroElement) return;

        heroElement.addEventListener("mousemove", handleMouseMove, {
            passive: true,
        });
        return () => {
            heroElement.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove]);

    // Memoized background gradients
    const backgroundGradients = useMemo(
        () => (
            <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.2),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,107,107,0.15),transparent_50%)]" />
            </>
        ),
        []
    );

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
        >
            {/* Static Background */}
            <div className="absolute inset-0">{backgroundGradients}</div>

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Additional Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={`ambient-${i}`}
                        className="absolute w-3 h-3 bg-gradient-to-r from-red-400/20 to-purple-400/20 rounded-full blur-sm"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                            y: [-40, 40, -40],
                            x: [-20, 20, -20],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Optimized Mouse Follower */}
            <motion.div
                className="fixed w-80 h-80 rounded-full bg-gradient-to-r from-red-500/8 to-purple-500/8 blur-3xl pointer-events-none z-0"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between min-h-screen pt-20">
                {/* Left Content */}
                <motion.div
                    className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
                    style={{ y: y1, opacity }}
                >
                    <AnimatedText>
                        <motion.div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-white/90 text-sm font-medium">
                                Save Lives Today
                            </span>
                        </motion.div>
                    </AnimatedText>

                    <AnimatedText delay={0.1}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
                                Donate Blood,
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                                Save Lives
                            </span>
                        </h1>
                    </AnimatedText>

                    <AnimatedText delay={0.2}>
                        <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
                            Every drop counts! Join our mission to connect
                            heroes with those in need.
                            <span className="text-red-400 font-semibold">
                                {" "}
                                Make a difference today.
                            </span>
                        </p>
                    </AnimatedText>

                    {/* Action Buttons */}
                    <AnimatedText delay={0.3}>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 items-center sm:items-start">
                            <ActionButton
                                to="/login"
                                variant="primary"
                                icon={LogIn}
                            >
                                Login
                            </ActionButton>

                            <ActionButton
                                to="/signup"
                                variant="secondary"
                                icon={UserPlus}
                            >
                                Sign Up
                            </ActionButton>

                            <ActionButton
                                to="/donate"
                                variant="success"
                                icon={Heart}
                            >
                                Donate Now
                            </ActionButton>
                        </div>
                    </AnimatedText>

                    {/* Emergency Button */}
                    <AnimatedText delay={0.4}>
                        <EmergencyButton />
                    </AnimatedText>
                </motion.div>

                {/* Right Content - Stats & Visual */}
                <motion.div
                    className="lg:w-1/2 flex justify-center"
                    style={{ y: y2 }}
                >
                    <div className="relative max-w-sm w-full">
                        {/* Main Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "linear",
                                    }}
                                    className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Heart className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    Lives Saved
                                </h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.5, delay: 0.8 }}
                                    className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
                                >
                                    10,000+
                                </motion.p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <StatsCard
                                    icon={Users}
                                    label="Active Donors"
                                    value="5,000+"
                                    color="text-blue-400"
                                    delay={0.2}
                                />
                                <StatsCard
                                    icon={Shield}
                                    label="Hospitals"
                                    value="200+"
                                    color="text-green-400"
                                    delay={0.4}
                                />
                            </div>
                        </motion.div>

                        {/* Floating Decorative Elements */}
                        <FloatingElement delay={0.5} duration={4}>
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </FloatingElement>

                        <FloatingElement delay={1} duration={5}>
                            <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                        </FloatingElement>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
