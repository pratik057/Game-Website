import express from "express";
import { registerUser, loginUser, getMe,logoutUser } from "../controllers/userControler.js";
import { protect } from "../middleware/auth.js"; // Middleware for authentication

const router = express.Router();
router.post("/logout", protect, logoutUser); // Logout user
router.post("/register", registerUser); // Register user
router.post("/login", loginUser); // Login user
router.get("/me", protect, getMe); // Get logged-in user details (protected route)

export default router; // Corrected the export
