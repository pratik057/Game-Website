// import { generateDeck, shuffleDeck } from "../utils/gameUtils.js";
// import User from "../models/User.js";
// import Game from "../models/game.js";
// import jwt from "jsonwebtoken";

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
// };

// // Timer references
// let bettingTimer = null;
// const gameLoopTimer = null;

// // Generate a random game ID
// function generateGameId() {
//   return Math.random().toString(36).substring(2, 15);
// }

// // Verify JWT token
// const verifyToken = (token) => {
//   try {
//     if (!token) return null;
//     return jwt.verify(token, process.env.JWT_SECRET || "andarbahar-secret-key");
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return null;
//   }
// };

// // Initialize Socket.IO
// export const initializeSocketIO = (io) => {
//   startGameLoop(io);

//   io.on("connection", (socket) => {
//     socket.emit("gameState", {
//       ...gameState,
//       players: Object.values(gameState.players).map((player) => ({
//         id: player.id,
//         username: player.username,
//         bet: player.bet,
//       })),
//     });

//     socket.on("authenticate", async ({ token }) => {
//       const decoded = verifyToken(token);

//       if (decoded) {
//         try {
//           const user = await User.findById(decoded.id);
//           if (user) {
//             gameState.players[socket.id] = {
//               id: socket.id,
//               userId: user._id,
//               username: user.username,
//               balance: user.balance,
//               bet: null,
//             };
//             io.emit("playerJoined", { id: socket.id, username: user.username });
//             socket.emit("authenticated", {
//               userId: user._id,
//               username: user.username,
//               balance: user.balance,
//             });
//           }
//         } catch (error) {
//           console.error("Authentication error:", error);
//           socket.emit("authError", { message: "Authentication failed" });
//         }
//       }
//     });

//     socket.on("placeBet", async ({ side, amount }) => {
//       const player = gameState.players[socket.id];
//       if (!player || gameState.status !== "betting" || amount <= 0 || player.balance < amount) {
//         socket.emit("betError", { message: "Invalid bet" });
//         return;
//       }

//       player.bet = { side, amount };
//       player.balance -= amount;
//       gameState.totalBets[side] += amount;

//       if (player.userId) {
//         try {
//           await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } });
//         } catch (error) {
//           console.error("Error updating user balance:", error);
//         }
//       }

//       io.emit("betPlaced", {
//         playerId: socket.id,
//         username: player.username,
//         side,
//         amount,
//         totalBets: gameState.totalBets,
//       });

//       socket.emit("balanceUpdated", { balance: player.balance });
//     });

//     socket.on("disconnect", () => {
//       if (gameState.players[socket.id]) {
//         io.emit("playerLeft", { id: socket.id, username: gameState.players[socket.id].username });
//         delete gameState.players[socket.id];
//       }
//     });
//   });
// };

// // Start the game loop
// const startGameLoop = (io) => {
//   const resetGame = () => {
//     gameState.status = "betting";
//     gameState.jokerCard = null;
//     gameState.andarCards = [];
//     gameState.baharCards = [];
//     gameState.winningSide = null;
//     gameState.winningCardIndex = null;
//     gameState.bettingTimeLeft = 30;
//     gameState.totalBets = { andar: 0, bahar: 0 };
//     gameState.gameId = generateGameId();

//     Object.values(gameState.players).forEach((player) => { player.bet = null; });
//     io.emit("gameState", gameState);
//     startBettingTimer(io);
//   };

//   const startBettingTimer = (io) => {
//     if (bettingTimer) clearInterval(bettingTimer);
//     gameState.bettingTimeLeft = 60;
//     io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft });
//     bettingTimer = setInterval(() => {
//       gameState.bettingTimeLeft -= 1;
//       io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft });
//       if (gameState.bettingTimeLeft <= 0) {
//         clearInterval(bettingTimer);
//         startDealing(io);
//       }
//     }, 1000);
//   };
//   const startDealing = async (io) => {
//     gameState.status = "dealing";
//     const deck = shuffleDeck(generateDeck());
//     const joker = deck.pop();
//     gameState.jokerCard = joker;
//     io.emit("jokerRevealed", { jokerCard: joker });
//     await new Promise((resolve) => setTimeout(resolve, 2000));
  
//     const andarBet = gameState.totalBets.andar;
//     const baharBet = gameState.totalBets.bahar;
//     let forcedWinningSide = andarBet < baharBet ? "andar" : "bahar";
  
//     let andar = [], bahar = [], foundMatch = false;
//     while (!foundMatch && deck.length > 0) {
//       const card = deck.pop();
//       const currentSide = andar.length <= bahar.length ? "andar" : "bahar";
//       (currentSide === "andar" ? andar : bahar).push(card);
//       io.emit("cardDealt", { side: currentSide, card });
//       if (card.value === joker.value && currentSide === forcedWinningSide) foundMatch = true;
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
  
//     gameState.winningSide = forcedWinningSide;
//     io.emit("gameResult", { winningSide: forcedWinningSide });
  
//     // Calculate winnings
//     Object.values(gameState.players).forEach(async (player) => {
//       if (player.bet) {
//         if (player.bet.side === gameState.winningSide) {
//           // Player wins, gets 2x the bet amount back
//           const winnings = player.bet.amount * 2;
//           player.balance += winnings;
          
//           if (player.userId) {
//             try {
//               await User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } });
//             } catch (error) {
//               console.error("Error updating user balance:", error);
//             }
//           }
  
//           io.to(player.id).emit("balanceUpdated", { balance: player.balance });
//           io.to(player.id).emit("winMessage", { amountWon: winnings });
//         } else {
//           // Player lost, balance already deducted
//           io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount });
//         }
//       }
//     });
  
//     await new Promise((resolve) => setTimeout(resolve, 10000));
//     resetGame();
//   };
  
//   resetGame();
// };


import { generateDeck, shuffleDeck } from "../utils/gameUtils.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Game state
const gameState = {
  status: "waiting", // waiting, betting, dealing, result
  jokerCard: null,
  andarCards: [],
  baharCards: [],
  winningSide: null,
  bettingTimeLeft: 20, // seconds
  players: {},
  totalBets: {
    andar: 0,
    bahar: 0,
  },
  gameId: generateGameId(),
};

// Generate a random game ID
function generateGameId() {
  return Math.random().toString(36).substring(2, 15);
}

// Verify JWT token
const verifyToken = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET || "andarbahar-secret-key");
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

// Initialize Socket.IO
export const initializeSocketIO = (io) => {
  startGameLoop(io);

  io.on("connection", (socket) => {
    socket.emit("gameState", {
      ...gameState,
      players: Object.values(gameState.players).map((player) => ({
        id: player.id,
        username: player.username,
        bet: player.bet,
      })),
    });

    socket.on("authenticate", async ({ token }) => {
      const decoded = verifyToken(token);

      if (decoded) {
        try {
          const user = await User.findById(decoded.id);
          if (user) {
            gameState.players[socket.id] = {
              id: socket.id,
              userId: user._id,
              username: user.username,
              balance: user.balance,
              bet: null,
            };
            io.emit("playerJoined", { id: socket.id, username: user.username });
            socket.emit("authenticated", {
              userId: user._id,
              username: user.username,
              balance: user.balance,
            });
          }
        } catch (error) {
          console.error("Authentication error:", error);
          socket.emit("authError", { message: "Authentication failed" });
        }
      }
    });

    socket.on("placeBet", async ({ side, amount }) => {
      const player = gameState.players[socket.id];
      if (!player || gameState.status !== "betting" || amount <= 0 || player.balance < amount) {
        socket.emit("betError", { message: "Invalid bet" });
        return;
      }

      player.bet = { side, amount };
      player.balance -= amount;
      gameState.totalBets[side] += amount;

      if (player.userId) {
        try {
          await User.findByIdAndUpdate(player.userId, { $inc: { balance: -amount } });
        } catch (error) {
          console.error("Error updating user balance:", error);
        }
      }

      io.emit("betPlaced", {
        playerId: socket.id,
        username: player.username,
        side,
        amount,
        totalBets: gameState.totalBets,
      });

      socket.emit("balanceUpdated", { balance: player.balance });
    });

    socket.on("disconnect", () => {
      if (gameState.players[socket.id]) {
        io.emit("playerLeft", { id: socket.id, username: gameState.players[socket.id].username });
        delete gameState.players[socket.id];
      }
    });
  });
};

// Start the game loop
const startGameLoop = (io) => {
  const resetGame = () => {
    gameState.status = "betting";
    gameState.jokerCard = null;
    gameState.andarCards = [];
    gameState.baharCards = [];
    gameState.winningSide = null;
    gameState.bettingTimeLeft = 30;
    gameState.totalBets = { andar: 0, bahar: 0 };
    gameState.gameId = generateGameId();

    Object.values(gameState.players).forEach((player) => { player.bet = null; });
    io.emit("gameState", gameState);
    startBettingTimer(io);
  };

  const startBettingTimer = (io) => {
    gameState.bettingTimeLeft = 20;
    io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft });
    const bettingTimer = setInterval(() => {
      gameState.bettingTimeLeft -= 1;
      io.emit("bettingTimeUpdate", { timeLeft: gameState.bettingTimeLeft });
      if (gameState.bettingTimeLeft <= 0) {
        clearInterval(bettingTimer);
        startDealing(io);
      }
    }, 1000);
  };

  const startDealing = async (io) => {
    gameState.status = "dealing";
    const deck = shuffleDeck(generateDeck());
    const joker = deck.pop();
    gameState.jokerCard = joker;
    io.emit("jokerRevealed", { jokerCard: joker });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let andar = [], bahar = [], foundMatch = false;

    while (!foundMatch && deck.length > 0) {
      const card = deck.pop();
      const currentSide = andar.length <= bahar.length ? "andar" : "bahar";
      (currentSide === "andar" ? andar : bahar).push(card);
      io.emit("cardDealt", { side: currentSide, card });

      if (card.value === joker.value) {
        foundMatch = true;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // **Determine the winning side based on bet amounts**
    const { andar: andarBet, bahar: baharBet } = gameState.totalBets;
    if (baharBet > andarBet) {
      gameState.winningSide = "andar"; // If Bahar bet is higher, Andar wins
    } else if (andarBet > baharBet) {
      gameState.winningSide = "bahar"; // If Andar bet is higher, Bahar wins
    } else {
      gameState.winningSide = andar.length > bahar.length ? "bahar" : "andar"; // If bets are equal, fewer cards win
    }

    io.emit("gameResult", { winningSide: gameState.winningSide });

    // **Calculate winnings**
    Object.values(gameState.players).forEach(async (player) => {
      if (player.bet) {
        if (player.bet.side === gameState.winningSide) {
          const winnings = player.bet.amount * 2;
          player.balance += winnings;

          if (player.userId) {
            try {
              await User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } });
            } catch (error) {
              console.error("Error updating user balance:", error);
            }
          }

          io.to(player.id).emit("balanceUpdated", { balance: player.balance });
          io.to(player.id).emit("winMessage", { amountWon: winnings });
        } else {
          io.to(player.id).emit("loseMessage", { amountLost: player.bet.amount });
        }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 10000));
    resetGame();
  };

  resetGame();
};

