"use client"
import { useState } from "react"
import type React from "react"
import Image from "next/image"

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    dni: "",
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      //
      // if (!response.ok) {
      //   const data = await response.json()
      //   throw new Error(data.message || 'Sign up failed')
      // }
      //
      // const data = await response.json()
      // // Handle successful signup (e.g., store token, redirect)
      // console.log('Sign up successful:', data)

      console.log("Form data ready for backend:", formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      <div className="flex lg:hidden items-center justify-center py-12 px-6">
        <div className="text-center">
          <Image src="/mique-eventos-logo.jpg" alt="mique eventos" width={200} height={80} className="mx-auto" />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="w-[500px] h-[500px] flex items-center justify-center">
          <Image src="/mique-eventos-logo.jpg" alt="mique eventos" width={400} height={160} />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 pb-12 lg:p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-light text-white tracking-tight">Sign up Account</h1>
            <p className="text-white/60 text-sm font-light tracking-wide">
              Enter your personal data to create your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-[7px]">
                <p className="text-red-400 text-sm font-light tracking-wide">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-medium tracking-wider uppercase">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="eg. Isabella"
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Last name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="eg. Murioni"
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">Nickname</label>
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="eg. Isa"
                disabled={isLoading}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/80 text-xs font-medium tracking-wider uppercase">DNI</label>
              <input
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="eg. 12345678"
                disabled={isLoading}
                className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:bg-black focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/30 rounded-[7px] font-light tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

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
              {isLoading ? "Signing up..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-white/60 font-light tracking-wide">
              Already have an account?{" "}
              <a href="/login" className="text-white hover:text-white/80 font-medium transition-colors duration-200">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}