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
      // 1. Clear all React Query cache
      queryClient.clear()
      
      // 2. Redirect to login after a small delay
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Still clear local state and redirect
      queryClient.clear()
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    }
  })
}