import express from "express";
import { sendOtp, verifyOtp, registerUser, loginUser, getMe } from "../controllers/userControler.js";
import { protect } from "../middleware/auth.js"; // Middleware for authentication

const router = express.Router();

router.post("/send-otp", sendOtp); // Send OTP
router.post("/verify-otp", verifyOtp); // Verify OTP
router.post("/register", registerUser); // Register user
router.post("/login", loginUser); // Login user
router.get("/me", protect, getMe); // Get logged-in user details (protected route)

export default router; // Corrected the export
