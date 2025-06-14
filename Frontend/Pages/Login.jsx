"use client";

import React from "react";

import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Heart,
    Shield,
    User,
    Building,
    ArrowLeft,
    Home,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";

const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

// Memoized background particles component
const BackgroundParticles = React.memo(() => {
    const particles = useMemo(
        () =>
            Array.from({ length: 15 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 2,
            })),
        []
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                    }}
                    animate={{
                        y: [-20, -100, -20],
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

// Memoized decorative elements
const DecorativeElements = React.memo(() => (
    <>
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                duration: 30,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
            }}
            className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-80 will-change-transform"
        />
        <motion.div
            animate={{ rotate: -360 }}
            transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
            }}
            className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-80 will-change-transform"
        />
    </>
));

// Memoized user type button component
const UserTypeButton = React.memo(
    ({ type, isActive, onClick, icon: Icon, label }) => (
        <motion.button
            type="button"
            onClick={onClick}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-all duration-300 min-h-[48px] ${
                isActive
                    ? type === "user"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border border-red-400/50"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border border-blue-400/50"
                    : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </motion.button>
    )
);

// Memoized input field component
const InputField = React.memo(
    ({
        label,
        icon: Icon,
        type = "text",
        register,
        error,
        placeholder,
        isLoading,
        showPasswordToggle,
        showPassword,
        onTogglePassword,
        autoComplete,
    }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: type === "email" ? 0.2 : 0.3 }}
        >
            <label className="flex items-center text-white/90 font-medium mb-2">
                <Icon className="w-4 h-4 mr-2 text-red-400" />
                {label}
            </label>
            <div className="relative">
                <input
                    disabled={isLoading}
                    autoComplete={autoComplete}
                    type={
                        showPasswordToggle
                            ? showPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    {...register}
                    className={`w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-red-400/50 focus:bg-white/20 transition-all duration-300 min-h-[56px] ${
                        showPasswordToggle ? "pr-12" : ""
                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    placeholder={placeholder}
                />
                {showPasswordToggle && (
                    <motion.button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </motion.button>
                )}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm mt-2 flex items-center"
                    >
                        <Shield className="w-3 h-3 mr-1" />
                        {error.message}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    )
);

const Login = () => {
    const [userType, setUserType] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // Memoized callbacks to prevent re-renders
    const handleUserTypeChange = useCallback((type) => {
        setUserType(type);
    }, []);

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleBackToHome = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const onSubmit = useCallback(
        async (data) => {
            setIsLoading(true);
            try {
                const endpoint =
                    userType === "user" ? "login/user" : "login/hospital";
                const response = await fetch(
                    `http://https://blood-donation-backend-b325.onrender.com/api/auth/${endpoint}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );

                let result;
                try {
                    result = await response.json();
                } catch (jsonErr) {
                    result = { message: "Login failed. Please try again." };
                }

                if (!response.ok) {
                    throw new Error(result.message || "Login failed");
                }

                localStorage.setItem("token", result.token);
                localStorage.setItem("userType", userType);
                localStorage.setItem("userName", result.userName);

                toast.success("Login successful!", {
                    duration: 3000,
                    style: {
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.2)",
                    },
                });

                if (userType === "user") {
                    navigate("/user-dashboard");
                } else {
                    navigate("/hospital-dashboard");
                }
            } catch (err) {
                console.error("Error:", err.message);
                toast.error(err.message || "Something went wrong", {
                    duration: 4000,
                    style: {
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        color: "white",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.2)",
                    },
                });
            } finally {
                setIsLoading(false);
            }
        },
        [userType, navigate]
    );

    // Memoized static elements
    const backgroundGradients = useMemo(
        () => (
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.2),transparent_50%)]" />
            </div>
        ),
        []
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background */}
            {backgroundGradients}

            {/* Background Particles */}
            <BackgroundParticles />

            {/* Back to Home Button */}
            <motion.button
                onClick={handleBackToHome}
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 group cursor-pointer shadow-lg"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
            </motion.button>

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                            }}
                            className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg will-change-transform"
                        >
                            <Heart className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-white/70">
                            Sign in to continue saving lives
                        </p>
                    </div>

                    {/* User Type Selection */}
                    <div className="flex mb-8 bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                        <UserTypeButton
                            type="user"
                            isActive={userType === "user"}
                            onClick={() => handleUserTypeChange("user")}
                            icon={User}
                            label="User"
                        />
                        <UserTypeButton
                            type="hospital"
                            isActive={userType === "hospital"}
                            onClick={() => handleUserTypeChange("hospital")}
                            icon={Building}
                            label="Hospital"
                        />
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <InputField
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            register={register("email")}
                            error={errors.email}
                            placeholder="Enter your email"
                            isLoading={isLoading}
                            autoComplete="email"
                        />

                        {/* Password Field */}
                        <InputField
                            label="Password"
                            icon={Lock}
                            register={register("password")}
                            error={errors.password}
                            placeholder="Enter your password"
                            isLoading={isLoading}
                            showPasswordToggle={true}
                            showPassword={showPassword}
                            onTogglePassword={togglePassword}
                            autoComplete="current-password"
                        />

                        {/* Remember Me & Forgot Password */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-between items-center"
                        >
                            <label className="flex items-center text-white/70 cursor-pointer">
                                <input
                                    type="checkbox"
                                    {...register("rememberMe")}
                                    className="w-4 h-4 text-red-500 bg-white/10 border-white/20 rounded focus:ring-red-500 focus:ring-2 mr-2"
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-gradient-to-r ${
                                userType === "user"
                                    ? "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                    : "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                            } text-white py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center border border-white/20 min-h-[56px]`}
                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {isLoading ? (
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
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <Heart className="w-5 h-5 mr-2" />
                                    Sign In
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Signup Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center mt-8"
                    >
                        <p className="text-white/70">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className={`text-red-400 hover:text-red-300 font-semibold transition-colors ${
                                    isLoading
                                        ? "pointer-events-none opacity-70"
                                        : ""
                                }`}
                            >
                                Create Account
                            </Link>
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <DecorativeElements />
            </motion.div>
        </div>
    );
};

export default Login;
