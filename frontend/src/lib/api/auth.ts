import { api } from '../../utils/api'
import type { LoginData, RegisterData } from '../types/auth'

export const authApi = {
  login: async (credentials: LoginData) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/users/register', userData)
    return response.data
  } 
}