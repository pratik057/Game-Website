import express from "express";
import {users, editUser} from "../controllers/adminControler.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/users",users); // Get all users
router.put("/users/:id", editUser); // Edit user
export default router;