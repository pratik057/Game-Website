"use client"

import { useState, useContext, useEffect } from "react"
import { UserContext } from "../context/UserContext"
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const WalletControls = () => {
  const { user, balance, updateBalance } = useContext(UserContext)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [displayBalance, setDisplayBalance] = useState(balance)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [activeTab, setActiveTab] = useState("deposit")
  const [transactions, setTransactions] = useState([]) // Store transaction history

  const token = localStorage.getItem("token")

  useEffect(() => {
    if (balance !== displayBalance) {
      const interval = setInterval(() => {
        setDisplayBalance(prev => {
          const diff = balance - prev
          const increment = diff > 0 ? Math.max(1, Math.ceil(diff / 10)) : Math.min(-1, Math.floor(diff / 10))
          
          if (Math.abs(diff) < Math.abs(increment)) {
            clearInterval(interval)
            return balance
          }
          return prev + increment
        })
      }, 50)
      
      return () => clearInterval(interval)
    }
  }, [balance, displayBalance])

  useEffect(() => {
    fetchTransactionHistory()
  }, [])

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch(`https://game-website-yyuo.onrender.com/api/games/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setTransactions(data.transactions) // Store transactions
      } else {
        showNotification("Failed to load transactions", "error")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      showNotification("Could not fetch transactions", "error")
    }
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  const handleDeposit = () => {
    const whatsappMessage = `Name: ${user.username}%0AEmail: ${user.email}%0AAmount to deposit: ${amount}`
    const whatsappLink = `https://wa.me/918975461685?text=${whatsappMessage}`
    window.open(whatsappLink, "_blank")
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div className="bg-gradient-to-br from-gray-800 to-gray-600 p-6 rounded-xl shadow-lg text-white max-w-md w-full mx-auto border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-center">My Wallet</h2>
        
        <motion.div 
          className="mb-6 text-center"
          initial={{ scale: 1 }}
          animate={{ scale: balance !== displayBalance ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-300 mb-1">Current Balance</p>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            COINS: {displayBalance.toFixed(2)}
          </p>
        </motion.div>

        <div className="flex mb-4 bg-gray-700/50 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "deposit" ? "bg-green-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("deposit")}
          >
            <ArrowDownCircle size={18} />
            <span>Deposit</span>
          </button>
          <button
            className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "withdraw" ? "bg-red-600 text-white shadow-md" : "text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            <ArrowUpCircle size={18} />
            <span>Withdraw</span>
          </button>
        </div>

        <div className="mb-4">
          <motion.input
            type="number"
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            min="1"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <motion.button 
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === "deposit" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={handleDeposit}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ArrowDownCircle size={20} />}
          <span>{loading ? "Processing..." : activeTab === "deposit" ? "Add Funds" : "Withdraw Funds"}</span>
        </motion.button>
      </div>

      {/* Transaction History Section */}
      <div className="mt-6 w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Transaction History</h3>
        <div className="h-48 overflow-y-auto">
          {transactions.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="bg-gray-700 text-gray-200">
                <tr>
                  <th className="px-2 py-1">Type</th>
                  <th className="px-2 py-1">Amount</th>
                  <th className="px-2 py-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className={`px-2 py-1 ${txn.type === "deposit" ? "text-green-400" : "text-red-400"}`}>
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </td>
                    <td className="px-2 py-1">COINS {txn.amount.toFixed(2)}</td>
                    <td className="px-2 py-1">{new Date(txn.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400 text-center">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WalletControls
