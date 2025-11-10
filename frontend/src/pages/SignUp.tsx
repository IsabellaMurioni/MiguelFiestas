// src/pages/Signup.tsx
"use client"

import { useState } from "react"
import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRegister } from "../lib/hooks/useAuth"
import type { RegisterData } from "../lib/types/auth"
import logo from "../assets/logo.png"

export default function Signup() {
  const [formData, setFormData] = useState<RegisterData>({
    nickName: "",
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const registerMutation = useRegister()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.dni || !formData.nickName) {
      setError("Please complete all fields")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      await registerMutation.mutateAsync(formData)
      // Redirect to home after successful registration
      navigate("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error during registration")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Mismo layout que Login */}
      <div className="flex lg:hidden items-center justify-center py-12 px-6">
          <div className="text-center">
            <img src={logo} alt="Mique Events Logo" className="mx-auto w-[240px] h-auto" />
          </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-[500px] h-[500px] flex items-center justify-center">
          <img src={logo} alt="Mique Events Logo" className="ml-8 lg:ml-12 w-[520px] h-auto" />
        </div>
      </div>

  <div className="flex w-full lg:w-1/2 items-center justify-center px-6 pb-12 lg:p-6 mr-8 lg:mr-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-light text-white tracking-tight">Sign Up</h1>
            <p className="text-white/60 text-sm font-light tracking-wide">
              Complete your information to create a new account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[7px]">
                <p className="text-red-400 text-sm font-light tracking-wide">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-medium tracking-wider uppercase">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  disabled={registerMutation.isPending}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  disabled={registerMutation.isPending}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Username</label>
              <input
                type="text"
                name="nickName"
                value={formData.nickName}
                onChange={handleChange}
                placeholder="Unique username"
                disabled={registerMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">ID Number</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="ID number"
                disabled={registerMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. user@example.com"
                disabled={registerMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                disabled={registerMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-transparent text-white border border-white hover:bg-white hover:text-black font-medium tracking-wider uppercase text-sm rounded-[7px] transition-all duration-200 py-3 disabled:opacity-50"
            >
              {registerMutation.isPending ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-white/60 font-light tracking-wide">
              Already have an account?{" "}
              <Link to="/" className="text-white hover:text-white/80 font-medium transition-colors duration-200">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}