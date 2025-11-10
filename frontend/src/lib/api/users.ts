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

  // Nueva función para obtener eventos a los que el usuario se unió
  getJoinedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/joined-events')
    return response.data
  },

  // Función para obtener eventos creados por el usuario
  getOwnedEvents: async (): Promise<Event[]> => {
    const response = await api.get('/users/me/created-events')
    return response.data
  },

}