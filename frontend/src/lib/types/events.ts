export type EventCategory = 'CONCERTS' | 'FESTIVALS' | 'THEMATIC_MEETINGS' | 'SPORTS' | 'NEIGHBORHOOD_GATHERINGS' | 'BIRTHDAYS' | 'WEDDINGS' | 'CONFERENCES' | 'EXHIBITIONS'

export type EventStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED'

type Image = {
  id: string,
  url: string,
  eventID: number
}

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
  images: Image[]
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