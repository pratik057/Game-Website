"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { io } from "socket.io-client"
import { toast } from "react-toastify"
import { UserContext } from "./UserContext"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user, updateBalance } = useContext(UserContext)
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [gameState, setGameState] = useState({
    status: "waiting",
    jokerCard: null,
    andarCards: [],
    baharCards: [],
    winningSide: null,
    winningCardIndex: null,
    bettingTimeLeft: 0,
    players: [],
    totalBets: { andar: 0, bahar: 0 },
  })
  const [onlinePlayers, setOnlinePlayers] = useState([])
  const [currentBet, setCurrentBet] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    // Connect to the server
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
      autoConnect: true,
      reconnectionAttempts: 5, // Try to reconnect 5 times
  reconnectionDelay: 2000,
    })

    setSocket(socketInstance)

    // Clean up on unmount
    return () => {
      if (socketInstance) socketInstance.disconnect()
    }
  }, [])

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return

    // Connection events
    socket.on("connect", () => {
      console.log("Connected to server")
      setConnected(true)

      // Authenticate with the server
      const token = localStorage.getItem("token")
      socket.emit("authenticate", { token })
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
      setConnected(false)
    })

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      toast.error("Failed to connect to the game server")
    })

    // Authentication events
    socket.on("authenticated", (userData) => {
      console.log("Authenticated:", userData)
      // If the user is a guest, update the balance
      if (!user && userData.balance) {
        updateBalance(userData.balance)
      }
    })

    socket.on("authError", (error) => {
      console.error("Authentication error:", error)
      toast.error(error.message || "Authentication failed")
    })

    // Game state events
    socket.on("gameState", (state) => {
      console.log("Game state updated:", state)
      setGameState(state)
      setOnlinePlayers(state.players || [])
    })

    socket.on("bettingStarted", ({ timeLeft }) => {
      toast.info(`Betting phase started! ${timeLeft} seconds to place your bets.`)
      setGameState((prev) => ({ ...prev, status: "betting", bettingTimeLeft: timeLeft }))
      // Reset current bet
      setCurrentBet(null)
    })

    socket.on("bettingTimeUpdate", ({ timeLeft }) => {
      setGameState((prev) => ({ ...prev, bettingTimeLeft: timeLeft }))

      if (timeLeft <= 5) {
        toast.warning(`${timeLeft} seconds left to place your bet!`, {
          autoClose: 1000,
          hideProgressBar: true,
        })
      }
    })

    socket.on("jokerRevealed", ({ jokerCard }) => {
      console.log("Joker revealed:", jokerCard)
      setGameState((prev) => ({
        ...prev,
        status: "dealing",
        jokerCard,
        andarCards: [],
        baharCards: [],
      }))
    })

    socket.on("cardDealt", ({ side, card, index }) => {
      console.log(`Card dealt to ${side}:`, card)
      setGameState((prev) => {
        if (side === "andar") {
          return {
            ...prev,
            andarCards: [...prev.andarCards, card],
          }
        } else {
          return {
            ...prev,
            baharCards: [...prev.baharCards, card],
          }
        }
      })
    })

    socket.on("gameResult", ({ winningSide, winningCardIndex, winners, losers }) => {
      console.log("Game result:", { winningSide, winningCardIndex, winners, losers })

      setGameState((prev) => ({
        ...prev,
        status: "result",
        winningSide,
        winningCardIndex,
      }))

      // Check if the current user won or lost
      const socketId = socket.id
      const winner = winners?.find((w) => w.id === socketId)
      const loser = losers?.find((l) => l.id === socketId)

      if (winner) {
        toast.success(`You won ${winner.winnings}!`)
      } else if (loser) {
        toast.error(`You lost ${loser.loss}`)
      }
    })

    // Player events
    socket.on("playerJoined", ({ id, username }) => {
      console.log(`Player joined: ${username} (${id})`)
      toast.info(`${username} joined the game`)

      setOnlinePlayers((prev) => {
        if (prev.find((p) => p.id === id)) return prev
        return [...prev, { id, username, bet: null }]
      })
    })

    socket.on("playerLeft", ({ id, username }) => {
      console.log(`Player left: ${username} (${id})`)
      toast.info(`${username} left the game`)

      setOnlinePlayers((prev) => prev.filter((p) => p.id !== id))
    })

    socket.on("betPlaced", ({ playerId, username, side, amount, totalBets }) => {
      console.log(`Bet placed by ${username}: ${amount} on ${side}`)

      // Update total bets
      setGameState((prev) => ({
        ...prev,
        totalBets,
      }))

      // Update player's bet
      setOnlinePlayers((prev) => {
        return prev.map((p) => {
          if (p.id === playerId) {
            return { ...p, bet: { side, amount } }
          }
          return p
        })
      })

      // If it's the current user, update current bet
      if (playerId === socket.id) {
        setCurrentBet({ side, amount })
      }
    })

    socket.on("betError", ({ message }) => {
      console.error("Bet error:", message)
      toast.error(message)
    })

    socket.on("balanceUpdated", ({ balance }) => {
      console.log("Balance updated:", balance)
      updateBalance(balance)
    })

    // Clean up event listeners on unmount
    return () => {
      socket.off("connect")
      socket.off("disconnect")
      socket.off("connect_error")
      socket.off("authenticated")
      socket.off("authError")
      socket.off("gameState")
      socket.off("bettingStarted")
      socket.off("bettingTimeUpdate")
      socket.off("jokerRevealed")
      socket.off("cardDealt")
      socket.off("gameResult")
      socket.off("playerJoined")
      socket.off("playerLeft")
      socket.off("betPlaced")
      socket.off("betError")
      socket.off("balanceUpdated")
    }
  }, [socket, user, updateBalance])

  // Function to place a bet
  const placeBet = (side, amount) => {
    if (!socket || !connected) {
      toast.error("Not connected to the game server")
      return
    }

    if (gameState.status !== "betting") {
      toast.error("Betting is not open right now")
      return
    }

    socket.emit("placeBet", { side, amount })
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        gameState,
        onlinePlayers,
        currentBet,
        placeBet,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

