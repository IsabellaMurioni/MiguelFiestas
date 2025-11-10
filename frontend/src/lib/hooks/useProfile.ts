import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import type { UserProfile } from '../types/auth'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { data: profile } = useProfile()

  return useMutation({
    mutationFn: (updateData: Partial<UserProfile>) => {
      if (!profile) {
        throw new Error('User profile not loaded')
      }
      // Solo pasa los valores, no los tipos
      return usersApi.updateProfile(profile.id, updateData)
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile)
    },
    onError: (error) => {
      console.error('Failed to update profile:', error)
    }
  })
}

export const useJoinedEvents = () => {
  return useQuery({
    queryKey: ['joined-events'],
    queryFn: usersApi.getJoinedEvents
  })
}

export const useOwnedEvents = () => {
  return useQuery({
    queryKey: ['owned-events'],
    queryFn: usersApi.getOwnedEvents
  })
}