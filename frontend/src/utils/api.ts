import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Redirect to login if not authenticated
      window.location.href = '/'
    }

    // Normalize error message from backend.
    // Backend usually sends { error: '...' } or { message: '...' }
    const serverMessage = error.response?.data?.error ?? error.response?.data?.message;
    if (serverMessage) {
      // Assign to error.message so axios/React Query display the text
      error.message = serverMessage;
    }

    return Promise.reject(error)
  }
)