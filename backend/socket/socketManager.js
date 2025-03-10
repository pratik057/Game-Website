import { generateDeck, shuffleDeck } from "../utils/gameUtils.js"
import User from "../models/User.js"
import Game from "../models/game.js"
import jwt from "jsonwebtoken"

// Game state
const gameState = {
  status: "waiting", // waiting, betting, dealing, result
  jokerCard: null,
  andarCards: [],
  baharCards: [],
  winningSide: null,
  winningCardIndex: null,
  bettingTimeLeft: 30, // seconds
  players: {},
  totalBets: {
    andar: 0,
    bahar: 0,
  },
  gameId: generateGameId(),
  lastGameResult: null,
}

// Timer references
let bettingTimer = null
const gameLoopTimer = null

// Generate a random game ID
function generateGameId() {
  return Math.random().toString(36).substring(2, 15)
}

// Verify JWT token
const verifyToken = (token) => {
  try {
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET || "andarbahar-secret-key")
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

// Initialize Socket.IO
export const initializeSocketIO = (io) => {
  // Start the game loop
  startGameLoop(io)

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Send current game state to the newly connected client
    socket.emit("gameState", {
      ...gameState,
      players: Object.values(gameState.players).map((player) => ({
        id: player.id,
        username: player.username,
        bet: player.bet,
      })),
    })

    // Handle user authentication
    socket.on("authenticate", async ({ token }) => {
      const decoded = verifyToken(token)

      if (decoded) {
        try {
          const user = await User.findById(decoded.id)

          if (user) {
            // Add user to players list
            gameState.players[socket.id] = {
              id: socket.id,
              userId: user._id,
              username: user.username,
              balance: user.balance,
              bet: null,
            }

            // Notify all clients about the new player
            io.emit("playerJoined", {
              id: socket.id,
              username: user.username,
            })

            // Send user data back to the client
            socket.emit("authenticated", {
              userId: user._id,
              username: user.username,
              balance: user.balance,
            })
          }
        } catch (error) {
          console.error("Authentication error:", error)
          socket.emit("authError", { message: "Authentication failed" })
        }
      } else {
        // Handle guest users
        const guestName = `Guest_${Math.floor(Math.random() * 10000)}`

        gameState.players[socket.id] = {
          id: socket.id,
          userId: null,
          username: guestName,
          balance: 1000, // Default balance for guests
          bet: null,
        }

        // Notify all clients about the new player
        io.emit("playerJoined", {
          id: socket.id,
          username: guestName,
        })

        // Send guest data back to the client
        socket.emit("authenticated", {
          userId: null,
          username: guestName,
          balance: 1000,
        })
      }
    })

    // Handle placing bets
    socket.on("placeBet", async ({ side, amount }) => {
      const player = gameState.players[socket.id]

      if (!player) {
        socket.emit("betError", { message: "Player not found" })
        return
      }

      if (gameState.status !== "betting") {
        socket.emit("betError", { message: "Betting is not open right now" })
        return
      }

      if (amount <= 0) {
        socket.emit("betError", { message: "Bet amount must be greater than 0" })
        return
      }

      if (player.balance < amount) {
        socket.emit("betError", { message: "Insufficient balance" })
        return
      }

      // Update player's bet
      player.bet = { side, amount }
      player.balance -= amount

      // Update total bets
      gameState.totalBets[side] += amount

      // If player is authenticated, update their balance in the database
      if (player.userId) {
        try {
          await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } })
        } catch (error) {
          console.error("Error updating user balance:", error)
        }
      }

      // Notify all clients about the new bet
      io.emit("betPlaced", {
        playerId: socket.id,
        username: player.username,
        side,
        amount,
        totalBets: gameState.totalBets,
      })

      // Send updated balance to the player
      socket.emit("balanceUpdated", { balance: player.balance })
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`)

      // Remove player from the game
      if (gameState.players[socket.id]) {
        const username = gameState.players[socket.id].username

        // Notify all clients about the player leaving
        io.emit("playerLeft", {
          id: socket.id,
          username,
        })

        // Remove player from the game state
        delete gameState.players[socket.id]
      }
    })
  })
}

// Start the game loop
const startGameLoop = (io) => {
  // Function to reset the game
  const resetGame = () => {
    gameState.status = "betting"
    gameState.jokerCard = null
    gameState.andarCards = []
    gameState.baharCards = []
    gameState.winningSide = null
    gameState.winningCardIndex = null
    gameState.bettingTimeLeft = 30
    gameState.totalBets = { andar: 0, bahar: 0 }
    gameState.gameId = generateGameId()

    // Reset player bets but keep their balances
    Object.values(gameState.players).forEach((player) => {
      player.bet = null
    })

    // Broadcast the new game state
    io.emit("gameState", {
      ...gameState,
      players: Object.values(gameState.players).map((player) => ({
        id: player.id,
        username: player.username,
        bet: player.bet,
      })),
    })

    // Start the betting timer
    startBettingTimer(io)
  }

  // Function to start the betting timer
  const startBettingTimer = (io) => {
    // Clear any existing timer
    if (bettingTimer) clearInterval(bettingTimer)

    gameState.bettingTimeLeft = 30

    // Broadcast betting phase start
    io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft })

    // Start countdown
    bettingTimer = setInterval(() => {
      gameState.bettingTimeLeft -= 1

      // Broadcast time update every 5 seconds or last 5 seconds
      if (gameState.bettingTimeLeft % 5 === 0 || gameState.bettingTimeLeft <= 5) {
        io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft })
      }

      // When time is up, start dealing
      if (gameState.bettingTimeLeft <= 0) {
        clearInterval(bettingTimer)
        startDealing(io)
      }
    }, 1000)
  }

  // Function to start dealing cards
  const startDealing = async (io) => {
    gameState.status = "dealing"

    // Generate and shuffle deck
    const deck = generateDeck()
    const shuffledDeck = shuffleDeck(deck)

    // Draw joker card
    const joker = shuffledDeck.pop()
    gameState.jokerCard = joker

    // Broadcast joker card
    io.emit("jokerRevealed", { jokerCard: joker })

    // Wait 2 seconds before dealing cards
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Deal cards until we find a match
    const andar = []
    const bahar = []
    let currentSide = "andar"
    let foundMatch = false
    let matchingSide = null
    let matchingIndex = null

    while (!foundMatch && shuffledDeck.length > 0) {
      const card = shuffledDeck.pop()

      if (currentSide === "andar") {
        andar.push(card)
        gameState.andarCards = [...andar]

        // Broadcast the new card
        io.emit("cardDealt", { side: "andar", card, index: andar.length - 1 })

        if (card.value === joker.value) {
          foundMatch = true
          matchingSide = "andar"
          matchingIndex = andar.length - 1
        }

        currentSide = "bahar"
      } else {
        bahar.push(card)
        gameState.baharCards = [...bahar]

        // Broadcast the new card
        io.emit("cardDealt", { side: "bahar", card, index: bahar.length - 1 })

        if (card.value === joker.value) {
          foundMatch = true
          matchingSide = "bahar"
          matchingIndex = bahar.length - 1
        }

        currentSide = "andar"
      }

      // Wait 1 second between dealing cards
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // Update game state with results
    gameState.status = "result"
    gameState.winningSide = matchingSide
    gameState.winningCardIndex = matchingIndex

    // Calculate and distribute winnings
    const winners = []
    const losers = []

    Object.values(gameState.players).forEach(async (player) => {
      if (!player.bet) return

      const { side, amount } = player.bet
      const won = side === matchingSide

      if (won) {
        // Calculate winnings
        const multiplier = side === "andar" ? 1.9 : 2.0
        const winnings = Math.floor(amount * multiplier)

        // Update player balance
        player.balance += winnings

        winners.push({
          id: player.id,
          username: player.username,
          winnings: winnings - amount, // Net profit
        })

        // If player is authenticated, update their balance in the database
        if (player.userId) {
          try {
            await User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } })

            // Save game result to database
            const game = new Game({
              user: player.userId,
              betAmount: amount,
              betSide: side,
              jokerCard: joker,
              andarCards: andar,
              baharCards: bahar,
              winningSide: matchingSide,
              winningCardIndex: matchingIndex,
              result: "win",
              winAmount: winnings,
            })

            await game.save()
          } catch (error) {
            console.error("Error updating user balance or saving game:", error)
          }
        }
      } else {
        losers.push({
          id: player.id,
          username: player.username,
          loss: amount,
        })

        // If player is authenticated, save game result to database
        if (player.userId) {
          try {
            const game = new Game({
              user: player.userId,
              betAmount: amount,
              betSide: side,
              jokerCard: joker,
              andarCards: andar,
              baharCards: bahar,
              winningSide: matchingSide,
              winningCardIndex: matchingIndex,
              result: "lose",
              winAmount: 0,
            })

            await game.save()
          } catch (error) {
            console.error("Error saving game:", error)
          }
        }
      }
    })

    // Save the game result for history
    gameState.lastGameResult = {
      jokerCard: joker,
      winningSide: matchingSide,
      winningCardIndex: matchingIndex,
      winners,
      losers,
      timestamp: new Date(),
    }

    // Broadcast game result
    io.emit("gameResult", {
      winningSide: matchingSide,
      winningCardIndex: matchingIndex,
      winners,
      losers,
    })

    // Wait 10 seconds before starting a new game
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // Start a new game
    resetGame()
  }

  // Start the first game
  resetGame()
}

