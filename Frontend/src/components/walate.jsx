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
  const token = localStorage.getItem("token")

  // Animate balance changes
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

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
  }

  const handleTransaction = async (type) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      showNotification("Please enter a valid amount", "error")
      return
    }

    if (!user) {
      showNotification("User not authenticated!", "error")
      return
    }

    setLoading(true)
    try {
      const endpoint = type === "deposit" ? "add-funds" : "withdraw"
      const response = await fetch(`http://localhost:5000/api/games/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })

      const data = await response.json()
      if (data.success) {
        updateBalance && updateBalance(data.newBalance)
        showNotification(
          type === "deposit" ? "Funds added successfully!" : "Withdrawal successful!",
          "success"
        )
      } else {
        showNotification(data.message || "Transaction failed", "error")
      }
    } catch (error) {
      console.error("Transaction error:", error)
      showNotification("Transaction failed. Please try again.", "error")
    }
    setLoading(false)
    setAmount("")
  }

  return (
    <div className="h-full w-full flex justify-center items-center">
    <div className="bg-gradient-to-br from-gray-800 to-gray-600 p-6 rounded-xl shadow-lg text-white max-w-md w-full mx-auto border border-gray-700 ">
      <h2 className="text-xl font-bold mb-4 text-center">My Wallet</h2>
      
      {/* Animated Balance Display */}
      <motion.div 
        className="mb-6 text-center top-30"
        initial={{ scale: 1 }}
        animate={{ scale: balance !== displayBalance ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-300 mb-1">Current Balance</p>
        <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          ${displayBalance.toFixed(2)}
        </p>
      </motion.div>
      
      {/* Transaction Type Tabs */}
      <div className="flex mb-4 bg-gray-700/50 rounded-lg p-1">
        <button
          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === "deposit" 
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md" 
              : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("deposit")}
        >
          <ArrowDownCircle size={18} />
          <span>Deposit</span>
        </button>
        <button
          className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
            activeTab === "withdraw" 
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md" 
              : "text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setActiveTab("withdraw")}
        >
          <ArrowUpCircle size={18} />
          <span>Withdraw</span>
        </button>
      </div>
      
      {/* Amount Input with Animation */}
      <div className="mb-4 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</div>
        <motion.input
          type="number"
          className="w-full p-3 pl-8 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          min="1"
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        />
      </div>
      
      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[10, 50, 100, 500].map((quickAmount) => (
          <motion.button
            key={quickAmount}
            className="bg-gray-700 hover:bg-gray-600 rounded-md py-1 text-sm transition-colors"
            onClick={() => setAmount(quickAmount.toString())}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ${quickAmount}
          </motion.button>
        ))}
      </div>
      
      {/* Transaction Button */}
      <motion.button 
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
          activeTab === "deposit" 
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" 
            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        }`}
        onClick={() => handleTransaction(activeTab)}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" size={20} />
        ) : activeTab === "deposit" ? (
          <ArrowDownCircle size={20} />
        ) : (
          <ArrowUpCircle size={20} />
        )}
        <span>
          {loading 
            ? "Processing..." 
            : activeTab === "deposit" 
              ? "Add Funds" 
              : "Withdraw Funds"}
        </span>
      </motion.button>
      
      {/* Notification Toast */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white font-medium z-50 min-w-[200px] text-center`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  )
}

export default WalletControls
