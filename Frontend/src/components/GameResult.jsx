"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

const GameResult = ({ result, winAmount, onPlayAgain, autoClose = false }) => {
  useEffect(() => {
    if (result === "win") {
      // Trigger confetti animation for win
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [result])

  // Auto-close after 5 seconds if autoClose is true
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onPlayAgain()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [autoClose, onPlayAgain])

  if (!result) return null

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70`}>
      <div
        className={`bg-gray-800 rounded-lg p-8 max-w-md w-full text-center border-4 ${
          result === "win" ? "border-yellow-500" : "border-red-500"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">
          {result === "win" ? (
            <span className="text-yellow-500">You Won!</span>
          ) : (
            <span className="text-red-500">You Lost</span>
          )}
        </h2>

        {result === "win" && (
          <div className="mb-6">
            <p className="text-gray-300 text-lg">You've won</p>
            <p className="text-yellow-500 text-4xl font-bold">{winAmount}</p>
          </div>
        )}

        {!autoClose && (
          <button
            onClick={onPlayAgain}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
          >
            Play Again
          </button>
        )}

        {autoClose && <div className="text-gray-400 mt-4">Next round starting soon...</div>}
      </div>
    </div>
  )
}

export default GameResult

