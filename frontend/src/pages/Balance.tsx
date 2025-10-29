"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useState, useEffect } from "react"
import profileImg from "../assets/profile.jpg"
import airbagImg from "../assets/airbag.jpeg"
import breshImg from "../assets/bresh.jpeg"

// Types for backend integration
interface User {
  id: string
  name: string
  email: string
  profileImage: string
}

interface Transaction {
  id: string
  eventName: string
  eventImage: string
  date: string
  time: string
  amount: number
  type: "debit" | "credit"
}

interface BalanceData {
  user: User
  balance: number
  transactions: Transaction[]
}

export default function BalancePage() {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBalanceData()
  }, [])

  const fetchBalanceData = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/balance', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // })
      // const data = await response.json()
      // setBalanceData(data)

      // Mock data for development
      const mockData: BalanceData = {
        user: {
          id: "1",
          name: "Isabella's Account",
          email: "isabella@example.com",
          profileImage: profileImg,
        },
        balance: 500.0,
        transactions: [
          {
            id: "1",
            eventName: "Airbag River Plate",
            eventImage: airbagImg,
            date: "21 de diciembre",
            time: "21:00h",
            amount: -100,
            type: "debit",
          },
          {
            id: "2",
            eventName: "Bresh Estadio Geba",
            eventImage: breshImg,
            date: "10 de diciembre",
            time: "23:00h",
            amount: -150,
            type: "debit",
          },
        ],
      }

      setBalanceData(mockData)
    } catch (err) {
      setError("Failed to load balance data")
      console.error("Error fetching balance:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async () => {
    // TODO: Implement transfer functionality
    console.log("Transfer clicked")
  }

  const handleAddMoney = async () => {
    // TODO: Implement add money functionality
    console.log("Add money clicked")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header currentPath="/balance" />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white/60">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !balanceData) {
    return (
      <div className="min-h-screen bg-black">
        <Header currentPath="/balance" />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500">{error || "Failed to load data"}</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header currentPath="/balance" />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 flex-1">
        {/* Balance Card */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="bg-black border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={balanceData.user.profileImage || "/placeholder.svg"}
                  alt={balanceData.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-white">{balanceData.user.name}</h1>
            </div>

            {/* Balance Amount */}
            <div className="py-6 sm:py-8">
              <p className="text-white/60 text-sm mb-2">Available balance</p>
              <p className="text-4xl sm:text-5xl font-bold text-white">
                $ {balanceData.balance.toFixed(2).replace(".", ",")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleTransfer}
                className="px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 bg-black text-white border border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                TRANSFER
              </button>
              <button
                onClick={handleAddMoney}
                className="px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 bg-black text-white border border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                ADD MONEY
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Today</h2>

          <div className="space-y-3 sm:space-y-4">
            {balanceData.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-black border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Event Image */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={transaction.eventImage || "/placeholder.svg"}
                      alt={transaction.eventName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-medium text-white truncate">{transaction.eventName}</h3>
                    <p className="text-xs sm:text-sm text-white/60 mt-1">
                      {transaction.date} - {transaction.time}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className={`text-base sm:text-lg font-semibold ${
                        transaction.type === "debit" ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {transaction.type === "debit" ? "-" : "+"}${Math.abs(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {balanceData.transactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No transactions yet</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
