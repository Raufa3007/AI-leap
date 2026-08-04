"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"

interface LoginPageProps {
  onNavigate: (page: "login" | "registration" | "dashboard" | "portal-chooser") => void
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Login failed")
        return
      }

      const data = await response.json()

      localStorage.setItem("user", JSON.stringify(data.user))
      if (rememberMe) {
        localStorage.setItem("rememberEmail", email)
      } else {
        localStorage.removeItem("rememberEmail")
      }

      console.log("[v0] Login successful:", data.user)
      onNavigate("dashboard")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Shipping Container Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-900 via-teal-800 to-blue-900 relative overflow-hidden">
        <Image src="/images/loginImage.png" alt="Shipping containers" fill className="object-cover" priority />

        {/* Bottom Text Section */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 via-black/50 to-transparent">
          <h2 className="text-2xl font-bold text-white mb-3">The Logistics Sector</h2>
          <p className="text-gray-200 text-sm leading-relaxed mb-4">
            Modern logistics plays a pivotal role in global supply chains—connecting manufacturers, suppliers, and
            customers with speed, efficiency, and precision. At KaarTech, we empower organizations to build smarter
            procurement pipelines, optimize inventory flow, and ensure timely delivery across continents.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 sm:px-16">
        <div className="w-full max-w-md">
          {/* Header with Logo and Language Selector */}
          <div className="flex items-center justify-between mb-16">
            <button
              onClick={() => onNavigate("portal-chooser")}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              aria-label="Back to portal selection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back</span>
            </button>
            <div className="text-2xl font-bold text-green-700">KaarTech</div>
            <button className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition">
              English (United Kingdom) ▼
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Log in to supplier portal</h1>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded bg-red-50 p-4 border border-red-200">
              <AlertCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
                <Eye size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Remember for 30 days</span>
              </label>
              <a href="#" className="text-sm text-green-700 hover:text-green-800 font-medium">
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded hover:bg-green-700 transition mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-700 mt-8">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("registration")}
              className="text-green-700 hover:text-green-800 font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
