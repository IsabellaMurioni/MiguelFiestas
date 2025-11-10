import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no está autenticado
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)