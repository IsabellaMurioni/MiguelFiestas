"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import airbagImg from "../assets/airbag.jpeg"
import breshImg from "../assets/bresh.jpeg"
import rooftopImg from "../assets/rooftop.jpg"

type Event = {
  id: string
  name: string
  description: string
  date: string
  image: string
  organizerName: string
  organizerLogo: string
  participants: number
  isPaid: boolean
  category: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("most-popular")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, activeFilter, events])

  const fetchEvents = async () => {
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/events')
      // const data = await response.json()
      // setEvents(data)

      // Mock data for now
      const mockEvents: Event[] = [
        {
          id: "1",
          name: "Airbag River Plate",
          description:
            "Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup, our platform makes it easy to create, share.",
          date: "2024-12-21",
          image: airbagImg,
          organizerName: "Airbag",
          organizerLogo: "/airbag-logo.jpg",
          participants: 20000,
          isPaid: true,
          category: "Concerts",
        },
        {
          id: "2",
          name: "Bresh Estadio Geba",
          description:
            "Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup, our platform makes it easy to create, share.",
          date: "2024-12-10",
          image: breshImg,
          organizerName: "Bresh",
          organizerLogo: "/bresh-logo-pink.jpg",
          participants: 20000,
          isPaid: true,
          category: "Concerts",
        },
        {
          id: "3",
          name: "Rooftop Buenos Aires",
          description:
            "Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup, our platform makes it easy to create, share.",
          date: "2024-12-10",
          image: rooftopImg,
          organizerName: "Skybar",
          organizerLogo: "/skybar-logo.jpg",
          participants: 20000,
          isPaid: true,
          category: "Parties",
        },
      ]

      setEvents(mockEvents)
      setFilteredEvents(mockEvents)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching events:", error)
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => event.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply category filter
    if (activeFilter === "free") {
      filtered = filtered.filter((event) => !event.isPaid)
    } else if (activeFilter === "paid") {
      filtered = filtered.filter((event) => event.isPaid)
    }
    // "most-popular" and "category" would need additional logic based on backend data

    setFilteredEvents(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("en", { month: "short" }).toUpperCase()
    return { day, month }
  }

  const formatParticipants = (count: number) => {
    if (count >= 1000) {
      return `+${Math.floor(count / 1000)}k`
    }
    return `+${count}`
  }

  const getFilterButtonClasses = (filterName: string) => {
    const baseClasses =
      "px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 uppercase"

    if (activeFilter === filterName) {
      return `${baseClasses} bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.1),0_0_30px_rgba(255,255,255,0.05)]`
    }

    return `${baseClasses} bg-transparent text-white/60 hover:text-white/90 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]`
  }

  return (
    <div className="min-h-screen bg-black">
      <Header currentPath="/events" />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            <span className="italic">Trending</span> events
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto px-4">
            Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup.
          </p>
        </div>

        {/* Filters - Updated to use new button styling function */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={() => setActiveFilter("most-popular")} className={getFilterButtonClasses("most-popular")}>
            Most Popular
          </button>
          <button onClick={() => setActiveFilter("free")} className={getFilterButtonClasses("free")}>
            Free
          </button>
          <button onClick={() => setActiveFilter("paid")} className={getFilterButtonClasses("paid")}>
            Paid
          </button>
          <button onClick={() => setActiveFilter("category")} className={getFilterButtonClasses("category")}>
            Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16 px-4 sm:px-0">
          <div className="relative">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/20 rounded-full py-3 sm:py-4 pl-12 sm:pl-14 pr-4 sm:pr-6 text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center text-white/60 py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-white/60 py-12">No events found</div>
        ) : (
          <div className="space-y-6 sm:space-y-8 container mx-auto">
            {filteredEvents.map((event) => {
              const { day, month } = formatDate(event.date)
              return (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="group block relative overflow-hidden rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    {/* Event Badge */}
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-red-900/80 backdrop-blur-sm rounded-full text-sm text-white font-light">
                        {event.isPaid ? "Evento pago" : "Evento gratis"}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-6 right-6 text-right">
                      <p className="text-5xl font-light text-white">{day}</p>
                      <p className="text-white/60 text-sm font-light tracking-wider uppercase">{month}</p>
                    </div>

                    {/* Event Info - bottom overlay like featured */}
                    <div className="absolute bottom-8 left-8 right-8 space-y-4 p-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white font-light border border-white/20">
                          {event.category}
                        </span>
                      </div>

                      <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{event.name}</h3>

                      <p className="text-white/80 text-base font-light tracking-wide max-w-2xl">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button className="px-8 py-3 bg-white text-black rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200">
                          Comprar entrada
                        </button>
                        <Link
                          to="/events"
                          className="px-8 py-3 bg-transparent text-white border border-white/40 rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-200"
                        >
                          Ver más
                        </Link>

                        <div className="flex items-center gap-2 ml-auto">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                            ))}
                          </div>
                          <p className="text-white/60 text-sm font-light tracking-wide">{formatParticipants(event.participants)} participantes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
