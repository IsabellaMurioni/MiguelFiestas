// src/lib/api/events.ts
import { api } from '../../utils/api'
import type { Event } from '../types/events'

export const eventsApi = {
  getEvents: async (filters?: any): Promise<Event[]> => {
    const response = await api.get('/events', { params: filters })
    console.log("Events data", response.data)
    return response.data
  },

  getEventById: async (eventId: number): Promise<Event> => {
    const response = await api.get(`/events/${eventId}`)
    console.log('Event data:', response.data)
    return response.data
  },

  createEvent: async (eventData: FormData) => {
    const response = await api.post('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updateEvent: async (eventId: number, updateData: any) => {
    const response = await api.patch(`/events/${eventId}`, updateData)
    return response.data
  },

  cancelEvent: async (eventId: number) => {
    const response = await api.post(`/events/${eventId}/cancel`)
    return response.data
  },

  confirmAttendance: async (eventId: number): Promise<Event> => { // ✅ Cambiado para devolver Event
    const response = await api.post(`/events/${eventId}/confirm`)
    console.log('Confirm attendance response:', response.data)
    // ✅ Asegurar que devuelve el evento completo con attendeesCount
    return response.data.data || response.data
  },

  buyTicket: async (eventId: number, quantity: number = 1): Promise<Event> => { // ✅ Cambiado para devolver Event
    const response = await api.post(`/events/${eventId}/buy`, { quantity })
    console.log('Buy ticket response:', response.data)
    // ✅ Asegurar que devuelve el evento completo con attendeesCount
    return response.data.data || response.data
  },

  cancelAttendance: async (eventId: number) => {
    const response = await api.delete(`/events/${eventId}/attendance`)
    return response.data
  }
}