"use client"

import { useState, useContext } from "react"
import { UserContext } from "../context/UserContext"

const BetControls = ({ onPlaceBet, disabled, currentBet }) => {
  const { balance } = useContext(UserContext)
  const [betAmount, setBetAmount] = useState(10)

  const predefinedBets = [10, 50, 100, 500, 1000]

  const handleBetAmountChange = (amount) => {
    setBetAmount(amount)
  }

  const handleCustomBetChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 0) {
      setBetAmount(value)
    } else {
      setBetAmount(0)
    }
  }

  const handlePlaceBet = (side) => {
    if (betAmount <= 0) return
    if (betAmount > balance) return

    onPlaceBet(side, betAmount)
  }

  // If user already placed a bet, show their current bet
  if (currentBet) {
    return (
      <div className="lg:w-[60%] w-full bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Your Bet</h3>

        <div className="flex justify-center items-center p-4 bg-gray-700 rounded-lg">
          <div className={`text-center ${currentBet.side === "andar" ? "text-red-500" : "text-blue-500"}`}>
            <div className="text-lg font-bold mb-1">{currentBet.side === "andar" ? "ANDAR" : "BAHAR"}</div>
            <div className="text-2xl font-bold">{currentBet.amount}</div>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-400">Waiting for the round to complete...</div>
      </div>
    )
  }

  return (
    <div className="lg:w-[60%] w-full bg-gray-800 rounded-lg p-4 shadow-lg mb-15">
      <h3 className="text-xl font-bold text-white mb-4 ">Place Your Bet</h3>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300">Bet Amount:</label>
          <span className="text-yellow-500 font-bold">{betAmount}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedBets.map((amount) => (
            <button
              key={amount}
              onClick={() => handleBetAmountChange(amount)}
              className={`px-3 py-1 rounded-md ${betAmount === amount ? "bg-yellow-500 text-black" : "bg-gray-700 text-white"}`}
              disabled={disabled}
            >
              {amount}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={betAmount}
            onChange={handleCustomBetChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            min="1"
            max={balance}
            disabled={true}

          />
          <button
            onClick={() => setBetAmount(Math.floor(balance / 2))}
            className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            disabled={disabled}
          >
            1/2
          </button>
          <button
            onClick={() => setBetAmount(balance)}
            className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
            disabled={disabled}
          >
            Max
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handlePlaceBet("andar")}
          className={`py-3 rounded-lg font-bold text-lg bg-red-500 hover:bg-red-600 text-white`}
          disabled={disabled || betAmount <= 0 || betAmount > balance}
        >
          ANDAR
        </button>
        <button
          onClick={() => handlePlaceBet("bahar")}
          className={`py-3 rounded-lg font-bold text-lg bg-blue-500 hover:bg-blue-600 text-white`}
          disabled={disabled || betAmount <= 0 || betAmount > balance}
        >
          BAHAR
        </button>
      </div>

      {betAmount > balance && <p className="text-red-500 mt-2 text-center">Insufficient balance</p>}

      {disabled && !currentBet && (
        <p className="text-yellow-500 mt-2 text-center">
          {betAmount <= 0 ? "Please enter a valid bet amount" : "Betting is currently closed"}
        </p>
      )}
    </div>
  )
}

export default BetControls

