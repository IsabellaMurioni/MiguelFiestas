export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  nickName: string
  firstName: string
  lastName: string
  dni: string
  email: string
  password: string
}

export interface UserProfile {
  id: number
  nickName: string
  firstName: string
  lastName: string
  dni: string
  email: string
  balance: number
  ticketsBought: number
  confirmations: number
}