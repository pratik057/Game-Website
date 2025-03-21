import Game from "../models/game.js";
import User from "../models/User.js";
import mongoose from "mongoose";

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
    const winAmount = Math.random() < 0.3 ? amount * 2 : 0;

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
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // Retrieve games based on the userId
    const games = await Game.find({ user: userId }).sort({ createdAt: -1 });

    console.log("Retrieved game history:", games);

    res.status(200).json({
      success: true,
      games: games.length ? games : [],
      message: games.length ? "Game history retrieved." : "No game history found.",
    });
  } catch (error) {
    console.error("Get game history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// @desc    Add funds to user account
// @route   POST /api/game/add-funds
// @access  Private
export const addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.balance += amount;
    await user.save();

    res.status(200).json({ success: true, message: "Funds added successfully.", newBalance: user.balance });
  } catch (error) {
    console.error("Add funds error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Withdraw funds from user account
// @route   POST /api/game/withdraw
// @access  Private
export const withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance." });
    }

    user.balance -= amount;
    await user.save();

    res.status(200).json({ success: true, message: "Funds withdrawn successfully.", newBalance: user.balance });
  } catch (error) {
    console.error("Withdraw funds error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

