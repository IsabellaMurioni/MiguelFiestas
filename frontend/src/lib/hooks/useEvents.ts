import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '../api/events'

export const useEvents = (filters?: any) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsApi.getEvents(filters)
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventData: any) => eventsApi.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['ownedEvents'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}

export const useEvent = (eventId: number) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEventById(eventId),
    enabled: !!eventId
  })
}

export const useBuyTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, quantity }: { eventId: number; quantity: number }) =>
      eventsApi.buyTicket(eventId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    }
  })
}

export const useConfirmAttendance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: number) => eventsApi.confirmAttendance(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })
}