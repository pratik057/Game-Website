"use client"

import { useState, useEffect } from "react"

const Card = ({ card, flipped, delay = 0, highlighted = false }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (flipped) {
      const timer = setTimeout(() => {
        setIsFlipped(true)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setIsFlipped(false)
    }
  }, [flipped, delay])

  // If no card is provided, show the back of the card
  if (!card) {
    return (
      <div className="card-container w-14 h-20 md:w-28 md:h-36">
        <div className="card-inner relative w-full h-full">
          <div className="card-back absolute w-full h-full rounded-lg bg-blue-900 border-2 border-blue-700 flex items-center justify-center">
            <div className="bg-blue-800 w-12 h-16 md:w-16 md:h-24 rounded-lg flex items-center justify-center">
              <div className="text-yellow-500 text-xl md:text-2xl font-bold">AB</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { suit, value } = card

  const getSuitColor = () => {
    return suit === "hearts" || suit === "diamonds" ? "text-red-600" : "text-black"
  }

  const getSuitSymbol = () => {
    switch (suit) {
      case "hearts":
        return "♥"
      case "diamonds":
        return "♦"
      case "clubs":
        return "♣"
      case "spades":
        return "♠"
      default:
        return ""
    }
  }

  const getCardValue = () => {
    switch (value) {
      case 1:
        return "A"
      case 11:
        return "J"
      case 12:
        return "Q"
      case 13:
        return "K"
      default:
        return value.toString()
    }
  } 

  return (
    <div className={`card-container w-15 h-21 md:w-28 md:h-36 ${highlighted ? "animate-pulse" : ""}`}>
    <div className={`card-inner relative w-full h-full ${isFlipped ? "flipped" : ""}`}>
      <div className="card-back absolute w-full h-full rounded-lg bg-blue-900 border-2 border-blue-700 flex items-center justify-center">
        <div className="bg-blue-800 w-12 h-16 md:w-16 md:h-24 rounded-lg flex items-center justify-center">
          <div className="text-yellow-500 text-xl md:text-2xl font-bold">AB</div>
        </div>
      </div>
  
      <div
        className={`card-front absolute w-full h-full rounded-lg bg-white border-2 ${highlighted ? "border-yellow-400" : "border-gray-300"} p-1 md:p-2 flex flex-col`}
      >
        <div className={`flex justify-between items-center ${getSuitColor()}`}>
          <div className="text-sm md:text-lg font-bold">{getCardValue()}</div>
          <div className="text-sm md:text-lg">{getSuitSymbol()}</div>
        </div>
  
        <div className={`flex-grow flex items-center justify-center ${getSuitColor()}`}>
          <div className="text-2xl md:text-4xl">{getSuitSymbol()}</div>
        </div>
  
        <div className={`flex justify-between items-center ${getSuitColor()} rotate-180`}>
          <div className="text-sm md:text-lg font-bold">{getCardValue()}</div>
          <div className="text-sm md:text-lg">{getSuitSymbol()}</div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default Card

