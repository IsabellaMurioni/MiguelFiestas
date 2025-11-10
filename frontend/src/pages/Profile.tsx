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

  const getCreatorInitials = (event: Event) => {
    if (event.creator?.firstName && event.creator?.lastName) {
      return `${event.creator.firstName[0]}${event.creator.lastName[0]}`.toUpperCase()
    }
    return event.creator?.name?.[0]?.toUpperCase() || "O"
  }

  const getCreatorName = (event: Event) => {
    if (event.creator?.firstName && event.creator?.lastName) {
      return `${event.creator.firstName} ${event.creator.lastName}`
    }
    return event.creator?.name || "Organizer"
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

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6 sm:p-8 mb-8 sm:mb-12 hover:border-white/20 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 sm:gap-6 flex-1">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 border-2 border-white/20 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl font-bold">
                    {getInitials(profile)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
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
                  
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-2xl font-light text-white">${profile.balance.toFixed(2)}</p>
                      <p className="text-white/40 text-xs font-light tracking-wider uppercase">Balance</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light text-white">{profile.ticketsBought}</p>
                      <p className="text-white/40 text-xs font-light tracking-wider uppercase">Tickets</p>
                    </div>
                    <div>
                      <p className="text-2xl font-light text-white">{profile.confirmations}</p>
                      <p className="text-white/40 text-xs font-light tracking-wider uppercase">Confirmations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Joined Events Section */}
          <div className="mb-12 sm:mb-16">
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
                  const eventImage = event.images ? event.images.split(',')[0] : "/placeholder.svg"
                  
                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="group block relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="relative h-[350px] sm:h-[400px]">
                        <img
                          src={eventImage}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-900/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-light">
                            {event.isFree ? "Free Event" : "Paid Event"}
                          </span>
                        </div>

                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{day}</div>
                          <div className="text-xs sm:text-sm text-white/60 uppercase">{month}</div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {getCreatorInitials(event)}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-white/80 font-light">
                              {getCreatorName(event)}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-white/90 transition-colors">
                            {event.title}
                          </h3>

                          <p className="text-white/80 text-sm mb-3 sm:mb-4 line-clamp-2">
                            {event.shortDesc}
                          </p>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                            <button 
                              onClick={(e) => e.preventDefault()}
                              className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors"
                            >
                              View details
                            </button>

                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-black" />
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-black" />
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-500 border-2 border-black" />
                              </div>
                              <span className="text-xs text-white/60">
                                {formatParticipants(event.attendees)} participants
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

          {/* Create Event Section - Siempre visible */}
          <div className="mb-12 sm:mb-16">
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
                  const eventImage = event.images ? event.images.split(',')[0] : "/placeholder.svg"
                  
                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="group block relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="relative h-[350px] sm:h-[400px]">
                        <img
                          src={eventImage}
                          alt={event.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-900/80 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white font-light">
                            {event.isFree ? "Free Event" : "Paid Event"}
                          </span>
                        </div>

                        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{day}</div>
                          <div className="text-xs sm:text-sm text-white/60 uppercase">{month}</div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {getInitials(profile)}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-white/80 font-light">
                              {getFullName(profile)}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-white/90 transition-colors">
                            {event.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4 line-clamp-2">
                            {event.shortDesc}
                          </p>

                          <button 
                            onClick={(e) => e.preventDefault()}
                            className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-colors"
                          >
                            View details
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

      <Footer />
    </div>
  )
}