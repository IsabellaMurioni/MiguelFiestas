"use client"

import Footer from "../components/Footer"
import { useState, useEffect, useCallback } from "react"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "../components/Header"
import { eventsApi } from "../lib/api/events"
import { useToast } from "../components/ToastProvider"
import { useProfile } from "../lib/hooks/useProfile"

import type { Event as BackendEvent } from "../lib/types/events"

type Event = BackendEvent

// ✅ Configuración del backend
const BACKEND_BASE_URL = 'http://localhost:8080';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("most-popular")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const maxTickets = 5
  const { showToast } = useToast()
  const { data: profile } = useProfile()
  const [confirmedEvents, setConfirmedEvents] = useState<Set<number>>(new Set())

  const existingTicketsForSelected = selectedEvent ? (selectedEvent.attendees?.find((a: any) => a.userId === profile?.id)?.ticketsBought ?? 0) : 0
  const remainingAllowed = Math.max(0, maxTickets - existingTicketsForSelected)

  const isEventCreator = selectedEvent?.creatorId === profile?.id;

  // Obtener imágenes del evento seleccionado
  const selectedEventImages = selectedEvent?.images || []
  const hasMultipleImages = selectedEventImages.length > 1

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [searchQuery, activeFilter, events])

  const fetchEvents = async () => {
    try {
      const filters = {
        free: activeFilter === "free" ? true : activeFilter === "paid" ? false : undefined
      }
      const eventsData = await eventsApi.getEvents(filters)
      setEvents(eventsData)
      setFilteredEvents(eventsData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching events:", error)
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    if (searchQuery.trim()) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (activeFilter === "free") {
      filtered = filtered.filter((event) => event.isFree)
    } else if (activeFilter === "paid") {
      filtered = filtered.filter((event) => !event.isFree)
    }

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

  const openEventModal = (event: Event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
    setCurrentImageIndex(0) // Resetear índice al abrir modal
    // Set initial quantity to 1 but cap to remaining allowed for this user
    const existingTickets = event.attendees?.find((a: any) => a.userId === profile?.id)?.ticketsBought ?? 0
    const remaining = Math.max(0, maxTickets - existingTickets)
    setTicketQuantity(remaining > 0 ? 1 : 0)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setSelectedEvent(null)
      setCurrentImageIndex(0)
    }, 300)
  }

  // Navegación del carrusel
  const nextImage = useCallback(() => {
    if (selectedEventImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedEventImages.length - 1 ? 0 : prevIndex + 1
      )
    }
  }, [selectedEventImages.length])

  const prevImage = useCallback(() => {
    if (selectedEventImages.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedEventImages.length - 1 : prevIndex - 1
      )
    }
  }, [selectedEventImages.length])

  // Auto-avance del carrusel
  useEffect(() => {
    if (isModalOpen && hasMultipleImages) {
      const interval = setInterval(nextImage, 5000) // Cambiar cada 5 segundos
      return () => clearInterval(interval)
    }
  }, [isModalOpen, hasMultipleImages, nextImage])

  const handlePurchase = async () => {
  if (!selectedEvent) return

  try {
    let result;
    
    if (!selectedEvent.isFree) {
      result = await eventsApi.buyTicket(selectedEvent.id, ticketQuantity)
      const total = selectedEvent.price * ticketQuantity
      showToast(`Purchase successful! Total: $${total.toLocaleString()}`, 'success', {
        center: true,
        actions: [
          { label: 'Continue shopping', variant: 'secondary' },
          { label: 'Go to my events', to: '/profile', variant: 'primary' },
        ],
        duration: 6000,
      })
    } else {
      result = await eventsApi.confirmAttendance(selectedEvent.id)
      showToast('Attendance confirmed!', 'success', {
        center: true,
        actions: [
          { label: 'Continue shopping', variant: 'secondary' },
          { label: 'Go to my events', to: '/profile', variant: 'primary' },
        ],
        duration: 6000,
      })
      // mark as confirmed locally so button disables immediately
      if (selectedEvent && selectedEvent.id) {
        setConfirmedEvents((prev) => new Set(prev).add(selectedEvent.id))
      }
    }

    // ✅ ACTUALIZAR EL CONTADOR DE PARTICIPANTES INMEDIATAMENTE
    if (result && result.attendeesCount !== undefined) {
      setSelectedEvent(prev => prev ? { ...prev, attendeesCount: result.attendeesCount } : null)
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, attendeesCount: result.attendeesCount }
            : event
        )
      )
    }

    closeModal()
    
  } catch (error) {
    console.error("Error processing purchase:", error)
    // Prefer server-provided message when available (axios interceptor also normalizes to error.message)
    const serverMessage = (error as any)?.response?.data?.error ?? (error as any)?.response?.data?.message ?? (error as any)?.message ?? String(error)
    // If it's an insufficient balance error, offer to go to balance page
    if (serverMessage && serverMessage.toLowerCase().includes('insufficient')) {
      showToast(serverMessage, 'error', {
        center: true,
        actions: [
          { label: 'Go to Balance', to: '/balance', variant: 'primary' },
        ],
        duration: 8000,
      })
    } else {
      showToast(serverMessage, 'error', { center: true, duration: 6000 })
    }
  }
}

  // ✅ MEJORADO: Función para obtener la URL de imagen del evento con cache de fallos
  const getEventImage = (event: Event) => {
    if (event.images && event.images.length > 0) {
      const imageUrl = event.images[0].url;
      
      // Si la URL ya es completa, usarla directamente
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      const fullImageUrl = `${BACKEND_BASE_URL}${imageUrl}`;
      
      // ✅ Verificar si esta imagen ya falló antes
      if (failedImages.has(fullImageUrl)) {
        return "/placeholder.svg";
      }
      
      return fullImageUrl;
    }
    return "/placeholder.svg";
  }

  // ✅ MEJORADO: Función para obtener la URL de imagen del carrusel con cache de fallos
  const getCarouselImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    const fullImageUrl = `${BACKEND_BASE_URL}${imageUrl}`;
    
    // ✅ Verificar si esta imagen ya falló antes
    if (failedImages.has(fullImageUrl)) {
      return "/placeholder.svg";
    }
    
    return fullImageUrl;
  }

  // ✅ MEJORADO: Manejo de errores de imagen que evita el bucle
  const handleImageError = (imageUrl: string) => {
    console.log(`Image failed to load: ${imageUrl}`);
    // ✅ Agregar al set de imágenes fallidas para evitar reintentos
    setFailedImages(prev => new Set(prev).add(imageUrl));
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            <span className="italic">Trending</span> events
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto px-4">
            Join a community built for connection. Whether you're hosting a concert, workshop, or casual meetup.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button onClick={() => setActiveFilter("most-popular")} className={getFilterButtonClasses("most-popular")}>
            All
          </button>
          <button onClick={() => setActiveFilter("free")} className={getFilterButtonClasses("free")}>
            Free
          </button>
          <button onClick={() => setActiveFilter("paid")} className={getFilterButtonClasses("paid")}>
            Paid
          </button>
        </div>

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

        {isLoading ? (
          <div className="text-center text-white/60 py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center text-white/60 py-12">No events found</div>
        ) : (
          <div className="space-y-6 sm:space-y-8 container mx-auto">
            {filteredEvents.map((event) => {
              const { day, month } = formatDate(event.date)
              const eventImageUrl = getEventImage(event)
              
              return (
                <button
                  key={event.id}
                  onClick={() => openEventModal(event)}
                  className="group block relative overflow-hidden rounded-[32px] border border-white/10 hover:border-white/20 transition-all duration-300 w-full text-left cursor-pointer"
                >
                  <div className="relative h-[400px] sm:h-[500px] overflow-hidden">
                    <img
                      src={eventImageUrl}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={() => handleImageError(eventImageUrl)}
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

                    <div className="absolute top-10 right-10">
                      <div className="flex flex-col items-center">
                        <p className="text-5xl font-light text-white">{day}</p>
                        <p className="text-white/60 text-sm font-light tracking-wider uppercase">{month}</p>
                      </div>
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
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 border-2 border-black"
                              />
                            ))}
                          </div>
                          <p className="text-white/60 text-sm font-light tracking-wide">
                            {formatParticipants(event.attendeesCount || 0)} participants
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div
            className="relative bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Carrusel de imágenes */}
            <div className="relative h-64 overflow-hidden rounded-t-3xl">
              {selectedEventImages.length > 0 ? (
                <>
                  <img
                    src={getCarouselImageUrl(selectedEventImages[currentImageIndex].url)}
                    alt={`${selectedEvent.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(getCarouselImageUrl(selectedEventImages[currentImageIndex].url))}
                  />
                  
                  {/* Controles del carrusel */}
                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          prevImage()
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          nextImage()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>

                      {/* Indicadores de posición */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {selectedEventImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentImageIndex(index)
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex 
                                ? 'bg-white' 
                                : 'bg-white/50 hover:bg-white/70'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-white/60">No image available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm text-white font-light ${
                    selectedEvent.isFree ? 'bg-emerald-700/80' : 'bg-red-900/80'
                  }`}
                >
                  {selectedEvent.isFree ? 'Free Event' : 'Paid Event'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs text-white font-light border border-white/20">
                  {selectedEvent.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex-1">
                  {selectedEvent.title}
                </h2>
                <div className="absolute top-10 left-10">
                  <div className="flex flex-col items-center">
                    <p className="text-5xl font-light text-white">{formatDate(selectedEvent.date).day}</p>
                    <p className="text-white/60 text-sm font-light tracking-wider uppercase">
                      {formatDate(selectedEvent.date).month}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-base leading-relaxed">{selectedEvent.longDesc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Organizer</p>
                  <p className="text-white font-medium">
  {`${selectedEvent.creator?.firstName || ''} ${selectedEvent.creator?.lastName || ''}`.trim() || 'Unknown'}
</p>
                </div>
                {selectedEvent.location && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Location</p>
                    <p className="text-white font-medium">{selectedEvent.location}</p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-white/40 text-sm">Participants</p>
                  <p className="text-white font-medium">{formatParticipants(selectedEvent.attendeesCount || 0)}</p>
                </div>
                {!selectedEvent.isFree && (
                  <div className="space-y-1">
                    <p className="text-white/40 text-sm">Price</p>
                    <p className="text-white font-medium text-xl">${selectedEvent.price.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {!selectedEvent.isFree && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="text-white/80">Quantity:</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-white text-lg font-medium">
                          {ticketQuantity}
                        </span>
                        <button
                          onClick={() => setTicketQuantity(Math.min(remainingAllowed, ticketQuantity + 1))}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-white/60 text-sm">
                      Remaining {remainingAllowed} of {maxTickets} tickets available for you
                    </span>
                  </div>

                  {selectedEvent.price && (
                    <div className="flex justify-between items-center text-white">
                      <span className="text-lg">Total:</span>
                      <span className="text-2xl font-bold">
                        ${(selectedEvent.price * ticketQuantity).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handlePurchase}
                  disabled={isEventCreator}
                  className={`flex-1 px-8 py-4 rounded-full font-medium tracking-wider uppercase text-sm transition-all duration-200 ${
                    isEventCreator
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {isEventCreator 
                    ? 'Event Creator' 
                    : !selectedEvent?.isFree 
                      ? 'Buy Ticket' 
                      : 'Confirm Attendance'
                  }
                </button>
                <button
                  onClick={closeModal}
                  className="px-8 py-4 bg-transparent text-white border border-white/40 rounded-full font-medium tracking-wider uppercase text-sm hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
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