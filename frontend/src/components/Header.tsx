"use client"

import { Menu } from "lucide-react"
import { useState } from "react"
import logo from "../assets/logo.png"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isActive = (path: string) => window.location.pathname === path

  const getNavLinkClasses = (path: string) => {
    const baseClasses = "px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200"

    if (isActive(path)) {
      return `${baseClasses} bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.1),0_0_30px_rgba(255,255,255,0.05)]`
    }

    return `${baseClasses} bg-transparent text-white/60 hover:text-white/90 hover:bg-black/30 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]`
  }

  return (
    <header className="w-full bg-black border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo img*/}
          <a href="/home" className="flex items-center">
            <img src={logo} alt="Mique Events Logo" className="h-[80px]" />
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <a href="/home" className={getNavLinkClasses("/home")}>
              HOME
            </a>

            <a href="/events" className={getNavLinkClasses("/events")}>
              EVENTS
            </a>

            <a href="/balance" className={getNavLinkClasses("/balance")}>
              BALANCE
            </a>
          </nav>

          {/* My Profile Button - Added thin white border */}
          <a
            href="/profile"
            className="px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 text-white border border-white hover:bg-white hover:text-black"
          >
            MY PROFILE
          </a>
        </div>

        {/* Mobile Layout - Added mobile version with hamburger on left and centered logo */}
        <div className="flex md:hidden items-center justify-between">
          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Centered Logo */}
          <a href="/home" className="absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="Mique Events Logo" className="h-6" />
          </a>

          {/* Spacer for layout balance */}
          <div className="w-10" />
        </div>

        {/* Mobile Menu - Added mobile navigation menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden flex flex-col gap-3 mt-6 pb-4">
            <a href="/home" className={getNavLinkClasses("/home")}>
              HOME
            </a>
            <a href="/events" className={getNavLinkClasses("/events")}>
              EVENTS
            </a>
            <a href="/balance" className={getNavLinkClasses("/balance")}>
              BALANCE
            </a>
            <a
              href="/profile"
              className="px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 text-white border border-white hover:bg-white hover:text-black text-center"
            >
              MY PROFILE
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}