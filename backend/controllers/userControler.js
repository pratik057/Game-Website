import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
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
if(mobileNo.length !== 10){
  return res.status(400).json({ success: false, message: "Mobile number must be 10 digits" });
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
    const { username, email, password } = req.body;
    const identifier = email || username; // Try email first, fallback to username

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

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
        isActive: user.isActive,
        isBlocked: user.isBlocked,
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
      isActive: user.isActive,
      mobileNo: user.mobileNo,
      isblocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { isActive: false });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
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





// Function to handle forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User with this email does not exist' });
    }

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save token and expiry to DB
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `https://creative-duckanoo-fb515f.netlify.app/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click below to reset your password:\n\n${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) return res.status(400).json({ message: "Token is missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate the token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};


