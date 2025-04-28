// // import { generateDeck, shuffleDeck } from "../utils/gameUtils.js";
// // import User from "../models/User.js";
// // import Game from "../models/game.js";
// // import jwt from "jsonwebtoken";

// // // Game state
// // const gameState = {
// //   status: "waiting", // waiting, betting, dealing, result
// //   jokerCard: null,
// //   andarCards: [],
// //   baharCards: [],
// //   winningSide: null,
// //   winningCardIndex: null,
// //   bettingTimeLeft: 30, // seconds
// //   players: {},
// //   totalBets: {
// //     andar: 0,
// //     bahar: 0,
// //   },
// //   gameId: generateGameId(),
// //   lastGameResult: null,
// // };

// // // Timer references
// // let bettingTimer = null;
// // const gameLoopTimer = null;

// // // Generate a random game ID
// // function generateGameId() {
// //   return Math.random().toString(36).substring(2, 15);
// // }

// // // Verify JWT token
// // const verifyToken = (token) => {
// //   try {
// //     if (!token) return null;
// //     return jwt.verify(token, process.env.JWT_SECRET || "andarbahar-secret-key");
// //   } catch (error) {
// //     console.error("Token verification error:", error);
// //     return null;
// //   }
// // };

// // // Initialize Socket.IO
// // export const initializeSocketIO = (io) => {
// //   startGameLoop(io);

// //   io.on("connection", (socket) => {
// //     socket.emit("gameState", {
// //       ...gameState,
// //       players: Object.values(gameState.players).map((player) => ({
// //         id: player.id,
// //         username: player.username,
// //         bet: player.bet,
// //       })),
// //     });

// //     socket.on("authenticate", async ({ token }) => {
// //       const decoded = verifyToken(token);

// //       if (decoded) {
// //         try {
// //           const user = await User.findById(decoded.id);
// //           if (user) {
// //             gameState.players[socket.id] = {
// //               id: socket.id,
// //               userId: user._id,
// //               username: user.username,
// //               balance: user.balance,
// //               bet: null,
// //             };
// //             io.emit("playerJoined", { id: socket.id, username: user.username });
// //             socket.emit("authenticated", {
// //               userId: user._id,
// //               username: user.username,
// //               balance: user.balance,
// //             });
// //           }
// //         } catch (error) {
// //           console.error("Authentication error:", error);
// //           socket.emit("authError", { message: "Authentication failed" });
// //         }
// //       }
// //     });

// //     socket.on("placeBet", async ({ side, amount }) => {
// //       const player = gameState.players[socket.id];
// //       if (!player || gameState.status !== "betting" || amount <= 0 || player.balance < amount) {
// //         socket.emit("betError", { message: "Invalid bet" });
// //         return;
// //       }

// //       player.bet = { side, amount };
// //       player.balance -= amount;
// //       gameState.totalBets[side] += amount;

// //       if (player.userId) {
// //         try {
// //           await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } });
// //         } catch (error) {
// //           console.error("Error updating user balance:", error);
// //         }
// //       }

// //       io.emit("betPlaced", {
// //         playerId: socket.id,
// //         username: player.username,
// //         side,
// //         amount,
// //         totalBets: gameState.totalBets,
// //       });

// //       socket.emit("balanceUpdated", { balance: player.balance });
// //     });

// //     socket.on("disconnect", () => {
// //       if (gameState.players[socket.id]) {
// //         io.emit("playerLeft", { id: socket.id, username: gameState.players[socket.id].username });
// //         delete gameState.players[socket.id];
// //       }
// //     });
// //   });
// // };

// // // Start the game loop
// // const startGameLoop = (io) => {
// //   const resetGame = () => {
// //     gameState.status = "betting";
// //     gameState.jokerCard = null;
// //     gameState.andarCards = [];
// //     gameState.baharCards = [];
// //     gameState.winningSide = null;
// //     gameState.winningCardIndex = null;
// //     gameState.bettingTimeLeft = 30;
// //     gameState.totalBets = { andar: 0, bahar: 0 };
// //     gameState.gameId = generateGameId();

// //     Object.values(gameState.players).forEach((player) => { player.bet = null; });
// //     io.emit("gameState", gameState);
// //     startBettingTimer(io);
// //   };

// //   const startBettingTimer = (io) => {
// //     if (bettingTimer) clearInterval(bettingTimer);
// //     gameState.bettingTimeLeft = 60;
// //     io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft });
// //     bettingTimer = setInterval(() => {
// //       gameState.bettingTimeLeft -= 1;
// //       io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft });
// //       if (gameState.bettingTimeLeft <= 0) {
// //         clearInterval(bettingTimer);
// //         startDealing(io);
// //       }
// //     }, 1000);
// //   };
// //   const startDealing = async (io) => {
// //     gameState.status = "dealing";
// //     const deck = shuffleDeck(generateDeck());
// //     const joker = deck.pop();
// //     gameState.jokerCard = joker;
// //     io.emit("jokerRevealed", { jokerCard: joker });
// //     await new Promise((resolve) => setTimeout(resolve, 2000));
  
// //     const andarBet = gameState.totalBets.andar;
// //     const baharBet = gameState.totalBets.bahar;
// //     let forcedWinningSide = andarBet < baharBet ? "andar" : "bahar";
  
// //     let andar = [], bahar = [], foundMatch = false;
// //     while (!foundMatch && deck.length > 0) {
// //       const card = deck.pop();
// //       const currentSide = andar.length <= bahar.length ? "andar" : "bahar";
// //       (currentSide === "andar" ? andar : bahar).push(card);
// //       io.emit("cardDealt", { side: currentSide, card });
// //       if (card.value === joker.value && currentSide === forcedWinningSide) foundMatch = true;
// //       await new Promise((resolve) => setTimeout(resolve, 1000));
// //     }
  
// //     gameState.winningSide = forcedWinningSide;
// //     io.emit("gameResult", { winningSide: forcedWinningSide });
  
// //     // Calculate winnings
// //     Object.values(gameState.players).forEach(async (player) => {
// //       if (player.bet) {
// //         if (player.bet.side === gameState.winningSide) {
// //           // Player wins, gets 2x the bet amount back
// //           const winnings = player.bet.amount * 2;
// //           player.balance += winnings;
          
// //           if (player.userId) {
// //             try {
// //               await User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } });
// //             } catch (error) {
// //               console.error("Error updating user balance:", error);
// //             }
// //           }
  
// //           io.to(player.id).emit("balanceUpdated", { balance: player.balance });
// //           io.to(player.id).emit("winMessage", { amountWon: winnings });
// //         } else {
// //           // Player lost, balance already deducted
// //           io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount });
// //         }
// //       }
// //     });
  
// //     await new Promise((resolve) => setTimeout(resolve, 10000));
// //     resetGame();
// //   };
  
// //   resetGame();
// // };


// import { generateDeck, shuffleDeck } from "../utils/gameUtils.js"
// import User from "../models/User.js"
// import Game from "../models/game.js"
// import jwt from "jsonwebtoken"

// // Game state
// const gameState = {
//   status: "waiting", // waiting, betting, dealing, result
//   jokerCard: null,
//   andarCards: [],
//   baharCards: [],
//   winningSide: null,
//   winningCardIndex: null,
//   bettingTimeLeft: 30, // seconds
//   players: {},
//   totalBets: {
//     andar: 0,
//     bahar: 0,
//   },
//   gameId: generateGameId(),
//   lastGameResult: null,
//   isProcessingBets: false, // Flag to prevent race conditions
// }

// // Timer references
// let bettingTimer = null
// const gameLoopTimer = null

// // Generate a random game ID
// function generateGameId() {
//   return Math.random().toString(36).substring(2, 15)
// }

// // Verify JWT token
// const verifyToken = (token) => {
//   try {
//     if (!token) return null
//     return jwt.verify(token, process.env.JWT_SECRET || "andarbahar-secret-key")
//   } catch (error) {
//     console.error("Token verification error:", error)
//     return null
//   }
// }

// // Initialize Socket.IO
// export const initializeSocketIO = (io) => {
//   // Clean up any existing timers on server restart
//   if (bettingTimer) clearInterval(bettingTimer)
//   if (gameLoopTimer) clearInterval(gameLoopTimer)

//   startGameLoop(io)

//   io.on("connection", (socket) => {
//     try {
//       // Send current game state to new connection
//       socket.emit("gameState", {
//         ...gameState,
//         players: Object.values(gameState.players).map((player) => ({
//           id: player.id,
//           username: player.username,
//           bet: player.bet,
//         })),
//       })
//     } catch (error) {
//       console.error("Error sending initial game state:", error)
//     }

//     socket.on("authenticate", async ({ token }) => {
//       try {
//         const decoded = verifyToken(token)

//         if (decoded) {
//           try {
//             const user = await User.findById(decoded.id)
//             if (user) {
//               gameState.players[socket.id] = {
//                 id: socket.id,
//                 userId: user._id,
//                 username: user.username,
//                 balance: user.balance,
//                 bet: null,
//               }
//               io.emit("playerJoined", { id: socket.id, username: user.username })
//               socket.emit("authenticated", {
//                 userId: user._id,
//                 username: user.username,
//                 balance: user.balance,
//               })
//             }
//           } catch (error) {
//             console.error("Authentication error:", error)
//             socket.emit("authError", { message: "Authentication failed" })
//           }
//         }
//       } catch (error) {
//         console.error("Token verification error:", error)
//         socket.emit("authError", { message: "Invalid token" })
//       }
//     })

//     socket.on("placeBet", async ({ side, amount }) => {
//       try {
//         // Validate inputs to prevent crashes
//         if (!side || !["andar", "bahar"].includes(side) || !amount || isNaN(amount) || amount <= 0) {
//           socket.emit("betError", { message: "Invalid bet parameters" })
//           return
//         }

//         // Check if game is in betting state
//         if (gameState.status !== "betting") {
//           socket.emit("betError", { message: "Betting is not open right now" })
//           return
//         }

//         // Check if we're already processing a bet to prevent race conditions
//         if (gameState.isProcessingBets) {
//           socket.emit("betError", { message: "Processing another bet, please try again" })
//           return
//         }

//         const player = gameState.players[socket.id]
//         if (!player) {
//           socket.emit("betError", { message: "Player not found" })
//           return
//         }

//         // Check if player already placed a bet
//         if (player.bet) {
//           socket.emit("betError", { message: "You've already placed a bet for this round" })
//           return
//         }

//         // Check if player has enough balance
//         if (player.balance < amount) {
//           socket.emit("betError", { message: "Insufficient balance" })
//           return
//         }

//         // Set processing flag to prevent race conditions
//         gameState.isProcessingBets = true

//         try {
//           // Update player's bet and balance
//           player.bet = { side, amount }
//           player.balance -= amount
//           gameState.totalBets[side] += amount

//           // Update user balance in database
//           if (player.userId) {
//             try {
//               await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } })
//             } catch (error) {
//               console.error("Error updating user balance:", error)
//               // Continue with the game even if DB update fails
//             }
//           }

//           // Notify all clients about the bet
//           io.emit("betPlaced", {
//             playerId: socket.id,
//             username: player.username,
//             side,
//             amount,
//             totalBets: gameState.totalBets,
//           })

//           // Update player's balance
//           socket.emit("balanceUpdated", { balance: player.balance })
//         } finally {
//           // Always reset the processing flag
//           gameState.isProcessingBets = false
//         }
//       } catch (error) {
//         console.error("Error processing bet:", error)
//         socket.emit("betError", { message: "An error occurred while placing your bet" })
//         gameState.isProcessingBets = false
//       }
//     })

//     socket.on("disconnect", () => {
//       try {
//         if (gameState.players[socket.id]) {
//           io.emit("playerLeft", { id: socket.id, username: gameState.players[socket.id].username })
//           delete gameState.players[socket.id]
//         }
//       } catch (error) {
//         console.error("Error handling disconnect:", error)
//       }
//     })
//   })
// }

// // Start the game loop
// const startGameLoop = (io) => {
//   const resetGame = () => {
//     try {
//       gameState.status = "betting"
//       gameState.jokerCard = null
//       gameState.andarCards = []
//       gameState.baharCards = []
//       gameState.winningSide = null
//       gameState.winningCardIndex = null
//       gameState.bettingTimeLeft = 30
//       gameState.totalBets = { andar: 0, bahar: 0 }
//       gameState.gameId = generateGameId()
//       gameState.isProcessingBets = false

//       Object.values(gameState.players).forEach((player) => {
//         player.bet = null
//       })
//       io.emit("gameState", {
//         ...gameState,
//         players: Object.values(gameState.players).map((p) => ({
//           id: p.id,
//           username: p.username,
//           bet: p.bet,
//         })),
//       })
//       startBettingTimer(io)
//     } catch (error) {
//       console.error("Error resetting game:", error)
//       // Try to recover by restarting the game loop
//       setTimeout(() => resetGame(), 5000)
//     }
//   }

//   const startBettingTimer = (io) => {
//     try {
//       if (bettingTimer) clearInterval(bettingTimer)


//       gameState.bettingTimeLeft = 30
//       io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft })

//       bettingTimer = setInterval(() => {
//         try {
//           gameState.bettingTimeLeft -= 1
//           io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft })

//           if (gameState.bettingTimeLeft <= 0) {
//             clearInterval(bettingTimer)
//             startDealing(io)
//           }
//         } catch (error) {
//           console.error("Error in betting timer:", error)
//           // Don't clear the interval here, let it continue
//         }
//       }, 1000)
//     } catch (error) {
//       console.error("Error starting betting timer:", error)
//       // Try to recover
//       clearInterval(bettingTimer)
//       setTimeout(() => resetGame(), 5000)
//     }
//   }

//   const startDealing = async (io) => {
//     try {
//       gameState.status = "dealing"

//       // Generate and shuffle a fresh deck of cards
//       const deck = shuffleDeck(generateDeck())

//       // Draw the joker card
//       const joker = deck.pop()
//       gameState.jokerCard = joker

//       try {
//         io.emit("jokerRevealed", { jokerCard: joker })
//       } catch (error) {
//         console.error("Error emitting joker revealed:", error)
//       }

//       // Pause for dramatic effect
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       // Determine the winning side based on bet amounts
//       // If andar has more bets, bahar will win (and vice versa)
//       const forcedWinningSide = gameState.totalBets.andar > gameState.totalBets.bahar ? "bahar" : "andar"
//       console.log(`Forcing ${forcedWinningSide} to win based on bet amounts`)

//       // Initialize card arrays and game variables
//       const andarCards = []
//       const baharCards = []
//       let matchFound = false

//       // Deal cards until we find a match on the forced winning side
//       while (!matchFound && deck.length > 0) {
//         // Get the next card
//         const card = deck.pop()

//         // Determine which side to deal to
//         // We'll alternate, but need to ensure the winning card goes to the forced side
//         let currentSide

//         if (card.value === joker.value) {
//           // If this card matches the joker, it should go to the forced winning side
//           currentSide = forcedWinningSide
//           matchFound = true
//           gameState.winningSide = forcedWinningSide
//           gameState.winningCardIndex = forcedWinningSide === "andar" ? andarCards.length : baharCards.length
//         } else {
//           // Otherwise, alternate sides but ensure we don't put a matching card on the wrong side
//           if (andarCards.length <= baharCards.length) {
//             // Normally would go to andar
//             if (card.value === joker.value && forcedWinningSide === "bahar") {
//               // But this is a matching card and we want bahar to win, so put it on bahar
//               currentSide = "bahar"
//             } else {
//               currentSide = "andar"
//             }
//           } else {
//             // Normally would go to bahar
//             if (card.value === joker.value && forcedWinningSide === "andar") {
//               // But this is a matching card and we want andar to win, so put it on andar
//               currentSide = "andar"
//             } else {
//               currentSide = "bahar"
//             }
//           }
//         }

//         // Add card to the current side
//         if (currentSide === "andar") {
//           andarCards.push(card)
//           gameState.andarCards = [...andarCards]
//         } else {
//           baharCards.push(card)
//           gameState.baharCards = [...baharCards]
//         }

//         // Emit the card dealt event
//         try {
//           io.emit("cardDealt", {
//             side: currentSide,
//             card,
//             index: currentSide === "andar" ? andarCards.length - 1 : baharCards.length - 1,
//           })
//         } catch (error) {
//           console.error("Error emitting card dealt:", error)
//         }

//         // Add a delay between dealing cards
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//       }

//       // If we ran out of cards without finding a match, force a result
//       if (!matchFound) {
//         gameState.winningSide = forcedWinningSide
//         gameState.winningCardIndex = forcedWinningSide === "andar" ? andarCards.length - 1 : baharCards.length - 1
//       }

//       // Save game result for history
//       gameState.lastGameResult = {
//         jokerCard: joker,
//         winningSide: gameState.winningSide,
//         andarCards,
//         baharCards,
//         timestamp: new Date(),
//       }

//       // Create winners and losers arrays to send to clients
//       const winners = []
//       const losers = []

//       // Process results and update player balances
//       const updatePromises = []

//       Object.values(gameState.players).forEach((player) => {
//         if (player.bet) {
//           if (player.bet.side === gameState.winningSide) {
//             // Player wins, gets 2x the bet amount back (1x bet + 1x winnings)
//             const winnings = player.bet.amount * 2
//             player.balance += winnings

//             winners.push({
//               id: player.id,
//               username: player.username,
//               winnings: player.bet.amount,
//             })

//             if (player.userId) {
//               try {
//                 // Add to update promises instead of awaiting here
//                 updatePromises.push(
//                   User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } }).catch((error) =>
//                     console.error(`Error updating balance for user ${player.userId}:`, error),
//                   ),
//                 )
//               } catch (error) {
//                 console.error("Error updating user balance:", error)
//               }
//             }

//             try {
//               io.to(player.id).emit("balanceUpdated", { balance: player.balance })
//               io.to(player.id).emit("winMessage", { amountWon: player.bet.amount })
//             } catch (error) {
//               console.error("Error emitting win message:", error)
//             }
//           } else {
//             // Player lost
//             losers.push({
//               id: player.id,
//               username: player.username,
//               loss: player.bet.amount,
//             })

//             try {
//               io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount })
//             } catch (error) {
//               console.error("Error emitting lose message:", error)
//             }
//           }
//         }
//       })

//       // Wait for all database updates to complete
//       try {
//         await Promise.allSettled(updatePromises)
//       } catch (error) {
//         console.error("Error updating user balances:", error)
//       }

//       // Save game result to database
//       try {
//         const gameRecords = Object.values(gameState.players).map((player) => {
//           if (!player.bet) return null // Skip players who didn't bet
      
//           return {
//             user: player.userId,
//             betAmount: player.bet.amount,
//             betSide: player.bet.side,
//             jokerCard: gameState.jokerCard,
//             andarCards: gameState.andarCards,
//             baharCards: gameState.baharCards,
//             winningSide: gameState.winningSide,
//             winningCardIndex: gameState.winningCardIndex,
//             result: player.bet.side === gameState.winningSide ? "win" : "lose",
//             winAmount: player.bet.side === gameState.winningSide ? player.bet.amount * 2 : 0, // Double the bet if won
//           }
//         }).filter(record => record !== null) // Remove null entries
      
//         await Game.insertMany(gameRecords) // Save all game records in one go
//       } catch (error) {
//         console.error("Error saving game record:", error)
//       }

//       // Emit game result to all clients
//       try {
//         io.emit("gameResult", {
//           winningSide: gameState.winningSide,
//           winningCardIndex: gameState.winningCardIndex,
//           winners,
//           losers,
//         })
//       } catch (error) {
//         console.error("Error emitting game result:", error)
//       }

//       // Wait before starting a new game
//       await new Promise((resolve) => setTimeout(resolve, 10000))
//       resetGame()
//     } catch (error) {
//       console.error("Error in dealing phase:", error)
//       // Try to recover by restarting the game
//       setTimeout(() => resetGame(), 5000)
//     }
//   }

//   // Start the game loop
//   resetGame()
// }

import { generateDeck, shuffleDeck } from "../utils/gameUtils.js"
import User from "../models/User.js"
import Game from "../models/game.js"
import jwt from "jsonwebtoken"

// Game state
const gameState = {
  status: "waiting", // waiting, jokerRevealed, betting, dealing, result
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
  isProcessingBets: false, // Flag to prevent race conditions
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
  // Clean up any existing timers on server restart
  if (bettingTimer) clearInterval(bettingTimer)
  if (gameLoopTimer) clearInterval(gameLoopTimer)

  startGameLoop(io)

  io.on("connection", (socket) => {
    try {
      // Send current game state to new connection
      socket.emit("gameState", {
        ...gameState,
        players: Object.values(gameState.players).map((player) => ({
          id: player.id,
          username: player.username,
          bet: player.bet,
        })),
      })
    } catch (error) {
      console.error("Error sending initial game state:", error)
    }

    socket.on("authenticate", async ({ token }) => {
      try {
        const decoded = verifyToken(token)

        if (decoded) {
          try {
            const user = await User.findById(decoded.id)
            if (user) {
              gameState.players[socket.id] = {
                id: socket.id,
                userId: user._id,
                username: user.username,
                balance: user.balance,
                bet: null,
              }
              io.emit("playerJoined", { id: socket.id, username: user.username })
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
        }
      } catch (error) {
        console.error("Token verification error:", error)
        socket.emit("authError", { message: "Invalid token" })
      }
    })

    socket.on("placeBet", async ({ side, amount }) => {
      try {
        // Validate inputs to prevent crashes
        if (!side || !["andar", "bahar"].includes(side) || !amount || isNaN(amount) || amount <= 0) {
          socket.emit("betError", { message: "Invalid bet parameters" })
          return
        }

        // Check if game is in betting state
        if (gameState.status !== "betting") {
          socket.emit("betError", { message: "Betting is not open right now" })
          return
        }

        // Check if we're already processing a bet to prevent race conditions
        if (gameState.isProcessingBets) {
          socket.emit("betError", { message: "Processing another bet, please try again" })
          return
        }

        const player = gameState.players[socket.id]
        if (!player) {
          socket.emit("betError", { message: "Player not found" })
          return
        }

        // Check if player already placed a bet
        if (player.bet) {
          socket.emit("betError", { message: "You've already placed a bet for this round" })
          return
        }

        // Check if player has enough balance
        if (player.balance < amount) {
          socket.emit("betError", { message: "Insufficient balance" })
          return
        }

        // Set processing flag to prevent race conditions
        gameState.isProcessingBets = true

        try {
          // Update player's bet and balance
          player.bet = { side, amount }
          player.balance -= amount
          gameState.totalBets[side] += amount

          // Update user balance in database
          if (player.userId) {
            try {
              await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } })
            } catch (error) {
              console.error("Error updating user balance:", error)
              // Continue with the game even if DB update fails
            }
          }

          // Notify all clients about the bet
          io.emit("betPlaced", {
            playerId: socket.id,
            username: player.username,
            side,
            amount,
            totalBets: gameState.totalBets,
          })

          // Update player's balance
          socket.emit("balanceUpdated", { balance: player.balance })
        } finally {
          // Always reset the processing flag
          gameState.isProcessingBets = false
        }
      } catch (error) {
        console.error("Error processing bet:", error)
        socket.emit("betError", { message: "An error occurred while placing your bet" })
        gameState.isProcessingBets = false
      }
    })

    socket.on("disconnect", () => {
      try {
        if (gameState.players[socket.id]) {
          io.emit("playerLeft", { id: socket.id, username: gameState.players[socket.id].username })
          delete gameState.players[socket.id]
        }
      } catch (error) {
        console.error("Error handling disconnect:", error)
      }
    })
  })
}

// Start the game loop
const startGameLoop = (io) => {
  const resetGame = () => {
    try {
      // First step: Show joker card
      showJokerCard(io)
    } catch (error) {
      console.error("Error resetting game:", error)
      // Try to recover by restarting the game loop
      setTimeout(() => resetGame(), 5000)
    }
  }

  // Step 1: Show joker card
  const showJokerCard = (io) => {
    try {
      // Reset game state
      gameState.status = "jokerRevealed"
      gameState.andarCards = []
      gameState.baharCards = []
      gameState.winningSide = null
      gameState.winningCardIndex = null
      gameState.totalBets = { andar: 0, bahar: 0 }
      gameState.gameId = generateGameId()
      gameState.isProcessingBets = false

      Object.values(gameState.players).forEach((player) => {
        player.bet = null
      })

      // Generate and shuffle a fresh deck of cards
      const deck = shuffleDeck(generateDeck())

      // Draw the joker card
      const joker = deck.pop()
      gameState.jokerCard = joker
      gameState.deck = deck // Save the deck for later use

      // Emit joker card to all clients
      io.emit("jokerRevealed", { jokerCard: joker })
      io.emit("gameState", {
        ...gameState,
        players: Object.values(gameState.players).map((p) => ({
          id: p.id,
          username: p.username,
          bet: p.bet,
        })),
      })

      // Wait 3 seconds before starting betting phase
      setTimeout(() => startBettingTimer(io), 3000)
    } catch (error) {
      console.error("Error showing joker card:", error)
      setTimeout(() => resetGame(), 5000)
    }
  }

  // Step 2: Start betting timer
  const startBettingTimer = (io) => {
    try {
      if (bettingTimer) clearInterval(bettingTimer)

      // Change game status to betting
      gameState.status = "betting"
      gameState.bettingTimeLeft = 30
      
      // Notify clients that betting has started
      io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft })

      bettingTimer = setInterval(() => {
        try {
          gameState.bettingTimeLeft -= 1
          io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft })

          if (gameState.bettingTimeLeft <= 0) {
            clearInterval(bettingTimer)
            startDealing(io)
          }
        } catch (error) {
          console.error("Error in betting timer:", error)
          // Don't clear the interval here, let it continue
        }
      }, 1000)
    } catch (error) {
      console.error("Error starting betting timer:", error)
      // Try to recover
      clearInterval(bettingTimer)
      setTimeout(() => resetGame(), 5000)
    }
  }

  // Step 3: Deal cards and determine winner
  // const startDealing = async (io) => {
  //   try {
  //     gameState.status = "dealing"
      
  //     // Get the saved deck and joker card
  //     const deck = gameState.deck
  //     const joker = gameState.jokerCard

  //     // Determine the winning side based on bet amounts
  //     // If andar has more bets, bahar will win (and vice versa)
  //     const forcedWinningSide = gameState.totalBets.andar > gameState.totalBets.bahar ? "bahar" : "andar"
  //     console.log(`Forcing ${forcedWinningSide} to win based on bet amounts`)

  //     // Initialize card arrays and game variables
  //     const andarCards = []
  //     const baharCards = []
  //     let matchFound = false

  //     // Deal cards until we find a match on the forced winning side
  //     while (!matchFound && deck.length > 0) {
  //       // Get the next card
  //       const card = deck.pop()

  //       // Determine which side to deal to
  //       // We'll alternate, but need to ensure the winning card goes to the forced side
  //       let currentSide

  //       if (card.value === joker.value) {
  //         // If this card matches the joker, it should go to the forced winning side
  //         currentSide = forcedWinningSide
  //         matchFound = true
  //         gameState.winningSide = forcedWinningSide
  //         gameState.winningCardIndex = forcedWinningSide === "andar" ? andarCards.length : baharCards.length
  //       } else {
  //         // Otherwise, alternate sides but ensure we don't put a matching card on the wrong side
  //         if (andarCards.length <= baharCards.length) {
  //           // Normally would go to andar
  //           if (card.value === joker.value && forcedWinningSide === "bahar") {
  //             // But this is a matching card and we want bahar to win, so put it on bahar
  //             currentSide = "bahar"
  //           } else {
  //             currentSide = "andar"
  //           }
  //         } else {
  //           // Normally would go to bahar
  //           if (card.value === joker.value && forcedWinningSide === "andar") {
  //             // But this is a matching card and we want andar to win, so put it on andar
  //             currentSide = "andar"
  //           } else {
  //             currentSide = "bahar"
  //           }
  //         }
  //       }

  //       // Add card to the current side
  //       if (currentSide === "andar") {
  //         andarCards.push(card)
  //         gameState.andarCards = [...andarCards]
  //       } else {
  //         baharCards.push(card)
  //         gameState.baharCards = [...baharCards]
  //       }

  //       // Emit the card dealt event
  //       try {
  //         io.emit("cardDealt", {
  //           side: currentSide,
  //           card,
  //           index: currentSide === "andar" ? andarCards.length - 1 : baharCards.length - 1,
  //         })
  //       } catch (error) {
  //         console.error("Error emitting card dealt:", error)
  //       }

  //       // Add a delay between dealing cards
  //       await new Promise((resolve) => setTimeout(resolve, 1000))
  //     }

  //     // If we ran out of cards without finding a match, force a result
  //     if (!matchFound) {
  //       gameState.winningSide = forcedWinningSide
  //       gameState.winningCardIndex = forcedWinningSide === "andar" ? andarCards.length - 1 : baharCards.length - 1
  //     }

  //     // Save game result for history
  //     gameState.lastGameResult = {
  //       jokerCard: joker,
  //       winningSide: gameState.winningSide,
  //       andarCards,
  //       baharCards,
  //       timestamp: new Date(),
  //     }

  //     // Create winners and losers arrays to send to clients
  //     const winners = []
  //     const losers = []

  //     // Process results and update player balances
  //     const updatePromises = []

  //     Object.values(gameState.players).forEach((player) => {
  //       if (player.bet) {
  //         if (player.bet.side === gameState.winningSide) {
  //           // Player wins, gets 2x the bet amount back (1x bet + 1x winnings)
  //           const winnings = player.bet.amount * 2
  //           player.balance += winnings

  //           winners.push({
  //             id: player.id,
  //             username: player.username,
  //             winnings: player.bet.amount,
  //           })

  //           if (player.userId) {
  //             try {
  //               // Add to update promises instead of awaiting here
  //               updatePromises.push(
  //                 User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } }).catch((error) =>
  //                   console.error(`Error updating balance for user ${player.userId}:`, error),
  //                 ),
  //               )
  //             } catch (error) {
  //               console.error("Error updating user balance:", error)
  //             }
  //           }

  //           try {
  //             io.to(player.id).emit("balanceUpdated", { balance: player.balance })
  //             io.to(player.id).emit("winMessage", { amountWon: player.bet.amount })
  //           } catch (error) {
  //             console.error("Error emitting win message:", error)
  //           }
  //         } else {
  //           // Player lost
  //           losers.push({
  //             id: player.id,
  //             username: player.username,
  //             loss: player.bet.amount,
  //           })

  //           try {
  //             io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount })
  //           } catch (error) {
  //             console.error("Error emitting lose message:", error)
  //           }
  //         }
  //       }
  //     })

  //     // Wait for all database updates to complete
  //     try {
  //       await Promise.allSettled(updatePromises)
  //     } catch (error) {
  //       console.error("Error updating user balances:", error)
  //     }

  //     // Save game result to database
  //     try {
  //       const gameRecords = Object.values(gameState.players).map((player) => {
  //         if (!player.bet) return null // Skip players who didn't bet
      
  //         return {
  //           user: player.userId,
  //           betAmount: player.bet.amount,
  //           betSide: player.bet.side,
  //           jokerCard: gameState.jokerCard,
  //           andarCards: gameState.andarCards,
  //           baharCards: gameState.baharCards,
  //           winningSide: gameState.winningSide,
  //           winningCardIndex: gameState.winningCardIndex,
  //           result: player.bet.side === gameState.winningSide ? "win" : "lose",
  //           winAmount: player.bet.side === gameState.winningSide ? player.bet.amount * 2 : 0, // Double the bet if won
  //         }
  //       }).filter(record => record !== null) // Remove null entries
      
  //       await Game.insertMany(gameRecords) // Save all game records in one go
  //     } catch (error) {
  //       console.error("Error saving game record:", error)
  //     }

  //     // Emit game result to all clients
  //     try {
  //       io.emit("gameResult", {
  //         winningSide: gameState.winningSide,
  //         winningCardIndex: gameState.winningCardIndex,
  //         winners,
  //         losers,
  //       })
  //     } catch (error) {
  //       console.error("Error emitting game result:", error)
  //     }

  //     // Wait before starting a new game
  //     await new Promise((resolve) => setTimeout(resolve, 10000))
  //     resetGame()
  //   } catch (error) {
  //     console.error("Error in dealing phase:", error)
  //     // Try to recover by restarting the game
  //     setTimeout(() => resetGame(), 5000)
  //   }
  // }



  // //new logic
  const startDealing = async (io) => {
    try {
      gameState.status = "dealing";
  
      const deck = gameState.deck;
      const joker = gameState.jokerCard;
  
      const andarCards = [];
      const baharCards = [];
      let matchFound = false;
      let currentSide = "andar";
  
      while (!matchFound && deck.length > 0) {
        const card = deck.pop();
  
        if (currentSide === "andar") {
          andarCards.push(card);
          gameState.andarCards = [...andarCards];
  
          if (card.value === joker.value) {
            matchFound = true;
            gameState.winningSide = "andar";
            gameState.winningCardIndex = andarCards.length - 1;
          }
        } else {
          baharCards.push(card);
          gameState.baharCards = [...baharCards];
  
          if (card.value === joker.value) {
            matchFound = true;
            gameState.winningSide = "bahar";
            gameState.winningCardIndex = baharCards.length - 1;
          }
        }
  
        // Emit card to clients
        try {
          io.emit("cardDealt", {
            side: currentSide,
            card,
            index: currentSide === "andar" ? andarCards.length - 1 : baharCards.length - 1,
          });
        } catch (error) {
          console.error("Error emitting card dealt:", error);
        }
  
        // Alternate side
        currentSide = currentSide === "andar" ? "bahar" : "andar";
  
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
  
      // If no match found, randomly pick winner (very rare fallback)
      if (!matchFound) {
        const fallbackSide = Math.random() < 0.3 ? "andar" : "bahar";
        gameState.winningSide = fallbackSide;
        gameState.winningCardIndex = fallbackSide === "andar" ? andarCards.length - 1 : baharCards.length - 1;
      }
  
      gameState.lastGameResult = {
        jokerCard: joker,
        winningSide: gameState.winningSide,
        andarCards,
        baharCards,
        timestamp: new Date(),
      };
  
      const winners = [];
      const losers = [];
      const updatePromises = [];
  
      Object.values(gameState.players).forEach((player) => {
        if (player.bet) {
          if (player.bet.side === gameState.winningSide) {
            const winnings = player.bet.amount * 2;
            player.balance += winnings;
  
            winners.push({
              id: player.id,
              username: player.username,
              winnings: player.bet.amount,
            });
  
            if (player.userId) {
              updatePromises.push(
                User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } }).catch((error) =>
                  console.error(`Error updating balance for user ${player.userId}:`, error)
                )
              );
            }
  
            try {
              io.to(player.id).emit("balanceUpdated", { balance: player.balance });
              io.to(player.id).emit("winMessage", { amountWon: player.bet.amount });
            } catch (error) {
              console.error("Error emitting win message:", error);
            }
          } else {
            losers.push({
              id: player.id,
              username: player.username,
              loss: player.bet.amount,
            });
  
            try {
              io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount });
            } catch (error) {
              console.error("Error emitting lose message:", error);
            }
          }
        }
      });
  
      try {
        await Promise.allSettled(updatePromises);
      } catch (error) {
        console.error("Error updating user balances:", error);
      }
  
      try {
        const gameRecords = Object.values(gameState.players)
          .map((player) => {
            if (!player.bet) return null;
  
            return {
              user: player.userId,
              betAmount: player.bet.amount,
              betSide: player.bet.side,
              jokerCard: gameState.jokerCard,
              andarCards: gameState.andarCards,
              baharCards: gameState.baharCards,
              winningSide: gameState.winningSide,
              winningCardIndex: gameState.winningCardIndex,
              result: player.bet.side === gameState.winningSide ? "win" : "lose",
              winAmount: player.bet.side === gameState.winningSide ? player.bet.amount * 2 : 0,
            };
          })
          .filter((record) => record !== null);
  
        await Game.insertMany(gameRecords);
      } catch (error) {
        console.error("Error saving game record:", error);
      }
  
      try {
        io.emit("gameResult", {
          winningSide: gameState.winningSide,
          winningCardIndex: gameState.winningCardIndex,
          winners,
          losers,
        });
      } catch (error) {
        console.error("Error emitting game result:", error);
      }
  
      await new Promise((resolve) => setTimeout(resolve, 10000));
      resetGame();
    } catch (error) {
      console.error("Error in dealing phase:", error);
      setTimeout(() => resetGame(), 5000);
    }
  };
  

  // Start the game loop
  resetGame()
}

// For testing purposes
console.log("Game loop initialized with the correct sequence: joker card → betting time → betting → card dealing")