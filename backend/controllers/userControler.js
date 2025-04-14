import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
// Assuming this is the User model location

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobileNo } = req.body;

    // Validate input fields
    if (!username || !email || !password || !mobileNo) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // Check if the user already exists based on email, username, or mobile number
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }, { mobileNo }] 
    });

    if (userExists) {
      // Check for specific duplicate field and provide a detailed message
      if (userExists.email === email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
      if (userExists.username === username) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      if (userExists.mobileNo === mobileNo) {
        return res.status(400).json({ success: false, message: "Mobile number already exists" });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      username,
      email,
      mobileNo,
      password: hashedPassword,
    });

    // Respond with success message
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        mobileNo: user.mobileNo,
        balance: user.balance,
        role: user.role,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      id: user._id,
      username: user.username,
      email: user.email,
      balance: user.balance,
      role: user.role,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get transaction history
// @route   GET /api/users/transactions
// @access  Private
import Transaction from "../models/Transaction.js";

export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
