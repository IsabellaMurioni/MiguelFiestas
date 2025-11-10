// src/lib/hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import type { UpdateProfileData } from '../types/auth'

// Hook para obtener perfil del usuario
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: usersApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  })
}

// Hook para actualizar perfil - CORREGIDO
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateProfileData }) =>
      usersApi.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Hook para agregar saldo - CORREGIDO
export const useAddBalance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, amount }: { userId: number; amount: number }) =>
      usersApi.addBalance(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

// Hook para obtener transacciones
export const useTransactions = (userId: number) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => usersApi.getTransactions(userId),
    enabled: !!userId,
  })
}