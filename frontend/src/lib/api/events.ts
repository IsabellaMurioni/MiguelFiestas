import { api } from '../../utils/api'
import type { Event } from '../types/events'

export const eventsApi = {
  getEvents: async (filters?: any): Promise<Event[]> => {
    const response = await api.get('/events', { params: filters })
    return response.data
  },

  getEventById: async (eventId: number): Promise<Event> => {
    const response = await api.get(`/events/${eventId}`)
    return response.data
  },

  createEvent: async (eventData: any) => {
    const response = await api.post('/events', eventData)
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

  confirmAttendance: async (eventId: number) => {
    const response = await api.post(`/events/${eventId}/confirm`)
    return response.data
  },

  buyTicket: async (eventId: number, quantity: number = 1) => {
    const response = await api.post(`/events/${eventId}/buy`, { quantity })
    return response.data
  },

  cancelAttendance: async (eventId: number) => {
    const response = await api.delete(`/events/${eventId}/attendance`)
    return response.data
  }
}