// src/pages/Login.tsx
"use client"

import { useState } from "react"
import type React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useLogin } from "../lib/hooks/useAuth"
import type { LoginData } from "../lib/types/auth"
import logo from "../assets/logo.png"

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  
  const loginMutation = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Please complete all fields")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      await loginMutation.mutateAsync(formData)
      // Redirect to home after successful login
      navigate("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error during login")
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
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
            <h1 className="text-3xl font-light text-white tracking-tight">Log In</h1>
            <p className="text-white/60 text-sm font-light tracking-wide">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[7px]">
                <p className="text-red-400 text-sm font-light tracking-wide">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. user@example.com"
                disabled={loginMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loginMutation.isPending}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-white/40 font-light tracking-wide">Minimum 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-transparent text-white border border-white hover:bg-white hover:text-black font-medium tracking-wider uppercase text-sm rounded-[7px] transition-all duration-200 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {loginMutation.isPending ? "Signing in..." : "Log In"}
            </button>

            <p className="text-center text-sm text-white/60 font-light tracking-wide">
              Don't have an account?{" "}
              <Link to="/signup" className="text-white hover:text-white/80 font-medium transition-colors duration-200">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}