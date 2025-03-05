const User = require('../models/User');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');  
require("dotenv").config();

const OTPs = {}; // Temporary storage for OTPs

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, otp } = req.body;

        // Validate input fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // If no OTP is provided, generate and send OTP
        if (!otp) {
            const generatedOtp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
            OTPs[email] = { otp: generatedOtp, username, password };

            // Send OTP via email
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Your OTP Code for Registration",
                text: `Your OTP is: ${generatedOtp}`,
            });

            return res.json({ message: "OTP sent to email for verification." });
        }

        // Verify OTP
        if (OTPs[email] && OTPs[email].otp === otp) {
            const { username, password } = OTPs[email];

            // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();

            delete OTPs[email]; // Remove stored OTP and user details

            return res.json({ message: "Registration successful. You can now log in." });
        }

        return res.status(400).json({ message: "Invalid OTP" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
exports.loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
         if(!email || !password) {
            return res.status(400).json({message: "Please fill in all fields"});
         }
         const user = await User.findOne({email});
            if(!user) {
                return res.status(400).json({message: "User does not exist"});
            }
            else{
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword) {
                    return res.status(400).json({message: "Invalid password"});
                }
                else{
                    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
                    res.status(200).json({token, user: {id: user._id, username: user.username, email: user.email}});
                }
            }
    } catch (err) {
        res.status(500).json(err);
    }
}
