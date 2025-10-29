"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

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
          image: "/concert-crowd-red-lights-stage.jpg",
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
          image: "/blue-concert-crowd-bresh-neon-lights.jpg",
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
          image: "/rooftop-city-night-lights-buenos-aires.jpg",
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
          <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
            {filteredEvents.map((event) => {
              const { day, month } = formatDate(event.date)
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative h-[400px] sm:h-[500px]">
                    <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Event Badge */}
                    <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-900/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-light">
                        Evento pago
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                      <div className="text-2xl sm:text-3xl font-bold text-white">{day}</div>
                      <div className="text-xs sm:text-sm text-white/60 uppercase">{month}</div>
                    </div>

                    {/* Event Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex-shrink-0">
                          <Image
                            src={event.organizerLogo || "/placeholder.svg"}
                            alt={event.organizerName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs sm:text-sm text-white/80 font-light">{event.organizerName}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 group-hover:text-white/90 transition-colors">
                        {event.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-6 line-clamp-2">{event.description}</p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors">
                          Comprar entrada
                        </button>

                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-black" />
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-black" />
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-black" />
                          </div>
                          <span className="text-xs sm:text-sm text-white/60">
                            {formatParticipants(event.participants)} participantes
                          </span>
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
