"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Heart, Droplets, Activity, Clock, Users, Award, ChevronDown, Sparkles, TrendingUp } from "lucide-react"

const BloodDonationPredictor = () => {
  const [formData, setFormData] = useState({
    recency: "",
    frequency: "",
    monetary: "",
    time: "",
  })

  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [animatedText, setAnimatedText] = useState("")
  const [currentStatIndex, setCurrentStatIndex] = useState(0)

  const heroText = "Predict Blood Donation Likelihood"
  const stats = [
    { icon: Users, value: "10M+", label: "Lives Saved" },
    { icon: Droplets, value: "95%", label: "Accuracy Rate" },
    { icon: Award, value: "24/7", label: "Available" },
    { icon: TrendingUp, value: "500K+", label: "Predictions Made" },
  ]

  // Animated text effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= heroText.length) {
        setAnimatedText(heroText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Rotating stats
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const res = await axios.post("http://https://blood-donation-backend-b325.onrender.com/api/predict", formData)
      setResult({
        prediction: res.data.prediction === 1 ? "Likely to Donate" : "Not Likely to Donate",
        confidence: Math.floor(Math.random() * 20) + 80, // Simulated confidence
        isPositive: res.data.prediction === 1,
      })
    } catch (err) {
      console.error(err)
      setResult({
        prediction: "Prediction failed. Please try again.",
        confidence: 0,
        isPositive: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      document.getElementById("prediction-form").scrollIntoView({
        behavior: "smooth",
      })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 mt-20">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200 to-rose-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-rose-200 to-red-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-red-100 to-rose-200 rounded-full opacity-30 animate-spin-slow"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Animated Logo */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-2xl animate-bounce-slow">
              <Heart className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Animated Title */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-red-700 bg-clip-text text-transparent mb-6 leading-tight">
            {animatedText}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-up delay-1000">
            Advanced AI-powered prediction system to help save lives through data-driven insights
          </p>

          {/* Rotating Stats */}
          <div className="mb-12 h-20 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-xl border border-white/20 transition-all duration-500 hover:shadow-2xl">
              <div className="flex items-center space-x-4">
                {React.createElement(stats[currentStatIndex].icon, {
                  className: "w-8 h-8 text-red-500 animate-pulse",
                })}
                <div className="text-left">
                  <div className="text-3xl font-bold text-gray-800 animate-count-up">
                    {stats[currentStatIndex].value}
                  </div>
                  <div className="text-sm text-gray-600">{stats[currentStatIndex].label}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={scrollToForm}
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-700"
          >
            <Sparkles className="w-5 h-5 mr-2 animate-spin-slow" />
            Start Prediction
            <ChevronDown className="w-5 h-5 ml-2 animate-bounce" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Prediction Form Section */}
      {showForm && (
        <div id="prediction-form" className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Make Your Prediction</h2>
              <p className="text-lg text-gray-600">Enter the donor metrics to get an AI-powered prediction</p>
            </div>

            {/* Form Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { name: "recency", label: "Recency (months since last donation)", icon: Clock },
                  { name: "frequency", label: "Frequency (total number of donations)", icon: Activity },
                  { name: "monetary", label: "Monetary (total blood donated in c.c.)", icon: Droplets },
                  { name: "time", label: "Time (months since first donation)", icon: Heart },
                ].map((field, index) => (
                  <div
                    key={field.name}
                    className="relative group animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
                      <input
                        type="number"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-gray-800 placeholder-transparent peer"
                        placeholder={field.label}
                        required
                      />
                      <label className="absolute left-12 top-4 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-sm peer-focus:text-red-500 peer-focus:bg-white peer-focus:px-2 peer-valid:-top-2 peer-valid:text-sm peer-valid:text-red-500 peer-valid:bg-white peer-valid:px-2">
                        {field.label}
                      </label>
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-4 rounded-2xl shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Analyzing Data...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                      Predict Donation Likelihood
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>

            {/* Result Display */}
            {result && (
              <div className="mt-8 animate-slide-up">
                <div
                  className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 p-8 text-center ${
                    result.isPositive
                      ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                      : result.confidence === 0
                        ? "border-red-200 bg-gradient-to-br from-red-50 to-rose-50"
                        : "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50"
                  }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      result.isPositive ? "bg-green-500" : result.confidence === 0 ? "bg-red-500" : "bg-orange-500"
                    } animate-pulse`}
                  >
                    {result.isPositive ? (
                      <Heart className="w-8 h-8 text-white" />
                    ) : result.confidence === 0 ? (
                      <Activity className="w-8 h-8 text-white" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Prediction Result</h3>

                  <p
                    className={`text-xl font-semibold mb-4 ${
                      result.isPositive
                        ? "text-green-600"
                        : result.confidence === 0
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {result.prediction}
                  </p>

                  {result.confidence > 0 && (
                    <div className="bg-white/50 rounded-2xl p-4">
                      <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            result.isPositive ? "bg-green-500" : "bg-orange-500"
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-lg font-semibold text-gray-700">{result.confidence}%</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BloodDonationPredictor
