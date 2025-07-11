import Game from "../models/game.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import PreviousGameWinner from "../models/PreviousGameWinner.js";
// @desc    Create a new game
// @route   POST /api/game/create
// @access  Private




export const createGame = async (req, res) => {
  try {
    const { gameType, betAmount } = req.body;

    if (!gameType || !betAmount) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const game = new Game({ gameType, betAmount });
    await game.save();

    res.status(201).json({ success: true, message: "Game created successfully", game });
  } catch (error) {
    console.error("Create game error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Place a bet
// @route   POST /api/game/bet
// @access  Private
export const placeBet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { gameId, amount } = req.body;
    const userId = req.user.id;

    if (!gameId || !amount) {
      return res.status(400).json({ success: false, message: "Game ID and bet amount are required." });
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance." });
    }

    // Simulate game result (Win/Loss)
    const winAmount = Math.random() < 0.3 ? amount * 1.96: 0;

    // Update user balance
    user.balance = Math.max(0, user.balance - amount + winAmount);
    await user.save({ session });

    // Save game result
    const game = new Game({ gameId, userId, betAmount: amount, winAmount, result: winAmount > 0 ? "win" : "lose" });
    await game.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, newBalance: user.balance, result: game.result });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Bet error:", error);
    res.status(500).json({ success: false, message: "Transaction failed." });
  }
};

// @desc    Get game result
// @route   GET /api/game/:gameId/result
// @access  Private
export const getGameResult = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found." });
    }

    res.status(200).json({ success: true, game });
  } catch (error) {
    console.error("Get game result error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get game history
// @route   GET /api/game/history
// @access  Private
export const getGameHistory = async (req, res) => {
  try {
    const userId = req.user?.id; // Get user ID from request
    

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // Retrieve user's game history
    const games = await Game.find({ user: userId }).sort({ createdAt: -1 });

    // Retrieve user's transaction history
    const user = await User.findById(userId).select("transactions");
    const transactions = user?.transactions || [];

   

    res.status(200).json({
      success: true,
      games: games.length ? games : [],
      transactions: transactions.length ? transactions : [],
      message:
        games.length || transactions.length
          ? "Game and transaction history retrieved."
          : "No game or transaction history found.",
    });
  } catch (error) {
    console.error("Get game and transaction history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
  

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // Populate transactions to get actual details
    const user = await User.findById(userId).populate("transactions");

    if (!user || !user.transactions || user.transactions.length === 0) {
      return res.status(200).json({ success: true, transactions: [], message: "No transaction history found." });
    }

    res.status(200).json({ success: true, transactions: user.transactions });
  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getPriviousGameHistory = async (req, res) => {
  try {
    const latestGames = await PreviousGameWinner.find( )
      .sort({ playedAt: -1 }) // newest first
      .lean();

    // Format date with seconds
    const formattedGames = latestGames.map(game => ({
      ...game,
      playedAtFormatted: new Date(game.playedAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }));

    return res.status(200).json({
      success: true,
      previousWinning: formattedGames
    });
    
  } catch (error) {
    console.error("Get previous game history error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
