import express from "express";
import {users, editUser,registerAdmin, loginAdmin} from "../controllers/adminControler.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();




router.post("/register", registerAdmin); // Register admin
router.post("/login", loginAdmin);       // Admin login


router.get("/users",verifyAdmin,users); // Get all users
router.put("/users/:id",verifyAdmin,editUser); // Edit user

 // Get user's transactions
export default router;