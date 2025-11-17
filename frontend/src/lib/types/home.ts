export interface EventCreator {
  id: number
  nickName?: string
  firstName?: string
  lastName?: string
  eventsCreated: number
  image?: string
  category?: string
  name?: string
}

export interface FeaturedEvent {
  id: number
  title: string
  date: string
  month: string
  image: string
  category: string
  participants: number
  isPaid: boolean
}

export interface FAQ {
  id: number
  question: string
  answer: string
}
