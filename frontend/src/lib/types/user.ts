export interface Transaction {
  id: number
  amount: number
  createdAt: string
}

export interface BalanceData {
  user: {
    name: string
  }
  balance: number
  transactions: Transaction[]
}