import express from "express";
import {users, editUser,registerAdmin, loginAdmin, deleteUser,toggleBlockUser ,getGames} from "../controllers/adminControler.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();




router.post("/register", registerAdmin); // Register admin
router.post("/login", loginAdmin);       // Admin login
router.delete("/users/:id",verifyAdmin,deleteUser); // Delete user
router.put("/users/:id/block",verifyAdmin,toggleBlockUser); // Block/Unblock user
router.get("/users",verifyAdmin,users); // Get all users
router.put("/users/:id",verifyAdmin,editUser); // Edit user
router.get("/games",verifyAdmin, getGames); // Get all games
export default router;