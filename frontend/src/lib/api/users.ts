import { api } from '../../utils/api'
import type { UserProfile } from '../types/auth'
import type { Event } from '../types/events'

// ✅ Función auxiliar para calcular attendeesCount
const calculateAttendeesCount = (attendees: any[] | undefined): number => {
  if (!attendees || !Array.isArray(attendees)) return 0;
  
  return attendees.reduce((total, attendee) => {
    return total + (attendee.ticketsBought || 1);
  }, 0);
}

export const usersApi = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateProfile: async (userID: number, updateData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch(`/users/${userID}`, updateData)
    return response.data
  },  

  addBalance: async (userId: number, amount: number) => {
    const response = await api.post(`/users/${userId}/balance`, { amount })
    return response.data
  },

  getTransactions: async (userId: number) => {
    const response = await api.get(`/users/${userId}/transactions`)
    return response.data
  },

  getJoinedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/joined-events')
    console.log('✅ Joined events FROM BACKEND:', response.data)
    return response.data // ✅ Ya viene con attendeesCount calculado
  },

  getOwnedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/created-events')
    console.log('✅ Owned events FROM BACKEND:', response.data)
    return response.data // ✅ Ya viene con attendeesCount calculado
  },

  // Get top event creators
  getTopCreators: async (limit: number = 3) => {
    const response = await api.get('/users/top-creators', { params: { limit } })
    return response.data
  },
}