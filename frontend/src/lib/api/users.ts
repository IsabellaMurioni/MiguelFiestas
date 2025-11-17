import { api } from '../../utils/api'
import type { UserProfile } from '../types/auth'
import type { Event } from '../types/events'

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

  // Get events the user has joined
  getJoinedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/joined-events')
    return response.data
  },

  // Get events created by the user
  getOwnedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/created-events')
    return response.data
  },

  // Get top event creators
  getTopCreators: async (limit: number = 3) => {
    const response = await api.get('/users/top-creators', { params: { limit } })
    return response.data
  },

}