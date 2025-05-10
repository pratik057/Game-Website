import User from "../models/User.js";
import Game from "../models/game.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Admin Register (Only for first-time setup)


export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email, isAdmin: true });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin user with hashed password
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    await newAdmin.save();

    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user is admin
    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token, admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ success: true, games });
  } catch (error) {
    console.error("Get games error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const users= async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import Transaction from "../models/Transaction.js";
export const editUser = async (req, res) => {
  try {
      const { id } = req.params; // User ID from URL
      const { username, email, balance } = req.body; // Updated fields

      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      let transactionType = null;
      let transactionAmount = 0;

      // Check if balance is changed and determine transaction type
      if (balance !== undefined && balance !== user.balance) {
          transactionType = balance > user.balance ? "credit" : "debit";
          transactionAmount = Math.abs(balance - user.balance);
      }

      // Update user details
      user.username = username || user.username;
      user.email = email || user.email;
      user.balance = balance !== undefined ? balance : user.balance;

      // Save updated user
      await user.save();

      // Save transaction if balance changed
      if (transactionType) {
          const transaction = await Transaction.create({
              userId: user._id,
              type: transactionType,
              amount: transactionAmount,
          });

          // 🔹 **Fix: Add transaction ID to user's transactions array**
          user.transactions.push(transaction._id);
          await user.save();
      }

      res.status(200).json({ 
          success: true, 
          message: "User updated successfully", 
          user: {
              id: user._id,
              username: user.username,
              email: user.email,
              balance: user.balance,
          }
      });
  } catch (error) {
      console.error("Edit user error:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Toggle block error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
