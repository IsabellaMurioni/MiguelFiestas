import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 1. Limpiar toda la cache de React Query
      queryClient.clear()
      
      // 2. Redirigir al login después de un pequeño delay
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Aún así limpiar el estado local y redirigir
      queryClient.clear()
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  })
}