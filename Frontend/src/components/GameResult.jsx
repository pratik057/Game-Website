"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import Sound from "react-sound"

const GameResult = ({ result, winAmount, onPlayAgain, autoClose = false }) => {
  const [playWinSound, setPlayWinSound] = useState(false)
  const [playLossSound, setPlayLossSound] = useState(false)

  useEffect(() => {
    if (result === "win") {
      setPlayWinSound(true)

      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 0,
      }

      const randomInRange = (min, max) => Math.random() * (max - min) + min

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()
        if (timeLeft <= 0) return clearInterval(interval)

        const particleCount = 50 * (timeLeft / duration)

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
    } else  {
      setPlayLossSound(true)
    }
  }, [result])

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
    <>
      {/* Play sounds using react-sound */}
      {playWinSound && (
        <Sound
          url="/Sounds/YouWin.mp3"
          playStatus={Sound.status.PLAYING}
          onFinishedPlaying={() => setPlayWinSound(false)}
        />
      )}
     
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-gray-900 text-white rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md text-center border-4 ${
              result === "win" ? "border-yellow-500" : "border-red-500"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
              {result === "win" ? (
                <span className="text-yellow-400 drop-shadow-glow">🎉 You Won! 🎉</span>
              ) : (
                <span className="text-red-500">You Lost 😢</span>
              )}
            </h2>

            {result === "win" && (
              <div className="mb-6">
                <p className="text-gray-300 text-lg">You’ve won</p>
                <p className="text-yellow-400 text-4xl font-bold animate-pulse">₹{winAmount}</p>
              </div>
            )}

            {!autoClose ? (
              <button
                onClick={onPlayAgain}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-full text-lg shadow-md transition-all duration-300"
              >
                🔄 Play Again
              </button>
            ) : (
              <div className="text-gray-400 mt-4 animate-pulse">
                ⏳ Next round starting soon...
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default GameResult
