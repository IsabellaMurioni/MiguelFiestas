// src/pages/BalancePage.tsx
"use client"

import { Header } from "../components/Header"
import Footer from "../components/Footer"
import { useBalanceData, useAddBalance } from "../lib/hooks/useBalance"
import { useState } from "react"
import { X, Plus } from "lucide-react"

export default function BalancePage() {
  const { data: balanceData, isLoading, error } = useBalanceData()
  const addBalanceMutation = useAddBalance()

  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [amount, setAmount] = useState("")
  const [amountError, setAmountError] = useState("")

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : parts[0][0].toUpperCase()
  }

  const validateAmount = (value: string): string => {
    if (!value.trim()) return "Amount is required"

    const numValue = parseFloat(value)
    if (isNaN(numValue)) return "Please enter a valid number"
    if (numValue <= 0) return "Amount must be greater than 0"
    if (numValue > 50000) return "Maximum amount is $50,000"
    if (!/^\d*\.?\d{0,2}$/.test(value)) return "Maximum 2 decimal places allowed"

    return ""
  }

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const sanitizedValue = value.replace(/[^\d.]/g, '')
    
    // Prevent multiple decimal points
    const parts = sanitizedValue.split('.')
    if (parts.length > 2) {
      return
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return
    }
    
    setAmount(sanitizedValue)
    setAmountError(validateAmount(sanitizedValue))
  }

  const handleAddMoney = async () => {
    const error = validateAmount(amount)
    if (error) {
      setAmountError(error)
      return
    }

    try {
      await addBalanceMutation.mutateAsync(parseFloat(amount))
      setShowAddMoneyModal(false)
      setAmount("")
      setAmountError("")
    } catch (err) {
      console.error('Failed to add money:', err)
    }
  }

  const handleCloseModal = () => {
    setShowAddMoneyModal(false)
    setAmount("")
    setAmountError("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white/60 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
              <p>Loading balance...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500 text-center">
              <p className="text-lg mb-2">Error loading balance</p>
              <p className="text-sm">Please try again later</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!balanceData) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white/60">No balance data found</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 pt-24 pb-12 flex-1">
        {/* Balance Card */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="bg-black border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {/* User Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              {/* Avatar con iniciales */}
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/40 to-white/10 animate-[spin_6s_linear_infinite] blur-sm"></div>
                <div className="relative w-full h-full rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                    {getInitials(balanceData.user.name)}
                </div>
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
                onClick={() => setShowAddMoneyModal(true)}
                className="px-8 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 bg-white text-black hover:bg-white/90 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                ADD MONEY
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">Recent Transactions</h2>

          <div className="space-y-3 sm:space-y-4">
            {balanceData.transactions.map((transaction: any) => {
              const type = transaction.amount < 0 ? "debit" : "credit"
              const description = type === "debit" ? "Ticket Purchase" : "Balance Deposit"
              const date = new Date(transaction.createdAt).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })
              const time = new Date(transaction.createdAt).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })

              return (
                <div
                  key={transaction.id}
                  className="bg-black border border-white/10 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 border-2 border-white/20 flex items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        type === "debit" ? "bg-red-500/20" : "bg-green-500/20"
                      }`}>
                        <span className={`text-lg ${
                          type === "debit" ? "text-red-400" : "text-green-400"
                        }`}>
                          {type === "debit" ? "↓" : "↑"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">
                        {description}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">
                        {date} at {time}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-base sm:text-lg font-semibold ${
                          type === "debit" ? "text-red-400" : "text-green-400"
                        }`}
                      >
                        {type === "debit" ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {balanceData.transactions.length === 0 && (
            <div className="text-center py-12 border border-white/10 rounded-2xl">
              <p className="text-white/60 mb-4">No transactions yet</p>
              <p className="text-white/40 text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Add Money</h2>
                <p className="text-white/60 text-sm">Enter the amount you want to add to your balance</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">$</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 rounded-xl font-light text-lg transition-all duration-200"
                    />
                  </div>
                  {amountError && (
                    <p className="text-red-400 text-sm">{amountError}</p>
                  )}
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[1000, 3000, 6000, 9000, 15000, 30000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleAmountChange(quickAmount.toString())}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-transparent text-white border border-white/40 rounded-xl font-medium hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMoney}
                  disabled={!!amountError || !amount || addBalanceMutation.isPending}
                  className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {addBalanceMutation.isPending ? "Adding..." : "Add Money"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}