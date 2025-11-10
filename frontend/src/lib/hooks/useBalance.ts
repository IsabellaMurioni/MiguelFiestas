import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'

export const useBalanceData = () => {
  return useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const profile = await usersApi.getProfile()
      const transactions = await usersApi.getTransactions(profile.id)
      
      return {
        user: {
          name: `${profile.firstName} ${profile.lastName}`
        },
        balance: profile.balance,
        transactions
      }
    }
  })
}

export const useAddBalance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (amount: number) => {
      const profile = await usersApi.getProfile()
      return usersApi.addBalance(profile.id, amount)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}