import { useEffect, useState } from 'react'
import { usersApi } from '../api/users'
import type { EventCreator } from '../types/home'

// Hooks para la página Home
export const useTopCreators = () => {
  const [data, setData] = useState<EventCreator[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreators = async () => {
      setIsLoading(true)
      try {
        const creators = await usersApi.getTopCreators(3)
        setData(creators)
        setError(null)
      } catch (err) {
        console.error('Error fetching top creators:', err)
        setError('Failed to load creators')
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCreators()
  }, [])

  return { 
    data, 
    isLoading,
    error
  }
}

export const useFeaturedEvent = () => {
  return { 
    data: null, 
    isLoading: false 
  }
}

export const useFAQs = () => {
  return { 
    data: [], 
    isLoading: false 
  }
}