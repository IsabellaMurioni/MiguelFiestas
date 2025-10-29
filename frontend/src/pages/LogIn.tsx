"use client"
import { useState } from "react"
import type React from "react"
import { Link } from "react-router-dom"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   const data = await response.json()
      //   throw new Error(data.message || 'Login failed')
      // }
      //
      // const data = await response.json()
      // // Handle successful login (e.g., store token, redirect)
      // console.log('Login successful:', data)

      console.log("Form data ready for backend:", formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      <div className="flex lg:hidden items-center justify-center py-12 px-6">
        <div className="text-center">
          <img src="/mique-eventos-logo.jpg" alt="mique eventos" className="mx-auto w-[200px] h-auto" />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-[500px] h-[500px] flex items-center justify-center">
          <img src="/mique-eventos-logo.jpg" alt="mique eventos" className="w-[400px] h-auto" />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 pb-12 lg:p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-light text-white tracking-tight">Log in Account</h1>
            <p className="text-white/60 text-sm font-light tracking-wide">
              Enter your personal data to access your account.
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
                placeholder="eg. isabellamurioni@gmail.com"
                disabled={isLoading}
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
                disabled={isLoading}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-white/40 font-light tracking-wide">Must at be least 8 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-transparent text-white border border-white hover:bg-white hover:text-black font-medium tracking-wider uppercase text-sm rounded-[7px] transition-all duration-200 py-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
            >
              {isLoading ? "Logging in..." : "Log in"}
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
