import { generateDeck, shuffleDeck } from "../utils/gameUtils.js";
import User from "../models/User.js";
import Game from "../models/game.js";
import jwt from "jsonwebtoken";

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
};

// Timer references
let bettingTimer = null;
const gameLoopTimer = null;

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
    
      // Deduct bet amount
      player.bet = { side, amount };
      player.balance -= amount;
      gameState.totalBets[side] += amount;
    
      // Update user balance in DB
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
    
    // Determine winner and update balances
    const determineWinner = async (winningSide) => {
      gameState.status = "result";
    
      for (const socketId in gameState.players) {
        const player = gameState.players[socketId];
    
        if (player.bet) {
          if (player.bet.side === winningSide) {
            // Player won, add winnings
            const winnings = player.bet.amount * 2; // Example: 2x payout
            player.balance += winnings;
    
            // Update balance in DB
            if (player.userId) {
              try {
                await User.findByIdAndUpdate(player.userId, { $inc: { balance: winnings } });
              } catch (error) {
                console.error("Error updating user balance:", error);
              }
            }
    
            io.to(socketId).emit("gameResult", { result: "win", winnings, balance: player.balance });
          } else {
            // Player lost, notify them
            io.to(socketId).emit("gameResult", { result: "lose", balance: player.balance });
          }
        }
      }
    
      io.emit("gameOver", { winningSide });
    
      // Reset game state for next round
      resetGame();
    };
    
    // Call this function after the game determines a winner
    determineWinner("andar"); // Example call with winning side
    

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
    gameState.winningCardIndex = null;
    gameState.bettingTimeLeft = 30;
    gameState.totalBets = { andar: 0, bahar: 0 };
    gameState.gameId = generateGameId();

    Object.values(gameState.players).forEach((player) => { player.bet = null; });
    io.emit("gameState", gameState);
    startBettingTimer(io);
  };

  const startBettingTimer = (io) => {
    if (bettingTimer) clearInterval(bettingTimer);
    gameState.bettingTimeLeft = 60;
    io.emit("bettingStarted", { timeLeft: gameState.bettingTimeLeft });
    bettingTimer = setInterval(() => {
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
    console.log("joker:", joker)
    gameState.jokerCard = joker;
    io.emit("jokerRevealed", { jokerCard: joker });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const andarBet = gameState.totalBets.andar;
    const baharBet = gameState.totalBets.bahar;
    let forcedWinningSide = andarBet < baharBet ? "andar" : "bahar";

    let andar = [], bahar = [], foundMatch = false;
    while (!foundMatch && deck.length > 0) {
      const card = deck.pop();
      const currentSide = andar.length <= bahar.length ? "andar" : "bahar";
      (currentSide === "andar" ? andar : bahar).push(card);
      io.emit("cardDealt", { side: currentSide, card });
      if (card.value === joker.value && currentSide === forcedWinningSide) foundMatch = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    gameState.winningSide = forcedWinningSide;
    io.emit("gameResult", { winningSide: forcedWinningSide });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    resetGame();
  };
  resetGame();
};
