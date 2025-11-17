"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { useProfile, useJoinedEvents, useOwnedEvents, useUpdateProfile } from "../lib/hooks/useProfile"
import type { UserProfile } from "../lib/types/auth"
import type { Event } from "../lib/types/events"
import { useState, useEffect } from "react"
import { Edit, X, Plus } from "lucide-react"

export default function ProfilePage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()
  const { data: joinedEvents = [], isLoading: joinedLoading, error: joinedError } = useJoinedEvents()
  const { data: ownedEvents = [], isLoading: ownedLoading, error: ownedError } = useOwnedEvents()
  const updateProfileMutation = useUpdateProfile()
  
  const [selectedJoinedEvent, setSelectedJoinedEvent] = useState<Event | null>(null)
  const [isJoinedModalOpen, setIsJoinedModalOpen] = useState(false)

  const openJoinedModal = (event: Event) => {
    setSelectedJoinedEvent(event)
    setIsJoinedModalOpen(true)
  }

  const closeJoinedModal = () => {
    setIsJoinedModalOpen(false)
    setTimeout(() => setSelectedJoinedEvent(null), 300)
  }

  const [selectedOwnedEvent, setSelectedOwnedEvent] = useState<Event | null>(null)
  const [isOwnedModalOpen, setIsOwnedModalOpen] = useState(false)

  const openOwnedModal = (event: Event) => {
    setSelectedOwnedEvent(event)
    setIsOwnedModalOpen(true)
  }

  const closeOwnedModal = () => {
    setIsOwnedModalOpen(false)
    setTimeout(() => setSelectedOwnedEvent(null), 300)
  }

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: ""
  })

  // Inicializar el formulario cuando el perfil se carga
  useEffect(() => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      })
    }
  }, [profile])

  const isLoading = profileLoading || joinedLoading || ownedLoading
  const hasError = profileError || joinedError || ownedError

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("en", { month: "short" }).toUpperCase()
    return { day, month }
  }

  const formatParticipants = (attendees: any[] | undefined) => {
    const count = attendees?.length || 0
    if (count >= 1000) {
      return `+${Math.floor(count / 1000)}k`
    }
    return `+${count}`
  }

  const getFullName = (profile: UserProfile) => {
    return `${profile.firstName} ${profile.lastName}`
  }

  const getInitials = (profile: UserProfile) => {
    return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
  }

  // Función para obtener la URL de la imagen del evento
  const getEventImageUrl = (event: Event): string => {
    // Si event.images existe y es un array
    if (event.images && Array.isArray(event.images)) {
      // Si el array no está vacío
      if (event.images.length > 0) {
        // Si el primer elemento es un objeto con propiedad 'url'
        if (typeof event.images[0] === 'object' && event.images[0] !== null && 'url' in event.images[0]) {
          return (event.images[0] as any).url
        }
        // Si el primer elemento es una string (URL directa)
        else if (typeof event.images[0] === 'string') {
          return event.images[0]
        }
      }
    }
    
    // Si event.images es una string directa (backward compatibility)
    if (typeof event.images === 'string') {
      return event.images
    }
    
    // Fallback a imagen placeholder
    return "/placeholder.svg"
  }

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: ""
    }

    if (!editForm.firstName.trim()) {
      errors.firstName = "First name is required"
    }

    if (!editForm.lastName.trim()) {
      errors.lastName = "Last name is required"
    }

    if (!editForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    setFormErrors(errors)
    return !errors.firstName && !errors.lastName && !errors.email
  }

  const handleEditProfile = async () => {
    if (!validateForm()) return

    try {
      await updateProfileMutation.mutateAsync({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email
      })
      
      setShowEditModal(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      })
    }
    setFormErrors({ firstName: "", lastName: "", email: "" })
  }

  const handleOpenEditModal = () => {
    if (profile) {
      setEditForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email
      })
    }
    setShowEditModal(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center text-white/60 py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="mt-2">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center text-red-500 py-12">
            <p className="text-lg mb-2">Error loading profile</p>
            <p className="text-sm">Please try again later</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="text-center text-white/60 py-12">Profile not found</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card - estilo IGUAL al recuadro de Balance */}
          <div className="bg-black border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {/* Avatar e Info (igual que el balance visualmente) */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              {/* Avatar with animation same as Balance */}
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/40 to-white/10 animate-[spin_6s_linear_infinite] blur-sm"></div>
                <div className="relative w-full h-full rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                  {getInitials(profile)}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-lg sm:text-xl font-semibold text-white truncate">
                    {getFullName(profile)}
                  </h1>
                  <button
                    onClick={handleOpenEditModal}
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white/60 border border-white/20 hover:bg-white/10 hover:text-white/90 hover:border-white/40 transition-all duration-200"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                </div>
                <p className="text-sm sm:text-base text-white/60 truncate">{profile.email}</p>
                <p className="text-sm text-white/40 mt-1">@{profile.nickName}</p>
              </div>
            </div>

            {/* Profile statistics with the same look as balance */}
            <div className="py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl sm:text-3xl font-bold text-white">${profile.balance.toFixed(2)}</p>
                <p className="text-white/60 text-sm mt-2">Balance</p>
              </div>
              <div>
                <p className="text-4xl sm:text-3xl font-bold text-white">{profile.ticketsBought}</p>
                <p className="text-white/60 text-sm mt-2">Tickets</p>
              </div>
              <div>
                <p className="text-4xl sm:text-3xl font-bold text-white">{profile.confirmations}</p>
                <p className="text-white/60 text-sm mt-2">Confirmations</p>
              </div>
            </div>
          </div>

          {/* Joined Events Section */}
          <div className="mt-12 sm:mt-16 mb-12 sm:mb-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Joined events</h2>
              <span className="text-white/60 text-sm">
                {joinedEvents.length} event{joinedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {joinedEvents.length === 0 ? (
              <div className="text-center py-12 border border-white/10 rounded-2xl">
                <p className="text-white/60 mb-4">No joined events yet</p>
                <Link
                  to="/events"
                  className="inline-block px-6 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {joinedEvents.map((event: Event) => {
                  const { day, month } = formatDate(event.date)
                  const eventImageUrl = getEventImageUrl(event)
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => openJoinedModal(event)}
                      className="group block relative overflow-hidden rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 w-full text-left cursor-pointer"
                    >
                      <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                        <img
                          src={eventImageUrl}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Si la imagen falla al cargar, usar placeholder
                            (e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        <div className="absolute top-10 left-12">
                          <span
                            className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm text-white font-light ${
                              event.isFree ? 'bg-emerald-700/80' : 'bg-red-900/80'
                            }`}
                          >
                            {event.isFree ? 'Free' : 'Paid'}
                          </span>
                        </div>

                        <div className="absolute top-10 right-10 text-center">
                          <p className="text-5xl font-light text-white">{day}</p>
                          <p className="text-white/60 text-sm font-light tracking-wider uppercase">{month}</p>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 space-y-4 p-6">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-xs text-white font-light border border-white/20">
                              {event.category}
                            </span>
                          </div>

                          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{event.title}</h3>

                          <p className="text-white/80 text-base font-light tracking-wide max-w-2xl">{event.shortDesc}</p>

                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openJoinedModal(event) }}
                                className="px-6 py-3 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors"
                              >
                                View details
                              </button>

                              <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                              </div>
                              <p className="text-white/60 text-sm font-light tracking-wide">
                                {formatParticipants(event.attendees)} participants
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Owned Events Section */}
          <div>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Owned by me</h2>
              <span className="text-white/60 text-sm">
                {ownedEvents.length} event{ownedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {ownedEvents.length === 0 ? (
              <div className="text-center py-12 border border-white/10 rounded-2xl">
                <p className="text-white/60 mb-4">You haven't created any events yet</p>
                <p className="text-white/40 text-sm mb-4">
                  Use the "Create Event" section above to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {ownedEvents.map((event: Event) => {
                  const { day, month } = formatDate(event.date)
                  const eventImageUrl = getEventImageUrl(event)
                  
                  return (
                    <div
                      key={event.id}
                      onClick={() => openOwnedModal(event)}
                      className="group block relative overflow-hidden rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 w-full text-left cursor-pointer"
                    >
                      <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                        <img
                          src={eventImageUrl}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        <div className="absolute top-10 left-12">
                          <span
                            className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm text-white font-light ${
                              event.isFree ? 'bg-emerald-700/80' : 'bg-red-900/80'
                            }`}
                          >
                            {event.isFree ? 'Free' : 'Paid'}
                          </span>
                        </div>

                        <div className="absolute top-10 right-10 text-center">
                          <p className="text-5xl font-light text-white">{day}</p>
                          <p className="text-white/60 text-sm font-light tracking-wider uppercase">{month}</p>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8 space-y-4 p-6">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-xs text-white font-light border border-white/20">
                              {event.category}
                            </span>
                          </div>

                          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{event.title}</h3>

                          <p className="text-white/80 text-base font-light tracking-wide max-w-2xl">{event.shortDesc}</p>

                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openOwnedModal(event) }}
                                className="px-6 py-3 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors"
                              >
                                View details
                              </button>

                              <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black" />
                              </div>
                              <p className="text-white/60 text-sm font-light tracking-wide">
                                {formatParticipants(event.attendees)} participants
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

          {/* Create Event Section - Siempre visible */}
          <div className="mt-12 sm:mt-16 mb-12 sm:mb-16">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Create New Event</h2>
            </div>
            
            <div className="text-center py-12 border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start Creating Events</h3>
                <p className="text-white/60 mb-6">
                  Share your passion and create unforgettable experiences for the community
                </p>
                <Link
                  to="/create-event"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </Link>
              </div>
            </div>
          </div>

          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <p className="text-white/60 text-sm">Update your personal information</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                    />
                    {formErrors.firstName && (
                      <p className="text-red-400 text-xs">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                    />
                    {formErrors.lastName && (
                      <p className="text-red-400 text-xs">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl transition-all duration-200"
                  />
                  {formErrors.email && (
                    <p className="text-red-400 text-xs">{formErrors.email}</p>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-white/40 text-xs">
                    Username: <span className="text-white/60">@{profile.nickName}</span>
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Note: Username cannot be changed once created.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-transparent text-white border border-white/40 rounded-xl font-medium hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isJoinedModalOpen && selectedJoinedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeJoinedModal}
        >
          <div
            className="relative bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeJoinedModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={getEventImageUrl(selectedJoinedEvent)}
                alt={selectedJoinedEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              <div className="absolute top-10 left-10">
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-light text-white">{formatDate(selectedJoinedEvent.date).day}</p>
                  <p className="text-white/60 text-sm font-light tracking-wider uppercase">{formatDate(selectedJoinedEvent.date).month}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm text-white font-light ${selectedJoinedEvent.isFree ? 'bg-emerald-700/80' : 'bg-red-900/80'}`}
                >
                  {selectedJoinedEvent.isFree ? 'Free Event' : 'Paid Event'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-white font-light border border-white/20">{selectedJoinedEvent.category}</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex-1">{selectedJoinedEvent.title}</h2>
              </div>

              <p className="text-white/80 text-base leading-relaxed">{selectedJoinedEvent.longDesc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Organizer</p>
                  <p className="text-white font-medium">{selectedJoinedEvent.creator?.name || 'Unknown'}</p>
                </div>
                {selectedJoinedEvent.location && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedJoinedEvent.location}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Participants</p>
                  <p className="text-white font-medium">{formatParticipants(selectedJoinedEvent.attendees)}</p>
                </div>
                {!selectedJoinedEvent.isFree && selectedJoinedEvent.price && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Price</p>
                    <p className="text-white font-medium text-xl">${selectedJoinedEvent.price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isOwnedModalOpen && selectedOwnedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeOwnedModal}
        >
          <div
            className="relative bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeOwnedModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              <img
                src={getEventImageUrl(selectedOwnedEvent)}
                alt={selectedOwnedEvent.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
              <div className="absolute top-10 left-10">
                <div className="flex flex-col items-center">
                  <p className="text-5xl font-light text-white">{formatDate(selectedOwnedEvent.date).day}</p>
                  <p className="text-white/60 text-sm font-light tracking-wider uppercase">{formatDate(selectedOwnedEvent.date).month}</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm text-white font-light ${selectedOwnedEvent.isFree ? 'bg-emerald-700/80' : 'bg-red-900/80'}`}
                >
                  {selectedOwnedEvent.isFree ? 'Free Event' : 'Paid Event'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-white font-light border border-white/20">{selectedOwnedEvent.category}</span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex-1">{selectedOwnedEvent.title}</h2>
              </div>

              <p className="text-white/80 text-base leading-relaxed">{selectedOwnedEvent.longDesc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Organizer</p>
                  <p className="text-white font-medium">{selectedOwnedEvent.creator?.name || 'Unknown'}</p>
                </div>
                {selectedOwnedEvent.location && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedOwnedEvent.location}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Participants</p>
                  <p className="text-white font-medium">{formatParticipants(selectedOwnedEvent.attendees)}</p>
                </div>
                {!selectedOwnedEvent.isFree && selectedOwnedEvent.price && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Price</p>
                    <p className="text-white font-medium text-xl">${selectedOwnedEvent.price.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}