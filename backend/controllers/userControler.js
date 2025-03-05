const User = require("../models/User");
const OTP = require("../models/otp");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Temporary storage for OTPs
const OTPs = {};
exports.Sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please enter your email" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const generatedOtp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      specialChars: false,
    });

    // Save OTP to database
    // await OTP.create({ email, otp: generatedOtp });
    const otp = new OTP({ email, otp: generatedOtp });
    await otp.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code for Registration",
      text: `Your OTP is: ${generatedOtp}. It expires in 5 minutes.`,
    });

    return res.json({ message: "OTP sent to email for verification." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.Verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
console.log('====================================');
console.log(email);
console.log(otp);
console.log('====================================');
    if (!email || !otp) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
console.log('====================================');
console.log(otpRecord);
console.log('====================================');
    if (!otpRecord) {
      return res
        .status(400)
        .json({
          message: "OTP expired or not found. Please request a new one.",
        });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark as verified and delete OTP record
    await OTP.deleteOne({ email });

    return res.json({
      message: "OTP verified successfully. You can now register.",
    });
  } catch (err) {
    await OTP.deleteOne({ email });

    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if OTP verification exists
    // const otpRecord = await OTP.findOne({ email });
    // if (!otpRecord) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email not verified. Please verify OTP first." });
    // }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user in the database
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Delete OTP record after successful registration
    await OTP.deleteOne({ email });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res
          .status(200)
          .json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
          });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
