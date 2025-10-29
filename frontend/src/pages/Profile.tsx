"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

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

type UserProfile = {
  name: string
  email: string
  avatar: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([])
  const [ownedEvents, setOwnedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // TODO: Replace with actual API endpoints
      // const profileResponse = await fetch('/api/user/profile')
      // const profileData = await profileResponse.json()
      // setProfile(profileData)

      // const joinedResponse = await fetch('/api/user/joined-events')
      // const joinedData = await joinedResponse.json()
      // setJoinedEvents(joinedData)

      // const ownedResponse = await fetch('/api/user/owned-events')
      // const ownedData = await ownedResponse.json()
      // setOwnedEvents(ownedData)

      // Mock data for now
      const mockProfile: UserProfile = {
        name: "Isabella Murioni",
        email: "isabellamurioni@gmail.com",
        avatar: "/abstract-profile.png",
      }

      const mockJoinedEvents: Event[] = [
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
      ]

      const mockOwnedEvents: Event[] = [
        {
          id: "3",
          name: "Previa Lanús",
          description:
            "Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup, our platform makes it easy to create, share.",
          date: "2024-12-15",
          image: "/concert-festival-crowd-lights-stage.jpg",
          organizerName: "Isabella Murioni",
          organizerLogo: "/abstract-profile.png",
          participants: 500,
          isPaid: false,
          category: "Parties",
        },
      ]

      setProfile(mockProfile)
      setJoinedEvents(mockJoinedEvents)
      setOwnedEvents(mockOwnedEvents)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching profile data:", error)
      setIsLoading(false)
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header currentPath="/profile" />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center text-white/60 py-12">Loading profile...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Header currentPath="/profile" />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center text-white/60 py-12">Profile not found</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header currentPath="/profile" />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 mb-8 sm:mb-12 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20">
                <Image
                  src={profile.avatar || "/placeholder.svg"}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">{profile.name}</h1>
                <p className="text-sm sm:text-base text-white/60 truncate">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Joined Events Section */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Joined events</h2>
            {joinedEvents.length === 0 ? (
              <p className="text-white/60 text-center py-8">No joined events yet</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {joinedEvents.map((event) => {
                  const { day, month } = formatDate(event.date)
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group block relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="relative h-[350px] sm:h-[400px]">
                        <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        {/* Event Badge */}
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-900/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-light">
                            {event.isPaid ? "Evento pagado" : "Evento gratuito"}
                          </span>
                        </div>

                        {/* Date Badge */}
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{day}</div>
                          <div className="text-xs sm:text-sm text-white/60 uppercase">{month}</div>
                        </div>

                        {/* Event Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex-shrink-0">
                              <Image
                                src={event.organizerLogo || "/placeholder.svg"}
                                alt={event.organizerName}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs sm:text-sm text-white/80 font-light">{event.organizerName}</span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-white/90 transition-colors">
                            {event.name}
                          </h3>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                            <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors">
                              Ver detalles
                            </button>

                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-black" />
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-black" />
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-black" />
                              </div>
                              <span className="text-xs text-white/60">
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
          </div>

          {/* Owned Events Section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Owned by me</h2>
            {ownedEvents.length === 0 ? (
              <p className="text-white/60 text-center py-8">No owned events yet</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {ownedEvents.map((event) => {
                  const { day, month } = formatDate(event.date)
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="group block relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="relative h-[350px] sm:h-[400px]">
                        <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        {/* Event Badge */}
                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-900/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-light">
                            {event.isPaid ? "Evento pagado" : "Evento gratuito"}
                          </span>
                        </div>

                        {/* Date Badge */}
                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{day}</div>
                          <div className="text-xs sm:text-sm text-white/60 uppercase">{month}</div>
                        </div>

                        {/* Event Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex-shrink-0">
                              <Image
                                src={event.organizerLogo || "/placeholder.svg"}
                                alt={event.organizerName}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs sm:text-sm text-white/80 font-light">{event.organizerName}</span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-white/90 transition-colors">
                            {event.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}