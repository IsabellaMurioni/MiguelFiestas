export type EventCategory = 'CONCERTS' | 'WORKSHOPS' | 'SPORTS' | 'ARTS' | 'FOOD' | 'OTHER'

export type EventStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED'

export interface Event {
  id: number
  title: string
  shortDesc: string
  longDesc: string
  location: string
  date: string
  price: number
  isFree: boolean
  status: EventStatus
  category: EventCategory
  maxAttendees: number | null
  images: string | null
  creatorId: number
  creator?: {
    name: string
    email: string
    firstName?: string
    lastName?: string
  }
  attendeesCount?: number
  attendees?: any[]
  name?: string
  description?: string
  image?: string
  organizerName?: string
  participants?: number
  isPaid?: boolean
}